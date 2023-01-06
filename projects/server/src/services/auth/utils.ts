import { OAuthConfig } from 'next-auth/providers/index';
import { authProviders } from './config';


type PROVIDER_PUBLIC_FIELDS = typeof PROVIDER_PUBLIC_FIELDS[number];
const PROVIDER_PUBLIC_FIELDS = ['id', 'type', 'name', 'style'] as const;

type PublicAuthProvider<K extends keyof typeof authProviders, T = (typeof authProviders)[K]> = K extends OAuthConfig<any>
    ? Pick<T, Extract<PROVIDER_PUBLIC_FIELDS, keyof T>> & { id: K }
    : Pick<T, Extract<PROVIDER_PUBLIC_FIELDS, keyof T>> & { id: K };

export type PublicAuthProviders = {
    [P in keyof typeof authProviders]: PublicAuthProvider<P>
}

export const publicAuthProviders: PublicAuthProviders = Object.fromEntries(
    Object.entries(authProviders).map(([id, provider]) => ([
        id,
        Object.fromEntries(
            Object.entries(provider).filter(o => PROVIDER_PUBLIC_FIELDS.includes(o[0] as any))
        )
    ]))
) as any;


