import mongoose, { HydratedDocumentFromSchema, model, Schema } from 'mongoose';
import { MailData, MailStatus, MailStatuses } from '../../data/models/emails';
import { exportModel } from '../../services/mongo/export';
import { InferPopulate, Relations } from '../../utils/zod';


namespace defineMail {
    export const ModelName = 'Mail';

    export type Data = MailData & {};
    export type Document = HydratedDocumentFromSchema<Schema>;
    export type Schema = typeof schema;

    /** Overwrite fields if necessary
     * - For example, passwords can be given a setter to ensure they are always hashed in the database.
     * - Enums should be redefined to ensure proper storage in the database
     * 
     * @see https://mongoosejs.com/docs/schematypes.html
     */
    const fields = new Schema<Data>({
        status: {
            type: String,
            enum: MailStatuses,
            default: 'pending',
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    });

    /** Define the schema
     * @see https://mongoosejs.com/docs/guide.html
     */
    const schema = new Schema(fields.obj, {
        strict: false,
        collection: 'emails',
        toJSON: {
            transform(doc, ret, options) {
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
            /** Populates and skips model hydration with [lean](https://mongoosejs.com/docs/tutorials/lean.html) */
            with(relations: (keyof Relations<Data>)[]) {
                // @ts-ignore
                return this.populate(relations)
                    .lean<InferPopulate<Data, typeof relations, typeof this>>();
            },
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

export const Mail = exportModel(defineMail);

// Redefine fields for exporting
export declare namespace Mail {
    export type Data = defineMail.Data;
    export type Document = defineMail.Document;
    export type Schema = defineMail.Schema;
}

