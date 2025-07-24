import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "@t3d/core-utils";

import { projectV2Controller } from "./project-v2.controller";
import { projectV3Service } from "../services/project-v3.service";

export const projectV3Controller = {

    ...projectV2Controller,

    deleteProject: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const response = await projectV3Service.deleteProject();
        res.json(response);
    })

}