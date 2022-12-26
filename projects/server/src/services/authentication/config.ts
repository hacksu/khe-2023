import { log } from '../../utils/logging';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

// TODO: pull the user and add their role and permissions to the token
// TODO: client library to facilitate auth
// TODO: retire express-session and replace with next-auth session


declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            random: number
        }
    }

    interface User {
        random: number
    }
}


export type AuthProviders = typeof authProviders;
export const authProviders = {
    github: GithubProvider({
        clientId: process.env.GITHUB_ID!,
        clientSecret: process.env.GITHUB_SECRET!,
        checks: 'none',
    }),
    google: GoogleProvider({
        clientId: '',
        clientSecret: '',
    }),
    credentials: CredentialsProvider({
        credentials: {
            email: { type: 'text' },
            password: { type: 'password' }
        },
        authorize(credentials, req) {
            // perform user lookup and password check
            return null;
        },
    }),
} as const;

export const authOptions: NextAuthOptions = {
    providers: Object.values(authProviders),
    pages: {
        // signIn: '/login'
    },
    // debug: true,
    session: {
        // strategy: 'jwt'
    },
    callbacks: {
        jwt({ account, token, profile, user, isNewUser }) {
            // console.log('callback.jwt', { account, token, profile, user, isNewUser })
            // token.user.random = Math.random();
            // if (user) {
            //     user.random = Math.random();
            // }
            token.random = Math.random();
            return token;
        },
        session({ session, token, user }) {
            // console.log('callback.session', { session, token, user })
            // session.user.random = user.random;
            session.user.random = token.random as any;
            return session;
        }
    }
}






// This check exists because we are using the names for typechecking and next-auth doesn't properly define the providers' names as const
const INCORRECTLY_NAMED = Object.entries(authProviders).find(o => o[0] !== o[1].id);
if (INCORRECTLY_NAMED ) {
    log.error(`INCORRECTLY NAMED PROVIDER; rename authProviders['${INCORRECTLY_NAMED[0]}'] to authProviders['${INCORRECTLY_NAMED[1].id}']`);
    process.exit(1);
}