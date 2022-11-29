import { App } from '@kenthackenough/web/app';

export default App({

}, (props) => {
    const { Component, pageProps } = props;
    return <Component {...pageProps} />;
})