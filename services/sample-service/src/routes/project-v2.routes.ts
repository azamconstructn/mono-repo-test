import { Router } from "express";

import { projectV2Controller } from "../controllers/project-v2.controller";
import projectV1Routes from "./project-v1.routes";

export default function projectV2Routes () {

    const router = Router();

    router.route('/').post(projectV2Controller.createProject);

    router.use('/', projectV1Routes());

    return router;

}