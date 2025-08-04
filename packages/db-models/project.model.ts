import { Document, Schema, model, Query, SchemaTypes } from "mongoose";
import { Project, Measurement, Status } from "../entities/project";
type status = "Draft" | "PendingApproval" | "Approved" | "Rejected";

interface ProjectDocument extends Project, Document { }

// Project schema
const ProjectSchema = new Schema<ProjectDocument>(
  {
    _id: {
      type: String,
      required: true,
    },
    name: { type: String, required: true, unique: true },
    status: {
      type: String,
      required: true,
      enum: ["Draft", "PendingApproval", "Approved", "Rejected"],
      default: "Approved",
    },
    company: { type: Schema.Types.String, ref: "Company", required: true },
    timeZone: String,
    isLive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    id: false,
  }
);

// Document middlewares
ProjectSchema.pre<ProjectDocument>("save", async function (next) {
  const now = String(Date.now());
  const middlePos = Math.ceil(now.length / 2);
  let prefix = "PRJ";
  if (!this._id) this._id = `${prefix}${now.substring(middlePos)}`;
  next();
});



// create and export project model
export const ProjectModel = model<Project>("Project", ProjectSchema);
