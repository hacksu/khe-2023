
const MAP_ID = 568;
const MAP_URL = `https://map.concept3d.com/?id=568#!ct/5500?s/`;

export namespace campusMap {

    let _key;
    const MATCH_VERSION_REGEX = /app\.js.{0,20}v=([.\d]+)/;
    const MATCH_KEY_REGEX = /api\.concept3d\.com\/['"].{1,20}=['"]([a-z0-9]+)['"]/;
    async function getKey() {
        if (_key) return _key;
        const page = await (await fetch(`https://map.concept3d.com/?id=${MAP_ID}`)).text();
        const version = MATCH_VERSION_REGEX.exec(page)?.[1];
        if (!version) throw new Error(`Campus Map: Unable to fetch version!`);
        const code = await (await fetch(`https://map.concept3d.com/js/app.js?v=${version}`)).text();
        const key = MATCH_KEY_REGEX.exec(code)?.[1];
        if (!key) throw new Error(`Campus Map: Unable to fetch map key!`);
        return _key = key;
    }
    // const MATCH_KEY_REGEX = /id=['"]map-css['"].+href=['"].+key=([a-z0-9]+)['"]/;
    
    export async function getLocation(name: string) {
        const key = await getKey();
        const results = await (await fetch(`https://api.concept3d.com/search?map=${MAP_ID}&q=${name}&page=1&ppage=10&key=${key}`)).text();
        
        console.log('campus map', { key })
    }
}

