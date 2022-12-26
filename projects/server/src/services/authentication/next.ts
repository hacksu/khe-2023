import { authOptions } from './config';
import NextAuth from 'next-auth';
import express from 'express';
import cookie from 'cookie';


const baseUrl = '/api/auth';
const auth = NextAuth(authOptions);

export const nextAuth = express.Router();
nextAuth.use(express.urlencoded({ extended: true }));
nextAuth.use(express.json());

nextAuth.use((req, res, next) => {
    if (!req.originalUrl.startsWith(baseUrl)) {
        return next();
    }
    if (req.method === 'GET' && req.originalUrl.endsWith('signin')) {
        return res.send('do redirect')
    }
    prepare(req, res);
    auth(req, res);
})


// Ensure NEXTAUTH_URL does not conflict with dynamic routing
delete process.env.NEXTAUTH_URL;

// Ensure NextAuth respects x-forwarded headers
process.env.AUTH_TRUST_HOST = 'true';

/** Alter express to provide compatability with NextAuth */
function prepare(req: express.Request, res: express.Response) {
    const { headers, originalUrl } = req;
    // const {  } = headers;

    const protocol = req.get('x-forwarded-proto') || req.protocol;
    const host = req.get('x-forwarded-host') || req.get('host');

    // Ensure NextAuth receives a URL in the proper format
    req.url = `${protocol}://${host}${originalUrl}`;

    // Parse path into NextAuth's `[...nextauth]` route parameter
    req.query.nextauth = originalUrl
        .slice(baseUrl.length) // make relative to baseUrl
        .replace(/\?.*/, "") // remove ?query
        .split('/') // split by slashes
        .filter(o => o); // eliminate empty values

    // Parse cookies
    req.cookies = cookie.parse(req.get('cookie') || '');

    // Assign forwarded headers to ensure NextAuth provides dynamic routing
    headers['x-forwarded-proto'] = protocol;
    headers['x-forwarded-host'] = `${protocol}://${host}`;

    // @ts-ignore
    res._end = res.end;
    res.end = replace;
}



const HARDCODED_HOST = 'http://localhost:3000';
const ENCODED_HARDCODED_HOST = encodeURIComponent(HARDCODED_HOST);

/** Replace hardcoded redirects with dynamic ones */
function replace(this: express.Response, data: any, ...rest) {
    const res = this;
    const req = res.req;

    const DYNAMIC_HOST = req.headers['x-forwarded-host'] as string;
    const ENCODED_DYNAMIC_HOST = encodeURIComponent(DYNAMIC_HOST);

    if (data) {
        if (data instanceof Buffer) {
            const sdata = data.toString('utf8');
            if (sdata.includes(HARDCODED_HOST)) {
                // Replace hardcoded urls with the actual url
                const replaced = sdata.replaceAll(HARDCODED_HOST, DYNAMIC_HOST);
                res.set('content-length', String(replaced.length));
                data = Buffer.from(replaced);
            }
        }
    }

    const headers = res.getHeaders();
    // console.log('res.getHeaders', headers);

    const cookies = headers['set-cookie'];
    if (cookies && Array.isArray(cookies) && typeof cookies !== 'string') {
        cookies.forEach((v, i) => {
            cookies[i] = v.replaceAll(ENCODED_HARDCODED_HOST, ENCODED_DYNAMIC_HOST);
        })
    }

    const location = headers['location'];
    if (location && typeof location === 'string') {
        headers['location'] = location.replaceAll(HARDCODED_HOST, DYNAMIC_HOST);
    }

    // console.log('post headers', res.getHeaders());

    // @ts-ignore
    return res._end(data, ...rest);
}

// import { session } from 'next-auth/core'

// export function getSession(req: express.Request, res: express.Response) {

// }