import { Router } from "express";
import { structureV1Controller } from "../controllers";
import { structureV1Validator } from "../validators";
import { validateRequest, validateResponse } from "@t3d/core-utils";

export default function structureV1Routes() {

    const router = Router({ mergeParams: true });

    // router.post("/", structureV1Controller.addStructure)

    const addMultipleStructuresValidator = structureV1Validator.addMultipleStructures();

    router.route("/add-levels").post(
        validateRequest(addMultipleStructuresValidator.request),
        // validateResponse(addMultipleStructuresValidator.response),
        structureV1Controller.addMultipleStructures
    )

    const rearrangeWbsIdsValidator = structureV1Validator.rearrangewbsids();

    router.route("/:structureId/rearrangewbsids").put(
        validateRequest(rearrangeWbsIdsValidator.request),
        validateResponse(rearrangeWbsIdsValidator.response),
        structureV1Controller.rearrangeWbsIds
    )

    return router;

}