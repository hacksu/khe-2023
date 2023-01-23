import { NextResponse } from 'next/server'
import type { NextMiddleware, NextRequest } from 'next/server'


export const middleware: NextMiddleware = (req, event) => {
    console.log('doing middleware', req);
    if (req.nextUrl.pathname.startsWith('/login')) {
        
    }
    return NextResponse.next();
}