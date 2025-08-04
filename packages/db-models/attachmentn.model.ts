import { Document, Schema, model, SchemaTypes } from "mongoose";

import { AttachmentN } from "../entities/attachmentn";
export interface AttachmentNDocument extends AttachmentN, Document { }

// Subdocument schema
export const AttachmentNSchema = new Schema(
    {
        _id: SchemaTypes.String,
        name: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        entity: {
            type: String,
            required: true,
        },
        entityType: {
            type: String,
            required: true,
            enum: ["Issue", "Task", "Voice Note"],
        },
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
        toJSON: {
            getters: true,
            virtuals: true,
        },
        id: false,
    }
);

// Document middlewares
AttachmentNSchema.pre<AttachmentNDocument>("save", async function (next) {
    const now = String(Date.now());
    const middlePos = Math.ceil(now.length / 2);
    let prefix = "ATT";
    if (!this._id) this._id = `${prefix}${now.substring(middlePos)}`;
});

// create and export Attachment model
export const AttachmentNModel = model<AttachmentNDocument>(
    "AttachmentN",
    AttachmentNSchema
);
