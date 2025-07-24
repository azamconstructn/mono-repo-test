import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "./errors";

// Extend Express Request interface using module augmentation
declare module "express" {
  interface Request {
    validatedData?: unknown;
  }
}

// Base schemas (for reuse in services)
export const emailSchema = z
  .email("Invalid email format")
  .min(1, "Email is required");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters");

export const idSchema = z.string().min(1, "ID is required");

type RequestSchema = {
  body?: z.ZodSchema;
  params?: z.ZodSchema;
  query?: z.ZodSchema;
}

// Validation middleware
export const validateRequest = (requestSchema: RequestSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData: Record<string, any> = {};

      // validatedData.body = body.parse(req.body);
      if (requestSchema.body) {
        validatedData.body = requestSchema.body.parse(req.body);
      }
      if (requestSchema.params) {
        validatedData.params = requestSchema.params.parse(req.params);
      }
      if (requestSchema.query) {
        validatedData.query = requestSchema.query.parse(req.query);
      }
      
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        const validationError = new ValidationError(
          "Validation failed",
          "VALIDATION_ERROR",
        );
        (validationError as any).details = { errors: validationErrors };
        return res.status(400).json({ error: "Validation failed", details: validationErrors });
      } else {
        return res.status(400).json({ error: "Unknown validation error" });
      }
    }
  };
};

// Response validation middleware
export const validateResponse = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    res.json = function (data: any) {
      try {
        const validatedData = schema.parse(data);
        return originalJson.call(this, validatedData);
      } catch (error) {
        // Restore the original res.json to avoid recursion
        res.json = originalJson;
        if (error instanceof z.ZodError) {
          const validationErrors = error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          }));

          const validationError = new ValidationError(
            "Response validation failed",
            "RESPONSE_VALIDATION_ERROR",
          );
          (validationError as any).details = { errors: validationErrors };
          return res.status(500).json({ error: "Invalid response", details: validationErrors });
        } else {
          return res.status(500).json({ error: "Unknown response validation error" });
        }
      }
    };
    next();
  };
};
