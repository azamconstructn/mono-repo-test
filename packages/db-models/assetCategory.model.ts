import { Document, Schema, model, SchemaTypes } from "mongoose";


import { AssetCategory } from "../entities/assetCategory";
export interface AssetCategoryDocument extends AssetCategory, Document { }
export const AssetCategorySchema = new Schema(
    {
        _id: SchemaTypes.String,
        name: {
            type: String,
            required: true,
            trim: true
        },
        project: {
            type: SchemaTypes.String,
            required: true
        },
        drawing: {
            type: SchemaTypes.String,
            required: false
        }
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        },
        toJSON: {
            getters: true,
            virtuals: true
        },
        id: false
    }
);

export const AssetCategoryModel = model<AssetCategory>(
    "AssetCategory",
    AssetCategorySchema
);
