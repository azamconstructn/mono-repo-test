import { Schema, model, SchemaTypes, Document } from 'mongoose';
import ShortUniqueId from 'short-unique-id';

export type entityType =
    | 'Project'
    | 'issue'
    | 'task'
    | 'progress'
    | 'permission'
    | 'capture'
    | 'sharelink'
    | 'Note'

export interface Permission extends Document {
    name: string;
    permission: string;
    entityType: entityType;
    group: string;
}

export const PermissionSchema = new Schema<Permission>(
    {
        _id: SchemaTypes.String,
        name: {
            type: String,
            required: true,
        },
        permission: {
            type: String,
            required: true,
            unique: true,
        },
        entityType: {
            type: String,
            required: true,
            enum: ['project', 'task', 'issue', 'note', 'progress', 'permission', 'capture', 'sharelink'],
        },
        group: {
            type: String,
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
    }
);
PermissionSchema.pre<Permission>('save', async function (next) {
    if (!this._id) {
        const uid = new ShortUniqueId({ length: 10, dictionary: 'alphanum_upper' });
        this._id = `PEM-${uid.rnd()}`;
    }
});

export const PermissionModel = model<Permission>('Permission', PermissionSchema);
