import type { Router as TRPCRouter } from '@trpc/server'
import express from 'express';
import { get } from 'lodash';


type RequestMethods = 
    | 'GET'
    | 'PUT'
    | 'POST'
    | 'PATCH'
    | 'DELETE'

export type RestMeta = {
    /** 
     * @deprecated Mounts a route as a normal REST endpoint at `/api/...`
     * - **USAGE NOT RECOMMENDED**
     * - This utilizes crude input parsing to run TRPC procedures.
     * - It is __not recommended__ to use these routes in production.
     * - It will not work properly for some use cases.
     * - In simple use cases, its a good way to test API routes.
     */
    api?: `${RequestMethods} /${string}`
}


type HandlerOptions<TRouter extends TRPCRouter<any>> = {
    router: TRouter
    createContext: any,
}


const STATUS_CODES = {
    PARSE_ERROR: 400,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    TIMEOUT: 408,
    CONFLICT: 409,
    CLIENT_CLOSED_REQUEST: 499,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    METHOD_NOT_SUPPORTED: 405,
    TOO_MANY_REQUESTS: 429,
} as const;


/** Handles TRPC requests via REST */
export function createRestHandler<TRouter extends TRPCRouter<any>>(opts: HandlerOptions<TRouter>) {
    const router = express.Router();
    const procedures = opts.router._def.procedures;
    const routes = new Map<string, { procedure: any, name: string }>();
    for (const key in procedures) {
        const proc = procedures[key];
        if (proc?.meta) {
            if ('api' in proc.meta) {
                routes.set(proc.meta.api, { procedure: proc, name: key });
            }
        }
    }

    routes.forEach(({ name, procedure }, _path) => {
        const [method, path] = _path.split(' /', 2);
        console.log(method.toLowerCase(), path, { method, path, name });
        const pre = ['/' + path] as any[];
        if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
            pre.push(express.json());
        }
        router[method.toLowerCase()](...pre, async (req, res, next) => {
            const handler = opts.router.createCaller(opts.createContext({ req, res }));
            try {
                const input = req.params.input || req.query.input || {
                    ...req.query,
                    ...req.params,
                    ...(req.body || {}),
                }
                for (const key in input) {
                    if (!isNaN(Number(input[key]))) {
                        input[key] = Number(input[key])
                    }
                }
                // @ts-ignore
                const result = await get(handler, name)(input);
                res.json(result);
            } catch(err) {
                res.status(STATUS_CODES[err.code]).json({
                    error: err
                })
            }
        })
    })


    return router;
}




// export function createRestHandler<TRouter extends TRPCRouter<any>>(opts: HandlerOptions<TRouter>) {
//     return function<C extends ReturnType<TRouter['createCaller']>>(
//         run: (handle: C, req: express.Request) => any,
//         serialize?: (data: any) => string
//     ): express.RequestHandler {
//         return async function (req, res) {
//             const trpc = opts.router.createCaller(
//                 opts.createContext({ req, res })
//             );
//             // @ts-ignore
//             const result = await run(trpc, req);
//             if (serialize) {
//                 res.json(await serialize(result))
//             } else {
//                 res.json(result);
//             }
//         }
//     }
// }


