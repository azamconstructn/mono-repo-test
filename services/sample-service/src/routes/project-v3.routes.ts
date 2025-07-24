import { Router } from "express";

import { projectV3Controller } from "../controllers/project-v3.controller";
import projectV2Routes from "./project-v2.routes";

export default function projectV3Routes () {

    const router = Router();

    router.route('/:projectId').delete(projectV3Controller.deleteProject);

    router.use('/', projectV2Routes());

    return router;

}