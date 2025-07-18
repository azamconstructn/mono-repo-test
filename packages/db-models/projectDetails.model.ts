import { Document, Schema, model, SchemaTypes } from "mongoose";
import { UserRole, UserRoleSchema } from "./user-role";
import { Address, AddressSchema, Contact, ContactSchema } from "./address";
import { Location, LocationSchema } from "./location";
import { UtmLocation, UtmLocationSchema } from "./utmLocation";

// Types reused from project.model.ts
export type measurement = "US" | "Metric";
export type status = "Draft" | "PendingApproval" | "Approved" | "Rejected";
type metric = "$" | "SF";

export interface ProjectValue extends Document {
  metric: metric;
  value: number;
}

const ProjectValueSchema = new Schema<ProjectValue>(
  {
    metric: {
      type: String,
      enum: ["$", "SF"],
      default: "$",
    },
    value: {
      type: Number,
    },
  },
  { _id: false }
);

export interface ProjectDetails extends Document {
    project: string;
    nickName?: string;
    type: string;
    measurement: measurement;
    referenceId?: string;
    description?: string;
    email?: string;
    contact?: Contact;
    location?: Location;
    utm?: UtmLocation;
    //   snapshotCount?: number;
    //   structureCount?: number;
    //   latestSnapshotDate?: Date;
    projectValue?: ProjectValue;
    approval_At?: Date;
    users?: UserRole[];
    address?: Address;
    logo?: string;
    metaDetails?: object;
}

export const ProjectDetailsSchema = new Schema<ProjectDetails>(
    {
        project: {
            type: SchemaTypes.String, 
            required: true, 
            ref: "Project"
        },
        nickName: { type: String },
        type: { type: String, required: true },
        measurement: {
            type: String,
            enum: ["US", "Metric"],
            default: "US",
            required: true,
        },
        referenceId: { type: String },
        description: { type: String },
        email: { type: String },
        contact: { type: ContactSchema },
        location: { type: LocationSchema },
        utm: { type: UtmLocationSchema },
        // snapshotCount: { type: Number },
        // structureCount: { type: Number },
        // latestSnapshotDate: { type: Date },
        projectValue: { type: ProjectValueSchema },
        approval_At: { type: Date, default: null },
        users: [UserRoleSchema],
        address: AddressSchema,
        logo: String,
        metaDetails: Object,
    },
    {
        _id: false,
        toJSON: { getters: true, virtuals: true },
    }
);


export type ProjectType = "Residential" | "Pipeline" | "Road" | "Solar" | "Building" | "Commercial" | "Healthcare" | "Infrastructure" | "Industrial" | "Data Center" | "Airport";

export const ProjectTypes = [
  "Residential", "Pipeline", "Road", "Solar", "Building", "Commercial", "Healthcare", "Infrastructure", "Industrial", "Data Center", "Airport"
];

export const ProjectDetailsModel = model<ProjectDetails>("ProjectDetails", ProjectDetailsSchema);