import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express, Request, Response } from "express";
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

export interface SwaggerOptions {
  title?: string;
  version?: string;
  description?: string;
  contact?: {
    name?: string;
    email?: string;
  };
  servers?: Array<{
    url: string;
    description: string;
  }>;
  apis?: string[];
}

// Swagger configuration
export const createSwaggerConfig = (
  app: Express,
  options: SwaggerOptions,
): void => {
  const swaggerSpec = swaggerJsdoc({
    definition: {
      openapi: "3.0.0",
      info: {
        title: options.title || "API Documentation",
        version: options.version || "1.0.0",
        description: options.description || "API documentation",
        contact: {
          name: options.contact?.name || "API Support",
          email: options.contact?.email || "support@example.com",
        },
      },
      servers: options.servers || [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: options.apis || ["./src/routes/*.ts", "./src/controllers/*.ts"],
  });

  // Serve Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: options.title || "API Documentation",
    }),
  );

  // Serve Swagger JSON
  app.get("/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

// Common Swagger annotations
export const swaggerAnnotations = {
  /**
   * @swagger
   * components:
   *   schemas:
   *     User:
   *       type: object
   *       required:
   *         - email
   *         - firstName
   *         - lastName
   *         - username
   *       properties:
   *         _id:
   *           type: string
   *           description: Auto-generated user ID
   *         email:
   *           type: string
   *           format: email
   *           description: User's email address
   *         firstName:
   *           type: string
   *           description: User's first name
   *         lastName:
   *           type: string
   *           description: User's last name
   *         username:
   *           type: string
   *           description: Unique username
   *         avatar:
   *           type: string
   *           description: URL to user's avatar image
   *         isActive:
   *           type: boolean
   *           description: Whether the user account is active
   *         createdAt:
   *           type: string
   *           format: date-time
   *         updatedAt:
   *           type: string
   *           format: date-time
   */
  /**
   * @swagger
   * components:
   *   schemas:
   *     AuthRequest:
   *       type: object
   *       required:
   *         - email
   *         - password
   *       properties:
   *         email:
   *           type: string
   *           format: email
   *         password:
   *           type: string
   *           minLength: 6
   */
  /**
   * @swagger
   * components:
   *   schemas:
   *     AuthResponse:
   *       type: object
   *       properties:
   *         accessToken:
   *           type: string
   *           description: JWT access token
   *         refreshToken:
   *           type: string
   *           description: JWT refresh token
   *         user:
   *           $ref: '#/components/schemas/User'
   */
  /**
   * @swagger
   * components:
   *   schemas:
   *     Notification:
   *       type: object
   *       required:
   *         - userId
   *         - type
   *         - title
   *         - message
   *       properties:
   *         _id:
   *           type: string
   *           description: Auto-generated notification ID
   *         userId:
   *           type: string
   *           description: ID of the user receiving the notification
   *         type:
   *           type: string
   *           enum: [email, push, sms]
   *           description: Type of notification
   *         title:
   *           type: string
   *           description: Notification title
   *         message:
   *           type: string
   *           description: Notification message
   *         status:
   *           type: string
   *           enum: [pending, sent, delivered, failed, cancelled]
   *           description: Current status of the notification
   *         priority:
   *           type: string
   *           enum: [low, normal, high, urgent]
   *           description: Priority level of the notification
   *         createdAt:
   *           type: string
   *           format: date-time
   */
};

// import { Express } from 'express';
// import swaggerUi from 'swagger-ui-express';
// import { registerUserDocs } from './user.docs';

export const registry = new OpenAPIRegistry();

export const setupSwagger = (app: Express) => {
  const openApiSpec = new OpenApiGeneratorV3(registry.definitions).generateDocument({
    openapi: '3.0.0',
    info: { title: 'Track3D API', version: '1.0.0' },
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
};