// RabbitMQ client temporarily disabled for build

import amqp from "amqplib";
import logger from "./logger";

export class RabbitMQClient {
  private connection: any = null;
  private channel: amqp.Channel | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();

      if (this.connection) {
        this.connection.on("error", (err: Error) => {
          logger.error("RabbitMQ connection error:", err);
        });

        this.connection.on("close", () => {
          logger.warn("RabbitMQ connection closed");
        });
      }

      logger.info("Connected to RabbitMQ");
    } catch (error) {
      logger.error("Failed to connect to RabbitMQ:", error);
      throw error;
    }
  }

  async createQueue(
    queueName: string,
    options?: amqp.Options.AssertQueue,
  ): Promise<void> {
    if (!this.channel) {
      throw new Error("Channel not available. Call connect() first.");
    }

    try {
      await this.channel.assertQueue(queueName, options);
      logger.info(`Queue '${queueName}' created/verified`);
    } catch (error) {
      logger.error(`Failed to create queue '${queueName}':`, error);
      throw error;
    }
  }

  async publishMessage(
    queueName: string,
    message: unknown,
    options?: amqp.Options.Publish,
  ): Promise<boolean> {
    if (!this.channel) {
      throw new Error("Channel not available. Call connect() first.");
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      const result = this.channel.sendToQueue(
        queueName,
        messageBuffer,
        options,
      );
      logger.info(`Message published to queue '${queueName}'`);
      return result;
    } catch (error) {
      logger.error(`Failed to publish message to queue '${queueName}':`, error);
      throw error;
    }
  }

  async consumeMessages(
    queueName: string,
    callback: (message: unknown) => Promise<void>,
    options?: amqp.Options.Consume,
  ): Promise<void> {
    if (!this.channel) {
      throw new Error("Channel not available. Call connect() first.");
    }

    try {
      await this.channel.assertQueue(queueName);

      this.channel.consume(
        queueName,
        async (msg) => {
          if (msg) {
            try {
              const content = JSON.parse(msg.content.toString());
              await callback(content);
              this.channel?.ack(msg);
              logger.info(`Message processed from queue '${queueName}'`);
            } catch (error) {
              logger.error(
                `Error processing message from queue '${queueName}':`,
                error,
              );
              this.channel?.nack(msg);
            }
          }
        },
        options,
      );

      logger.info(`Started consuming messages from queue '${queueName}'`);
    } catch (error) {
      logger.error(
        `Failed to start consuming from queue '${queueName}':`,
        error,
      );
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }

      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }

      logger.info("RabbitMQ connection closed");
    } catch (error) {
      logger.error("Error closing RabbitMQ connection:", error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.connection !== null && this.channel !== null;
  }
}

// Singleton instance
let client: RabbitMQClient | null = null;

export const getRabbitMQClient = (url?: string): RabbitMQClient => {
  if (!client) {
    const rabbitMQUrl =
      url || process.env.RABBITMQ_URL || "amqp://localhost:5672";
    client = new RabbitMQClient(rabbitMQUrl);
  }
  return client;
};

export const initRabbitMQ = async (url?: string): Promise<RabbitMQClient> => {
  const rabbitMQClient = getRabbitMQClient(url);
  await rabbitMQClient.connect();
  return rabbitMQClient;
};
