import get from 'lodash/get';

const projectConfig = {
    mode: process.env.NODE_ENV,
    ...require(process.cwd() + '/config.ts'),
}

export function Config(key: string) {
    return get(projectConfig, key);
}

// export const config = Config;

const config = new Proxy(projectConfig, {
    apply(target, thisArg, argArray) {
        
    },
    get(target, p, receiver) {
        
    },
})