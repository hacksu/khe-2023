import { UserData } from '../../data';
import { Permissions, InferPermission } from '../../services/permissions/class/2/a';
import { AccessControl } from '../../services/permissions/class/2/b';

export type Permission = InferPermission<typeof permissions>;

export const permissions = new Permissions({
    tickets: {
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
        const permissions: AccessControl.Permission<C> = {
            ...user?.permissions,
        }

        // TODO: pull permissions from custom resolvers

        user.permissions = this.config.permissions.get('all'); //permissions;
        return user;
    }

}


export const rbac = new UserAccessControl({
    permissions,
})

