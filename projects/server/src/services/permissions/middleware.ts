/** TRPC Middleware for permissions */
import { hasPermission, Permissions } from './rbac';
import { TRPCError } from '@trpc/server';
import { merge } from 'lodash';
import { DISABLE_PERMISSIONS } from './config';
import { t } from '../../utils/trpc';



export function access<T extends Permissions>(permission: T) {
    return t.middleware(async ({ ctx, next }) => {
        const user = null; //await Session.getUser(ctx);
        if (user && user !== null) {
            if (hasPermission(user, permission)) {
                return next({
                    ctx: {
                        ...ctx,
                        user,
                    }
                })
            }
        }
        if (DISABLE_PERMISSIONS) return next({ ctx })
        else throw new TRPCError({ code: 'UNAUTHORIZED' });
    })
}


export const tr = merge(t, {
    access<T extends Permissions>(permission: T) {
        return t.procedure.use(access(permission));
    }
});

