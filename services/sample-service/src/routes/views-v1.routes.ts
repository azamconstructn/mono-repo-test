import { Router } from "express";
import { ViewsV1Controller } from "../controllers";
import { ViewsV1Validator } from "../validators";
import { validateRequest, validateResponse, registerEndpoint } from "@t3d/core-utils";

export default function viewsRoutes() {

    const router = Router();

    const controller = new ViewsV1Controller();

    const validator = new ViewsV1Validator();

    const getProjectDetailsSchema = validator.getProjectDetails();

    registerEndpoint({
        method: 'put',
        path: '/api/v1/views/projectDetails/{projectId}',
        requestSchema: getProjectDetailsSchema.request,
        responseSchema: getProjectDetailsSchema.response,
        description: 'Get project details',
        tags: ['Views'],
    });

    router.route("/projectDetails/:projectId").put(
        validateRequest(getProjectDetailsSchema.request),
        validateResponse(getProjectDetailsSchema.response),
        controller.getProjectDetails
    );

    return router;

}