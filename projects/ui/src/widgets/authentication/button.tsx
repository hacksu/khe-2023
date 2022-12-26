import type { AuthProviderId } from '@kenthackenough/server/auth';
import { Button, ButtonProps, ColorScheme, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getProviders } from 'next-auth/react';
import { useProps } from '@kenthackenough/react/hooks';
import { api } from '../../utils/trpc';
import { useAuthProviders } from '.';
import { login } from '@kenthackenough/server/auth';

export function SignInWith(props: {
    strategy: Exclude<AuthProviderId, 'credentials'>,
    theme?: ColorScheme
} & ButtonProps) {
    const theme = useMantineTheme();

    const { strategy, theme: colorScheme = theme.colorScheme, ...rest } = props;
    const provider = useAuthProviders()?.[strategy];

    const styles = provider?.style ? {
        bg: getProviderStyle(provider.style, colorScheme, 'bg'),
        text: getProviderStyle(provider.style, colorScheme, 'text'),
        logo: getProviderStyle(provider.style, colorScheme, 'logo'),
        hover: '',
    } : null;

    if (styles && styles.bg) {
        const _initial = theme.fn.lighten(styles.bg, 0);
        const _light = theme.fn.lighten(styles.bg, 0.05);
        const _dark = theme.fn.darken(styles.bg, 0.05);
        styles.hover = _initial === _light ? _dark : _light;
    }

    const buttonProps = useProps(props, {
        // eslint-disable-next-line @next/next/no-img-element
        leftIcon: styles?.logo && <img src={styles?.logo} style={{ height: '1.5em', marginRight: 4 }} alt={provider?.name + ' Logo'} />,
        sx: {
            backgroundColor: styles?.bg,
            color: styles?.text,
            ":hover": {
                backgroundColor: styles?.hover,
            }
        },
    } as ButtonProps);

    return <Button onClick={() => login({ strategy })} {...buttonProps}>
        Sign in with {provider?.name}
    </Button>
}

// export function SignInWith(props: {
//     strategy: Exclude<AuthProviderId, 'credentials'>,
//     theme?: ColorScheme
// }) {
//     const { colorScheme } = useMantineColorScheme();
//     const { strategy, theme = colorScheme, ...rest } = props;
//     const query = api.auth.providers.useQuery();
//     const provider = query.data ? query.data[props.strategy] : null;
//     const styles = provider?.style ? {
//         bg: getProviderStyle(provider.style, theme, 'bg'),
//         text: getProviderStyle(provider.style, theme, 'text'),
//         logo: getProviderStyle(provider.style, theme, 'logo'),
//     } : null;
//     console.log({ styles }, styles?.bg)
//     const buttonProps = useProps(props, {
//         // eslint-disable-next-line @next/next/no-img-element
//         leftIcon: <img src={styles?.logo} style={{ height: '1.5em' }} alt={provider?.name + ' Logo'} />,
//         // styles: styles ? (theme, params) => {
//         //     // console.log('darken', theme.fn?.darken);
//         //     return ({
//         //         root: {
//         //             backgroundColor: styles.bg,
//         //             color: styles.text,
//         //             '&:hover': {
//         //                 backgroundColor: theme?.fn?.darken(styles.bg, 0.05),
//         //             },
//         //         }
//         //     })
//         // } : {},
//     } satisfies ButtonProps);
//     return <Button {...buttonProps} styles={styles ? ((theme) => ({
//         root: {
//             backgroundColor: styles.bg,
//             color: styles.text,
//             '&:hover': {
//                 backgroundColor: theme.fn.darken(styles.bg, 0.05),
//             },
//         }
//     })) : () => ({})}>
//         Sign in with {provider?.name}
//     </Button>
// }

function getProviderStyle<T, K extends keyof T>(style: NonNullable<T>, theme: ColorScheme, key: K & string): T[K] {
    if (!style) return undefined as any;
    const light = key;
    const dark = key + 'Dark';
    switch (theme) {
        case 'light': {
            return style[light] || style[dark];
        }
        case 'dark': {
            return style[dark] || style[light];
        }
    }
}

