import type { Context } from './context';
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { RestMeta } from './rest';

/** TRPC Procedure Meta
 * Used to define custom route properties
 */
export type Meta = {

} & RestMeta

/** TRPC Builder
 * - Used to construct everything TRPC related.
 * - Automatically scoped to Meta, Context, and any other mixins.
 */
export const t = initTRPC
    .context<Context>()
    .meta<Meta>()
    .create({
        transformer: superjson,
    })
