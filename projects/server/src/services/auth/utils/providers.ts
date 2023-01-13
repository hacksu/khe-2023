import { OAuthConfig } from 'next-auth/providers/index';
import { authProviders } from '../config';
import { get, set } from 'lodash';


type PROVIDER_PUBLIC_FIELDS = typeof PROVIDER_PUBLIC_FIELDS[number];
const PROVIDER_PUBLIC_FIELDS = ['id', 'type', 'name', 'style'] as const;

type PublicAuthProvider<K extends keyof typeof authProviders, T = (typeof authProviders)[K]> = K extends OAuthConfig<any>
    ? Pick<T, Extract<PROVIDER_PUBLIC_FIELDS, keyof T>> & { id: K }
    : Pick<T, Extract<PROVIDER_PUBLIC_FIELDS, keyof T>> & { id: K };

export type PublicAuthProviders = {
    [P in keyof typeof authProviders]: PublicAuthProvider<P>
}

export const publicAuthProviders: PublicAuthProviders = Object.fromEntries(
    Object.entries(authProviders).map(([id, provider]) => {
        const data = Object.fromEntries(
            Object.entries(provider).filter(o => PROVIDER_PUBLIC_FIELDS.includes(o[0] as any))
        );
        if (provider.type === 'oauth') {
            set(data, 'style.logo', `https://authjs.dev/img/providers/` + get(data, 'style.logo'))
            set(data, 'style.logoDark', `https://authjs.dev/img/providers/` + get(data, 'style.logoDark'))
        }
        return [id, data];
    })
) as any;

