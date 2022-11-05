/**
 * Gets the package.json version
 */

const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { resolve } = require('path');
 
const __cache = resolve(process.cwd(), '.workflow-cache');
const __package = resolve(process.cwd(), 'package.json');

const { version } = require(__package);

console.log(version);