import { createWSClient, httpLink, splitLink, wsLink, createTRPCProxyClient } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { createFlatProxy, createRecursiveProxy } from '@trpc/server/shared';
import { get, merge } from 'lodash';
import { NextPageContext } from 'next';
import type { Router } from '@kenthackenough/server/trpc/router';
import superjson from 'superjson';

/** @export 'trpc' */


const APP_URL = 'http://localhost:5000';
const WS_URL = 'ws://localhost:5000';

function getEndingLink(ctx?: NextPageContext | undefined) {
    const http = httpLink({ url: `${APP_URL}/api/trpc` })
    if (typeof window === 'undefined') {
        return http;
    }
    const client = createWSClient({
        url: WS_URL,
    });
    const ws = wsLink<Router>({
        client,
    });
    return splitLink({
        condition(op) {
            if (op.type === 'subscription') {
                return true;
            }
            return false;
        },
        true: ws,
        false: http,
    })
}

export const trpc = createTRPCNext<Router>({
    ssr: false,
    config({ ctx }) {
        return {
            transformer: superjson,
            links: [
                getEndingLink(ctx),
            ]
        }
    }
});

export const api = trpc;

// const vanilla = createTRPCProxyClient<Router>({
//     transformer: superjson,
//     links: [
//         getEndingLink(),
//     ]
// })


// export const api = createRecursiveProxy(({ args, path }) => {
//     const _path = path.join('.');
//     const r = get(trpc, _path) as any;
//     if (!r) return get(vanilla, _path)(...args);
//     return r(...args);
// }) as typeof trpc & typeof vanilla;