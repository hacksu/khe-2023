import 'zx/globals';

await $`esbuild src/compile.tsx --bundle --format=cjs --platform=node --outfile=dist/compile.js`;
await $`esbuild src/render.tsx --bundle --format=cjs --platform=node --outfile=dist/render.js`;
// await $`esbuild src/index.tsx --bundle --format=cjs --outfile=dist/index.js`;

