import { Router } from "express";

import structureV1Routes from "./structure-v1.routes";

export default function projectV1Routes() {

    const router = Router({ mergeParams: true });

    router.use("/:projectId/structures", structureV1Routes());
    
    return router;

}