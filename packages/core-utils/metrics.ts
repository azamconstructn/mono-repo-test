import {
  register,
  collectDefaultMetrics,
  Counter,
  Histogram,
  Gauge,
} from "prom-client";
import { Request, Response, NextFunction } from "express";

// Initialize default metrics
collectDefaultMetrics({ register });

// HTTP request metrics
export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

export const httpRequestTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

// Business logic metrics
export const activeConnections = new Gauge({
  name: "active_connections",
  help: "Number of active connections",
});

export const databaseOperations = new Counter({
  name: "database_operations_total",
  help: "Total number of database operations",
  labelNames: ["operation", "collection"],
});

export const messageQueueOperations = new Counter({
  name: "message_queue_operations_total",
  help: "Total number of message queue operations",
  labelNames: ["operation", "queue"],
});

// Custom metrics
export const createCustomCounter = (
  name: string,
  help: string,
  labelNames: string[] = [],
) => {
  return new Counter({
    name,
    help,
    labelNames,
    registers: [register],
  });
};

export const createCustomHistogram = (
  name: string,
  help: string,
  labelNames: string[] = [],
  buckets: number[] = [0.1, 0.5, 1, 2, 5],
) => {
  return new Histogram({
    name,
    help,
    labelNames,
    buckets,
    registers: [register],
  });
};

export const createCustomGauge = (
  name: string,
  help: string,
  labelNames: string[] = [],
) => {
  return new Gauge({
    name,
    help,
    labelNames,
    registers: [register],
  });
};

// Metrics middleware for Express
export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;

    httpRequestDuration
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration);

    httpRequestTotal.labels(req.method, route, res.statusCode.toString()).inc();
  });

  next();
};

// Get metrics endpoint
export const getMetrics = async (): Promise<string> => {
  return register.metrics();
};

// Reset metrics (useful for testing)
export const resetMetrics = (): void => {
  register.clear();
};
