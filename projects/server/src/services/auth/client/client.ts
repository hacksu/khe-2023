import type { CredentialsConfig } from 'next-auth/providers/credentials';
import type { AuthProviders } from '../config';
import { signIn, signOut } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query';


/** @export 'auth' */


// export function useSession() {
//     const url = getNextAuthURL();
//     // console.log('nextauth', { url })
//     // fetch(new URL('/session', url), (req, res))
//     console.log('sessionUrl', { base: url.toString(), url: new URL('/api/auth/session', url).toString() })
//     const session = useQuery(['session'], () => (
//         fetch(new URL('/api/auth/session', url)).then(o => o.json())
//     ));
//     return session;
// }

export type AuthProviderId = keyof AuthProviders;

type LoginProps = {
    [P in keyof AuthProviders]: {
        /** The method of authentication */
        strategy: P
    } & CredentialLoginProps<AuthProviders[P]>
}[keyof AuthProviders]

type CredentialLoginProps<T> = T extends CredentialsConfig ? {
    [P in keyof T['credentials']]: T['credentials'][P]['type']
} : {};



export function login(props: LoginProps) {
    const { strategy, ...rest } = props;
    signIn(strategy, {
        callbackUrl: location.href,
        redirect: true,
        ...rest,
    })
}

export function logout() {
    signOut({
        callbackUrl: location.href,
        redirect: true,
    })
}



// login({ strategy: 'credentials', email: '', password: '' })

