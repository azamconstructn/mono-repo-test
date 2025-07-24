import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "@t3d/core-utils"
import { ProjectModel } from "@t3d/db-models";

export class ViewsV1Controller {

    constructor() {}

    getProjectDetails = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        // const projects = await ProjectModel.find();
        // res.json({
        //     success: true,
        //     result: projects,
        // });
        const result = [
            {
                id: "PRJ001",
                name: "Project One",
                description: "This is the first project."
            },
            {
                id: "PRJ002",
                name: "Project Two",
                description: "This is the second project."
            }
        ]
        res.json({
            success: true,
            result: result,
        });
    });

}