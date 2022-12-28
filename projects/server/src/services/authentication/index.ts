import type { OAuthChecks, OAuthConfig, OAuthProvider } from 'next-auth/providers/oauth';
import { t } from '../../services/trpc';

export { nextAuth } from './next';
import { authProviders } from './config';
import { CredentialsProvider } from 'next-auth/providers/credentials';
import { publicAuthProviders } from './utils';
import { z } from 'zod';
export namespace Authentication {
    
}



// function sanitizeProvider<T extends OAuthConfig<any>>(provider: T) {
//     const { id, name, type, style } = provider;
//     return { id, name, type, style }
// }

// const woah = sanitizeProvider(authProviders.github);

// const sanitizedProviders: {
//     [P in keyof typeof auth]
// }

// function sanitizeProvider<K extends keyof typeof authProviders>(id: K) {
//     const provider = authProviders[id];
//     const { name, type } = provider;
//     const data = { name, type };
//     if (provider.type === 'oauth') {
//         const { style } = provider;
//         return { ...data, style }
//     }
//     return data;
// }

// const providers: {
//     [P in keyof typeof authProviders]: ReturnType<typeof serializeProvider
// } = {

// }

// const providers = Object.fromEntries(Object.keys(authProviders).map(o => [o, sanitizeProvider]));

// providers['github']

export const authProcedures = t.router({
    session: t.procedure
        .query(({ ctx }) => {
            return ctx.session || {};
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