import mongoose from "mongoose";
import logger from "@t3d/core-utils/logger";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    logger.info("Database already connected");
    return;
  }

  try {
    const mongoURI =
      "mongodb+srv://dev-admin:C0nstructN@constructnapidev.ehhll19.mongodb.net/?retryWrites=true&w=majority";

    await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 50000,
      socketTimeoutMS: 450000,
      bufferCommands: false,
    });

    isConnected = true;
    logger.info("MongoDB connected successfully");

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
      isConnected = false;
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
      isConnected = true;
    });
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info("MongoDB disconnected");
  } catch (error) {
    logger.error("Error disconnecting from MongoDB:", error);
    throw error;
  }
};

export const getConnectionStatus = (): boolean => {
  return isConnected;
};

export const getConnection = () => {
  return mongoose.connection;
};
