import mongoose from "mongoose";
import { CreateNotificationsDto } from "../domain/notifications.types";

const schema = new mongoose.Schema<CreateNotificationsDto>(
  {
    name: String,
    email: String,
  },
  { timestamps: true },
);

export const NotificationsModel = mongoose.model("Notifications", schema);
