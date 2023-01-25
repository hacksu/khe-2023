import { get, merge, set } from 'lodash';
import type { FieldPath, FieldPathValue, FieldPathValues } from 'react-hook-form';


type Intersect<T> = (T extends any ? ((x: T) => 0) : never) extends ((x: infer R) => 0) ? R : never

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type Permission<T extends Permissions<any> | any = Permissions<any>> = T extends Permissions<any>
    ? DeepPartial<T['permissions']>
    : DeepPartial<T>;

export type InferPermission<T extends Permissions<any> | any = Permissions<any>> = Permission<T>;

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
export type AuthorizedPermission<T extends Permission> = {
    [phantom]: T
}

export type AuthorizeResult<T extends Permission> =
    | { type: 'ok', permissions: AuthorizedPermission<T> }
    | { type: 'fail', reason: string }

type _PermissionPath<T extends object, F extends FieldPath<T> = FieldPath<T>> = {
    [P in F]: FieldPathValue<T, P> extends object ? `${P}.all` : P;
};

type PermissionPath<T extends object, F extends FieldPath<T> = FieldPath<T>> = _PermissionPath<T>[keyof _PermissionPath<T>];

// @ts-ignore
type PopulatedPermissionValue<T extends object, K extends string> = FieldPathValue<T, PopulatedPermissionPath<K>>;
type PopulatedPermission<T extends object, K extends string> = K extends 'all' ? T : NestedAssign<{}, PopulatedPermissionPath<K>, PopulatedPermissionValue<T, K>>;
type PopulatedPermissionPath<K extends string> = K extends `${infer S}.all` ? S : K;

type NestedAssign<T, K, V> = K extends `${infer A}.${infer B}`
    // @ts-ignore
    ? T & { [P in A]: NestedAssign<FieldPathValue<T, P>, B, V> }
    // @ts-ignore
    : { [P in K]: V }

// type uuh = PermissionPath<{
//     tickets: {
//         read: true,
//         write: true,
//         delete: true,
//     },
//     users: {
//         read: true,
//         write: true,
//         delete: true,
//     }
// }>;

// type pls = PopulatedPermission<{
//     tickets: {
//         read: true,
//         write: true,
//         delete: true,
//     },
//     users: {
//         read: true,
//         write: true,
//         delete: true,
//     }
// }, 'tickets'>

// type omg = keyof uuh;

export class Permissions<T extends object = any> {
    public readonly permissions: T
    constructor(permissions: T) {
        this.permissions = permissions;
    }

    /** Determine if the specified input matches the required permissions
     * @usage ```ts
     * // In most cases, the first parameter is pulled from a User or some other part of the application.
     * authorize(user.permissions, 'tickets.read') // { 'type': 'ok' | 'fail' }
     * authorize({ tickets: { read: true } }, { tickets: { read: true } }) // { 'type': 'ok' }
     * authorize({ tickets: { read: true } }, { tickets: { delete: true } }) // { type: 'fail' }
     * authorize({ tickets: { read: true } }, 'tickets.read') // { 'type': 'ok' }
     * authorize({ tickets: { read: true, write: true }, users: { read: true } }, ['tickets.read', 'users.read']) // { 'type': 'ok' }
     * ```
     */
    authorize<I extends Permission<T>, P extends PermissionPath<T>>(input: I, permission: P[]): AuthorizeResult<Intersect<PopulatedPermission<T, P>>>
    authorize<I extends Permission<T>, P extends Permission<T>>(input: I, permission: P): AuthorizeResult<P>
    authorize<I extends Permission<T>, P extends PermissionPath<T>>(input: I, permission: P): AuthorizeResult<PopulatedPermission<T, P>>
    authorize<I extends Permission<T>, P extends Permission<T>>(input: I, against: P): AuthorizeResult<P> {
        if (typeof against === 'string') against = this.get(against) as any;
        const requested = flattenKeys(against);
        for (const path in requested) {
            if (get(input, path) !== requested[path]) {
                return { type: 'fail', reason: `User did not meet permission "${path}"` }
            }
        }
        return { type: 'ok', permissions: input as AuthorizedPermission<P> }
    }

    /** Retrieve one or more combined permissions
     * @usage ```ts
     * const updateUsers = get('users.write'); // { users: { write: true } }
     * const ticketMaster = get('tickets.all'); // { tickets: { read: true, write: true, delete: true } }
     * const adminPermissions = get('all'); // { tickets: { read: true, write: true, delete: true }, users: { ... }, ... }
     * hasPermission({ tickets: { read: true } }, get('tickets.read')) // { type: 'ok' }
     * ```
     */
    get<K extends PermissionPath<T>>(path: K[]): Intersect<PopulatedPermission<T, K>>
    get<K extends PermissionPath<T> | 'all'>(path: K): PopulatedPermission<T, K>
    get(path: string | string[]) {
        if (typeof path === 'string') {
            if (path === 'all') return { ...this.permissions };
            if (path.endsWith('.all')) {
                path = path.slice(0, -4);
            }
            return set({}, path, get(this.permissions, path));
        } else {
            return merge(path.map(o => this.get(o as any)));
        }
    }

}



export type AccessControlConfig = {
    permissions: Permissions,
}

export type AccessControlPermission<T extends AccessControlConfig | any = any> = T extends AccessControlConfig
    ? Permission<T['permissions']>
    : Permission;

declare const phantoma: unique symbol;
type Authorized<T, P extends Permissions> = T & {
    [phantoma]: P
}

export declare namespace AccessControl {
    export type Permission<T> = AccessControlPermission<T>;
    export type Config = AccessControlConfig;
}
export class AccessControl<C extends AccessControlConfig, T = AccessControlPermission<C>> {
    // public Permission: Permission<C['permissions']>;
    protected permissions: C['permissions'];

    public Config: AccessControlConfig;
    // public Permission: AccessControlPermission;

    constructor(protected config: C) {
        this.permissions = config.permissions;
    }

    // @ts-ignore
    hasPermission<I extends T, P extends AccessControlPermission<C>>(subject: I, permission: P): subject is Authorized<T, P> {
        const subjectPermissions = this.getPermissions(subject);
        return this.permissions.authorize(subjectPermissions, permission).type === 'ok';
    }

    getPermissions<I extends T>(subject: I): AccessControlPermission<C> | Permission {
        return subject as any;
    }

}