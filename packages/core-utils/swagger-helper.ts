import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { registry } from './swagger';

type RequestSchema = {
    body?: z.ZodSchema;
    params?: z.ZodSchema;
    query?: z.ZodSchema;
}

export function registerEndpoint(
  opts: {
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    path: string;
    description: string;
    requestSchema: RequestSchema;
    responseSchema: z.ZodSchema;
    tags?: string[];
  }
) {
  const { method, path, description, tags, requestSchema, responseSchema } = opts;
  
  // Build the request object dynamically
  const request: any = {};

  if (requestSchema.params) {
    request.params = requestSchema.params;
  }

  if (requestSchema.query) {
    request.query = requestSchema.query;
  }

  if (requestSchema.body) {
    request.body = {
      content: {
        'application/json': {
          schema: requestSchema.body,
        },
      },
    };
  }

  registry.registerPath({
    method,
    path,
    description,
    tags,
    request,
    responses: {
      200: {
        description: 'Successful response',
        content: { 'application/json': { schema: responseSchema } },
      },
    },
  });
}
