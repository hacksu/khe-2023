/** Server
 * - Handles all the requests for this program
 * - Integrates TRPC subscriptions via websockets
 * - Incorporates reverse proxies for development mode
 */

console.time('server ready');
console.log('starting...');

import './config';
import './services/mongo';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { createContext } from './services/trpc/context';
import { router } from './services/trpc/router';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { session } from './session';
import { api } from './router';
import express from 'express';

const port = 5001;



/** Express app */
export const app = express();
app.use('/api', session, api);


/** Node HTTP Server */
export const server = createServer((req, res) => (
    app(req, res)
));


/** Websocket Server */
export const wss = new WebSocketServer({
    noServer: true,
})


/** Apply TRPC Websockets */
const wssHandle = applyWSSHandler({
    createContext: createContext as any,
    router,
    wss,
})

/** Upgrade websockets to WSS for TRPC */
server.on('upgrade', (req, socket, head) => {
    /** Handle Session logic */
    session(req as any, {} as any, () => {});
    wss.handleUpgrade(req, socket, head, ws => {
        wss.emit('connection', ws, req);
    })
});


/** Close connections when the process is about to exit */
process.on('SIGTERM', () => {
    wssHandle.broadcastReconnectNotification();
    server.close();
    wss.close();
});


/** Start the server on the specified port */
server.listen(port, () => {
    console.timeEnd('server ready');
});
