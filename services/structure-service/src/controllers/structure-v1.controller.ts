import { asyncHandler } from "@t3d/core-utils";
import { Request, Response, NextFunction } from "express";

import { structureV1Service } from "../services";

export const structureV1Controller = {

    addStructure: asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
        
    }),

    addMultipleStructures: asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
        const projectId = req.params.projectId;
        const { parent, prefix, count, wbs, type, isExterior } = req.body;

        // Call the service to add multiple structures
        const result = await structureV1Service.addMultipleStructures(projectId, parent, prefix, count, wbs, type, isExterior);

        return res.status(200).json({
            success: true,
            result
        });
    }),

}