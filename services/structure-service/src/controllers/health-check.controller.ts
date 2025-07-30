import { asyncHandler } from "@t3d/core-utils"
import { Request, Response, NextFunction } from "express";

export const healthCheckController = {

  basicHealthCheck: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

      return res.status(200).json({
        
        success: true,

        result: {uptime: process.uptime(), message: 'OK', date: new Date() }
        
      })
    }
  )
}