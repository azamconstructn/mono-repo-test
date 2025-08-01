import { Router } from "express";
import { structureV1Controller } from "../controllers";
import { structureV1Validator } from "../validators";
import { registerEndpoint, validateRequest, validateResponse } from "@t3d/core-utils";

export default function structureV1Routes() {

    const router = Router({ mergeParams: true });

    // router.post("/", structureV1Controller.addStructure)

    const addMultipleStructuresValidator = structureV1Validator.addMultipleStructures();

    registerEndpoint({
        method: 'post',
        path: "/api/v1/projects/{projectId}/structures/add-levels",
        description: "Add multiple structures in a project",
        requestSchema: addMultipleStructuresValidator.request,
        responseSchema: addMultipleStructuresValidator.response,
        tags: ["Structure Service"]
    });

    router.route("/add-levels").post(
        validateRequest(addMultipleStructuresValidator.request),
        // validateResponse(addMultipleStructuresValidator.response),
        structureV1Controller.addMultipleStructures
    )

    const rearrangeWbsIdsValidator = structureV1Validator.rearrangewbsids();

    registerEndpoint({
        method: 'put',
        path: "/api/v1/projects/{projectId}/structures/{structureId}/rearrangewbsids",
        description: "Rearrange WBS IDs for a structure",
        requestSchema: rearrangeWbsIdsValidator.request,
        responseSchema: rearrangeWbsIdsValidator.response,
        tags: ["Structure Service"]
    })

    router.route("/:structureId/rearrangewbsids").put(
        validateRequest(rearrangeWbsIdsValidator.request),
        validateResponse(rearrangeWbsIdsValidator.response),
        structureV1Controller.rearrangeWbsIds
    )

    return router;

}