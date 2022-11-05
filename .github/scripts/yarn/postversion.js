/**
 * Syncs the project's package.json version to the all the projects
 * - Critical for the publish workflow, which publishes these projects to NPM
 */

const { writeFileSync, readFileSync } = require("fs");
const { resolve, relative } = require("path");
const { execSync } = require('child_process');
const JSON5 = require('json5');


const { version }  = require(process.cwd() + '/package.json');

console.log('got version', { version })

const files = new Set();

function updatePackage(path) {
    const data = JSON5.parse(readFileSync(path, 'utf8'));
    if (data.version != version) {
        data.version = version;
        writeFileSync(path, JSON.stringify(data, null, 2));
        files.add(relative(process.cwd(), path));
    }
}

updatePackage(process.cwd() + '/projects/server/package.json');
updatePackage(process.cwd() + '/projects/staff/package.json');
updatePackage(process.cwd() + '/projects/web/package.json');

// console.log()
if (files.size > 0) {
    execSync(`git add ${[...files].join(' ')}`);
    execSync(`git commit -m Updated Package Versions to v${version}`);
}