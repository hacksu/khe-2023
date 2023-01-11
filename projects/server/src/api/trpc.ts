import { ticketRouter } from './routers/models/tickets';
import { userRouter } from './routers/models/users';
import { faqRouter } from './routers/models/content/faq';
import { createTRPCRouter } from './trpc/base';

/** @export 'trpc' */

export type ApiRouter = typeof apiRouter;
export const apiRouter = createTRPCRouter({
    tickets: ticketRouter,
    users: userRouter,

    content: createTRPCRouter({
        faq: faqRouter,
    }),

})

