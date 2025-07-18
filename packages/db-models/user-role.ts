import { Document, Schema } from "mongoose";
// import { Role } from "./role";
import { User } from "./user.model";

type newRole = "admin" | "collaborator" | "viewer";
//  UserRole Interface
export interface UserRole extends Document {
  emailSendAt?: any;
  user: User;
  role: newRole;
  assignedOn: Date;
}

// Subdocument schema
export const UserRoleSchema = new Schema(
  {
    user: {
      type: Schema.Types.String,
      ref: "User",
      required: true,
    },
    role: {
      type: Schema.Types.String,
      required: true,
      enum: ["admin", "collaborator", "viewer"],
    },
    assignedOn: {
      type: Schema.Types.Date,
      required: true,
    },
    emailSendAt:{
      type:Schema.Types.Date,
      required:false,
    }
  },
  {
    _id: false,
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);
