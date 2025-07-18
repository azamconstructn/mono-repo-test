import { Document, Schema, model, SchemaTypes } from "mongoose";
//oss:object storage service
type provider = "constructn-oss" | "autodesk-oss";
type format =
  | ".DWG"
  | ".DXF"
  | ".PDF"
  | ".RVT"
  | ".SVF"
  | ".SVF2"
  | ".IFC"
  | ".SKP"
  | ".NWD";
type tm = {
  tm: number[];
  offset?: number[];
};
type category = "BIM" | "sheet";
type status =
  | "active"
  | "inActive"
  | "created"
  | "uploaded"
  | "processing"
  | "readyForCapture"
  | "inReview";
const TmSchema = new Schema<tm>(
  {
    tm: {
      type: [Schema.Types.Number],
    },
    offset: {
      type: [Schema.Types.Number],
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
type storage = {
  provider: provider; //constructn-oss
  path?: string;
  pathId?: string;
  format: format;
  providerType: "internal" | "external"; //internal or external
};
const StorageSchema = new Schema<storage>(
  {
    provider: {
      type: Schema.Types.String,
    },
    path: {
      type: Schema.Types.String,
    },
    pathId: {
      type: Schema.Types.String,
    },
    providerType: {
      type: Schema.Types.String,
      enum: ["internal", "external"],
      required: true,
    },
    format: {
      type: Schema.Types.String,
      enum: [
        ".DWG",
        ".DXF",
        ".PDF",
        ".RVT",
        ".SVF",
        ".SVF2",
        ".IFC",
        ".NWD",
        ".SKP",
      ],
      required: true,
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

export type manifestInfo = {
  resolution: [number]
  paperUnits: string
  paperWidth: number
  paperHeight: number
  trueWidth?: number
  trueHeight?: number
}

const manifestSchema = new Schema<manifestInfo>(
  {
    resolution: [Number],
    paperUnits: String,
    paperWidth: Number,
    paperHeight: Number,
    trueWidth: Number,
    trueHeight: Number
  },
  {
    _id: false
  }
)

// Design interface
export interface Design extends Document {
  user?: string;
  type: string;
  name: string;
  displayName?: string;
  isUploaded?: boolean;
  status: status;
  readyForProcessing: boolean;
  readyForCapture: boolean;
  readyForViewing: boolean;
  category: category;
  project: string;
  structure: string;
  storage: [storage];
  version?: string;
  isProcessing?: boolean;
  tm?: tm;
  fileSize?: number;
  metaDetails?: Object;
  config?: {
    type: string
  };
  isReplaced?: boolean;
  manifestInfo?: manifestInfo
  isDeleted: boolean;
  isDefault?: boolean;
  previousDefault?: boolean;
}

// Design schema
export const DesignSchema = new Schema<Design>(
  {
    _id: Schema.Types.String,
    user: {
      type: Schema.Types.String,
      ref: "User",
    },
    type: {
      type: Schema.Types.String,
      required: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    isUploaded: {
      type: Boolean,
      default: false,
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    displayName: {
      type: Schema.Types.String
    },
    previousDefault: {
      type: Schema.Types.String,
      ref: "Design",
    },
    readyForCapture: {
      type: Schema.Types.Boolean,
      default: false,
      required: true
    },
    readyForProcessing: {
      type: Schema.Types.Boolean,
      default: false,
      required: true
    },
    readyForViewing: {
      type: Schema.Types.Boolean,
      default: false,
      required: true
    },
    isProcessing: {
      type: Boolean,
      default: false
    },
    category: {
      type: Schema.Types.String,
      enum: ["BIM", "sheet"],
      required: true
    },
    project: {
      type: Schema.Types.String,
      ref: "Project",
      required: true,
    },
    structure: {
      type: Schema.Types.String,
      ref: "Structure",
      required: true,
    },
    fileSize: {
      type: Schema.Types.Number,
      required: false,
    },
    status: {
      type: String,
      default: "created",
      required: true,
      enum: [
        "active",
        "inActive",
        "created",
        "uploaded",
        "processing",
        "readyForCapture",
        "inReview",
      ],
    },
    storage: [StorageSchema],
    version: {
      type: Schema.Types.String,
    },
    tm: TmSchema,
    metaDetails: {
      type: Object,
    },
    config: {
      type: {
        type: Schema.Types.String,
        ref: "ProjectConfiguration",
        populate: { select: "project entity type name color" }
      },
    },
    isReplaced: {
      type: Boolean,
      required: false
    },
    manifestInfo: {
      type: manifestSchema,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

// Document middlewares
DesignSchema.pre<Design>("save", async function (next) {
  const now = String(Date.now());
  const middlePos = Math.ceil(now.length / 2);
  let prefix = "DSG";
  if (!this._id) this._id = `${prefix}${now.substring(middlePos)}`;
  if (!this.displayName) {
    this.displayName = this.name;
  }
  next && next();
});

// create and export Design model
export const DesignModel = model<Design>("Design", DesignSchema);
