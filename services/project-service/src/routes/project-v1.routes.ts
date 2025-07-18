import { Router } from "express";
import viewsV1Routes from "./views-v1.routes";

export default function projectRoutes () {

    const router = Router();

    router.use("/views", viewsV1Routes());

    return router;

}