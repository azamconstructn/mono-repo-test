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
  .string()
  .email("Invalid email format")
  .min(1, "Email is required");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters");

export const idSchema = z.string().min(1, "ID is required");

// Validation middleware
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse({
        ...req.body,
        ...req.params,
        ...req.query,
      });

      // Add validated data to request object
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        const validationError = new ValidationError(
          "Validation failed",
          "VALIDATION_ERROR",
        );
        (validationError as any).details = { errors: validationErrors };
        next(validationError);
      } else {
        next(error);
      }
    }
  };
};
