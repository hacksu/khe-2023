import { get } from 'lodash';



type Intersect<T> = (T extends any ? ((x: T) => 0) : never) extends ((x: infer R) => 0) ? R : never

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

type AllPermissions<T> = {
    [P in keyof T]: T[P] & {
        /** woah */
        all: Intersect<T[P]>
    }
}


class BasePermissions<P> {
    /** All permissions */
    public all: P;

    constructor(permissions: P) {
        this.all = permissions;
        for (const key in permissions) {
            // @ts-ignore
            this[key] = {
                all: {
                    [key]: {
                        ...permissions[key],
                    }
                },
            };
            for (const name in permissions[key]) {
                // @ts-ignore
                this[key][name] = {
                    [key]: {
                        [name]: permissions[key][name],
                    }
                }
            }
        }
    }
}

export function createPermissions<P>(permissions: P): BasePermissions<P> & AllPermissions<P> {
    // @ts-ignore
    return new BasePermissions(permissions);
}



export type AccessControlConfig = {
    permissions: ReturnType<typeof createPermissions>,
}

export type Permissions<C extends AccessControlConfig = any> = DeepPartial<C['permissions']['all']>;

function flattenKeys(object, initialPathPrefix = '') {
    if (!object || typeof object !== 'object') {
        return [{ [initialPathPrefix]: object }]
    }

    const prefix = initialPathPrefix
        ? Array.isArray(object)
            ? initialPathPrefix
            : `${initialPathPrefix}.`
        : ''

    return Object.keys(object)
        .flatMap((key) =>
            flattenKeys(
                object[key],
                Array.isArray(object) ? `${prefix}[${key}]` : `${prefix}${key}`,
            ),
        )
        .reduce((acc, path) => ({ ...acc, ...path }))
}



declare const phantom: unique symbol;
export type AuthorizedPermissions<T extends Permissions> = {
    [phantom]: T
}

export type AuthorizeResult<T extends Permissions> =
    | { type: 'ok', permissions: AuthorizedPermissions<T> }
    | { type: 'fail', reason: string }

export class AccessControl<C extends AccessControlConfig> {
    constructor(public config: C) {

    }

    authorize<I extends Permissions<C>, P extends Permissions<C>>(input: I, against: P): AuthorizeResult<P> {
        const requested = flattenKeys(against);
        for (const path in requested) {
            if (get(input, path) !== requested[path]) {
                return { type: 'fail', reason: `User did not meet permission "${path}"` }
            }
        }
        return { type: 'ok', permissions: input as AuthorizedPermissions<P> }
    }
}

