// import { z } from "zod";
// import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "@t3d/core-utils";

// Extend Zod with OpenAPI capabilities
// extendZodWithOpenApi(z);

export class ViewsV1Validator {

    constructor() {}

    getProjectDetails = () => {

        const projectIdSchema = z.string().startsWith('PRJ', { message: "ProjectId must start with 'PRJ'" });

        const nameSchema = z.string().min(2).max(100);

        const descriptionSchema = z.string().max(500).optional();

        const resultSchema = z.object({
            id: projectIdSchema,
            name: nameSchema,
            description: descriptionSchema,
        });

        const body = z.object({
            project: projectIdSchema
        });
        
        const params = z.object({
            projectId: projectIdSchema,
        });

        const query = z.object({
            includeDetails: z.boolean().optional(),
        });

        const request = {
            body: body,
            params: params,
            query: query
        };

        const response = z.object({
            success: z.boolean(),
            result: z.array(resultSchema)
        });

        // type requestDto = z.infer<typeof request>;

        // type responseDto = z.infer<typeof response>;

        return {
            request,
            response
        };

    }

}