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

    rearrangeWbsIds: asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
        const projectId = req.params.projectId;
        const newParent = req.params.structureId;
        let updateWbs = Object.entries(req.body);
        let structureId = updateWbs[0][0];
        let wbsId = updateWbs[0][1] as number;

        const result = await structureV1Service.rearrangeWbsIds(newParent, structureId, wbsId);

        return res.status(200).json({
            success: true,
            message: "Successfully updated wbs",
        });
    }),

}