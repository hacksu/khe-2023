import { App } from '../widgets/app';


export default App({
    colorScheme: 'dark',
    withGlobalStyles: true,
    withNormalizeCSS: true,
    theme: {}
}, (props) => {
    const { Component, pageProps } = props;
    return <Component {...pageProps} />
})

