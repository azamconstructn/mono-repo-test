import { Schema, model, Document } from "mongoose";
import { ProjectMetrics } from "../entities/projectmetrics";

// Extend the ProjectMetrics interface for Mongoose
interface ProjectMetricsDocument extends ProjectMetrics, Document { }

// Define the schema
const ProjectMetricsSchema = new Schema<ProjectMetricsDocument>(
    {
        project: { type: String, ref: "Project", required: true },
        VD: { type: Schema.Types.Mixed }, // Record<string, ModeCounts>
        twoD: { type: Schema.Types.Mixed }, // Record<string, ModeCounts>
        colors: { type: [String], default: ['#FF0000', '#00FF00', '#232356ff'] }, // Array of colors, e.g. ['#FF0000', '#00FF00', '#0000FF']
    },
    {
        timestamps: true,
        toJSON: { getters: true, virtuals: true },
        id: false,
    }
);

// Optionally, add a pre-save hook for custom _id generation if needed
ProjectMetricsSchema.pre<ProjectMetricsDocument>("save", async function (next) {
    const now = String(Date.now());
    const middlePos = Math.ceil(now.length / 2);
    let prefix = "PRJM";
    if (!this._id) this._id = `${prefix}${now.substring(middlePos)}`;
    next();
});

// Create and export the model
export const ProjectMetricsModel = model<ProjectMetricsDocument>("ProjectMetrics", ProjectMetricsSchema);