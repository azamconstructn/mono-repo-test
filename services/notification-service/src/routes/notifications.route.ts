import { Router } from "express";
import {
  validateNotificationRequest,
  createNotificationSchema,
  getNotificationByIdSchema,
} from "../validation";
import { authenticateToken, asyncHandler } from "@t3d/core-utils";
import * as notificationsController from "../controllers/notifications.controller";

const router = Router();

// Protect all notification routes
router.use(authenticateToken);

// Create notification
router.post(
  "/",
  validateNotificationRequest(createNotificationSchema),
  asyncHandler(notificationsController.createNotificationsController),
);

// Get notification by ID
router.get(
  "/:id",
  validateNotificationRequest(getNotificationByIdSchema),
  asyncHandler(notificationsController.getNotificationsByIdController),
);

// Add more routes as needed

export default router;
