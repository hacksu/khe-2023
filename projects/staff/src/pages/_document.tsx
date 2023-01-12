// import { DocumentContext } from 'next/document';
// import { ReactFragment } from 'react';
// import { MantineDocument } from '@kenthackenough/ui/mantine/document';

// export default class _Document extends MantineDocument {
//     static async getInitialProps(ctx: DocumentContext) {
//         const initialProps = await super.getInitialProps(ctx);

//         return {
//             ...initialProps,
//         }
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