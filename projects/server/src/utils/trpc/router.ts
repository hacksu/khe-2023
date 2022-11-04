import { observable } from '@trpc/server/observable';
import { randomUUID } from 'crypto';
import { t } from '.';


/** @export 'trpc/router' */

/** Router type used in client imports */
export type Router = typeof router;

/** Define one-off routes here */
const routes = t.router({
    ping: t.procedure.query(({ ctx }) => {
        console.log('got pinged');
        const newId = randomUUID();
        console.log('bruh', [ctx.session.bruh, newId]);
        ctx.session.bruh = newId;
        ctx.session.save();
        return new Date();
    }),
    onDate: t.procedure.subscription(() => {
        return observable<{ date: Date }>(emit => {
            const onDate = () => {
                emit.next({ date: new Date() })
            }

            onDate();
            const intv = setInterval(() => {
                onDate()
            }, 1000);

            return () => clearInterval(intv);
        })
    })
})

/** Merge in any routers where other routes are defined */
export const router = t.mergeRouters(
    routes,
)
