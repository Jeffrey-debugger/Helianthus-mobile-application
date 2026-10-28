import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/src', { recursive: true });
await cp('index.html', 'dist/index.html');
await cp('src/index.css', 'dist/src/index.css');
await cp('src/app.js', 'dist/src/app.js');
console.log('Built dependency-free dashboard in dist/');
