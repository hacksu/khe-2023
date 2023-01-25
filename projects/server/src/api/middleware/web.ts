import { NextRequest, NextMiddleware, NextResponse } from 'next/server';

/** @export 'next/middleware/web' */


const rewrites = {
    '/mail': '/api/mail',
}

// @see https://nextjs.org/docs/advanced-features/middleware
const config = {
    // matcher: []
}

const handle: NextMiddleware = (request) => {
    const { nextUrl } = request;
    for (const key in rewrites) {
        if (nextUrl.pathname.startsWith(key)) {
            console.log('rewrite', nextUrl.pathname, 'to', rewrites[key] + nextUrl.pathname.slice(key.length))
            return NextResponse.rewrite(new URL((
                rewrites[key] + nextUrl.pathname.slice(key.length)
            ), request.url))
        }
    }
}


export const webMiddleware = {
    handle,
    config,
}

