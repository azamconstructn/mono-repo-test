import { z } from "zod";
import { validateRequest } from "@t3d/core-utils";

// Base schemas (reused from core-utils)
const idSchema = z.string().min(1, "ID is required");
const notificationTypeSchema = z.enum(["email", "push", "sms"]);

// Notification-specific schemas
export const createNotificationSchema = z.object({
  userId: idSchema,
  type: notificationTypeSchema,
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
});

export const getNotificationByIdSchema = z.object({
  id: idSchema,
});

// Validation middleware wrapper
export const validateNotificationRequest = (schema: z.ZodSchema) => validateRequest(schema);

// Type exports
export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;
export type GetNotificationByIdDto = z.infer<typeof getNotificationByIdSchema>; 