import * as lib from '../../src/index';
import { setWindowProp } from '../../src';
import { Stream } from 'stream';

setWindowProp('lib', lib);

setWindowProp('Stream', Stream);
