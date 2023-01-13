import { publicAuthProviders } from '../../../services/auth';
import { createTRPCRouter, procedure } from '../../trpc/base';
import { getSession } from '../../../services/auth/session';
import express from 'express';
import { z } from 'zod';


export const authRouter = createTRPCRouter({
    logout: procedure.public
        .meta({ api: 'GET /logout' })
        .mutation(async ({ input }) => {
            return { success: false }
        }),

    session: procedure.public
        .query(async ({ input, ctx }) => {
            // console.log(ctx.req.cookies);
            return await getSession(ctx);
        }),

    providers: procedure.public
        .query(({ ctx }) => {
            // console.log('get providers', ctx.req.headers)
            return publicAuthProviders;
        }),

    provider: procedure.public
        .input(z.enum(Object.keys(publicAuthProviders) as [keyof typeof publicAuthProviders]))
        .query(({ input, ctx }) => {
            return publicAuthProviders[input];
        }),

})


// export const authRestRouter = express.Router();

// authRestRouter.get('/logout', (req, res) => {
//     res.send('logging you out');
// })