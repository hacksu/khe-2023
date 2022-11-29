import { isProxied, ReverseProxy } from './proxy';
import { createServer } from 'http';
import express from 'express';

const port = 5000;

/** Express app */
export const app = express();


/** Node HTTP Server */
export const server = createServer((req, res) => (
    !proxyRequest(req, res) && app(req, res)
));

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
        server: {
            ws: true,
            target: {
                host: 'localhost',
                port: port + 1,
            }
        }
    },
    staff: {
        // This rule proxies requests to the staff portal, which runs one port higher than the API
        enabled: true,
        server: {
            ws: true,
            target: {
                host: 'localhost',
                port: port + 2,
            },
        },
        match(req) {
            if (req.headers.host?.includes('staff')) {
                return true;
            }
        },
    },
    ui: {
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
            if (req.headers.host?.includes('ui')) {
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
                port: port + 4,
            },
        },
        match(req) {
            return true;
        },
    }
})


/** Close connections when the process is about to exit */
process.on('SIGTERM', () => {
    server.close();
});


/** Start the server on the specified port */
server.listen(port, () => {
    console.timeEnd('development proxy ready');
});
