import { TRPCError, inferAsyncReturnType, initTRPC } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { Permission, rbac } from '../../services/auth/rbac';
import { TRPCExpressMeta } from './express';
import { config } from '../../config';
import { Session } from 'next-auth';
import SuperJSON from 'superjson';
import '../../services/auth';

export { observable } from '@trpc/server/observable';

export type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;

export type TRPCMeta = TRPCExpressMeta & {

}

type CreateContextOptions = {
    session?: Session
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInternalTRPCContext = (opts: CreateContextOptions) => {
    return {
        session: opts.session,
    }
}

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateExpressContextOptions) => {
    const { req, res } = opts;

    const session = req.session;

    // return createInternalTRPCContext({
    //     session,
    // })

    return {
        ...createInternalTRPCContext({ session }),
        req,
        res,
    }
}




export const t = initTRPC.context<TRPCContext>().meta<TRPCMeta>().create({
    transformer: SuperJSON,
    errorFormatter({ shape }) {
        return shape;
    }
})


/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * This is how you merge multiple routers into a single router in your tRPC API
 * @see https://trpc.io/docs/merging-routers
 */
export const mergeTRPCRouters = t.mergeRouters;


export const procedure = {
    /**
     * Public (unauthed) procedure
     *
     * This is the base piece you use to build new queries and mutations on your
     * tRPC API. It does not guarantee that a user querying is authorized, but you
     * can still access user session data if they are logged in
     */
    public: t.procedure,

    /**
     * Protected (authed) procedure, with ability to specify permissions
     *
     * If you want a query or mutation to ONLY be accessible to logged in users with a specific level of permissions, use
     * this. It verifies the session is valid and guarantees ctx.session.user is not
     * null, and that they match the right permissions.
     * 
     * If you sim
     *
     * @see https://trpc.io/docs/procedures
     */
    // protected: <T extends Permission>(permission?: T) => {
    protected: <T extends Permission>(permission?: Permission & T) => {
        return t.procedure.use(t.middleware(async ({ ctx, next }) => {

            let user = ctx.session?.user;
            if (!user && config.disablePermissions) user = {} as any;

            if (user && rbac.hasPermission(user, permission || {})) {
                return next({
                    ctx: {
                        ...ctx,
                        user,
                    },
                })
            }

            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }))
    },

}
