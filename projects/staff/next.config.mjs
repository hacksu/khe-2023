import withTM from 'next-transpile-modules';
import bundleAnalyzer from '@next/bundle-analyzer';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import path from 'path';

import * as dotenv from 'dotenv'
dotenv.config()

console.log('host', process.env.API_HOST);

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// @link https://github.com/belgattitude/nextjs-monorepo-example/blob/main/apps/nextjs-app/next.config.js

/** @type {import('./config').ServerRuntimeConfig} */
const serverRuntimeConfig = {
    env: process.env.NODE_ENV,
}

/** @type {import('./config').PublicRuntimeConfig} */
const publicRuntimeConfig = {
    api: process.env.API_HOST || 'localhost:5001',
    websocket: true,
    batched: true,
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    
    serverRuntimeConfig,
    publicRuntimeConfig,

    output: 'standalone',
    reactStrictMode: true,
    swcMinify: true,

    distDir: process.env.BUILD_DIR || undefined,

    typescript: {
        ignoreBuildErrors: true,
    },

    experimental: {
        scrollRestoration: true,
    },
    
}


const { dependencies, devDependencies } = JSON.parse(readFileSync(__dirname + '/package.json', 'utf8'));
const withDependencies = Object.entries({ ...dependencies, ...devDependencies })
    .filter(([name, version]) => name.startsWith('@kenthackenough') || version === '*')
    .map(([name]) => name);

const withModules = [
    ...withDependencies,
];


const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: false,
})

export default withBundleAnalyzer(
    (withModules.length === 0)
        ? nextConfig
        : withTM(withModules, {
            resolveSymlinks: true
        })(nextConfig)
);
