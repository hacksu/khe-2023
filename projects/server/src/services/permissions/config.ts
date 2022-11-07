import { registerPermisions, Permission, derivePermissions } from './rbac';
import { config } from '../../config';
import { UserRole } from '../../models/users/data';
const register = registerPermisions;

/** All permissions */
const ALL_PERMISSIONS = Object.fromEntries(
    Object.entries(Permission).map(([key, value]) => ([key, value?.All])).filter(o => o)
);

/** Are permissions disabled? */
export const DISABLE_PERMISSIONS = config.disablePermissions;
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

    }
})


/** Define permissions for user status
 * - These permissions will be applied to users matching the defined statuses
 * @see {@link derivePermissions}
 */
// register(RegistrationStatus, user => user?.registration?.status, {

// })


register(user => user.email, {
    ['cseitz5@kent.edu']: ALL_PERMISSIONS,
})

// @ts-ignore
// console.log(derivePermissions({ email: 'cseitz5@kent.edu', role: UserRole.User }))