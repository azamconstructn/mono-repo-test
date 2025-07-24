import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "@t3d/core-utils";

import { projectV1Controller } from "./project-v1.controller";
import { projectV2Service } from "../services/project-v2.service";

export const projectV2Controller = {

    ...projectV1Controller,

    createProject: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const response = await projectV2Service.createProject();
        res.json(response);
    })

}