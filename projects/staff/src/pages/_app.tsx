import { NotificationsProvider } from '@mantine/notifications';
import { trpc } from '../utils/trpc';
import { createContext } from 'react';
import { Router } from 'next/router';
import { AppProps } from 'next/app';
import { RouteParameters } from '@kenthackenough/react/hooks';
import { AppLayout } from '../ui/layouts/app';
import { withMantine } from '../utils/mantine';
import Head from 'next/head';


declare global {
    export interface AppInitialProps extends AppProps {
        pageProps: AppInitialPageProps
    }
    export interface AppInitialPageProps {

    }
}

export const InitialRouter = createContext<Router>(null as any);

function App(props: AppInitialProps) {
    const { Component, pageProps } = props;

    return <InitialRouter.Provider value={props.router}>
        <NotificationsProvider>
            <Head>
                <title>Page title</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <AppLayout>
                <Component {...pageProps} />
            </AppLayout>
            <RouteParameters />
        </NotificationsProvider>
    </InitialRouter.Provider>
}


export default trpc.withTRPC(
    withMantine(App, {
        cookie: 'khe-staff-color-scheme',
        withGlobalStyles: true,
        withNormalizeCSS: true,
    })
)