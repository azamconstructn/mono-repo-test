import { initRabbitMQ } from "@t3d/core-utils";

import { userRegistered, sendWelcomeEmail } from "./notifications.service";

const eventHandlers: Record<string, any> = {
    USER_REGISTERED: userRegistered,
    SEND_WELCOME_EMAIL: sendWelcomeEmail,
}

export const listenToQueueEvents = async () => {
    try {
      const rabbit = await initRabbitMQ();
      const queueName = "notifications";
      await rabbit.createQueue(queueName);
      await rabbit.consumeMessages(queueName, async (msg: any) => {
        // Here you would process the notification event
        // For demo, just log it
        // eslint-disable-next-line no-console
        const eventHandler = eventHandlers[msg.type];
        if (eventHandler) {
            await eventHandler(msg.request);
        }
      });
      // eslint-disable-next-line no-console
      console.log(`[RabbitMQ] Listening for messages on queue '${queueName}'`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[RabbitMQ] Error initializing RabbitMQ:", err);
    }
}
  // --- End RabbitMQ Example ---