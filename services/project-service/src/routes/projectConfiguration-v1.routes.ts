import { Router } from "express";
import { structureV1Validator } from "../validators";
import { validateRequest, validateResponse } from "@t3d/core-utils";
import { projectConfigurationV1Controller } from "../controllers";

export default function projectConfigurationV1Routes() {

    const router = Router({ mergeParams: true });

    // router.post("/", structureV1Controller.addStructure)

    const addMultipleStructuresValidator = structureV1Validator.addMultipleStructures();

    router.route("/").post(
        // validateRequest(addMultipleStructuresValidator.request),
        // validateResponse(addMultipleStructuresValidator.response),
        projectConfigurationV1Controller.createNewConfig
    )

    const rearrangeWbsIdsValidator = structureV1Validator.rearrangewbsids();

    router.route("/rearrangewbsids").put(
        // validateRequest(rearrangeWbsIdsValidator.request),
        // validateResponse(rearrangeWbsIdsValidator.response),
        projectConfigurationV1Controller.rearrangeWbsIds
    )
    router.route("/:configId").put(
        // validateRequest(rearrangeWbsIdsValidator.request),
        // validateResponse(rearrangeWbsIdsValidator.response),
        projectConfigurationV1Controller.editConfig
    )

    return router;

}