import { exec as _exec } from 'child_process';
import * as util from 'util';

export let exec = util.promisify(_exec);
