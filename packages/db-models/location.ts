import { Document, Schema, SchemaTypes } from "mongoose";

type LocationType = "point";

export interface Location extends Document {
  type: LocationType;
  elevation?: number;
  coordinates: [number, number];
}

export const LocationSchema = new Schema<Location>(
  {
    _id: SchemaTypes.String,
    type: {
      type: String,
      enum: ["point"],
      required: true,
    },
    elevation: {
      type: Number,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (arr: number[]) => Array.isArray(arr) && arr.length === 2,
        message: "Coordinates must be an array of two numbers [longitude, latitude]",
      },
    },
  },
);
