import { trpc } from '@kenthackenough/ui/trpc';
import { App } from '@kenthackenough/ui/app';
import { withMantine } from '../utils/mantine';
import { emotionCache } from './_document';
import { createContext } from 'react';
import { Router } from 'next/router';
import Head from 'next/head';
import { AppProps } from 'next/app';


export const InitialRouter = createContext<Router>(null as any);

declare global {
    interface AppInitialProps extends AppProps {}
}



const app = App((props) => {
    const { Component, pageProps } = props;
    return <>
        <Head>
            <title>Page title</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <InitialRouter.Provider value={props.router}>
            <Component {...pageProps} />
        </InitialRouter.Provider>
    </>
})


export default trpc.withTRPC(
    withMantine(app, {
        emotionCache: emotionCache,
        withGlobalStyles: true,
        withNormalizeCSS: true,
    })
)

