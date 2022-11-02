import ExpressSession from 'express-session';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type { Request } from 'express';


declare module 'express-session' {
    interface SessionData {
        bruh: string
    }
}

export const session = ExpressSession({
    secret: 'bruh hi there',
    saveUninitialized: true,
    resave: true,
});


export function getSession<R extends Request>(req: R) {
    return req.session;
}


