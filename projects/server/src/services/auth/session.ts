import { Request, Response } from 'express';
import { Session, unstable_getServerSession } from 'next-auth';
import { authOptions } from './config';
import cookie from 'cookie';

declare module 'express' {
    export interface Request {
        session?: Session;
    }
}

export async function getSession(ctx: {
    req: Request,
    res: Response,
}): Promise<Session> {
    // @ts-ignore
    return unstable_getServerSession(ctx.req, ctx.res, authOptions);
}

export const session = Object.assign(async (req: any, res: any, next) => {
    req.cookies = req.cookies || cookie.parse(req.headers['cookie'] || '');
    req.session = await getSession({ req, res });
    next();
}, {

})