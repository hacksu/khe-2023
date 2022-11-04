import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createContext } from './utils/trpc/context';
import { router } from './utils/trpc/router';
import express from 'express';
import cors from 'cors';


export const api = express();

const handle_cors = cors({
    origin(requestOrigin, callback) {
        console.log('cors', requestOrigin);
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

api.get('/', (req, res) => {
    res.send('hi')
});
