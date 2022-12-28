import type { OAuthChecks, OAuthConfig, OAuthProvider } from 'next-auth/providers/oauth';
import { t } from '../../services/trpc';

export { nextAuth } from './next';
import { publicAuthProviders } from './utils';
import { z } from 'zod';
import { User } from '../../models/users/model';
export namespace Authentication {
    
}


export const authProcedures = t.router({
    me: t.procedure
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
    providers: t.procedure
        .query(({ ctx }) => {
            // console.log('get providers', ctx.req.headers)
            return publicAuthProviders;
        }),
    provider: t.procedure
        .input(z.enum(Object.keys(publicAuthProviders) as [keyof typeof publicAuthProviders]))
        .query(({ input, ctx }) => {
            return publicAuthProviders[input];
        })
})