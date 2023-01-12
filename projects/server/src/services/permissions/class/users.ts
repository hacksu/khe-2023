import { UserData } from '../../../data';
import { TicketPermissions } from '../../../models/tickets/model';
import { AccessControl, AccessControlConfig, Permissions, createPermissions } from './rbac';


export type PermissibleUser = (UserData) & { permissions?: Permissions }

declare const UAC_phantom: unique symbol;
type AuthorizedUser<T extends Permissions> = PermissibleUser & {
    [UAC_phantom]: T
}

type UserAccessControlConfig = AccessControlConfig & {

}

export class UserAccessControl<C extends UserAccessControlConfig> extends AccessControl<C> {

    hasPermission<P extends Permissions<C>>(user: PermissibleUser, permission: P): user is AuthorizedUser<P> {
        const perms = user.permissions;
        if (!perms) return false;
        return this.authorize(perms as any, permission).type === 'ok';
    }

}


const rbac = new UserAccessControl({
    permissions: createPermissions({
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
})

const rbac2 = new UserAccessControl({
    permissions: createPermissions({
        tickets: TicketPermissions,
    })
})

rbac2.config.permissions.tickets.Write

// const test1 = {} as any;
// if (rbac.hasPermission(test1, {
//     users: { read: true },
//     tickets: { write: true }
// })) {
//     const omg = test1;
// }

