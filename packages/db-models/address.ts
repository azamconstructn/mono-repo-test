import { Document, Schema } from "mongoose";

// Address Interface
export interface Address extends Document {
  line1?: string;
  line2?: string;
  zipcode?: string;
  city?: string;
  state?: string;
  country?: string;
}

export const AddressSchema = new Schema<Address>(
  {
    line1: { type: String },
    line2: { type: String },
    zipcode: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  {
    _id: false,
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);

// Contact Interface
export interface Contact extends Document {
  code: string;
  number: string;
}

export const ContactSchema = new Schema<Contact>(
  {
    code: {
      type: String,
      required: true,
      default: "+91",
    },
    number: {
      type: String,
      required: true,
      length: 10,
    },
  },
  {
    _id: false,
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);
