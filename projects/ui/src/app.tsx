
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

/** @export 'app' */

import { ColorScheme, EmotionCache, MantineThemeOverride, useMantineTheme } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { useEffect} from 'react';
import { AppContext } from 'next/app';
import { trpc } from './utils/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { ModalsProvider } from '@mantine/modals';
import { RouteParameters, useUserAgent } from '@kenthackenough/react/hooks';
import { useTheme } from './utils/mantine';
import { MantineGlobals } from './utils/globals';
import { useMediaQuery } from '@mantine/hooks';
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
        userAgent?: string
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

        useTheme();
        useUserAgent(props.pageProps.userAgent);

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

    const getInitialProps = async function (ctx: AppContext) {
        const inherited = 'getInitialProps' in Component
            ? await Component.getInitialProps(ctx) : {};

        return {
            ...inherited,
            pageProps: {
                ...(inherited?.pageProps || {}),
                userAgent: ctx.ctx.req?.headers['user-agent'],
            }
        }

    }

    return Object.assign(app, {
        getInitialProps,
    });
}



const DeviceTypeBreakpoints = {
    'xs': ['embedded', 'wearable'],
    'sm': ['embedded', 'wearable', 'mobile'],
    'md': ['embedded', 'wearable', 'mobile', 'tablet'],
    'lg': ['embedded', 'wearable', 'mobile', 'tablet', 'laptop'],
}

/** Determines if the device is smaller than or equal to the specified breakpoint
 * - If properly configured, automatically utilizes the UserAgent to properly return during Server-Side-Rendering
 * - When the UserAgent is known, one can globally configure this hook via `useUserAgent(req.headers['user-agent'])`
 *   All subsequent usage of `userUserAgent()` will use the cached result.
 */
export function useIsBreakpoint(breakpoint: 'xs' | 'sm' | 'md' | 'lg' = 'md') {
    const theme = useMantineTheme();
    const ua = useUserAgent();
    const mediaIsMobile = useMediaQuery(`(max-width: ${theme.breakpoints[breakpoint]}px)`);
    const isMobile = mediaIsMobile === true || (
        ua?.device?.type === 'mobile'
        || DeviceTypeBreakpoints[breakpoint].includes(ua?.device?.type || '')
    );
    return isMobile;
}

/** Determines if the device is smaller than or equal to the size of a tablet or smartphone
 * - If properly configured, automatically utilizes the UserAgent to properly return during Server-Side-Rendering
 * - When the UserAgent is known, one can globally configure this hook via `useUserAgent(req.headers['user-agent'])`.
 *   All subsequent usage of `userUserAgent()` will use the cached result.
 */
export function useIsMobile() {
    return useIsBreakpoint('md');
}
