import { Schema, model, Document } from "mongoose";
import { ProjectDetails } from "../entities/projectDetails";

// Extend the ProjectDetails interface for Mongoose
interface ProjectDetailsDocument extends ProjectDetails, Document { }

// Define the schema
const ProjectDetailsSchema = new Schema<ProjectDetailsDocument>(
  {
    project: { type: String, ref: "Project", required: true },
    description: { type: String },
    contact: {
      name: { type: String },
      phone: { type: String },
      email: { type: String },
    },
    address: { type: Schema.Types.Mixed }, // Flexible key-value pairs
    email: { type: String },
    utm: {
      easting: { type: Number },
      northing: { type: Number },
      zone: { type: String },
    },
    coverPhoto: { type: String },
    logo: { type: String },
    dashboardURL: { type: String },
    reportURL: { type: String },
    reportLocation: { type: String },
    projectIntend: { type: String },
    startDate: { type: Date },
    mlOps: { type: Boolean },
    isPursuitProject: { type: Boolean },
    projectValue: {
      metric: { type: String },
      value: { type: Number },
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    id: false,
  }
);
ProjectDetailsSchema.pre<ProjectDetailsDocument>("save", async function (next) {
  const now = String(Date.now());
  const middlePos = Math.ceil(now.length / 2);
  let prefix = "PRJD";
  if (!this._id) this._id = `${prefix}${now.substring(middlePos)}`;
  next();
});
// Create and export the model
export const ProjectDetailsModel = model<ProjectDetailsDocument>(
  "ProjectDetails",
  ProjectDetailsSchema
);