import { Document, Schema, model, Query, SchemaTypes } from "mongoose";
import bcrypt from "bcryptjs";
import { Contact, ContactSchema, Address, AddressSchema } from "./address";

export enum loginType {
  constructn = "constructn-oauth",
  procore = "procore-oauth",
  autodesk = "autodesk-oauth",
  microsoft = "microsoft-oauth",
}

export const salt: number = 12;

export interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  loginType: loginType;
  // contact?: Contact;
  // gender?: "Male" | "Female" | "Transgender";
  // dob?: Date;
  // address?: Address;
  // avatar?: string;
  verified: boolean;
  isSupportUser: boolean;
  // verificationTimestamps: Date[];
  // resetPasswordTimestamps: Date[];
  // userPreference?: string;
  // timezone: string;
  status: "active" | "inActive";
  // unReadNotifications: number;
  // metadata?: object;
  // jobTitle: string;
  // company?: Company | null;
  comparePassword(candidatePassword: string): boolean;
  // fullName?: string;
  // canResendVerification?: boolean;
  // canResetPassword?: boolean;
  // age?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<User>(
  {
    _id: SchemaTypes.String,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // userPreference: {
    //   type: Schema.Types.String,
    //   ref: "UserPreference",
    //   required: false,
    // },
    // timezone: { type: String },
    status: {
      type: String,
      enum: ["active", "inActive"],
      default: "active",
    },
    isSupportUser: {
      type: Boolean,
      required: true,
      default: false,
    },
    // jobTitle: { type: String },
    // unReadNotifications: { type: Number, default: 0 },
    loginType: {
      type: String,
      enum: Object.values(loginType),
      required: true,
      default: loginType.constructn,
    },
    password: {
      type: String,
      required: true,
      set: (plaintextPassword: string) => bcrypt.hashSync(plaintextPassword, salt),
    },
    // contact: ContactSchema,
    // verificationTimestamps: { type: [Date], default: [] },
    // resetPasswordTimestamps: { type: [Date], default: [] },
    // gender: {
    //   type: String,
    //   enum: ["Male", "Female", "Transgender"],
    // },
    // dob: Date,
    // address: AddressSchema,
    // avatar: String,
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    // metadata: { type: Object },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
    id: false,
  }
);

UserSchema.virtual("fullName").get(function (this: User) {
  return `${this.firstName} ${this.lastName}`;
});





UserSchema.methods.comparePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.pre<User>("save", async function (next) {
  const now = String(Date.now());
  const middlePos = Math.ceil(now.length / 2);
  let prefix = "USR";
  if (!this._id) this._id = `${prefix}${now.substring(middlePos)}`;
  next();
});

UserSchema.pre<Query<User, User>>(
  /^(updateOne|findOneAndUpdate)/,
  async function () {
    this.select("-password");
  }
);





export const UserModel = model<User>("User", UserSchema);
