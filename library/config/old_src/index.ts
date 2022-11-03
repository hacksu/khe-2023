// import { merge } from 'lodash';
// import { resolve } from 'path';

const merge = require('lodash/merge');
const { resolve } = require('path');

const esmRequire = require('esm')(module, {

});
const tsRequire = require('ts-node').register({
    esm: true,
    transpileOnly: true,
})

console.log('WOAH', tsRequire);
process.exit(1);
// ({
//     lazy: true,
// });


const projectConfig = {
    mode: process.env.NODE_ENV || 'development',
}


function importConfig(...path: string[]) {
    const _path = resolve(...path);
    let data;
    try {
        data = esmRequire(_path);
    } catch(err) {
        console.log('1: could not load config file from', _path, err);
        try {
            data = tsRequire(data)
        } catch(err2) {
            console.log('2: could not load config file from', _path, err2);
        }
    }
    if (data) {
        for (const key in data.config) {
            merge(projectConfig, data.config[key]);
        }
        merge(projectConfig, data.config);
    }
}

const __cwd = process.cwd();
const __config = 'config.ts';

importConfig(__cwd, __config);
importConfig(__cwd, '..', __config);

try {
    const nextConfig = esmRequire('next/config');
    console.log({ nextConfig })
} catch(err) {
    console.log('oof nextconfig', err);
}


export const config = projectConfig;
export const Config = projectConfig;

