// src/utils/zod-with-openapi.ts
import { z as baseZ } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(baseZ);

export const z = baseZ;
