// import { App } from '@kenthackenough/ui/app';
// import { emotionCache } from './_document';
// import { withMantine } from '@kenthackenough/ui/mantine';

import { RouteParameters } from '@kenthackenough/react/hooks';
import { trpc } from '@kenthackenough/ui/trpc';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Router } from 'next/router';
import { createContext } from 'react';
import { withMantine } from '../utils/mantine';
// import { withMantine } from '@kenthackenough/ui/mantine';
import { emotionCache } from './_document';

// export default App({
//     // colorScheme: 'light',
//     emotionCache,
// }, (props) => {
//     const { Component, pageProps } = props;
//     return <Component {...pageProps} />;
// })

// export default App({

// }, withMantine((props) => {
//     const { Component, pageProps } = props;
//     return <Component {...pageProps} />;
// }, {
//     withGlobalStyles: true,
//     withNormalizeCSS: true,
//     emotionCache,
// }))

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
        <Head>
            <title>Page title</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <Component {...pageProps} />
        <RouteParameters />
    </InitialRouter.Provider>
}


export default trpc.withTRPC(
    withMantine(App, {
        colorScheme: 'light',
        cookie: 'khe-color-scheme',
        withGlobalStyles: true,
        withNormalizeCSS: true,
        emotionCache: emotionCache,
    })
)