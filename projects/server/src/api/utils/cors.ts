import createCORS from 'cors';


const HOST_DOMAIN = process.env.HOST_DOMAIN;

export const cors = createCORS({
    origin(requestOrigin, callback) {
        if (!HOST_DOMAIN || HOST_DOMAIN && requestOrigin?.endsWith(HOST_DOMAIN)) {
            return callback(null, true);
        }
        callback(new Error(`CORS: Denied Origin "${requestOrigin}"`));
    },
});

