import { config } from '../../config';
import { UserRole, UserRoles } from '../../data';
import { Permissions } from './utils/permissions';
import { InferPermission } from './utils/permissions';
import { UserAccessControl } from './utils/user-access-control';


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
});


export const rbac = new UserAccessControl({
    permissions,
});




const register = rbac.registerPermisions.bind(rbac) as typeof rbac.registerPermisions;

/** Are permissions disabled? */
if (config.disablePermissions) {
    /** Grant all users all permissions; as if they were a superadmin */
    register(user => user.email, () => permissions.get('all'));
}

/** Define permissions for roles
 * - These permissions will be applied to users matching the defined roles
 * @see {@link derivePermissions}
 */
register(user => user.role, {
    admin: permissions.get('all'),
})


/** Define permissions for user status
 * - These permissions will be applied to users matching the defined statuses
 * @see {@link derivePermissions}
 */
// register(RegistrationStatus, user => user?.registration?.status, {

// })


register(user => user.email, {
    'cseitz5@kent.edu': permissions.get('all'),
})

