import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const asyncHandler =
    (fn: any) => (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

class BaseError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational: boolean) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);
        this.name = Error.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}

export class InvalidRouteError extends BaseError {
    routeName: string;

    constructor(routeName: string) {
        super(404, `Invalid Route: '${routeName}`, true);

        this.routeName = routeName;
    }
}

export class NotFoundError extends BaseError {
    reason: string;

    constructor(reason: string) {
        super(404, `${reason}`, true);

        this.reason = reason;
    }
}

export class AuthenticationError extends BaseError {
    reason: string;

    constructor(reason: string) {
        super(401, `${reason}`, true);

        this.reason = reason;
    }
}

export class ConflictError extends BaseError {
    reason: string;

    constructor(reason: string) {
        super(409, `${reason}`, true);

        this.reason = reason;
    }
}

export class ValidationError extends BaseError {
    reason: string;

    constructor(reason: string) {
        super(403, `${reason}`, true);

        this.reason = reason;
    }
}

export class UnsupportedFormatError extends BaseError {
    reason: string;

    constructor(reason: string) {
        super(415, `${reason}`, true);

        this.reason = reason;
    }
}

export class DuplicateError extends BaseError {
    reason: string;

    constructor(reason: string) {
        super(409, `${reason}`, true);

        this.reason = reason;
    }
}

export class InternalError extends BaseError {
    constructor() {
        super(500, `Internal Server Error`, true);
    }
}

export class ProcoreError extends BaseError {
    constructor(statusCode: number, error: any) {
        console.log('Procore error', JSON.stringify(error.response.data));
        if (
            error.response.status === 403 &&
            error.response.data.errors[0] ===
            'App is not connected to this company.'
        ) {
            throw new ValidationError(
                'App is not connected to this company. Please install Track3D app from Procore Marketplace',
            );
        } else if (error.response.status === 403) {
            throw new ValidationError(error.response.data.errors[0]);
        } else if (error.response.status === 401) {
            throw new AuthenticationError('Procore Authentication Failed');
        } else {
            super(error.response.status, `${JSON.stringify(error.response.data)}`, true);
        }
    }
}

class ErrorHandler {
    errorType: string = "BaseError";

    public async handleError(err: any, res?: Response): Promise<void> {
        console.error(
            "Error message from the centralized error-handling component",
            err
        );
        // await sendMailToAdminIfCritical();
        // await sendEventsToSentry();
        if (res) {
            let error: BaseError = new InternalError();
            if (this.errorType == "BaseError") {
                error = err as BaseError;
            } else if (this.errorType == "MongooseError") {
                switch (err.name) {
                    case "ValidationError":
                        error = new ValidationError(err.message);
                        break;
                    case "MongoServerError":
                        if (err.code == 11000) {
                            error = new DuplicateError(
                                `An item with '${Object.keys(err.keyValue)[0]} as ${Object.values(err.keyValue)[0]
                                }' already exist.`
                            );
                        }
                        break;
                    default:
                        error = new InternalError();
                }
            }
            res.status(error.statusCode).send({
                success: false,
                message: error.message,
            });
        }
    }

    public isTrustedError(error: any) {
        if (error instanceof BaseError) {
            this.errorType = "BaseError";
            return error.isOperational;
        } else if (error.name) {
            this.errorType = "MongooseError";
            return true;
        }
        return false;
    }
}
export const errorHandler = new ErrorHandler();
