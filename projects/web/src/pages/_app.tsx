import { App } from '../widgets/app';


export default App({
    colorScheme: 'dark',
    theme: {}
}, (props) => {
    const { Component, pageProps } = props;
    return <Component {...pageProps} />
})

