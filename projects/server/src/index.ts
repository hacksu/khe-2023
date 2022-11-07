/** Server
 * - Handles all the requests for this program
 * - Integrates TRPC subscriptions via websockets
 * - Incorporates reverse proxies for development mode
 */

import './config';
import './utils/mongo';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { isProxied, ReverseProxy } from './utils/proxy';
import { createContext } from './utils/trpc/context';
import { router } from './utils/trpc/router';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { session } from './session';
import { api } from './router';
import express from 'express';

const port = 5000;



/** Express app */
export const app = express();
app.use('/api', session, api);


/** Node HTTP Server */
export const server = createServer((req, res) => (
    !proxyRequest(req, res) && app(req, res)
));


/** Websocket Server */
export const wss = new WebSocketServer({
    noServer: true,
})


/** Define reverse proxies (like NGINX) */
const proxyRequest = ReverseProxy({ server }, {
    api: {
        // This rule prevents requests to the API from being proxied
        enabled: true,
        match(req, { ws }) {
            if (ws) {
                if (!req.url?.startsWith('/_next'))
                    return true; // Matches non-NextJS websockets
            } else {
                if (req.url?.startsWith('/api'))
                    return true; // Matches API routes
            }
        },
    },
    staff: {
        // This rule proxies requests to the staff portal, which runs one port higher than the API
        enabled: true,
        server: {
            ws: true,
            target: {
                host: 'localhost',
                port: port + 1,
            },
        },
        match(req) {
            if (req.headers.host?.includes('staff')) {
                return true;
            }
        },
    },
    template: {
        // This rule proxies requests to the staff portal, which runs 3 ports higher than the API
        enabled: true,
        server: {
            ws: true,
            target: {
                host: 'localhost',
                port: port + 3,
            },
        },
        match(req) {
            if (req.headers.host?.includes('template')) {
                return true;
            }
        },
    },
    web: {
        // This rule proxies requests to the website, which runs two ports higher than the API
        enabled: true,
        server: {
            ws: true,
            target: {
                host: 'localhost',
                port: port + 2,
            },
        },
        match(req) {
            return true;
        },
    }
})


/** Apply TRPC Websockets */
const wssHandle = applyWSSHandler({
    createContext: createContext as any,
    router,
    wss,
})

/** Upgrade websockets to WSS for TRPC */
server.on('upgrade', (req, socket, head) => {
    if (!isProxied(req)) {
        /** Handle Session logic */
        session(req, {} as any, () => {});
        wss.handleUpgrade(req, socket, head, ws => {
            wss.emit('connection', ws, req);
        })
    }
});


/** Close connections when the process is about to exit */
process.on('SIGTERM', () => {
    wssHandle.broadcastReconnectNotification();
    server.close();
    wss.close();
});


/** Start the server on the specified port */
server.listen(port);
