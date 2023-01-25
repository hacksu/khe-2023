import type { CredentialsConfig } from 'next-auth/providers/credentials';
import type { AuthProviders } from '../config';
import { signIn, signOut } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query';
import { openConfirmModal } from '@mantine/modals';

// @ts-ignore
import { api as _api } from 'utils/trpc';
import type { ApiRouter } from '../../../api/trpc';
import { DecoratedProcedureRecord } from '@trpc/react-query/shared';
const api = _api as DecoratedProcedureRecord<ApiRouter["_def"]["record"], ApiRouter>





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

export function logout(force?: boolean) {
    if (force === true || location.href.startsWith('a/logout')) {
        signOut({
            callbackUrl: location.href,
            redirect: true,
        })
    } else {
        openConfirmModal({
            title: 'heya',

        })
    }
}

export function useSession() {
    const query = api.auth.session.useQuery(undefined, {
        cacheTime: 20 * 60 * 1000,
    });
    if (query.data) {
        const session = query.data as typeof query.data & {
            logout: typeof logout,
        };
        if (!session.logout) {
            session.logout = logout;
        }
        return session;
    }
    return null;
}



// login({ strategy: 'credentials', email: '', password: '' })

