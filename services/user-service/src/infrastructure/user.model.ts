import mongoose from "mongoose";
import { CreateUserDto } from "../domain/user.types";

const userSchema = new mongoose.Schema<CreateUserDto>(
  {
    name: String,
    email: String,
  },
  { timestamps: true },
);

export const UserModel = mongoose.model("User", userSchema);
