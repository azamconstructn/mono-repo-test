import { Router } from "express";
import structureV1Routes from "./structure-v1.routes";

export default function v1Routes () {

    const router = Router({ mergeParams: true });

    router.use("/projects/:projectId/structures", structureV1Routes());

    return router;
    
}