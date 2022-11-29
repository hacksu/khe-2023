import ExpressSession from 'express-session';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type { Request } from 'express';
import { randomBytes, randomUUID } from 'crypto';
import { config } from './config';
import mongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import { ServerState } from './utils/mongo/state';
import express from 'express';

declare module 'express-session' {
    interface SessionData {
        bruh: string
    }
}

const sessionServerState = new ServerState('session', {
    secret: randomBytes(48).toString('hex'),
})

const sessionHandler = (async () => {
    const secret = await sessionServerState.get('secret');
    return ExpressSession({
        secret,
        saveUninitialized: true,
        resave: true,
        store: mongoStore.create({
            mongoUrl: config.mongo,
            collectionName: 'sessions',
        })
    })
})()

export const session: express.RequestHandler = (req, res, next) => {
    sessionHandler.then(handler => handler(req, res, next));
}


export function getSession<R extends Request>(req: R) {
    return req.session;
}

