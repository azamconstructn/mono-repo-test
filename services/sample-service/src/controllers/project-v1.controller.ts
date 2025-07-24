import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "@t3d/core-utils";
import { projectV1Service } from "../services/project-v1.service";

export const projectV1Controller = {

    createProject: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const response = await projectV1Service.createProject();
        res.json(response);
    }),

    editProject: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const response = await projectV1Service.editProject();
        res.json(response);
    }),

    deleteProject: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const response = await projectV1Service.deleteProject();
        res.json(response);
    })

}