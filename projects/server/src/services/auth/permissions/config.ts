import { registerPermisions, Permission, derivePermissions, ALL_PERMISSIONS, DISABLE_PERMISSIONS } from './rbac';
import { config } from '../../../config';
import { UserRole } from '../../../data/models/users';
const register = registerPermisions;


/** Are permissions disabled? */
if (DISABLE_PERMISSIONS) {
    /** Grant all users all permissions; as if they were a superadmin */
    register(user => user.email, () => ALL_PERMISSIONS);
}


/** Define permissions for roles
 * - These permissions will be applied to users matching the defined roles
 * @see {@link derivePermissions}
 */
register(UserRole, user => user.role, {
    Admin: {
        ...Permission.Users.All,
    },
    User: {

    },
})


/** Define permissions for user status
 * - These permissions will be applied to users matching the defined statuses
 * @see {@link derivePermissions}
 */
// register(RegistrationStatus, user => user?.registration?.status, {

// })


register(user => user.email, {
    'cseitz5@kent.edu': ALL_PERMISSIONS,
})

// @ts-ignore
// console.log('perms', derivePermissions({ email: 'cseitz6@kent.edu', role: UserRole.User }))