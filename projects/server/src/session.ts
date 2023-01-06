import { ironSession } from 'iron-session/express';
import { config } from './config';
import type { Request } from 'express';


declare module 'iron-session' {
    interface IronSessionData {
        bruh: string
    }
}


export const session = ironSession({
    cookieName: 'iron-session',
    password: config.secret,
    cookieOptions: {
        secure: config.mode === 'production',
    }
})

type uuh = Request['session']

export function getSession(req: Request) {
    return req.session;
}


// export function getSession(session: IronSession): IronSession
// export function getSession(req: Request): IronSession
// export function getSession(input) {
//     if ('session' in input)
//         return getSession(input.session);
//     return input;
// }

// getSession()