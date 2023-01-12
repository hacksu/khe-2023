// import { WebDocument } from '@kenthackenough/ui/document';

// import { createEmotionCache } from '@mantine/core';
// import { createStylesServer } from '@mantine/next';
// export const emotionCache = createEmotionCache({
//     key: 'mantine-ssr',
// });

// WebDocument.emotionCache = emotionCache;
// WebDocument.stylesServer = createStylesServer(emotionCache);

// export default WebDocument;


import { createEmotionCache } from '@mantine/core';
import { ServerStyles, createStylesServer } from '@mantine/next';
import Document, { DocumentContext } from 'next/document';

export const emotionCache = createEmotionCache({
    key: 'mantine-ssr',
    // prepend: true,
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