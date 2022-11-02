/** Reverse Proxy
 * - Used to proxy requests and websockets to various destinations
 * - Very useful in development mode to proxy frontend requests, acting as if this server utilizes NGINX reverse proxies.
 */

import { IncomingMessage, Server, ServerResponse } from 'http';
import { createProxyServer, ServerOptions } from 'http-proxy';


type ProxyProps = {
    /** The HTTP server to mount on */
    server: Server
}

type ProxyConfig = {
    /** If not enabled, this entry is not considered */
    enabled: boolean;
    /** Matcher function to determine if content should match this rule */
    match: (req: Proxyable, context: ProxyableContext) => boolean | void;
    /** [HTTP Proxy Server Config](https://www.npmjs.com/package/http-proxy#options)
     * - **Note**: If not present, then this rule acts as a filter to prevent requests from being proxied.
     */
    server?: ServerOptions;
}

export type Proxyable = {
    /** URL of the request */
    url?: IncomingMessage['url'],
    /** Headers present on the request */
    headers: IncomingMessage['headers']
}

type ProxyableContext = {
    /** Indicates if this request is a websocket connection */
    ws?: boolean;
}

declare const wasProxied: unique symbol;
type WasProxied<T> = T & {
    [wasProxied]: true
}


/** Checks if a request was sent through the proxy
 * - Common usage is to ensure operations are not performed on a proxied request, as the proxy is already handling it.
 */
export function isProxied<T>(req: T): req is WasProxied<T> {
    return '_proxied' in (req as any);
}


/** Mark a request as being proxied for future `isProxied` checks */
function markProxied<T>(req: T) {
    req['_proxied'] = true;
    return req as WasProxied<T>;
}

/** Define a reverse proxy for a variety of targets
 * - Operates top-to-bottom and proxies to the first matched target.
 * - If no `server` config is specified, the proxy will ignore the request when matched. 
 *      This can be used to prevent requests from going through the proxy.
 */
export function ReverseProxy<C extends Record<string, ProxyConfig>>(props: ProxyProps, config: C) {
    const { server } = props;

    /** Instantiate proxy servers */
    const proxies: Record<keyof C, ProxyConfig & {
        proxy: ReturnType<typeof createProxyServer> | null
    }> = {} as any;
    for (const key in config) {
        const conf = config[key];
        if (conf.enabled) {
            proxies[key] = {
                ...conf,
                proxy: conf.server ? createProxyServer(conf.server) : null,
            }
        }
    }

    /** Forward any requests through the proxy */
    function handleRequest(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
        const matched = match(req, {});
        if (matched && matched.proxy !== null) {
            markProxied(req);
            markProxied(res);
            matched.proxy.web(req, res);
            return true;
        }
        return false;
    }

    /** Automatically retry errors */
    for (const key in proxies) {
        const proxy = proxies[key].proxy;
        if (proxy === null) continue;
        proxy.on('error', (err, req, res) => {
            if (err.message.startsWith('connect ECONNREFUSED')) {
                if (res instanceof ServerResponse) {
                    const failures = (req as any)._failedConnects = (req as any)._failedConnects + 1;
                    if (failures >= 10) {
                        res.statusCode = 503;
                        res.end();
                        return;
                    }
                    setTimeout(() => {
                        req.removeAllListeners();
                        handleRequest(req, res as any);
                    }, 1000);
                    return;
                }
                return;
            }
            throw err;
        })
    }

    /** Find proxy server to fulfill request */
    function match<P extends Proxyable>(req: P, ctx: ProxyableContext) {
        for (const key in proxies) {
            const proxy = proxies[key];
            if (proxy.match(req, ctx)) {
                return proxy;
            }
        }
    }

    /** Forward any websockets */
    server.on('upgrade', (req, socket, head) => {
        const matched = match(req, { ws: true });
        if (matched && matched.proxy !== null) {
            markProxied(req);
            markProxied(socket);
            matched.proxy.ws(req, socket, head);
        }
    });

    return handleRequest;
}


