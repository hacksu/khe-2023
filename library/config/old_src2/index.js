console.log('do global', global)

try {
    const { readFileSync, existsSync } = require('fs');
    const merge = require('lodash/merge');
    const { resolve } = require('path');
} catch(err) {
    console.log('what the fuck', err);
}
const { readFileSync, existsSync } = require('fs');
const merge = require('lodash/merge');
const { resolve } = require('path');

Object.defineProperty(exports, "__esModule", { value: true });



const { ts } = require('ts-node').create({
    transpileOnly: true,
    esm: true,
})

const projectConfig = {};

function importFile(...paths) {
    const path = resolve(...paths);
    if (!existsSync) return;
    try {
        const data = eval(ts.transpileModule(readFileSync(path, 'utf8'), {

        }).outputText);
        console.log('eeey config data', data)
        for (const key in data) {
            merge(projectConfig, data[key]);
        }
        merge(projectConfig, data);
    } catch (err) {
        // console.log('ooof config import', err);
    }
};

{
    const __cwd = process.cwd();
    const __config = 'config.ts';

    importFile(__cwd, __config);
    importFile(__cwd, '..', __config);
}


exports.config = projectConfig;
exports.Config = projectConfig;
