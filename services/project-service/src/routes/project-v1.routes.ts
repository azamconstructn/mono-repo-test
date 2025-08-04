import { Router } from "express";
import projectConfigurationV1Routes from "./projectConfiguration-v1.routes";
export default function projectV1Routes() {

    const router = Router({ mergeParams: true });

    router.use("/:projectId/config", projectConfigurationV1Routes());

    return router;

}