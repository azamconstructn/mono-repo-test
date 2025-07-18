import { Schema, Document, model } from "mongoose";

export interface UserNotificationTypes extends Document {
  app: "All Projects" | "Priority Projects" | "None";
  email: "All Projects" | "Priority Projects" | "None";
}

const UserNotificationTypesSchema = new Schema<UserNotificationTypes>(
  {
    app: {
      type: String,
      enum: ["All Projects", "Priority Projects", "None"],
      required: true,
      default: "All Projects",
    },
    email: {
      type: String,
      enum: ["All Projects", "Priority Projects", "None"],
      required: true,
      default: "All Projects",
    },
  },
  {
    _id: false,
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);

export interface UserNotification extends Document {
  captures: UserNotificationTypes;
  progressMonitoring: UserNotificationTypes;
  webUploader: UserNotificationTypes;
  notes: UserNotificationTypes;
  weeklyDigest: UserNotificationTypes;
}

const NotificationSchema = new Schema<UserNotification>(
  {
    captures: UserNotificationTypesSchema,
    progressMonitoring: UserNotificationTypesSchema,
    webUploader: UserNotificationTypesSchema,
    notes: UserNotificationTypesSchema,
    weeklyDigest: UserNotificationTypesSchema,
  },
  {
    _id: false,
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);

export interface Integration {
  id?: string;
  accessToken: string;
  refreshToken: string;
  email: string;
  expireTime?: number;
  redirectURI?: string;
  status: "enabled" | "disabled";
}

const IntegrationSchema = new Schema<Integration>(
  {
    id: { type: String },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    email: { type: String, required: true },
    expireTime: { type: Number },
    redirectURI: { type: String },
    status: { type: String, enum: ["enabled", "disabled"], required: true },
  },
  { _id: false }
);

export interface UserPreference extends Document {
  integration?: {
    procore?: Integration;
    autodesk?: Integration;
    microsoft?: Integration;
  };
  user: string;
  reversePanel: boolean;
  favouriteProject?: string[];
  notification: UserNotification;
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferenceSchema = new Schema<UserPreference>(
  {
    _id: {
      type: Schema.Types.String,
    },
    integration: {
      procore: { type: IntegrationSchema },
      autodesk: { type: IntegrationSchema },
      microsoft: { type: IntegrationSchema },
    },
    user: {
      type: String,
      ref: "User",
      required: true,
      unique: true,
    },
    reversePanel: {
      type: Boolean,
      default: false,
    },
    favouriteProject: {
      type: [String],
      required: false,
    },
    notification: {
      type: NotificationSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);

UserPreferenceSchema.pre<UserPreference>("save", async function (next) {
  const now = String(Date.now());
  const middlePos = Math.ceil(now.length / 2);
  let prefix = "USP";
  if (!this._id) this._id = `${prefix}${now.substring(middlePos)}`;
  next();
});
UserPreferenceSchema.index({ user: 1 }, { unique: true });

export const UserPreferenceModel = model<UserPreference>(
  "UserPreference",
  UserPreferenceSchema
);