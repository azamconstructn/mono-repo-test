import { Document, Schema, model, SchemaTypes } from "mongoose";
import { Address, AddressSchema } from "./address";
import { UserRole, UserRoleSchema } from "./user-role";

// Company interface
export interface Company extends Document {
  name: string;
  users: UserRole[];
  type: string;
  address: Address;
  description?: string;
  logo?: string;
  domain: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Company schema
const CompanySchema = new Schema<Company>(
  {
    _id: SchemaTypes.String,
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    domain: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Trade Partner", "General Contractor", "Owner"],
    },
    users: [UserRoleSchema],
    address: AddressSchema,
    description: String,
    logo: String,
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

// Document middlewares
CompanySchema.pre<Company>("save", async function (next) {
  const now = String(Date.now());
  const middlePos = Math.ceil(now.length / 2);
  let prefix = "CMP";
  if (!this._id) this._id = `${prefix}${now.substring(middlePos)}`;
  next();
});

// create and export Company model
export const CompanyModel = model<Company>("Company", CompanySchema);
