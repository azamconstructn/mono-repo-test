import { Router } from "express";
import { ViewsV1Controller } from "../controllers";

export default function viewsRoutes() {

    const router = Router();

    const controller = new ViewsV1Controller();

    router.route("/web/projectlist").get(controller.getProjectList)

    return router;

}