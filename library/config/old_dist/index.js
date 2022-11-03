"use strict";
// import { merge } from 'lodash';
// import { resolve } from 'path';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.config = void 0;
var merge = require('lodash/merge');
var resolve = require('path').resolve;
var esmRequire = require('esm')(module, {});
var tsRequire = require('ts-node').register({
    esm: true,
    transpileOnly: true,
});
console.log('WOAH', tsRequire);
process.exit(1);
// ({
//     lazy: true,
// });
var projectConfig = {
    mode: process.env.NODE_ENV || 'development',
};
function importConfig() {
    var path = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        path[_i] = arguments[_i];
    }
    var _path = resolve.apply(void 0, path);
    var data;
    try {
        data = esmRequire(_path);
    }
    catch (err) {
        console.log('1: could not load config file from', _path, err);
        try {
            data = tsRequire(data);
        }
        catch (err2) {
            console.log('2: could not load config file from', _path, err2);
        }
    }
    if (data) {
        for (var key in data.config) {
            merge(projectConfig, data.config[key]);
        }
        merge(projectConfig, data.config);
    }
}
var __cwd = process.cwd();
var __config = 'config.ts';
importConfig(__cwd, __config);
importConfig(__cwd, '..', __config);
try {
    var nextConfig = esmRequire('next/config');
    console.log({ nextConfig: nextConfig });
}
catch (err) {
    console.log('oof nextconfig', err);
}
exports.config = projectConfig;
exports.Config = projectConfig;
