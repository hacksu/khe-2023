import express from 'express';
import NextAuth from 'next-auth';
import { authOptions } from './config';
import cookie from 'cookie';

// process.env.NEXTAUTH_URL = 'http://localhost:5000';



// function getURL(url: string | undefined, headers: Headers): URL | Error {
//     try {
//         if (!url) throw new Error("Missing url")
//         if (process.env.NEXTAUTH_URL) {
//             const base = new URL(process.env.NEXTAUTH_URL)
//             if (!["http:", "https:"].includes(base.protocol)) {
//                 throw new Error("Invalid protocol")
//             }
//             const hasCustomPath = base.pathname !== "/"

//             if (hasCustomPath) {
//                 const apiAuthRe = /\/api\/auth\/?$/
//                 const basePathname = base.pathname.match(apiAuthRe)
//                     ? base.pathname.replace(apiAuthRe, "")
//                     : base.pathname
//                 return new URL(basePathname.replace(/\/$/, "") + url, base.origin)
//             }
//             return new URL(url, base)
//         }
//         const proto =
//             headers.get("x-forwarded-proto") ??
//             (process.env.NODE_ENV !== "production" ? "http" : "https")
//         const host = headers.get("x-forwarded-host") ?? headers.get("host")
//         if (!["http", "https"].includes(proto)) throw new Error("Invalid protocol")
//         const origin = `${proto}://${host}`
//         if (!host) throw new Error("Missing host")
//         return new URL(url, origin)
//     } catch (error) {
//         return error as Error
//     }
// }

// console.log(process.env.NEXTAUTH_URL);
// delete process.env.NEXTAUTH_URL;

// console.log(getURL('/api/auth/signin', {
//     get(name) {
//         if (name === 'x-forwarded-proto') return 'http';
//         if (name === 'x-forwarded-host') return 'staff.localhost:5000';
//         return undefined;
//     },
// }))


// TODO: figure out why csrf can't be parsed


export const authRouter = express.Router();
authRouter.use(express.json(), express.urlencoded({ extended: true }), async (req, res, next) => {
    // console.log(req.path, req.originalUrl, req.url);
    console.log('changed', [req.url, req.originalUrl])
    req.url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    // req.url = req.originalUrl;
    console.log(req.url, req.query);
    // console.log('x-forwarded', req.headers['x-forwarded-host']);
    req.headers['x-forwarded-proto'] = req.protocol;
    req.headers['x-forwarded-host'] = `${req.protocol}://${req.get('host')}`; //req.get('host');
    // console.log(req.action)
    req.query.nextauth = req.originalUrl // start with request url
        .slice('/api/auth/'.length) // make relative to baseUrl
        .replace(/\?.*/, "") // remove query part, use only path part
        .split("/") // as array of strings
    // .filter(o => o.length > 0);
    req.cookies = cookie.parse(req.get('cookie') || '');
    console.log(req.query, { cookies: req.cookies }, req.body, {
        host: req.host
    });
    // console.log('cookies', req.cookies, cookie.parse(req.get('cookie')!))
    const end = res.end;
    res.end = function (...args) {
        // console.log('res end', args);
        if (args.length > 0) {
            if (args[0] instanceof Buffer) {
                const _o = args[0];
                const data = args[0].toString('utf8');
                const replaced = data.replaceAll('localhost:3000', `${req.get('host')}`);
                // console.log(replaced.indexOf('3000'));
                // console.log(replaced);
                if (replaced !== data) {
                    args[0] = Buffer.from(replaced, 'utf8')
                    // console.log('did a replace', this.get('content-length') - data.length)
                    this.set('content-length', replaced.length);
                    // if (data.length <= 500) {
                    //     console.log('replaced', { args: args.slice(1), data, replaced }, data === replaced, {
                    //         aaa: args[0],
                    //         ooo: _o,
                    //     })
                    // }
                }

            } else {
                console.log('AGJSHDGSAHGDG', args[0]);
            }
            // console.log('YYEYEYEYEYEE', this)
        }
        return end(...args);
    }
    const encodedLocalhost3000 = encodeURIComponent('localhost:3000');
    const setHeader = res.setHeader;
    res.setHeader = function (field, value?: any) {
        console.log('(pre) res setHeader', [field, value])
        if (field === 'Set-Cookie') {
            if (typeof value != 'string') {
                if (Array.isArray(value)) {
                    const pre = value;
                    value = value.map(o => {
                        if (o.includes(encodedLocalhost3000)) {
                            return o.replace(encodedLocalhost3000, encodeURIComponent(`${req.get('host')}`))
                        }
                        return o;
                    })
                    // console.log('adjusted cookie', { pre, post: value })
                }
            }
        } else if (field === 'Location') {
            if (typeof value === 'string') {
                value = value.replace('localhost:3000', req.get('host')!)
            }
        }
        console.log('(post) res setHeader', [field, value])
        return setHeader.call(this, field, value)
    }
    NextAuth(authOptions)(req, res);
    // console.log(req.query);
    // NextAuth(authOptions)(req, new Proxy(res, {
    //     get(target, p, receiver) {
    //         const result = target[p];
    //         if (typeof p === 'string') {
    //             // console.log(`> (get) res.${p}`);
    //         }
    //         return result;
    //     },
    // }));
    // if (req.get('host')?.includes('staff')) {
    //     nextAuthStaff(req, res);
    // } else {
    //     nextAuthWeb(req, res);
    // }
    // const result = NextAuth(options)(req, res);
    // console.log(result);
    // res.end('wip');
})


// console.log((new Error()).stack)