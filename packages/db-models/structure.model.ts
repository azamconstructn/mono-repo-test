import { Document, Schema, model, Query, SchemaTypes } from 'mongoose';
import { Design, DesignSchema } from './design.model';
import { Location, LocationSchema } from './location';

//  Progress Snapshot Interface
export interface ProgressSnapshot {
  date: Date;
  planned: number;
  actual: number;
}

export interface ILayer {
  name: string;
  isSelected: boolean;
  children: ILayer[];
  filters?: any[];
  multiselection?: boolean;
  type?: string;
  layer?: string;
  color?: string;
}

//  Interface for views page item
export interface StructureItem {
  _id: string
  name: string
  parent: string
  children: StructureItem[]
  designCount: number
  wbs: number
  chip: string | undefined
  captures: {[key: string]: number} | undefined;
  captureCounts: {[key: string]: number} | undefined;
  issues: number | 0
  tasks: number | 0
  notes:number|0
  lastCapture: Date | undefined
  hasProgress: boolean | false
  assetCount: number | 0
}

// Subdocument schema
export const ProgressSnapshotSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      default: new Date(),
    },
    planned: {
      type: Number,
      required: true,
      default: -1,
      max: 100,
    },
    actual: {
      type: Number,
      required: true,
      default: -1,
      max: 100,
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
export interface Coordinates {
  type: 'Polygon';
  coordinates: [[[number]]];
}
// Structure interface
export interface Structure extends Document {
  name: string;
  progress: ProgressSnapshot;
  type: string;
  isExterior: boolean;
  fm: number;
  project: string;
  parent?: Schema.Types.String | null;
  children: [Schema.Types.String];
  location?: Location;
  utm?: string;
  designs?: Design[];
  wbs?: number;
  coordinates?: Coordinates;
  metaDetails?: Object;
  isDeleted: boolean;
}

export const coordinatesSchema: Schema = new Schema<Coordinates>(
  {
    type: { type: String, enum: ['Polygon'], required: true },
    coordinates: {
      type: [[[Number]]],
      required: true,
      validate: {
        validator: function (coords: [[[number]]]): boolean {
          return coords.length > 0 && coords[0].length > 2;
        },
        message: 'Polygon coordinates must have at least 3 points',
      },
    },
  },
  { _id: false }
);
// Structure schema
const StructureSchema = new Schema<Structure>(
  {
    _id: SchemaTypes.String,
    name: {
      type: String,
      required: true,
    },
    progress: ProgressSnapshotSchema,
    type: {
      type: String,
      required: true,
      default: 'Unknown',
    },
    isExterior: {
      type: Boolean,
      default: false,
    },
    fm: Number,
    project: {
      type: Schema.Types.String,
      ref: 'Project',
      required: true,
    },
    parent: {
      type: Schema.Types.Mixed,
      default: null,
      ref: 'Structure',
    },
    children: [
      {
        type: Schema.Types.String,
        ref: 'Structure',
      },
    ],
    coordinates: coordinatesSchema,
    location: LocationSchema,
    utm: String,
    designs: [DesignSchema],
    wbs: {
      type: Schema.Types.Number,
    },
    metaDetails: Object,
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    toJSON: {
      getters: true,
      virtuals: true,
    },
    toObject: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);
StructureSchema.index({ project: 1, parent: 1 });
StructureSchema.index({ coordinates: '2dsphere' });

// Document middlewares
StructureSchema.pre<Structure>('save', async function (next) {
  const now = String(Date.now());
  const middlePos = Math.ceil(now.length / 2);
  let prefix = 'STR';
  if (!this._id) this._id = `${prefix}${now.toString()}`;
  if (!this.wbs) {
    try {
      const parent = this.parent
        ? await StructureModel.findOne({_id:this.parent, isDeleted: false})
        : null;
      if (parent) {
        const children = await StructureModel.find({ parent: parent._id, isDeleted: false })
          .sort({ wbs: -1 })
          .limit(1);
        if (children.length > 0) {
          let latestwbs: number =
            children[0].wbs != undefined ? children[0].wbs : 0;
          this.wbs = latestwbs + 1;
        } else {
          this.wbs = 1;
        }
      } else {
        const roots = await StructureModel.find({
          parent: null,
          project: this.project,
          isDeleted: false,
        })
          .sort({ wbs: -1 })
          .limit(1);
        let latestRootWbs: number;
        if (roots.length)
          latestRootWbs = roots[0].wbs != undefined ? roots[0].wbs : 0;
        else latestRootWbs = 0;
        this.wbs = latestRootWbs + 1;
      }
    } catch (err) {
      next && next(err as Error);
      return;
    }
  }
  next && next();
});

StructureSchema.post<Structure>('save', async function (doc: Structure, next) {
  if (doc.parent) {
    await StructureModel.findOneAndUpdate(
      { _id: doc.parent },
      { $addToSet: { children: doc._id } }
    );
  }
  next && next();
});

StructureSchema.post<Structure>('deleteOne', async function (doc: Structure, next: (err?: Error) => void) {
  if (doc.parent) {
    await StructureModel.findOneAndUpdate(
      { _id: doc.parent },
      { $pull: { children: doc._id } }
    );
  }
  next && next();
});

StructureSchema.pre<Query<Structure, Structure>>('find', async function () {});
// const getBIMfromParentStructure = async (doc: String | null): Promise<any> => {
//   const parentStructure = await StructureModel.findById(doc);
//   return parentStructure?.bimDesign || undefined ;
// };

// StructureSchema.post<Query<Structure, Structure>>(
//   /^(find|findOne)/,
//   async function (doc: Structure | Structure[]) {
//     //console.log(doc)
//     let items: Structure[] = [];
//     if (!Array.isArray(doc)) {
//       items = [doc as Structure];
//     } else {
//       items = doc as Structure[];
//     }
//     for (let i = 0; i < items.length; i++) {
//       if(items[i]?.designs !== undefined){
//         let bimDesign = items[i]?.designs?.find((design) => design.type === 'BIM');
//         if (bimDesign === undefined) {
//           bimDesign = await getBIMfromParentStructure(items[i].parent as String | null);
//           items[i].bimDesign = bimDesign
//         }
//         else{
//           items[i].bimDesign = bimDesign
//         }
//       } 
//     }
//   }
// );

// create and export Structure model
export const StructureModel = model<Structure>('Structure', StructureSchema);
