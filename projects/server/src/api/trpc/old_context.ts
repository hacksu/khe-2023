import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { inferAsyncReturnType } from '@trpc/server';
import { getSession } from '../../session';
import { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { Request } from 'express';


type ContextOptions =
    | CreateWSSContextFnOptions
    | CreateHTTPContextOptions
    | CreateExpressContextOptions

/** TRPC Procedure Context
 * - Passed to all procedures.
 * - Instantiated via {@link createContext}
 */
// export type Context = inferAsyncReturnType<typeof createContext>;
// export async function createContext(options: ContextOptions) {
    
// }


async function createExpressContext(options: CreateExpressContextOptions) {
    const session = options.req?.session;
    return {
        mode: 'express' as const,
        session,
    }
}

async function createHTTPContext(options: CreateHTTPContextOptions) {
    return {
        mode: 'http' as const,
    }
}

async function createWSSContext(options: CreateWSSContextFnOptions) {
    return {
        mode: 'wss' as const,

    }
}