import { asyncHandler } from "@t3d/core-utils";
import { Request, Response, NextFunction } from "express";

import { structureV1Service } from "../services";

export const structureV1Controller = {

    addStructure: asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
        
    }),

    addMultipleStructures: asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
        const { projectId } = req.params;
        const { parent, prefix, count, wbs, type, isExterior } = req.body;

        const result = await structureV1Service.addMultipleStructures(projectId, parent, prefix, count, wbs, type, isExterior);

        return res.status(200).json({
            success: true,
            result: result
        });
    }),

    rearrangeWbsIds: asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
        const projectId = req.params.projectId;
        let newParent = req.params.structureId;
        let updateWbs = Object.entries(req.body);
        let structureId = updateWbs[0][0];
        let newWbsId = updateWbs[0][1] as number;

        const result = await structureV1Service.rearrangeWbsIds(newParent, structureId, newWbsId);

        return res.status(200).json(result);
    }),

}