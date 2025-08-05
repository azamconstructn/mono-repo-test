import { Router } from "express";
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
} from "../validation";
import { asyncHandler } from "@t3d/core-utils";
import * as authService from "../services/auth.service";

const router = Router();

// Register endpoint  
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const result = await authService.register(req.validatedData as RegisterDto);
    res.status(201).json({
      success: true,
      data: result,
    });
  })
);

// Login endpoint
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.validatedData as LoginDto);
    res.status(200).json({
      success: true,
      data: result,
    });
  })
);

// Refresh token endpoint
router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const result = await authService.refreshToken(
      (req.validatedData as RefreshTokenDto).refreshToken
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
  asyncHandler(async (req, res) => {
    await authService.logout((req.validatedData as RefreshTokenDto).refreshToken);
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
