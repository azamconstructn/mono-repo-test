import { NotificationsModel } from "../infrastructure/notifications.model";
import { CreateNotificationsDto } from "../domain/notifications.types";

export const createNotifications = async (data: CreateNotificationsDto) => {
  const entity = new NotificationsModel(data);
  return entity.save();
};

export const getNotificationsById = async (id: string) => {
  return NotificationsModel.findById(id);
};
