import { NextResponse } from 'next/server'
import type { NextMiddleware, NextRequest } from 'next/server'


export const middleware: NextMiddleware = (req, event) => {
    // console.log('doing middleware', req.headers);
    console.log('middleware', req.headers.get('cookie')?.includes('next-auth.session-token') && req.headers.get('cookie'))
    if (!req.headers.get('cookie')?.includes('next-auth.session-token')) {
        // if (!req.nextUrl.pathname.startsWith('/login') && !req.nextUrl.pathname.startsWith('/logout')) {
        //     return NextResponse.redirect(new URL('/login', req.url));
        // }
    } else {
        // if (!req.nextUrl.pathname.startsWith('/login') && !req.nextUrl.pathname.startsWith('/logout')) {
        //     return NextResponse.redirect(new URL('/logout', req.url));
        // }
    }
    return NextResponse.next();
}