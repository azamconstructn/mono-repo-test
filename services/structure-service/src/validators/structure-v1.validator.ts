import { z } from "@t3d/core-utils";

export const structureV1Validator = {

    addMultipleStructures : () => {

        const params = z.object({
            projectId: z.string(),
        });

        const body = z.object({
            parent: z.string(),
            prefix: z.string(),
            count: z.number().min(1).int(),
            wbs: z.number().min(1).int(),
            type: z.string(),
            isExterior: z.boolean()
        });

        const request = {
            params,
            body
        };

        const resultSchema = z.array(
            z.object({
                name: z.string(),
                type: z.string(),
                isExterior: z.boolean(),
                project: z.string(),
                parent: z.string(),
                children: z.array(z.any()),
                wbs: z.number().min(1),
                isDeleted: z.boolean(),
                designs: z.array(z.any()),
                // createdAt: z.string(),
                // updatedAt: z.string(),
                _id: z.string(),
                // __v: z.number()
            })
        )

        const response = z.object({
            success: z.boolean(),
            result: resultSchema
        });

        return { request, response };
    },

    rearrangewbsids: () => {

        const params = z.object({
            projectId: z.string(),
            structureId: z.string()
        });

        const body = z.record(z.string(), z.number().min(1).int()).refine(obj => Object.keys(obj).length === 1, {
            message: "One element is allowed in the record"
        });

        const request = { params, body };

        const response = z.object({
            success: z.boolean(),
            message: z.string()
        });

        return { request, response };
    },

}