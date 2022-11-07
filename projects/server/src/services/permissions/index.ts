import * as rbac from './rbac';
/** Role-Based Permission System
 * 
 * Facilitates authorization for a variety of permissions
 * - Permissions are imported in {@link rbac.Permission|Permission} at the top of `rbac.ts`
 * - Derivations that deduce permissions from a user are defined in `config.ts`
 * - Middleware for TRPC authentication is defined in `middleware.ts`
 */
export const Permissions = rbac;
export { Permission } from './rbac';