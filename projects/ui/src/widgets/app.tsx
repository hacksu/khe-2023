// import { useQueryClient } from '@tanstack/react-query';
// import { trpc } from '../utils/trpc';
// import { createContext, useEffect } from 'react';
// import { AppProps } from 'next/app';
// import { ModalsProvider } from '@mantine/modals';
// import { NotificationsProvider } from '@mantine/notifications';
// import { RouteParameters } from '@kenthackenough/react/hooks';
// import { Router } from 'next/router';


// export const InitialRouter = createContext<Router>(null as any);

// export function BaseApp(props: AppProps) {
//     const { Component } = props;

//     const _trpc = trpc.useContext();
//     const queryClient = useQueryClient();
//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             if (Object.keys(((queryClient.getQueryCache() as any).queriesMap as Map<string, any>)).length === 0) {
//                 _trpc.invalidate();
//             }
//         }
//     }, [typeof window]);

//     return <InitialRouter.Provider value={props.router}>
//         <ModalsProvider>
//             <NotificationsProvider>
//                 <RouteParameters />
//                 <Component {...props} />
//             </NotificationsProvider>
//         </ModalsProvider>
//     </InitialRouter.Provider>
// }

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

/** @export 'app' */

import { ColorScheme, ColorSchemeProvider, EmotionCache, MantineProvider, MantineThemeOverride, useMantineTheme } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { AppProps } from 'next/app';
import { trpc } from '../utils/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthProviders } from './authentication';
import { ModalsProvider } from '@mantine/modals';
import { RouteParameters } from '@kenthackenough/react/hooks';
import { withMantine } from '../utils/mantine';
import { Router } from 'next/router';
import { MantineGlobals } from '../utils/globals';
// import { MantineDocument } from '../utils/mantine/document';


type InitialProps = AppInitialProps; //AppProps;

type AppConfig = {
    colorScheme?: ColorScheme;
    theme?: MantineThemeOverride;
    emotionCache?: EmotionCache,
}

const baseAppConfig = {

} as const;


declare global {
    export interface AppInitialProps {
        pageProps: AppInitialPageProps
    }
    export interface AppInitialPageProps {

    }
}


export function App<Config extends AppConfig, Component extends (props: InitialProps) => JSX.Element>(config: Config, component: Component)
export function App<Component extends (props: InitialProps) => JSX.Element>(component: Component)
export function App(...args) {

    const [_config, Component] = [{}, ...args].slice(-2);
    const config: AppConfig = {
        ...baseAppConfig,
        ..._config,
    }

    const app = function (props: InitialProps) {
        const theme = useMantineTheme();
        if (MantineGlobals.theme) {
            Object.assign(theme, MantineGlobals.theme)
        }

        // console.log('theme', theme.colorScheme, MantineGlobals.theme.colorScheme);

        const _trpc = trpc.useContext();
        const queryClient = useQueryClient();
        useEffect(() => {
            if (typeof window !== 'undefined') {
                if (Object.keys(((queryClient.getQueryCache() as any).queriesMap as Map<string, any>)).length === 0) {
                    _trpc.invalidate();
                }
            }
        }, [typeof window]);

        return <>
            <ModalsProvider>
                <NotificationsProvider>
                    <RouteParameters />
                    <Component {...props} />
                </NotificationsProvider>
            </ModalsProvider>
        </>
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

    if (true) return app;

    return trpc.withTRPC(
        app
        // withMantine(app, {
        //     emotionCache: config?.emotionCache,
        //     colorScheme: config?.colorScheme,
        //     theme: config?.theme,
        //     withGlobalStyles: true,
        //     withNormalizeCSS: true,
        // })
    );
}




