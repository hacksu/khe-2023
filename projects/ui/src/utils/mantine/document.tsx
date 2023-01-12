/* eslint-disable @next/next/no-document-import-in-page */
// import { EmotionServer } from '@emotion/server/create-instance';
// import { EmotionCache, createEmotionCache } from '@mantine/core';
// import { ServerStyles, createStylesServer } from '@mantine/next';
// // import { emotionCache } from '.';
// import Document, { DocumentContext } from 'next/document';


/** @export 'mantine/document' */

// const stylesServer = createStylesServer(emotionCache);

// export class MantineDocument extends Document {

//     static emotionCache: EmotionCache; // = createEmotionCache({ key: 'mantine-ssr' })

//     static stylesServer: EmotionServer; // = createStylesServer(this.emotionCache);

//     static async getInitialProps(ctx: DocumentContext) {
//         const initialProps = await Document.getInitialProps(ctx);

//         return {
//             ...initialProps,
//             styles: [
//                 initialProps.styles,
//                 <ServerStyles html={initialProps.html} server={this.stylesServer} key="styles" />,
//             ],
//         };
//     }
// }

import { createEmotionCache } from '@mantine/core';
import { ServerStyles, createStylesServer } from '@mantine/next';
import Document, { DocumentContext } from 'next/document';

export const emotionCache = createEmotionCache({
    key: 'mantine-ssr',
})

const stylesServer = createStylesServer(emotionCache);

export default class MantineDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        return {
            ...initialProps,
            styles: [
                initialProps.styles,
                <ServerStyles html={initialProps.html} server={stylesServer} key="styles" />,
            ],
        };
    }
}