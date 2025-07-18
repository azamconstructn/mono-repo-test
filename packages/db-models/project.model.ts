import { Document, Schema, model, Query, SchemaTypes } from "mongoose";
import {} from "../entities/project";
 
type status = "Draft" | "PendingApproval" | "Approved" | "Rejected";

export interface Project extends Document {
  name: string;
  // nickName?: string;
  // type: string;
  // measurement: measurement;
  // referenceId?: string;
  // users?: UserRole[];
  status: status;
  // description?: string;
  // email?: string;
  // contact?: Contact;
  // address?: Address;
  // location: location;
  // utm: utmLocation;
  coverPhoto?: string;
  // logo?: string;
  company: string;
  // snapshotCount?: number;
  // structureCount?: num/ber;
  // latestSnapshotDate?: Date;
  timeZone?: string;
  // metaDetails?: object;
  // approval_At?: Date;
  isLive?: boolean;
  // projectValue?: ProjectValue;
  createdAt: Date;
  updatedAt: Date;
}

// Project schema
const ProjectSchema = new Schema<Project>(
  {
    _id: SchemaTypes.String,
    // type: { type: String, required: true },
    // nickName: String,
    // measurement: {
    //   type: String,
    //   required: true,
    //   enum: ["US", "Metric"],
    //   default: "US",
    // },
    name: { type: String, required: true, unique: true },
    status: {
      type: String,
      required: true,
      enum: ["Draft", "PendingApproval", "Approved", "Rejected"],
      default: "Approved",
    },
    // approval_At: { type: Date, default: null },
    // description: String,
    company: { type: Schema.Types.String, ref: "Company", required: true },
    // projectValue: { type: projectValueSchema },
    // email: String,
    // users: [UserRoleSchema],
    // contact: ContactSchema,
    // address: AddressSchema,
    // location: locationSchema,
    coverPhoto: String,
    // logo: String,
    timeZone: String,
    // utm: utmLocationSchema,
    // snapshotCount: Number,
    // structureCount: Number,
    // latestSnapshotDate: Schema.Types.Date,
    // metaDetails: Object,
    isLive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    id: false,
  }
);

// Document middlewares
ProjectSchema.pre<Project>("save", async function (next) {
  const now = String(Date.now());
  const middlePos = Math.ceil(now.length / 2);
  let prefix = "PRJ";
  if (!this._id) this._id = `${prefix}${now.substring(middlePos)}`;
  next();
});

ProjectSchema.post(["updateOne", "findOneAndUpdate"], async function (doc: Project) {
  // if (doc) doc.users = [];
});

// ProjectSchema.post(["updateOne", "findOneAndUpdate", "updateMany", "save"], async function (doc: Project) {
//   if (!doc) return;
//   const populate: PopulateOptions[] = [
//     { path: "company", select: "id name" },
//   ];
//   await doc.populate(populate);
//   updatecache.getProjectsDataV2(doc);
// });

// create and export project model
export const ProjectModel = model<Project>("Project", ProjectSchema);
