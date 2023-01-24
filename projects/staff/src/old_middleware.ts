import { NextResponse } from 'next/server'
import type { NextMiddleware, NextRequest } from 'next/server'


export const middleware: NextMiddleware = (req, event) => {
    // console.log('doing middleware', req.headers);
    // console.log('middleware', req.headers.get('cookie')?.includes('next-auth.session-token') && req.headers.get('cookie'))
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

// use notifications to track status of various systems
// each system can be tested on-demand to validate its status
// a check button on each notification to run the chekc
// automatically run checks
// put the notifications in a stack on the dashboard to show status of all systems

// just like their first example
// https://mantine.dev/core/notification/
