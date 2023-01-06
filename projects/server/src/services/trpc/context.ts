import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/config';

import { AuthHandler } from 'next-auth/core'
import { getToken } from 'next-auth/jwt';


/** TRPC Procedure Context
 * - Passed to all procedures.
 * - Instantiated via {@link createContext}
 */
export type Context = inferAsyncReturnType<typeof createContext>;
export async function createContext(options: CreateExpressContextOptions) {

    const session = options.req.session;
    return {
        session,
    }
}

