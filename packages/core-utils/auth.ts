import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "./errors";

// JWT configuration
const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = "24h";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

// Extend Express Request interface using module augmentation
declare module "express" {
  interface Request {
    user?: {
      id: string;
      email: string;
      roles: string[];
    };
  }
}

// Authentication middleware
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new AuthenticationError("Access token required");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles || [],
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError("Token expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError("Invalid token");
    } else {
      throw new AuthenticationError("Token verification failed");
    }
  }
};

// Authorization middleware
export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    if (
      !req.user.roles ||
      !req.user.roles.some((role) => roles.includes(role))
    ) {
      throw new AuthenticationError("Insufficient permissions");
    }

    next();
  };
};

// Generate JWT token
export const generateToken = (payload: {
  id: string;
  email: string;
  roles?: string[];
}) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Generate refresh token
export const generateRefreshToken = (payload: {
  id: string;
  email: string;
}) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

// Verify token
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
};

// Role-based middleware
export const requireAdmin = authorizeRoles(["admin"]);
export const requireModerator = authorizeRoles(["admin", "moderator"]);
export const requireUser = authorizeRoles(["user", "admin", "moderator"]);
