import NextAuth, { type NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';


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

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            checks: 'none'
        }),
    ],
    // debug: true,
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        jwt({ account, token, profile, user, isNewUser }) {
            console.log('callback.jwt', { account, token, profile, user, isNewUser })
            // token.user.random = Math.random();
            // if (user) {
            //     user.random = Math.random();
            // }
            token.random = Math.random();
            return token;
        },
        session({ session, token, user }) {
            console.log('callback.session', { session, token, user })
            // session.user.random = user.random;
            session.user.random = token.random as any;
            return session;
        }
    }
}
