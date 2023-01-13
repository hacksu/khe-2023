const { writeFileSync, readFileSync } = require("fs");
const fetch = require('node-fetch');
const JSON5 = require('json5');
const semver = require('semver');
const glob = require('glob');
const { execSync } = require("child_process");
const { resolve, relative } = require("path");


const __cwd = execSync(`git rev-parse --show-toplevel`).toString('utf8').trim();
const __package = resolve(__cwd, 'package.json');

const DRY = process.env.npm_config_dry ? true : false;

const changedFiles = new Set();

const tmt = setTimeout(() => {

}, 50000);

let version;


const versionCache = new Map();

function updatePackage(path) {
    const data = JSON5.parse(readFileSync(path, 'utf8'));
    let doSave = false;
    if (true) { //path.includes('web') || !path.includes('templates') && !path.includes('repos')) {
        if (data.version != version) {
            data.version = version;
            doSave = true;
        }
    }
    const projectInstallVersion = '^' + version;
    for (const key in data.dependencies || {}) {
        if (key.startsWith('@kenthackenough/')) {
            const v = data.dependencies[key];
            const latestVersion = versionCache.get(key);
            if (v != latestVersion) {
                data.dependencies[key] = latestVersion;
                doSave = true;
            }
        }
    }
    for (const key in data.devDependencies || {}) {
        if (key.startsWith('@kenthackenough/')) {
            const v = data.devDependencies[key];
            const latestVersion = versionCache.get(key);
            if (v != latestVersion) {
                data.devDependencies[key] = latestVersion;
                doSave = true;
            }
        }
    }
    if (doSave) {
        // console.log(data.name, data);
        if (!DRY) writeFileSync(path, JSON.stringify(data, null, 2));
        changedFiles.add(path);
    }
}


glob(__cwd + '/**/package.json', {
    ignore: ['**/node_modules/**'],
}, async (err, paths) => {
    paths.push(__package);
    const versions = new Set();

    const packages = paths
        .map(o => JSON5.parse(readFileSync(o, 'utf8')))
        .filter(o => o.name.startsWith('@kenthackenough'));

    packages.forEach(o => versions.add(o.version));

    // console.log({ packages })
    await Promise.all(Object.values(packages).map(async o => {
        const found = (await Promise.all(packages.map(o => {
            return fetch(`https://registry.npmjs.org/${o.name}/latest`)
                .then(res => res.json())
                .then(data => data.version)
        })))
            .filter(o => typeof o === 'string')
            // .forEach(o => versions.add(o));

        const latest = [...found].sort((a, b) => {
            return semver.gt(b, a) ? 1 : -1;
        })[0];

        console.log('registry', { [o.name]: latest })
        versionCache.set(o.name, '^' + latest);
    }));

    (await Promise.all(packages.map(o => {
        return fetch(`https://registry.npmjs.org/${o.name}/latest`)
            .then(res => res.json())
            .then(data => data.version)
    })))
        .filter(o => typeof o === 'string')
        .forEach(o => versions.add(o));

    const latest = [...versions.values()].sort((a, b) => {
        return semver.gt(b, a) ? 1 : -1;
    })[0];

    // if (true) return;

    // console.log({ version, patch: semver.inc(version, 'patch') });

    let increment = false;
    if (process.env.npm_lifecycle_event === 'deploy') {
        increment = 'patch';
        if (process.env.npm_config_prepatch) {
            increment = 'prepatch';
        } else if (process.env.npm_config_preminor) {
            increment = 'preminor';
        } else if (process.env.npm_config_preminor) {
            increment = 'premajor';
        } else if (process.env.npm_config_patch) {
            increment = 'patch';
        } else if (process.env.npm_config_minor) {
            increment = 'minor';
        } else if (process.env.npm_config_major) {
            increment = 'major';
        }
    }

    console.log({ latest, [increment]: increment ? semver.inc(latest, increment) : latest });

    const project = JSON5.parse(readFileSync(__package, 'utf8'));
    let saveProject = false;
    if (increment) {
        project.version = semver.inc(latest, increment);
        saveProject = true;
    }

    version = project.version;

    console.log(project.version);

    if (saveProject) {
        changedFiles.add(__package);
        if (!DRY) writeFileSync(__package, JSON.stringify(project, null, 2));
    }

    for (const pkg of paths.filter(o => o != __package)) {
        updatePackage(pkg);
    }

    if (changedFiles.size > 0 && !DRY) {
        execSync(`git commit ${[...changedFiles].map(o => relative(__cwd, o)).join(' ')} -m "Updated Package Versions to v${version}"`);
    }

    // console.log({ latest, [increment]: increment ? semver.inc(latest, increment) : latest });

    if (process.env.npm_lifecycle_event === 'deploy' && !DRY) {
        // if (process.argv.find(o => o.includes('postversion')) && !DRY) {
        execSync(`git commit --allow-empty -m '@deploy' && git push`);
    }

    clearTimeout(tmt);
});