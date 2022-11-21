/**
 * Gets the package.json version
 */

const { execSync } = require('child_process');
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { resolve } = require('path');

const __cwd = execSync(`git rev-parse --show-toplevel`).toString('utf8').trim();
const __package = resolve(__cwd, 'package.json');

const { version } = require(__package);

console.log(version);