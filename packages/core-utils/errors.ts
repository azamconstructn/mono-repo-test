// Custom error classes and error handling utilities

import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  status: number;
  code?: string;
  isOperational?: boolean;
  details?: unknown;
}

export class BaseError extends Error implements AppError {
  public status: number;
  public code?: string;
  public isOperational: boolean;
  public details?: unknown;

  constructor(message: string, status: number = 500, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, code?: string) {
    super(message, 400, code);
  }
}

export class AuthenticationError extends BaseError {
  constructor(message: string = "Authentication failed", code?: string) {
    super(message, 401, code);
  }
}

export class AuthorizationError extends BaseError {
  constructor(message: string = "Access denied", code?: string) {
    super(message, 403, code);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string = "Resource not found", code?: string) {
    super(message, 404, code);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string = "Resource conflict", code?: string) {
    super(message, 409, code);
  }
}

export class RateLimitError extends BaseError {
  constructor(message: string = "Too many requests", code?: string) {
    super(message, 429, code);
  }
}

export class InternalServerError extends BaseError {
  constructor(message: string = "Internal server error", code?: string) {
    super(message, 500, code);
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor(message: string = "Service unavailable", code?: string) {
    super(message, 503, code);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let error = err as AppError;

  // If it's not our custom error, wrap it
  if (!(err instanceof BaseError)) {
    error = new InternalServerError(err.message);
  }

  // Log error
  // eslint-disable-next-line no-console
  console.error("Error:", {
    message: error.message,
    status: error.status,
    code: error.code,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Send error response
  res.status(error.status).json({
    error: {
      message: error.message,
      code: error.code,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    },
  });
};

// Async error wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Error response creator
export const createErrorResponse = (error: unknown) => {
  if (error instanceof BaseError) {
    return {
      error: error.message,
      statusCode: error.status,
      timestamp: new Date().toISOString(),
    };
  }

  // Handle mongoose validation errors
  if ((error as { name?: string })?.name === "ValidationError") {
    const messages = Object.values(
      (error as { errors: Record<string, { message: string }> }).errors,
    ).map((err: { message: string }) => err.message);
    return {
      error: "Validation failed",
      details: messages,
      statusCode: 400,
      timestamp: new Date().toISOString(),
    };
  }

  // Handle mongoose duplicate key errors
  if ((error as { code?: number })?.code === 11000) {
    const field = Object.keys(
      (error as { keyValue: Record<string, unknown> }).keyValue,
    )[0];
    return {
      error: `${field} already exists`,
      statusCode: 409,
      timestamp: new Date().toISOString(),
    };
  }

  // Handle JWT errors
  if ((error as { name?: string })?.name === "JsonWebTokenError") {
    return {
      error: "Invalid token",
      statusCode: 401,
      timestamp: new Date().toISOString(),
    };
  }

  if ((error as { name?: string })?.name === "TokenExpiredError") {
    return {
      error: "Token expired",
      statusCode: 401,
      timestamp: new Date().toISOString(),
    };
  }

  // Default error response
  return {
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : (error as Error).message,
    statusCode: 500,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "development" && {
      stack: (error as Error).stack,
    }),
  };
};

// Global error handler middleware
export const globalErrorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // eslint-disable-next-line no-console
  console.error("Error occurred:", {
    error: (error as Error).message,
    stack: (error as Error).stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  const errorResponse = createErrorResponse(error);

  res
    .status((errorResponse as { statusCode: number }).statusCode)
    .json({
      success: false,
      message: errorResponse.error,
    });
};

// Not found handler middleware
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  _next(error);
};

// Error utilities
export const isOperationalError = (error: Error): boolean => {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
};

export const handleUncaughtException = (error: Error): void => {
  // eslint-disable-next-line no-console
  console.error("Uncaught Exception:", error);
  process.exit(1);
};

export const handleUnhandledRejection = (
  reason: unknown,
  promise: Promise<unknown>,
): void => {
  // eslint-disable-next-line no-console
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
};
