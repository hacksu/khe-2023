/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

/** @export 'app' */

import { ColorScheme, ColorSchemeProvider, EmotionCache, MantineProvider, MantineThemeOverride } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppProps } from 'next/app';
import { trpc } from '../utils/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthProviders } from './authentication';
import { ModalsProvider } from '@mantine/modals';
import { RouteParameters } from '@kenthackenough/react/hooks';
import { withMantine } from '../utils/mantine';
import { MantineDocument } from '../utils/mantine/document';


type InitialProps = AppProps;

type AppConfig = {
    colorScheme?: ColorScheme;
    theme?: MantineThemeOverride;
    emotionCache?: EmotionCache,
}

const baseAppConfig = {

} as const;


export function App<Config extends AppConfig, Component extends (props: InitialProps) => JSX.Element>(config: Config, component: Component)
export function App<Component extends (props: InitialProps) => JSX.Element>(component: Component)
export function App(...args) {

    const [_config, Component] = [{}, ...args].slice(-2);
    const config: AppConfig = {
        ...baseAppConfig,
        ..._config,
    }

    const app = function (props: InitialProps) {

        const _trpc = trpc.useContext();
        const queryClient = useQueryClient();
        useEffect(() => {
            if (typeof window !== 'undefined') {
                if (Object.keys(((queryClient.getQueryCache() as any).queriesMap as Map<string, any>)).length === 0) {
                    _trpc.invalidate();
                }
            }
        }, [typeof window]);

        return <ModalsProvider>
            <NotificationsProvider>
                <RouteParameters />
                <Component {...props} />
            </NotificationsProvider>
        </ModalsProvider>
    }

    // const app = function (props: InitialProps) {

    //     const [config, Component] = useMemo<[AppConfig, (args: any) => JSX.Element]>(() => {
    //         return [baseAppConfig, ...args].slice(-2) as any;
    //     }, args);

    // const _trpc = trpc.useContext();
    // const queryClient = useQueryClient();
    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         if (Object.keys(((queryClient.getQueryCache() as any).queriesMap as Map<string, any>)).length === 0) {
    //             _trpc.invalidate();
    //         }
    //     }
    // }, [typeof window]);

    //     return <ModalsProvider>
    //         <NotificationsProvider>
    //             <RouteParameters />
    //             <Component {...props} />
    //         </NotificationsProvider>
    //     </ModalsProvider>
    // }


    return trpc.withTRPC(
        withMantine(app, {
            emotionCache: config?.emotionCache,
            colorScheme: config?.colorScheme,
            theme: config?.theme,
            withGlobalStyles: true,
            withNormalizeCSS: true,
        })
    );
}

