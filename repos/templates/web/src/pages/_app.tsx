import { App } from '@kenthackenough/ui/app';
import { emotionCache } from './_document';
import { withMantine } from '@kenthackenough/ui/mantine';

// export default App({
//     // colorScheme: 'light',
//     emotionCache,
// }, (props) => {
//     const { Component, pageProps } = props;
//     return <Component {...pageProps} />;
// })

export default App({

}, withMantine((props) => {
    const { Component, pageProps } = props;
    return <Component {...pageProps} />;
}, {
    withGlobalStyles: true,
    withNormalizeCSS: true,
    emotionCache,
}))