import { z } from "zod";
import { validateRequest } from "@t3d/core-utils";

// Base schemas (reused from core-utils)
const emailSchema = z
  .string()
  .email("Invalid email format")
  .min(1, "Email is required");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters");

const idSchema = z.string().min(1, "ID is required");

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters");

// User-specific schemas
export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
});

export const getUserByIdSchema = z.object({
  id: idSchema,
});

// Validation middleware wrapper
export const validateUserRequest = (schema: z.ZodSchema) => validateRequest(schema);

// Type exports
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type GetUserByIdDto = z.infer<typeof getUserByIdSchema>; 