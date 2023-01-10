import { App } from '@kenthackenough/ui/app';

export default App({
    // colorScheme: 'light',
}, (props) => {
    const { Component, pageProps } = props;
    return <Component {...pageProps} />;
})