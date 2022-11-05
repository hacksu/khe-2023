/**
 * Checks if a publish is required
 */

const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { resolve } = require('path');

const __cache = resolve(process.cwd(), '.workflow-cache');
const __package = resolve(process.cwd(), 'package.json');
const __cachedPackage = resolve(__cache, 'package.json');

mkdirSync(__cache, { recursive: true })


const { version } = require(__package);

let oldVersion = '1.0.0';
try {
    oldVersion = require(__cachedPackage).version;
} catch(err) {};

// TODO: do not copy unless we actually upload
writeFileSync(__cachedPackage, readFileSync(__package));

if (version !== oldVersion) {
    console.log('yes');
} else {
    console.log('no');
}