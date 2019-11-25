import { createFSPool } from '../src/concurrent-fs';
import { catchMain } from '../src/node';
import * as path from 'path';

const { scanRecursively } = createFSPool(20);
// let separator = ' | ';
let start = Date.now();
let dir = 0;
let file = 0;
let total = 0;
let format = (x: number) => Math.round(x * 100) / 100;
let report = () => {
  let t = Date.now() - start;
  process.stdout.write(`\r dir: ${dir} (${format(dir / t)}/s) file: ${file} (${format(file / t)}/s) total: ${total} (${format(total / t)}/s)`);
};
catchMain(scanRecursively({
  // entryPath: path.join(process.env.HOME!, 'Music'),
  // entryPath: path.join(process.env.HOME!, 'workspace'),
  // entryPath: path.join('node_modules'),
  // entryPath: path.join('..'),
  entryPath: path.join(process.env.HOME!, '.npm'),
  // entryPath: path.join(process.env.HOME!, '.pnpm-store'),
  // dereferenceSymbolicLinks: true,
  dereferenceSymbolicLinks: false,
  onDir: (dirname, basename) => {
    dir++;
    total++;
    report();
    // console.log(['onDir', basename, dirname].join(separator));
  },
  onFile: (filename, basename) => {
    file++;
    total++;
    report();
    // console.log(['onFile', basename, filename].join(separator));
  },
  onComplete: () => {
    process.stdout.write('\r' + ' '.repeat(70) + '\r');
    console.log('onComplete');
  },
}));

