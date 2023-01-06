import * as rbac from './rbac';
import './config';
import { log } from '../../../utils/logging';
import chalk from 'chalk';

/** Role-Based Permission System
 * 
 * Facilitates authorization for a variety of permissions
 * - Permissions are imported in {@link rbac.Permission|Permission} at the top of `rbac.ts`
 * - Derivations that deduce permissions from a user are defined in `config.ts`
 * - Middleware for TRPC authentication is defined in `middleware.ts`
 */
export const Permissions = rbac;
export { Permission } from './rbac';

if (rbac.DISABLE_PERMISSIONS) {
    log.warn(chalk.red('Permissions are disabled!'))
}