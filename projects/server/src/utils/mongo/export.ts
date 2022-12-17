import { Model } from 'mongoose';


export function exportModel<T extends {
    Model: Model<any>
}>(namespace: T): T & T['Model'] {
    const keys = Object.keys(namespace);
    return new Proxy(namespace['Model'], {
        get(target, p, receiver) {
            if (typeof p === 'string' && keys.includes(p)) {
                return namespace[p];
            }
            return target[p];
        },
    }) as any;
}

