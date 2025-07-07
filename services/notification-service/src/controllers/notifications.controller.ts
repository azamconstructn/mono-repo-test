import { Request, Response, NextFunction } from "express";
import * as notificationsService from "../services/notifications.service";

export const createNotificationsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await notificationsService.createNotifications(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getNotificationsByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await notificationsService.getNotificationsById(
      req.params.id,
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
