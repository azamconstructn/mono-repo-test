import { Router } from "express";
import viewsV1Routes from "./views-v1.routes";

import { projectV1Controller } from "../controllers/project-v1.controller";

export default function projectV1Routes () {

    const router = Router();

    // router.use("/views", viewsV1Routes());

    router.route('/').post(projectV1Controller.createProject);

    router.route('/:projectId').put(projectV1Controller.editProject);

    router.route('/:projectId').delete(projectV1Controller.deleteProject);

    return router;

}