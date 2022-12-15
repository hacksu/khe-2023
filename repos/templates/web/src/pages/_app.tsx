import { App } from '@kenthackenough/ui/app';

export default App({

}, (props) => {
    const { Component, pageProps } = props;
    return <Component {...pageProps} />;
})