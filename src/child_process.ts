import { exec as _exec, spawn as _spawn } from 'child_process';
import * as util from 'util';

export let exec = util.promisify(_exec);

export function spawn(options: {
  cmd: string;
  args?: string[];
  on_stdout?: (chunk: any) => void;
  on_stderr?: (chunk: any) => void;
  on_error?: (error: any) => void;
}) {
  let { cmd, args } = options;
  if (!args) {
    args = cmd.split(' ');
    cmd = args.shift()!;
  }
  return new Promise((resolve, reject) => {
    const child = _spawn(cmd, args);
    child.stdout.setEncoding('utf8');
    child.stdout.on(
      'data',
      options.on_stdout || (data => process.stdout.write(data.toString())),
    );
    child.stderr.setEncoding('utf8');
    child.stderr.on(
      'data',
      options.on_stderr || (data => process.stderr.write(data.toString())),
    );
    child.on('error', err => {
      if (options.on_error) {
        options.on_error(err);
      } else {
        console.error(err);
        process.exit(1);
      }
    });
    child.on('close', code => {
      if (code) {
        reject(code);
      } else {
        resolve(code);
      }
    });
  });
}
