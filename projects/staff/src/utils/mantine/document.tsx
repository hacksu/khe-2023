/* eslint-disable @next/next/no-document-import-in-page */
import { ServerStyles, createStylesServer } from '@mantine/next';
// import { emotionCache } from '.';
import Document, { DocumentContext } from 'next/document';


// const stylesServer = createStylesServer(emotionCache);

export class MantineDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        return {
            ...initialProps,
            styles: [
                initialProps.styles,
                // <ServerStyles html={initialProps.html} server={stylesServer} key="styles" />,
            ],
        };
    }
}