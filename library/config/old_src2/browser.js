

const projectConfig = {};

try {
    const nextConfig = require('next/config');
    console.log('got nextjs config', { nextConfig })
} catch(err) {
    console.log('browser config nextjs error', err);
}

module.exports = projectConfig;