const { writeFileSync, readFileSync } = require("fs");
const { resolve } = require("path");
const JSON5 = require('json5');


const { version }  = require(process.cwd() + '/package.json');

console.log('got version', { version })

function updatePackage(path) {
    const data = JSON5.parse(readFileSync(path, 'utf8'));
    data.version = version;
    writeFileSync(path, JSON.stringify(data, null, 2));
}

updatePackage(process.cwd() + '/projects/server/package.json');
updatePackage(process.cwd() + '/projects/staff/package.json');
updatePackage(process.cwd() + '/projects/web/package.json');