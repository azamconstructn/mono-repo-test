import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, RefreshToken } from "@t3d/db-models";
import { LoginDto, RegisterDto } from "../validation";
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  publishToQueue,
} from "@t3d/core-utils";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const register = async (
  userData: RegisterDto,
): Promise<AuthResponse> => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  // Create user
  const user = new User({
    firstName: userData.name.split(" ")[0] || userData.name,
    lastName: userData.name.split(" ").slice(1).join(" ") || "",
    username: userData.email.split("@")[0], // Simple username generation
    email: userData.email,
    password: hashedPassword,
  });

  await user.save();

  // Generate tokens
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Save refresh token
  await saveRefreshToken(user.id, refreshToken);

  publishToQueue("notifications", {
    type: "USER_REGISTERED",
    request: {}
  });

  publishToQueue("notifications", {
    type: "SEND_WELCOME_EMAIL",
    request: {
      email: user.email
    }
  });

  return {
    user: {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
  // Find user by email
  const user = await User.findOne({ email: credentials.email });
  if (!user) {
    throw new AuthenticationError("Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password,
  );
  if (!isPasswordValid) {
    throw new AuthenticationError("Invalid email or password");
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Save refresh token
  await saveRefreshToken(user.id, refreshToken);

  return {
    user: {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshToken = async (
  refreshToken: string,
): Promise<AuthResponse> => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };

    // Check if refresh token exists in database
    const tokenDoc = await RefreshToken.findOne({
      userId: decoded.userId,
      token: refreshToken,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      throw new AuthenticationError("Invalid refresh token");
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    // Update refresh token in database
    await RefreshToken.findByIdAndUpdate(tokenDoc.id, {
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError("Invalid refresh token");
    }
    throw error;
  }
};

export const logout = async (refreshToken: string): Promise<void> => {
  // Remove refresh token from database
  await RefreshToken.findOneAndDelete({ token: refreshToken });
};

export const verifyToken = async (
  token: string,
): Promise<{ userId: string }> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    throw new AuthenticationError("Invalid token");
  }
};

// Helper functions
const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

const saveRefreshToken = async (
  userId: string,
  token: string,
): Promise<void> => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await RefreshToken.create({
    userId,
    token,
    expiresAt,
  });
};
