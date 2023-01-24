/* eslint-disable react-hooks/exhaustive-deps */
import { MantineProviderProps, ColorSchemeProvider, ColorScheme, MantineProvider, MantineThemeOverride, useMantineTheme } from '@mantine/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import { useMediaQuery } from '@mantine/hooks';
import { AppContext } from 'next/app';
import { MantineGlobals } from '@kenthackenough/ui/globals';


/** @export 'mantine' */

declare global {
    interface AppInitialPageProps {
        mantine: MantineInitialProps & {
            colorScheme: ColorScheme
        }
    }
}


type WithMantineProps = Omit<MantineProviderProps, 'children'> & {
    colorScheme?: ColorScheme,
    /** Cookie used to store the user's preferred color scheme */
    cookie?: string,
}

type MantineInitialProps = {
    savedColorScheme?: ColorScheme
}


// export class MantineGlobals {
//     static emotionCache: EmotionCache;
//     static stylesServer: EmotionServer;
//     static theme: MantineThemeOverride;
// }

export function withMantine(App: (props: any) => JSX.Element, options: WithMantineProps) {
    const {
        colorScheme: forcedColorScheme,
        cookie = 'color-scheme',
        ...providerProps
    } = options;

    function GlobalsProvider() {
        const theme = useMantineTheme();
        MantineGlobals.theme = theme;
        return <></>;
    }

    function Provider(props: any) {

        const colorProps = useDynamicColorScheme(props?.pageProps?.mantine, {
            forcedColorScheme,
            cookie,
        })

        // @ts-ignore
        const theme = useMemo<MantineThemeOverride>(() => {
            if (providerProps.theme && typeof providerProps.theme === 'function') {
                return (...args: any) => {
                    return {
                        ...(providerProps as any).theme(...args),
                        colorScheme: colorProps.colorScheme,
                    }
                };
            }
            return {
                ...(providerProps.theme || {}),
                colorScheme: colorProps.colorScheme,
            }
        }, [colorProps.colorScheme, providerProps.theme])

        return <ColorSchemeProvider {...colorProps}>
            <MantineProvider {...providerProps} theme={theme}>
                {/* <UiThemeProvider /> */}
                <GlobalsProvider />
                <App {...props} />
            </MantineProvider>
        </ColorSchemeProvider>
    }

    async function getInitialProps(ctx: AppContext) {
        const inherited = 'getInitialProps' in App
            ? await (App as any).getInitialProps(ctx) : {};

        const savedCookie = getCookie(cookie, ctx.ctx);
        const mantine: MantineInitialProps = {
            savedColorScheme: savedCookie as any,
        }

        return {
            ...inherited,
            pageProps: {
                ...(inherited?.pageProps || {}),
                mantine,
            }
        }

    }

    return Object.assign(Provider, {
        getInitialProps,
    })
}


function useDynamicColorScheme(props: MantineInitialProps, config: {
    forcedColorScheme?: ColorScheme,
    cookie: string
}) {
    const { savedColorScheme } = props || {};
    const { forcedColorScheme, cookie } = config;

    const [colorScheme, setColorScheme] = useState<ColorScheme>(
        forcedColorScheme || savedColorScheme || 'light'
    );

    const toggleColorScheme = useCallback((value?: ColorScheme) => {
        const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'light');
        setCookie(cookie, nextColorScheme);
        setColorScheme(nextColorScheme);
    }, [colorScheme])

    const devicePreference: ColorScheme = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const desiredColorScheme = useMemo<ColorScheme>(() => {
        const desired = getCookie(cookie);
        if (desired === 'dark') return 'dark';
        if (desired === 'light') return 'light';
        return devicePreference || 'light';
    }, [devicePreference]);

    const [isThemeSet, setIsThemeSet] = useState(savedColorScheme !== undefined);
    useEffect(() => {
        if (isThemeSet) return;
        if (forcedColorScheme) return;
        if (savedColorScheme !== undefined) return;
        if (colorScheme == desiredColorScheme) return;
        setIsThemeSet(true);
        toggleColorScheme(desiredColorScheme);
    }, [colorScheme, desiredColorScheme]);

    if (props) {
        // @ts-ignore
        props.colorScheme = colorScheme;
    }

    return {
        colorScheme,
        toggleColorScheme,
    }

}


/** Shorthand for `check ? value : undefined`
 * - Used frequently when the JSX default value is desired unless a specific condition is met.
 * - Avoids frequent retyping of `: undefined` in dozens of conditionals in JSX properties.
 * ```tsx
 * <Element padding={isMobile ? 20 : undefined} color={darkMode ? 'red' : undefined} />
 * <Element padding={onlyif(isMobile, 20)} color={onlyIf(darkmode, 'red')} />
 * ```
 */
export function onlyIf<T>(check: boolean, value: T) {
    if (check) return value;
    return undefined;
}

