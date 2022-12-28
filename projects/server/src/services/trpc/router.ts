import { trpcRouter } from '../../trpc';
import '../../session';


/** @export 'trpc/router' */

/** Router type used in client imports */
export type Router = typeof router;

export const router = trpcRouter;