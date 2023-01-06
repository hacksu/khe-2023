import { ticketProcedures } from './models/tickets/procedures';
import { userProcedures } from './models/users/procedures';
import { authProcedures } from './services/auth';
import { observable } from '@trpc/server/observable';
import { randomUUID } from 'crypto';
import { t } from './services/trpc';


/** Import model procedures */
const models = t.router({
    users: userProcedures,
    tickets: ticketProcedures,
});


/** Import service procedures */
const services = t.router({
    auth: authProcedures,
});


/** Define one-off routes here */
const routes = t.router({
    ping: t.procedure.query(({ ctx }) => {
        console.log('got pinged');
        const newId = randomUUID();
        // console.log('bruh', [ctx.session.bruh, newId]);
        // ctx.session.bruh = newId;
        // ctx.session.save();
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
export const trpcRouter = t.mergeRouters(
    routes,
    models,
    services
);