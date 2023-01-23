import { getSession } from '@kenthackenough/server/auth/session';
import { NextResponse } from 'next/server'
import type { NextMiddleware, NextRequest } from 'next/server'


export const middleware: NextMiddleware = (req, event) => {
    // console.log('doing middleware', req);
    if (req.nextUrl.pathname.startsWith('/login')) {
        getSession({ req: req as any, res: {} as any }).then(o => console.log('got sess', o))
    }
    return NextResponse.next();
}