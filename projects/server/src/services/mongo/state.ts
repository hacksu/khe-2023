import type { FieldPath, FieldPathValue } from 'react-hook-form';
import mongoose, { Schema } from 'mongoose';
import get from 'lodash/get';
import { config } from '../../config';

mongoose.connection.getClient().db('settings')

const serverStateModel = mongoose.model('state', new Schema({
    stateName: String,
}, {
    strict: false,
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated',
    }
}))

export class ServerState<T extends object> {
    public _document: any;
    constructor(public name: string, public initialData: T) {
        this.document;
        if (config.mode === 'development') {
            setInterval(() => {
                this.sync();
            }, 10000)
        }
    }

    get document() {
        if (this._document) return this._document as typeof found;
        const found = this.sync();
        return found;
    }

    async set<K extends FieldPath<T>>(key: K, value: FieldPathValue<T, K>) {
        await this.document;
        return serverStateModel.findOneAndUpdate({ stateName: this.name }, {
            $set: {
                [key]: value
            }
        });
    }

    async get<K extends FieldPath<T>>(key: K): Promise<FieldPathValue<T, K>> {
        return get(await this.document, key) as any;
    }

    async sync() {
        const found = serverStateModel.findOne({ stateName: this.name }).then(doc => {
            if (!doc) {
                return (
                    (new serverStateModel({
                        stateName: this.name,
                        ...this.initialData
                    })).save()
                ).then(o => serverStateModel.findOne({ stateName: this.name }))
            }
            return doc;
        })
        this._document = found;
        return found;
    }

}

