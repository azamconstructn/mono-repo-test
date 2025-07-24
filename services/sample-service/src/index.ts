// sample-service entry point

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
  setupSwagger
} from "@t3d/core-utils";

// Import database connection
import { connectDB } from "@t3d/db-models";

import routes from "./routes";
// import { setupSwagger } from "./swagger";

const app = express();
const PORT = process.env.PORT || 3003;

// Connect to database
const initializeDatabase = async () => {
  try {
    await connectDB();
    // eslint-disable-next-line no-console
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
routes(app);

// Swagger UI
setupSwagger(app);

// 404 handler
app.use("*", notFoundHandler);

// Error handling middleware
app.use(globalErrorHandler);

// Initialize database and start server
const startServer = async () => {
  await initializeDatabase();

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Project service listening on port ${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`📊 Health check: http://localhost:${PORT}/api/health/basic-health-check`);
  });
};

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

// Start the server
startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", error);
  process.exit(1);
});

export default app;
