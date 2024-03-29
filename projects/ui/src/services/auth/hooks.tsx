import { useEffect, useRef, useState } from 'react';
import { api } from '../../utils/trpc';
import { signIn, signOut } from 'next-auth/react';
import { AuthProviders } from '@kenthackenough/server/auth/client';
import { CredentialsConfig } from 'next-auth/providers/credentials';
import { openConfirmModal } from '@mantine/modals';
import { useTheme } from '../../utils/mantine';
import { MantineGlobals } from '../../utils/globals';
import { UserRole } from '@kenthackenough/server/data';




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


export function useAuthProviders() {
    const enabled = useRef(true);
    const query = api.auth.providers.useQuery(undefined, {
        refetchOnWindowFocus: false,
        enabled: enabled.current,
        staleTime: Infinity,
    });
    enabled.current = !query.data;
    return query?.data;
}


export function login(props: LoginProps) {
    const { strategy, ...rest } = props;
    signIn(strategy, {
        callbackUrl: location.href,
        redirect: true,
        ...rest,
    })
}

export function logout(force?: boolean) {
    if (force === true) {
        signOut({
            callbackUrl: location.href,
            redirect: true,
        })
    } else {
        openConfirmModal({
            styles(theme, params) {
                Object.assign(theme, MantineGlobals.theme);
                return {}
            },
            title: `Are you sure you want to log out of your account?`,
            centered: true,
            color: 'red',
            labels: {
                cancel: 'Cancel',
                confirm: 'Log Out',
            },
            onConfirm() {
                logout(true);
            },
            onCancel() {
                if (location.href.startsWith('/logout')) {
                    location.replace('/');
                }
            }
        })
    }
}

export function useSession() {
    const [role, setRole] = useState<UserRole | null>(null);
    const query = api.auth.session.useQuery(undefined, {
        cacheTime: ((role === 'admin' || role === 'staff') ? 1 : 60) * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        if (query.data?.user?.role) {
            setRole(query.data.user.role);
        }
    }, [query.data?.user?.role])
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


// function WithTheme() {

// }