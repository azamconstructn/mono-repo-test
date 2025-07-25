import { z } from "@t3d/core-utils";
import { Structure, StructureSchema } from "@t3d/db-models";

export const structureV1Validator = {

    addMultipleStructures : () => {

        const params = z.object({
            projectId: z.string(),
        });

        const body = z.object({
            parent: z.string(),
            prefix: z.string(),
            count: z.number().min(1),
            wbs: z.number().min(1),
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

        return {
            request,
            response
        };
    }

}