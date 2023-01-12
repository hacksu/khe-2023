import { App } from '@kenthackenough/ui/app';
import { MantineDocument } from '@kenthackenough/ui/mantine/document';
import { emotionCache } from './_document';

export default App({
    // colorScheme: 'light',
    emotionCache,
}, (props) => {
    const { Component, pageProps } = props;
    return <Component {...pageProps} />;
})