import { ticketRouter } from './routers/models/tickets';
import { userRouter } from './routers/models/users';
import { faqRouter } from './routers/models/content/faq';
import { createTRPCRouter, procedure } from './trpc/base';
import { observable } from '@trpc/server/observable';
import { authProcedures } from '../services/auth';

/** @export 'trpc' */

export type ApiRouter = typeof apiRouter;
export const apiRouter = createTRPCRouter({
    tickets: ticketRouter,
    users: userRouter,

    auth: authProcedures,

    content: createTRPCRouter({
        faq: faqRouter,
    }),

    ping: procedure.public.query(({ ctx }) => {
        console.log('got pinged');
        // console.log('bruh', [ctx.session.bruh, newId]);
        // ctx.session.bruh = newId;
        // ctx.session.save();
        return new Date();
    }),
    onDate: procedure.public.subscription(() => {
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

