import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createRestHandler } from './services/trpc/rest';
import { createContext } from './services/trpc/context';
import { nextAuth } from './services/auth';
import { router } from './services/trpc/router';
import express from 'express';
import cors from 'cors';
import { emailProviders, sendMail } from './services/mail';
import { sendTestEmail } from './services/mail/test2';


export const api = express();

const handle_cors = cors({
    origin(requestOrigin, callback) {
        // console.log('cors', requestOrigin);
        if (requestOrigin === undefined || requestOrigin.includes('localhost') || requestOrigin.includes('khe.io')) {
            return callback(null, true);
        }
        callback(new Error(`CORS: Denied Origin "${requestOrigin}"`));
    },
});

api.use((req, res, next) => {
    if (req.path == '/upload') return next();
    handle_cors(req, res, next);
});


api.use('/trpc', createExpressMiddleware({
    router,
    createContext,
}));

api.use(createRestHandler({
    router,
    createContext,
}))

// api.get('/session', async (req, res) => {
//     if (!req.session.bruh) {
//         req.session.bruh = Math.random().toString(16);
//         await req.session.save();
//     }
//     res.json({
//         session: req.session,
//         sessionId: req.sessionID,
//     });
// })

api.use('/auth', nextAuth);

api.get('/', (req, res) => {
    res.send('hi')
});

// import { campusMap } from './services/map';
// campusMap.getLocation('library');

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
