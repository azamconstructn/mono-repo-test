import { Document, Schema, model, SchemaTypes, Query } from "mongoose";
import { AttachmentNModel, AttachmentNSchema } from "./attachmentn.model";
import { AttachmentN } from "../entities/attachmentn";
import { Note } from "../entities/notes";
export interface NoteDocument extends Note, Document { }

const NotesSchema = new Schema<NoteDocument>(
    {
        _id: SchemaTypes.String,
        title: { type: String, required: true, trim: true },
        defaultTitle: { type: String, trim: true },
        description: String,
        type: { type: String, required: false },
        status: { type: String, required: false },
        priority: { type: String, required: false },
        assignees: [{ type: Schema.Types.String, ref: "User" }],
        addressedBy: { type: Schema.Types.String, ref: "User" },
        owner: { type: Schema.Types.String, ref: "User" },
        project: { type: Schema.Types.String, ref: "Project", required: true },
        structure: { type: Schema.Types.String, ref: "Structure", required: true },
        snapshot: { type: Schema.Types.String, ref: "Snapshot" },
        context: Object,
        screenshot: String,
        attachments: [AttachmentNSchema],
        progress: { type: Number, required: true, default: -1 },
        sequenceNumber: { type: Number, required: true, unique: true },
        metadata: Object,
        integration: Object,
        startDate: Date,
        dueDate: Date,
        completedDate: Date,
        tags: [String],
        config: {
            type: {
                type: Schema.Types.String,
                ref: "ProjectConfiguration",
                populate: { select: "project entity type name color" }
            },
            status: {
                type: Schema.Types.String,
                ref: "ProjectConfiguration",
                populate: { select: "project entity type name color" }
            },
            priority: {
                type: Schema.Types.String,
                ref: "ProjectConfiguration",
                populate: { select: "project entity type name color" }
            },
            tags: {
                type: [Schema.Types.String],
                ref: "ProjectConfiguration",
                populate: { select: "project entity type name color" }
            }
        },
        noteType: {
            type: String,
            required: true,
            enum: ["Issue", "Task", "VoiceNote"],
        },
        voiceNoteAttachmentId: {
            type: Schema.Types.String,
            ref: "AttachmentN",
            required: false,
        },
        capture: {
            type: String,
            required: false,
        },
        voiceNoteStatus: {
            type: String,
            required: false,
        },
        transcript: {
            type: String,
            required: false,
        },
        design: {
            type: String,
            required: false,
        },
        hasGlobal: {
            type: Boolean,
            required: false,
            default: true,
        },
        hasNormalized: {
            type: Boolean,
            required: false,
            default: false,
        },
        tmStatus: {
            type: String,
            enum: ["notUpdated", "updated"],
            default: "updated"
        },
        rawCaptureData: Object,
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
        toJSON: { virtuals: true },
        id: false,
    }
);

NotesSchema.index({ project: 1 });
NotesSchema.index({ structure: 1 });

// Document middlewares
NotesSchema.pre<NoteDocument>("save", async function (next) {
    const now = String(Date.now());
    const middlePos = Math.ceil(now.length / 2);
    let prefix = "NTE";
    if (!this._id) this._id = `${prefix}${now.substring(middlePos)}`;
});

// NotesSchema.post<Query<Note, Note>>(
//     /^(find|findOne|updateOne|findOneAndUpdate)/,
//     async function (doc: Note | Note[]) {
//         if (this.projection()?.attachments == 0) {
//             if (doc instanceof NotesModel) {
//                 const attachments: AttachmentN[] = await AttachmentNModel.find(
//                     { entity: doc._id },
//                     "-__v"
//                 );
//                 doc.attachments = attachments;
//             } else {
//                 for (let i = 0; i < (doc as Note[]).length; i++) {
//                     const attachments: AttachmentN[] = await AttachmentNModel.find(
//                         { entity: (doc as Note[])[i]._id },
//                         "-__v"
//                     );
//                     (doc as Note[])[i].attachments = attachments;
//                 }
//             }
//         } else {
//             if (doc && doc instanceof NotesModel) doc.attachments = undefined;
//             else if (doc) {
//                 for (let i = 0; i < (doc as Note[]).length; i++) {
//                     (doc as Note[])[i].attachments = undefined;
//                 }
//             }
//         }
//     }
// );

// Create and export the unified model
export const NotesModel = model<NoteDocument>("Note", NotesSchema);
