import { createWSClient, httpLink, splitLink, wsLink, createTRPCProxyClient } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { createFlatProxy, createRecursiveProxy } from '@trpc/server/shared';
import { get, merge } from 'lodash';
import { NextPageContext } from 'next';
import type { Router } from '@kenthackenough/server/trpc/router';
import getConfig from 'next/config';
import superjson from 'superjson';


const WS_ENABLED = true;
const API_HOST = typeof window !== 'undefined'
    ? location.host.split('.').filter(o => o != 'staff').join('.')
    : 'localhost:5000'


// TODO: service static files saying "oops, maintenance" when website is down

function getEndingLink(ctx?: NextPageContext | undefined) {
    const http = typeof window === 'undefined'
        ? httpLink({ url: `http://${API_HOST}/api/trpc` })
        : httpLink({ url: `/api/trpc` })

    if (typeof window === 'undefined' || !WS_ENABLED) {
        return http;
    }

    const client = location.host.includes('localhost')
        ? createWSClient({ url: `ws://localhost:5000` })
        : createWSClient({ url: `wss://${API_HOST}/api` })

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
    ssr: true,
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