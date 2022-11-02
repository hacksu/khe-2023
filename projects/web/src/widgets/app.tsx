/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

/** @export 'app' */

import { ColorScheme, ColorSchemeProvider, MantineProvider, MantineThemeOverride } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { useCallback, useMemo, useState } from 'react';
import { AppProps } from 'next/app';
import { trpc } from '../utils/trpc';


type InitialProps = AppProps;

type AppConfig = {
    colorScheme?: ColorScheme;
    theme?: MantineThemeOverride;
}

const baseAppConfig = {
    colorScheme: 'light',
    theme: {},
} as const;


export function App<Config extends AppConfig, Component extends (props: InitialProps) => JSX.Element>(config: Config, component: Component)
export function App<Component extends (props: InitialProps) => JSX.Element>(component: Component)
export function App(...args) {

    const app = function (props: InitialProps) {

        const [config, Component] = useMemo<[AppConfig, (args: any) => JSX.Element]>(() => {
            return [baseAppConfig, ...args].slice(-2) as any;
        }, args);
    
        const [colorScheme, setColorScheme] = useState<ColorScheme>(config.colorScheme || baseAppConfig.colorScheme);
    
        const toggleColorScheme = useCallback(((color) => color
            ? setColorScheme(color)
            : setColorScheme(colorScheme == 'dark' ? 'light' : 'dark')
        ), [colorScheme]);

        const theme = {
            colorScheme,
            __proto__: config.theme || baseAppConfig.theme,
        };

        return <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
                <NotificationsProvider>
                    <Component {...props} />
                </NotificationsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    }

    return trpc.withTRPC(app);
}

