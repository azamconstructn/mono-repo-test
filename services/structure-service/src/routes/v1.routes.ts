import { Router } from "express";
import projectV1Routes from "./project-v1.routes";

export default function v1Routes () {

    const router = Router({ mergeParams: true });

    router.use("/projects", projectV1Routes());

    return router;
    
}