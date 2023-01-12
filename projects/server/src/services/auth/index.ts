import type { OAuthChecks, OAuthConfig, OAuthProvider } from 'next-auth/providers/oauth';
// import './permissions'

export { nextAuth } from './next';
import { publicAuthProviders } from './utils';
import { z } from 'zod';
import { User } from '../../models/users/model';
import { createTRPCRouter, procedure } from '../../api/trpc/base';
export namespace Authentication {
    
}


export const authProcedures = createTRPCRouter({
    me: procedure.public
        .query(({ ctx }) => {
            const { session } = ctx;
            if (session) {
                // const user = User.findById(session.userId)
                return {
                    user: {
                        role: 'any'
                    }
                }
            }
            return { user: null }
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
        })
})