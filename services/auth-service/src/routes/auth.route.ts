import { Router } from "express";
import {
  validateAuthRequest,
  loginSchema,
  registerSchema,
  refreshTokenSchema,
} from "../validation";
import { asyncHandler } from "@t3d/core-utils";
import * as authService from "../services/auth.service";

const router = Router();

// Register endpoint
router.post(
  "/register",
  validateAuthRequest(registerSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.register(req.validatedData);
    res.status(201).json({
      success: true,
      data: result,
    });
  })
);

// Login endpoint
router.post(
  "/login",
  validateAuthRequest(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.validatedData);
    res.status(200).json({
      success: true,
      data: result,
    });
  })
);

// Refresh token endpoint
router.post(
  "/refresh",
  validateAuthRequest(refreshTokenSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.refreshToken(
      req.validatedData.refreshToken
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  })
);

// Logout endpoint
router.post(
  "/logout",
  validateAuthRequest(refreshTokenSchema),
  asyncHandler(async (req, res) => {
    await authService.logout(req.validatedData.refreshToken);
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  })
);

// Verify token endpoint
router.get(
  "/verify",
  asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = await authService.verifyToken(token);
    res.status(200).json({
      success: true,
      data: { userId: decoded.userId },
    });
  })
);

export default router;
