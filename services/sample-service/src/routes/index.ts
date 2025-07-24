import { Express } from "express";
import healthCheckRouter from "./health-check.routes";
import viewsV1Routes from "./views-v1.routes";
import projectV1Routes from "./project-v1.routes";
import projectV2Routes from "./project-v2.routes";
import projectV3Routes from "./project-v3.routes";

export default function routes (app: Express) {

    app.use("/api/health", healthCheckRouter());

    // app.use("/api/v1/views", viewsV1Routes());

    app.use("/api/v1", projectV1Routes())

    app.use("/api/v2", projectV2Routes());

    app.use("/api/v3", projectV3Routes());

}