import { HydratedDocumentFromSchema, model, Schema } from 'mongoose';
import { TicketData, TicketStatus } from '../../data/models/tickets';


export namespace TicketPermissions {
    export const Read = { tickets: { read: true } } as const;
    export const Write = { tickets: { write: true, read: true } } as const;
    export const Delete = { tickets: { delete: true } } as const;
}


export namespace Ticket {
    export const ModelName = 'Ticket';
    
    export type Data = TicketData & {};
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
            enum: TicketStatus,
            default: TicketStatus.Open,
        },
    });

    /** Define the schema
     * @see https://mongoosejs.com/docs/guide.html
     */
    const schema = new Schema(fields.obj, {
        strict: false,
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

