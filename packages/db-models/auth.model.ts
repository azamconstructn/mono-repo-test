import mongoose, { Document, Schema } from "mongoose";

export interface IRefreshToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  deviceInfo?: {
    userAgent: string;
    ip: string;
    deviceType: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  ip: string;
  userAgent: string;
  success: boolean;
  details?: Record<string, unknown>;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    deviceInfo: {
      userAgent: String,
      ip: String,
      deviceType: String,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ expiresAt: 1 });

const authLogSchema = new Schema<IAuthLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "login",
        "logout",
        "password_change",
        "password_reset",
        "email_verification",
        "account_lock",
        "account_unlock",
      ],
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    success: {
      type: Boolean,
      required: true,
    },
    details: { type: Schema.Types.Mixed as unknown as Record<string, unknown> },
  },
  {
    timestamps: true,
  },
);

// Indexes
authLogSchema.index({ userId: 1 });
authLogSchema.index({ action: 1 });
authLogSchema.index({ createdAt: -1 });
authLogSchema.index({ success: 1 });

// TTL index to automatically delete old logs (keep for 1 year)
authLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 365 * 24 * 60 * 60 },
);

export const RefreshToken = mongoose.model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema,
);
export const AuthLog = mongoose.model<IAuthLog>("AuthLog", authLogSchema);
