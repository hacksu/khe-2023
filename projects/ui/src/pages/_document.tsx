import { createGetInitialProps, createStylesServer, ServerStyles } from '@mantine/next';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

/** @export 'document' */

const stylesServer = createStylesServer();
const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        Object.assign(initialProps, getInitialProps(ctx));

        return {
            ...initialProps,
            styles: [
                initialProps.styles,
                <ServerStyles html={initialProps.html} server={stylesServer} key="styles" />,
            ],
        };
    }

    render() {
        return <Html>
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    }
}

export const WebDocument = _Document;