import { Document, Schema, model, SchemaTypes } from "mongoose";


// ProjectConfiguration interface
export interface ProjectConfiguration extends Document {
    project: string;
    entity:
    "Issue"
    | "Task"
    | "BIM"
    | "Sheet"
    | "Tag"
    | "Note"

    type:
    "Type"
    | "Status"
    | "Priority";
    name: string;
    color: string;
}
// ProjectConfiguration schema
const ProjectConfigurationSchema = new Schema<ProjectConfiguration>(
    {
        _id: SchemaTypes.String,
        project: {
            type: Schema.Types.String,
            ref: "Project",
            required: true,
        },
        entity: {
            type: String,
            required: true,
            enum: [
                "Issue",
                "Task",
                "BIM",
                "Sheet",
                "Tag",
                "Note"
            ]

        },
        type: {
            type: String,
            required: true,
            enum: [
                "Type",
                "Status",
                "Priority",
            ]
        },
        name: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: "#475467",
            required: true,
        }
    },
);


ProjectConfigurationSchema.pre<ProjectConfiguration>("save", async function (next) {
    const now = String(Date.now());
    const middlePos = Math.ceil(now.length / 2);
    let prefix = "PGCF";
    if (!this._id) this._id = `${prefix}${now.toString()}`;
    next && next();
});

// create and export projectConfiguration model
export const ProjectConfigurationModel = model<ProjectConfiguration>("ProjectConfiguration", ProjectConfigurationSchema);
