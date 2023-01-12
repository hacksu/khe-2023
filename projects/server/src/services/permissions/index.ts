import * as rbac from './rbac';
import './config';
import { log } from '../../utils/logging';
import { Permission } from './permissions';
import chalk from 'chalk';

/** Role-Based Permission System
 * 
 * Facilitates authorization for a variety of permissions
 * - Permissions are imported in the [Permission](./permissions.ts) namespace
 * - Derivations that deduce permissions from a user are defined in `config.ts`
 * - Middleware for TRPC authentication is defined in `middleware.ts`
 */
export const Permissions = rbac;
export { Permission } from './permissions';
export { hasPermission } from './rbac';

if (rbac.DISABLE_PERMISSIONS) {
    log.warn(chalk.red('Permissions are disabled!'))
}

import './class/rbac';