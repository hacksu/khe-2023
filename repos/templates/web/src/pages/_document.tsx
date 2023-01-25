import { ServerStyles, createStylesServer } from '@mantine/next';
import Document, { DocumentContext } from 'next/document';
import { createEmotionCache } from '@mantine/core';
import { MantineGlobals } from '@kenthackenough/ui/globals';
import { emotionCache } from 'utils/mantine';


// export const emotionCache = MantineGlobals.emotionCache = MantineGlobals.emotionCache
//     || createEmotionCache({
//         key: 'mantine-ssr',
//     });

const stylesServer = MantineGlobals.stylesServer = MantineGlobals.stylesServer
    || createStylesServer(emotionCache);

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
