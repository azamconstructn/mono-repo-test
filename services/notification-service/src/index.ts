// notification-service entry point

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Import core utilities
import {
  globalErrorHandler,
  notFoundHandler,
  handleUncaughtException,
  handleUnhandledRejection,
} from "@t3d/core-utils";

// Import routes
import notificationsRoutes from "./routes/notifications.route";

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "notification-service",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use("/notifications", notificationsRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Notification Service API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      notifications: "/notifications",
    },
  });
});

// 404 handler
app.use("*", notFoundHandler);

// Error handling middleware
app.use(globalErrorHandler);

// Start server
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Notification service listening on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`📊 Health check: http://localhost:${PORT}/health`);

  // --- RabbitMQ Usage Example ---
  // This demonstrates connecting, creating a queue, and consuming messages
  // You can move this to a dedicated worker or service as needed
  (async () => {
    try {
      const { initRabbitMQ } = await import("@t3d/core-utils");
      const rabbit = await initRabbitMQ();
      const queueName = "notifications";
      await rabbit.createQueue(queueName);
      await rabbit.consumeMessages(queueName, async (msg) => {
        // Here you would process the notification event
        // For demo, just log it
        // eslint-disable-next-line no-console
        console.log("[RabbitMQ] Received message:", msg);
      });
      // eslint-disable-next-line no-console
      console.log(`[RabbitMQ] Listening for messages on queue '${queueName}'`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[RabbitMQ] Error initializing RabbitMQ:", err);
    }
  })();
  // --- End RabbitMQ Example ---
});

// Global error handlers
process.on("uncaughtException", handleUncaughtException);
process.on("unhandledRejection", handleUnhandledRejection);

// Graceful shutdown
process.on("SIGTERM", () => {
  // eslint-disable-next-line no-console
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  // eslint-disable-next-line no-console
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

export default app;
