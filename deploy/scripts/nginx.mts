import { access, constants, copyFile, mkdir, rename, rm, rmdir, unlink } from 'fs/promises';
import _glob from 'glob';
import { basename, dirname, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { Low } from 'lowdb'
// @ts-ignore
import { JSONFile } from 'lowdb/node'
import 'zx/globals'

const glob = promisify(_glob);

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const isProd = await access('/etc/nginx', constants.F_OK).then(o => true).catch(o => false);

const __www = isProd ? '/var/www/nginx' : resolve(__dirname, 'test/var/www');
const __nginx = isProd ? '/etc/nginx' : resolve(__dirname, 'test/nginx');
const __config = resolve(__dirname, '..', 'nginx');
const __data = resolve(__dirname, 'data');
const __temp = resolve(__dirname, 'temp');
await mkdir(__nginx, { recursive: true });
await mkdir(__data, { recursive: true });
await mkdir(__temp, { recursive: true });


// Database
type File = {
    config: string
    nginx: string
    temp: string
}

const db = new Low<{
    files?: File[]
    temp?: File[]
}>(new JSONFile(resolve(__data, 'nginx.json')));
await db.read();
db.data ||= {

}


async function getFiles() {
    const found = await glob(`${__config}/**/*`, {
        nodir: true,
    });
    const files: File[] = [];
    for (const file of found) {
        let __relative = relative(__config, file);
        const isWWW = __relative.startsWith('www');
        if (isWWW) __relative = relative('www', __relative);
        const __dest = resolve(isWWW ? __www : __nginx, __relative);
        const __tmp = resolve(__temp, isWWW ? 'www' : 'nginx', __relative);
        // await mkdir(dirname(__tmp), { recursive: true })
        // console.log({ file, relative: __relative, dest: __dest, temp: __tmp })
        files.push({
            config: file,
            nginx: __dest,
            temp: __tmp,
        })
    }
    return files;
}


/** Migrate to the new configuration */
async function migrate() {

    // Clean the temp directory
    try {
        await rm(resolve(__temp, 'nginx'), { recursive: true, force: true })
    } catch (err) { console.error(err) }

    // Copy over the previous files, if present
    if (db.data?.files) {
        try {
            for (const file of db.data.files) {
                await mkdir(dirname(file.temp), { recursive: true });
                await rename(file.nginx, file.temp);
            }
        } catch (err) { console.error(err) }
        db.data.temp = db.data.files;
    }

    // Copy over our new configuration
    const files = await getFiles();
    db.data!.files = files;

    for (const file of files) {
        await mkdir(dirname(file.nginx), { recursive: true });
        await copyFile(file.config, file.nginx);
    }

    if (isProd) await $`chmod 755 -R ${__www}`;

    // Test NGINX
    if (isProd) await $`nginx -t`;
    // if (!isProd) { // intentional error for validation testing
    //     await new Promise((resolve, reject) => setTimeout(() => reject('oof'), 2000))
    // }

    return files;
}

/** Revert to the previous configuration */
async function revert() {
    if (db.data?.files) {
        try {
            for (const file of db.data.files) {
                await unlink(file.nginx);
            }
        } catch (err) {
            console.error(err);
        }
    }
    if (db.data?.temp) {
        db.data.files = db.data.temp;
        try {
            for (const file of db.data.files) {
                await rename(file.temp, file.nginx);
            }
        } catch (err) {
            console.error(err);
        }
    }
}



migrate()
    .then(async () => {
        if (isProd) await $`service nginx reload`;
        console.log('nginx reloaded');
        await db.write();
        console.log('nginx migration successful');
    })
    .catch(async (err) => {
        console.error('nginx migration failed');
        console.error(err);
        await revert();
        process.exit(1);
    })



// console.log(await getFiles());
// await db.write();

