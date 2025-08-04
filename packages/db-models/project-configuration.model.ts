import { Document, Schema, model, SchemaTypes } from "mongoose";
import { ProjectConfiguration } from "../entities/projectConfiguration";
export interface ProjectConfigurationDocument extends ProjectConfiguration, Document { }


// ProjectConfiguration schema
const ProjectConfigurationSchema = new Schema<ProjectConfigurationDocument>(
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
        },
        wbs: {
            type: Schema.Types.Number,
        }
    },
);

ProjectConfigurationSchema.pre<ProjectConfigurationDocument>("save", async function (next) {
    const now = String(Date.now());
    const middlePos = Math.ceil(now.length / 2);
    let prefix = "PGCF";
    if (!this._id) this._id = `${prefix}${now.toString()}`;
    if (!this.wbs) {
        let config = await ProjectConfigurationModel.find({
            project: this.project,
            entity: this.entity,
            type: this.type,
        }).sort({ wbs: -1 }).limit(1);
        if (config.length > 0) {
            let latestNum: number = config[0].wbs != undefined ? config[0].wbs : 0;
            this.wbs = latestNum + 1; // Increment the latest WBS number
        } else {
            this.wbs = 1; // Start with 1 if no previous configurations exist
        }
    }
});

// create and export projectConfiguration model
export const ProjectConfigurationModel = model<ProjectConfigurationDocument>("ProjectConfiguration", ProjectConfigurationSchema);
