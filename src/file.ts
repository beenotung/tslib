import {createDefer, Defer} from './async';
import {mapI} from './lang';

export type BlobType = 'image/png' | string;

function createAsyncFileReader<A>(): [Defer<A, any>, FileReader] {
  const defer = createDefer<A, any>();
  const reader = new FileReader();
  reader.onload = () => defer.resolve(reader.result);
  reader.onerror = defer.reject;
  return [defer, reader];
}

export async function fileToBase64String(file: File): Promise<string> {
  const [defer, reader] = createAsyncFileReader<string>();
  reader.readAsDataURL(file);
  return defer.promise;
}

export async function fileToBinaryString(file: File): Promise<string> {
  const [defer, reader] = createAsyncFileReader<string>();
  reader.readAsBinaryString(file);
  return defer.promise;
}

export async function fileToArray(file: File): Promise<number[]> {
  const s = await(fileToBinaryString(file));
  return mapI(i => s.charCodeAt(i), s.length);
}

export async function fileToArrayBuffer(file: File) {
  const [defer, reader] = createAsyncFileReader();
  reader.readAsArrayBuffer(file);
  return defer.promise.then(res => {
    debugger;
    window['reader'] = reader;
    window['res'] = res;
    return res;
  });
}
