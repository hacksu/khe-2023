import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createTRPCExpressRestHandler } from './trpc/express';
import { createTRPCContext } from './trpc/base';
import { apiRouter } from './trpc';
import { cors } from './utils/cors';
import express from 'express';
import { nextAuth } from '../services/auth';
import { sendTestEmail } from '../services/mail/test';
import { emailProviders } from '../services/mail';
import { session } from './utils/session';


export const api = express();
api.use(cors, session);


api.use('/trpc', createExpressMiddleware({
    createContext: createTRPCContext,
    router: apiRouter,
}))

api.use(createTRPCExpressRestHandler({
    createContext: createTRPCContext,
    router: apiRouter,
}))

api.use('/auth', nextAuth);




api.get('/email/send/:email', (req, res) => {
    sendTestEmail(req.params.email).then(o => {
        res.send('ok');
    })
})


api.get('/email/unsubscribe/:email', async (req, res) => {
    const request = await emailProviders.sendgrid.unsubscribe('add', req.params.email);
    res.json(request || {})
})

api.get('/email/resubscribe/:email', async (req, res) => {
    const request = await emailProviders.sendgrid.unsubscribe('remove', req.params.email);
    res.json(request || {})
})

api.get('/email/unsubscribes', async (req, res) => {
    const request = await emailProviders.sendgrid.unsubscribe('list');
    res.json(request || {})
})

api.get('/email/unsubscribed/:email', async (req, res) => {
    const request = await emailProviders.sendgrid.unsubscribe('get', req.params.email);
    res.json(request)
})
