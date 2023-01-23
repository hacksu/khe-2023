import { log } from '../../utils/logging';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserAuthData, UserData } from '../../data';
import { Permission, rbac } from './rbac';
import { User } from '../../models/users/model';
import type { FieldArrayPath } from 'react-hook-form';
import { NextAuthAdapter, debugNextAuth } from './adapter';
import { pick } from 'lodash';

// TODO: pull the user and add their role and permissions to the token
// TODO: client library to facilitate auth
// TODO: retire express-session and replace with next-auth session


declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        date?: Date
        user?: UserData & {
            permissions: Permission
        }
    }

    // interface User extends UserData {
    //     permissions: Permission
    // }
}


export type AuthProviders = typeof authProviders;
export const authProviders = {
    github: GithubProvider({
        clientId: process.env.GITHUB_ID!,
        clientSecret: process.env.GITHUB_SECRET!,
        checks: 'none',
    }),
    google: GoogleProvider({
        clientId: process.env.GOOGLE_ID!,
        clientSecret: process.env.GOOGLE_SECRET!,
    }),
    discord: DiscordProvider({
        clientId: process.env.DISCORD_ID!,
        clientSecret: process.env.DISCORD_SECRET!,
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
    adapter: NextAuthAdapter(null, {
        providers: authProviders,
    }),
    providers: Object.values(authProviders),
    pages: {
        signIn: '/login'
    },
    debug: debugNextAuth,
    callbacks: {
        session({ session, token, user: _user }) {
            const user = _user as any as UserData;
            // console.log('session', { user, session })
            const serialized: (keyof UserData)[] = [
                'email',
                'role'
            ]
            session.user = {
                // @ts-ignore
                id: user._id.toString(),
                ...pick(user, serialized),
            }
            // @ts-ignore
            rbac.derivePermissions(session.user);
            return session;
        },
        signIn(params) {
            return true;
        },
    },
}






// This check exists because we are using the names for typechecking and next-auth doesn't properly define the providers' names as const
const INCORRECTLY_NAMED = Object.entries(authProviders).find(o => o[0] !== o[1].id);
if (INCORRECTLY_NAMED ) {
    log.error(`INCORRECTLY NAMED PROVIDER; rename authProviders['${INCORRECTLY_NAMED[0]}'] to authProviders['${INCORRECTLY_NAMED[1].id}']`);
    process.exit(1);
}