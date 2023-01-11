import { ironSession } from 'iron-session/express';
import type { UserData } from '../../data';
import { config } from '../../config';

declare module 'iron-session' {
    interface IronSessionData {
        user?: UserData
    }
}

export const session = ironSession({
    cookieName: 'iron-session',
    password: config.secret,
    cookieOptions: {
        secure: config.mode === 'production',
    }
})

