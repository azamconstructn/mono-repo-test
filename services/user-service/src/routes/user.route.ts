import { Router } from "express";
import {
  validateUserRequest,
  createUserSchema,
  getUserByIdSchema,
} from "../validation";
import { authenticateToken, asyncHandler } from "@t3d/core-utils";
import * as userController from "../controllers/user.controller";

const router = Router();

// Protect all user routes
router.use(authenticateToken);

// Create user
router.post(
  "/",
  validateUserRequest(createUserSchema),
  asyncHandler(userController.createUserController),
);

// Get user by ID
router.get(
  "/:id",
  validateUserRequest(getUserByIdSchema),
  asyncHandler(userController.getUserByIdController),
);

// Add more routes as needed

export default router;
