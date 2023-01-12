import { UserData } from '../../../../data';
import { Permission, Permissions } from './a'



export type AccessControlConfig = {
    permissions: Permissions,
}

export type AccessControlPermission<T extends AccessControlConfig | any = any> = T extends AccessControlConfig
    ? Permission<T['permissions']>
    : Permission;

declare const phantom: unique symbol;
type Authorized<T, P extends Permissions> = T & {
    [phantom]: P
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


const perms = new Permissions({
    tickets: {
        read: true,
        write: true,
        delete: true,
    },
    users: {
        read: true,
        write: true,
        delete: true,
    }
})

const thingy = new AccessControl({
    permissions: perms,
})

// thingy.config.permissions.permissions.tickets

thingy.hasPermission({ tickets: { read: true } }, { tickets: { write: true } })


type PermissibleUser<T = any> = UserData & {
    permissions?: AccessControlPermission<T>
}

class UserAccessControl<
    C extends AccessControlConfig
> extends AccessControl<C, PermissibleUser<C>> {

    getPermissions(user: PermissibleUser) {
        return this.derivePermissions(user)?.permissions || {};
    }

    derivePermissions(user: PermissibleUser) {
        const permissions: Permission<C> = {
            ...user?.permissions,
        }

        // TODO: pull permissions from custom resolvers

        user.permissions = permissions;
        return user;
    }

}

const rbac = new UserAccessControl({
    permissions: perms,
})

const a = {} as any;
if (thingy.hasPermission(a, { tickets: { read: true } })) {
    const omg = a;
}

const b = {} as any;
if (rbac.hasPermission(b, { tickets: { read: true } })) {
    const omg = b;
}
