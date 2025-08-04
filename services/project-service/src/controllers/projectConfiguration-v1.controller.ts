import { asyncHandler } from "@t3d/core-utils";
import { Request, Response, NextFunction } from "express";

import { projectConfigurationV1Service } from "../services";

export const projectConfigurationV1Controller = {

    getAllConfigs: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const projectId = req.params.projectId;
        // Call the service to get all configurations
        const result = await projectConfigurationV1Service.getAllConfigs(req);
        return res.status(200).json({
            success: true,
            result
        });
    }),
    createNewConfig: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const projectId = req.params.projectId;
        // const { parent, prefix, count, wbs, type, isExterior } = req.body;

        // Call the service to create a new configuration
        const result = await projectConfigurationV1Service.createNewConfig(req.body);

        return res.status(200).json({
            success: true,
            result
        });
    }),
    editConfig: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        // Call the service to update a new configuration
        const result = await projectConfigurationV1Service.updateConfig(req.body);

        return res.status(200).json({
            success: true,
            result
        });
    }),
    deleteConfig: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        // Call the service to delete a configuration
        const result = await projectConfigurationV1Service.deleteConfig(req.body);

        return res.status(200).json(result);
    }),
    forceDeleteConfig: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        // Call the service to delete a configuration
        const result = await projectConfigurationV1Service.forceDeleteConfig(req.body);

        return res.status(200).json(result);
    }),
    rearrangeWbsIds: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const result = await projectConfigurationV1Service.rearrangeProjectConfigWbs(req.body.configId, req.body.wbsId);

        return res.status(200).json({
            success: result,
            message: "Successfully updated wbs",
        });
    }),

}