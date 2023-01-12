import { createGetInitialProps } from '@mantine/next';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { MantineDocument } from '../utils/mantine/document';

/** @export 'document' */


// const getInitialProps = createGetInitialProps();

// export default class _Document extends Document {
//     static getInitialProps = getInitialProps;

//     render() {
//         return <Html>
//             <Head />
//             <body>
//                 <Main />
//                 <NextScript />
//             </body>
//         </Html>
//     }
// }

// export const WebDocument = _Document;

export default class _Document extends MantineDocument {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await super.getInitialProps(ctx);

        return {
            ...initialProps,
        }
    }
}

export const WebDocument = _Document;