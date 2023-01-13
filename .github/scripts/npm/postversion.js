/**
 * Syncs the project's package.json version to the all the projects
 * - Critical for the publish workflow, which publishes these projects to NPM
 */

const { writeFileSync, readFileSync } = require("fs");
const { resolve, relative } = require("path");
const { execSync } = require('child_process');
const fetch = require('node-fetch');
const JSON5 = require('json5');
const glob = require('glob');
const semver = require('semver');

const __cwd = execSync(`git rev-parse --show-toplevel`).toString('utf8').trim();

const { version }  = require(__cwd + '/package.json');

console.log('got version', { version })

const files = new Set();

function updatePackage(path) {
    const data = JSON5.parse(readFileSync(path, 'utf8'));
    let doSave = false;
    if (!path.includes('templates') && !path.includes('workbench')) {
        if (data.version != version) {
            data.version = version;
            doSave = true;
        }
    }
    const projectInstallVersion = '^' + version;
    for (const key in data.dependencies || {}) {
        if (key.startsWith('@kenthackenough/')) {
            const v = data.dependencies[key];
            if (v != projectInstallVersion) {
                data.dependencies[key] = projectInstallVersion;
                doSave = true;
            }
        }
    }
    for (const key in data.devDependencies || {}) {
        if (key.startsWith('@kenthackenough/')) {
            const v = data.devDependencies[key];
            if (v != projectInstallVersion) {
                data.devDependencies[key] = projectInstallVersion;
                doSave = true;
            }
        }
    }
    if (doSave) {
        console.log(data.name, data);
        writeFileSync(path, JSON.stringify(data, null, 2));
        files.add(relative(process.cwd(), path));
    }
}

// updatePackage(process.cwd() + '/projects/server/package.json');
// updatePackage(process.cwd() + '/projects/staff/package.json');
// updatePackage(process.cwd() + '/projects/web/package.json');
// updatePackage(process.cwd() + '/library/tsconfig/package.json');
// updatePackage(process.cwd() + '/library/react/package.json');

const tmt = setTimeout(() => {

}, 50000);

glob(process.cwd() + '/**/package.json', {
    ignore: ['**/node_modules/**'],
}, (err, packages) => {
    for (const pkg of packages) {
        updatePackage(pkg);
    }
    clearTimeout(tmt);
});



if (files.size > 0) {
    // execSync(`git commit ${[...files].join(' ')} -m "Updated Package Versions to v${version}"`);
}