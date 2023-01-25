import { trpc } from '@kenthackenough/ui/trpc';
import { App } from '@kenthackenough/ui/app';
import { emotionCache, withMantine } from 'utils/mantine';
import { createContext } from 'react';
import { Router } from 'next/router';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { AppLayout } from 'ui/layouts/app';


export const InitialRouter = createContext<Router>(null as any);


declare global {
    interface AppInitialProps extends AppProps { }
}



const app = App((props) => {
    const { Component, pageProps } = props;
    return <>
        <Head>
            <title>Page title</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <InitialRouter.Provider value={props.router}>
            <AppLayout>
                <Component {...pageProps} />
            </AppLayout>
        </InitialRouter.Provider>
    </>
})


export default trpc.withTRPC(
    withMantine(app, {
        colorScheme: 'light',
        cookie: 'khe-color-scheme',
        withGlobalStyles: true,
        withNormalizeCSS: true,
        emotionCache: emotionCache,
    })
)

