import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../../services/authentication/config';

import { AuthHandler } from 'next-auth/core'
import { getToken } from 'next-auth/jwt';


/** TRPC Procedure Context
 * - Passed to all procedures.
 * - Instantiated via {@link createContext}
 */
export type Context = inferAsyncReturnType<typeof createContext>;
export async function createContext(options: CreateExpressContextOptions) {
    // if (options.req.originalUrl) console.log(options.req.originalUrl, options.req.headers['cookie']);
    // const session = options.req.originalUrl
    //     ? await unstable_getServerSession(options.req, options.res, authOptions)
    //     : null;

    // console.log('got session', session);
    // const what = await AuthHandler({
    //     options: authOptions,
    //     req: options.req as any,
    // });

    // const what = options.req.originalUrl ? await getToken({ req: options.req, cookieName: 'next-auth.session-token' }) : null;
    // console.log('ooooof', what)

    // console.log('hmmmm', options.req.get('cookie'))

    const session = options.req.session;
    return {
        session,
        // session: {} as any,
        req: options.req,
    }
}

