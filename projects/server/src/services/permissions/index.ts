import { AddPermissionsAll, DerivedPermissions, PermissibleUser } from './rbac';
import { UserPermissions } from '../../models/users/model';


/** Define permission imports */
export namespace Permission {
    const all = AddPermissionsAll;

    // Export the imported permissions
    export const Users = all(UserPermissions);

    
}


export namespace Permissions {

    export function derive(user: PermissibleUser): DerivedPermissions {

    }

}

