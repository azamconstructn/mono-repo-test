import { Express } from "express";
import healthCheckRouter from "./health-check.routes";
import v1Routes from "./v1.routes";

export default function routes(app: Express) {

    app.use("/api/health", healthCheckRouter());

    app.use("/api/v1", v1Routes());

}