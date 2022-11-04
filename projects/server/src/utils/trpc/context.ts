import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';


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

