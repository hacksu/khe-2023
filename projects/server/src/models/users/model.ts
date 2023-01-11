import { HydratedDocumentFromSchema, model, Schema } from 'mongoose';
import { UserData, UserRole, userData } from '../../data/models/users';
import { hashSync } from 'bcrypt';
import { exportModel } from '../../services/mongo/export';


export namespace UserPermissions {
    export const Read = { users: { read: true } } as const;
    export const Write = { users: { write: true, read: true } } as const;
    export const Delete = { users: { delete: true } } as const;
}


// Redefine fields for exporting
export declare namespace User {
    export type Data = defineUser.Data;
    export type Document = defineUser.Document;
    export type Schema = defineUser.Schema;
}

namespace defineUser {
    export const ModelName = 'User';
    export const data = userData;
    
    export type Data = UserData & {};
    export type Document = HydratedDocumentFromSchema<Schema>;
    export type Schema = typeof schema;

    /** Overwrite fields if necessary
     * - For example, passwords can be given a setter to ensure they are always hashed in the database.
     * - Enums should be redefined to ensure proper storage in the database
     * 
     * @see https://mongoosejs.com/docs/schematypes.html
     */
    const fields = new Schema<Data>({
        role: {
            type: String,
            enum: UserRole,
            default: UserRole.Pending,
        },
        password: {
            type: String,
            // Hash the password with bcrypt
            set: v => hashSync(v, 10),
        },
        emails: [{
            type: Schema.Types.ObjectId,
            ref: 'Mail'
        }],
    });

    /** Define the schema
     * @see https://mongoosejs.com/docs/guide.html
     */
    const schema = new Schema(fields.obj, {
        strict: false,
        toJSON: {
            transform(doc, ret, options) {
                delete ret['password'];
                return ret;
            },
        },
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated',
        },

        /** Query Helpers allow you to extend Mongoose's query operations
         * @see https://mongoosejs.com/docs/guide.html#query-helpers
         */
        query: {

        },

        /** Instance Methods allow you to define functions that can run on a document
         * @see https://mongoosejs.com/docs/guide.html#methods
         */
        methods: {

        },

        /** Virtuals allow you to define computed properties that are not serialized to the database
         * @see https://mongoosejs.com/docs/guide.html#virtuals
         */
        virtuals: {

        },

        /** Statics allow you to define static properties and functions on the model itself
         * @see https://mongoosejs.com/docs/guide.html#statics
         */
        statics: {

        }


    });

    export const Model = model(ModelName, schema);
    
}

export const User = exportModel(defineUser);
