import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "@t3d/core-utils"

export class ViewsV1Controller {

    constructor() {}

    getProjectList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        console.log("Fetching project list...");
    })

}