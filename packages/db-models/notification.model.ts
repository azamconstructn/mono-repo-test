import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: "email" | "push" | "sms";
  title: string;
  message: string;
  template?: string;
  templateData?: Record<string, unknown>;
  recipient: {
    email?: string;
    phone?: string;
    pushToken?: string;
  };
  status: "pending" | "sent" | "delivered" | "failed" | "cancelled";
  priority: "low" | "normal" | "high" | "urgent";
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["email", "push", "sms"],
    },
    title: {
      type: String,
      required: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    template: {
      type: String,
    },
    templateData: {
      type: Schema.Types.Mixed as unknown as Record<string, unknown>,
    },
    recipient: {
      email: {
        type: String,
        validate: {
          validator: function (v: string) {
            if (this.type === "email" && !v) return false;
            if (v) {
              const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
              return emailRegex.test(v);
            }
            return true;
          },
          message: "Valid email is required for email notifications",
        },
      },
      phone: {
        type: String,
        validate: {
          validator: function (v: string) {
            if (this.type === "sms" && !v) return false;
            if (v) {
              const phoneRegex = /^\+?[\d\s-()]+$/;
              return phoneRegex.test(v);
            }
            return true;
          },
          message: "Valid phone number is required for SMS notifications",
        },
      },
      pushToken: {
        type: String,
        validate: {
          validator: function (v: string) {
            if (this.type === "push" && !v) return false;
            return true;
          },
          message: "Push token is required for push notifications",
        },
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "sent", "delivered", "failed", "cancelled"],
      default: "pending",
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    scheduledAt: {
      type: Date,
    },
    sentAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    failureReason: {
      type: String,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    maxRetries: {
      type: Number,
      default: 3,
    },
    metadata: {
      type: Schema.Types.Mixed as unknown as Record<string, unknown>,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
notificationSchema.index({ userId: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ scheduledAt: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ "recipient.email": 1 });
notificationSchema.index({ "recipient.phone": 1 });

// Compound indexes for common queries
notificationSchema.index({ userId: 1, status: 1 });
notificationSchema.index({ userId: 1, type: 1 });
notificationSchema.index({ status: 1, scheduledAt: 1 });

// TTL index to automatically delete old notifications (keep for 6 months)
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 6 * 30 * 24 * 60 * 60 },
);

// Pre-save middleware to set scheduledAt if not provided
notificationSchema.pre("save", function (next) {
  if (!this.scheduledAt) {
    this.scheduledAt = new Date();
  }
  next();
});

// Instance method to mark as sent
notificationSchema.methods.markAsSent = function (): Promise<INotification> {
  this.status = "sent";
  this.sentAt = new Date();
  return this.save();
};

// Instance method to mark as delivered
notificationSchema.methods.markAsDelivered =
  function (): Promise<INotification> {
    this.status = "delivered";
    this.deliveredAt = new Date();
    return this.save();
  };

// Instance method to mark as failed
notificationSchema.methods.markAsFailed = function (
  reason: string,
): Promise<INotification> {
  this.status = "failed";
  this.failureReason = reason;
  this.retryCount += 1;
  return this.save();
};

// Instance method to retry
notificationSchema.methods.retry = function (): Promise<INotification> {
  if (this.retryCount < this.maxRetries) {
    this.status = "pending";
    this.failureReason = undefined;
    return this.save();
  }
  throw new Error("Max retries exceeded");
};

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);
