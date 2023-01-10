import { AppShell, Box, MantineThemeOverride } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { NextPageContext } from 'next';
import { AppContext, AppProps } from 'next/app';
import { ThemeProvider } from '../utils/mantine';
import { trpc } from '../utils/trpc';
import { Navigation } from '../widgets/navigation';
import { useAuthProviders } from '@kenthackenough/ui/authentication';
import { RouteParameters } from '@kenthackenough/react/hooks';
import { AppLayout } from '../ui/layouts/app';
import Head from 'next/head';


function App(props: InitialProps) {
    const { Component, pageProps } = props;

    const { colorScheme, firstVisit } = props;
    const theme: MantineThemeOverride = {

    }

    // const bruh = useAuthProviders();
    // console.log('auth providers', bruh);

    return <ThemeProvider {...{ theme, colorScheme, firstVisit }}>
        <Head>
            <title>Page title</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        {/* Ensure modals do not scroll to top of page */}
        <NotificationsProvider>
            <AppLayout>
                <Component {...pageProps} />
            </AppLayout>
            <RouteParameters />
        </NotificationsProvider>
    </ThemeProvider>
}

type InitialProps = AppProps & Awaited<ReturnType<typeof App.getInitialProps>>;
App.getInitialProps = async function (ctx: AppContext) {
    return {
        ...ThemeProvider.getInitialProps(ctx),
    }
}

const _App = trpc.withTRPC(App);
const _getInitialProps: any = _App.getInitialProps || (() => ({}));
_App.getInitialProps = async (ctx: NextPageContext) => ({
    ...await App.getInitialProps(ctx as any as AppContext),
    ...await _getInitialProps(ctx),
});

export default _App;