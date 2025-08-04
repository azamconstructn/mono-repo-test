import { Document, Schema, model, SchemaTypes } from 'mongoose';
import ShortUniqueId from 'short-unique-id';
import { UserEntityRole } from '../entities/userEntityRole';
export interface UserEntityRoleDocument extends UserEntityRole, Document { }
export const UserEntityRoleSchema = new Schema<UserEntityRoleDocument>(
    {
        _id: SchemaTypes.String,
        user: {
            type: String,
            required: true,
        },
        role: {
            type: Schema.Types.String,
            ref: "Role",
            required: true,

        },
        entityId: {
            type: String,
            required: true,
        },
        entityType: {
            type: String,
            enum: ['Project', 'task', 'issue', 'Note', 'progress', 'permission', 'capture', 'sharelink'],
            required: true,
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
UserEntityRoleSchema.pre<UserEntityRoleDocument>('save', async function (next) {
    // if (!this._id) {
    //   const uid = new ShortUniqueId({ length: 10, dictionary: 'alphanum_upper' });
    //   this._id = `UER-${uid.rnd()}`;
    // }
    const now = String(Date.now());
    const middlePos = Math.ceil(now.length / 2);
    let prefix = "UER";
    if (!this._id) this._id = `${prefix}${now.toString()}`;
});

UserEntityRoleSchema.index({ user: 1, entityId: 1 }, { unique: true });

export const UserEntityRoleModel = model<UserEntityRole>(
    'UserEntityRole',
    UserEntityRoleSchema
);
