import { Document, Schema } from "mongoose";

export interface UtmLocation extends Document {
  northing: number;
  easting: number;
  zone: string;
  elevation?: number;
}

export const UtmLocationSchema = new Schema<UtmLocation>(
  {
    northing: {
      type: Number,
      required: true,
    },
    easting: {
      type: Number,
      required: true,
    },
    zone: {
      type: String,
      required: true,
    },
    elevation: {
      type: Number,
    },
  }
);
