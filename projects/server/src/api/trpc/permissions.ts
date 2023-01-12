import { merge } from 'lodash';
import { UserData, UserRole } from '../../data';
import { Permissions, InferPermission } from '../../services/permissions/class/2/a';
import { AccessControl } from '../../services/permissions/class/2/b';
import { config } from '../../config';


export type Permission = InferPermission<typeof permissions>;
// export type Permission = AccessControl.Permission<typeof rbac['config']>;

export const permissions = new Permissions({
    tickets: {
        /** yeeee */
        read: true,
        write: true,
        delete: true,
    },
    users: {
        read: true,
        write: true,
        delete: true,
    },
    content: {
        write: true,
        delete: true,
    }
})




type PermissibleUser<T = any> = UserData & {
    // permissions?: Permission,
    permissions?: AccessControl.Permission<T>
}

class UserAccessControl<
    C extends AccessControl.Config
> extends AccessControl<C, PermissibleUser<C>> {

    getPermissions(user: PermissibleUser) {
        return this.derivePermissions(user)?.permissions || {};
    }

    derivePermissions(user: PermissibleUser) {
        if (!user) user = {} as any;

        // console.log('derived', this.derivations.map(o => o({ role: UserRole.Staff })))

        // TODO: pull permissions from custom resolvers
        if (!config.disablePermissions) {
            const derivations = this.derivations.map(o => o(user));
            user.permissions = merge({}, ...[...derivations, user.permissions || {}]);
        } else if (config.disablePermissions) {
            user.permissions = this.permissions.get('all');
        }

        // user.permissions = this.config.permissions.get('all'); //permissions;
        return user;
    }

    protected derivations = new Array<(...args: any) => any>();
    registerPermisions<E extends object, R extends ExclusiveRecord<keyof E, Permission>>(type: E, match: (user: PermissibleUser) => E[keyof E] | undefined, registry: R): R
    registerPermisions<E extends object, V extends E[keyof E], D extends (value: V) => Permission | void>(type: E, match: (user: PermissibleUser) => V | undefined, derive: D): D
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
    registerPermisions<T extends any, D extends (value: T) => Permission | void>(match: (user: PermissibleUser) => T | undefined, derive: D): D
    registerPermisions<T extends string | number, R extends ExclusiveRecord<T, Permission>>(match: (user: PermissibleUser) => T | undefined, registry: R): R
    registerPermisions(...args) {
        const isEnum = args.length > 2;
        const isFunc = typeof args[args.length - 1] != 'object';
        let en: any;
        if (isEnum) {
            en = args.shift();
        }
        const [match, registry] = args;
        if (isFunc) {
            this.derivations.push(input => {
                const value = match(input);
                return registry(value) || {};
            })
        } else {
            if (isEnum) {
                const maps: any = {};
                for (const key in en) {
                    maps[en[key]] = key;
                }
                this.derivations.push(input => {
                    const value = match(input);
                    if (value in maps) {
                        const key = maps[value];
                        if (key in registry) {
                            return registry[key];
                        }
                    }
                    return {}
                })
            } else {
                this.derivations.push(input => {
                    const value = match(input);
                    if (value in registry) {
                        return registry[value];
                    }
                    return {};
                })
            }
        }
        return registry;
    }

}

type ExclusiveRecord<K extends string | number | symbol, V> = {
    [P in K]?: V
}


export const rbac = new UserAccessControl({
    permissions,
})

rbac.registerPermisions(UserRole, user => user.role, {
    Admin: permissions.get('all'),
})

/** Are permissions disabled? */
if (config.disablePermissions) {
    /** Grant all users all permissions; as if they were a superadmin */
    rbac.registerPermisions(user => user.email, () => permissions.get('all'));
}

// rbac.hasPermission({ }, { tickets: { r}})