/**
 * For DOM
 * */

import { createDefer, Defer } from './async/defer';
import { arrayBufferToString } from './blob';
import { mapI } from './lang';

/**
 * @ref https://www.iana.org/assignments/media-types/media-types.xhtml
 * */
export type BlobType =
  | 'image/png'
  | 'image/*'
  | 'video/*'
  | 'audio/*'
  | 'text/plain'
  | 'text/html'
  | 'text/css'
  | 'text/javascript'
  | 'text/csv'
  | 'application/json'
  | 'application/xml'
  | string;

function createAsyncFileReader(): [
  Defer<string | ArrayBuffer, any>,
  FileReader
] {
  const defer = createDefer<string | ArrayBuffer, any>();
  const reader = new FileReader();
  reader.onload = () => {
    if (reader.result === null) {
      return defer.reject('unexpected null reader.result');
    }
    return defer.resolve(reader.result);
  };
  reader.onerror = defer.reject;
  return [defer, reader];
}

export async function fileToBase64String(file: File): Promise<string> {
  const [defer, reader] = createAsyncFileReader();
  reader.readAsDataURL(file);
  return defer.promise.then(arrayBufferToString);
}

export async function fileToText(file: File): Promise<string> {
  const [defer, reader] = createAsyncFileReader();
  reader.readAsText(file);
  return defer.promise.then();
}

export function filesForEach(
  files: FileList | File[],
  f: (file: File, i: number, files: FileList | File[]) => void,
) {
  if (Array.isArray(files)) {
    files.forEach(f);
  } else {
    for (let i = 0; i < files.length; i++) {
      f(files.item(i)!, i, files);
    }
  }
}

export function filesMap<A>(
  files: FileList | File[],
  f: (file: File, i: number, files: FileList | File[]) => A,
): A[] {
  const xs: A[] = new Array(files.length);
  filesForEach(files, (file, i, files) => (xs[i] = f(file, i, files)));
  return xs;
}

export async function filesToBase64Strings(
  files: FileList | File[],
): Promise<string[]> {
  return Promise.all(filesMap(files, file => fileToBase64String(file)));
}

export async function fileToBinaryString(file: File): Promise<string> {
  const [defer, reader] = createAsyncFileReader();
  reader.readAsBinaryString(file);
  return defer.promise.then(arrayBufferToString);
}

export async function fileToArray(file: File): Promise<number[]> {
  const s = await fileToBinaryString(file);
  return mapI(i => s.charCodeAt(i), s.length);
}

export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  const [defer, reader] = createAsyncFileReader();
  reader.readAsArrayBuffer(file);
  return defer.promise.then(x => {
    if (typeof x === 'string') {
      const xs = new ArrayBuffer(x.length);
      for (let i = 0, n = x.length; i < n; i++) {
        (xs as any)[i] = x[i];
      }
      return xs;
    } else {
      return x;
    }
  });
}

// reference: https://ausdemmaschinenraum.wordpress.com/2012/12/06/how-to-save-a-file-from-a-url-with-javascript/
//
// if filename is not given, will get from url
export async function downloadFile(
  url: string,
  filename: string = url.substring(url.lastIndexOf('/') + 1).split('?')[0],
) {
  const defer = createDefer();
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
    a.download = filename; // Set the file name.
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    defer.resolve(true);
  };
  xhr.onerror = e => defer.resolve(e);
  xhr.open('GET', url);
  xhr.send();
  return defer.promise;
}

/**@deprecated*/
export let saveFile = downloadFile;

export interface SelectFileOptions {
  multiple?: boolean;
  accept?: BlobType;
  pattern?: string;
  capture?: boolean;
}

export function selectFile(options: SelectFileOptions = {}): Promise<File[]> {
  return new Promise<File[]>((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    Object.keys(options).forEach(
      x => ((input as any)[x] = (options as any)[x]),
    );
    if (options.capture) {
      (input as any).capture = true;
    }
    // document.body.appendChild(input);
    input.onchange = e => {
      if (!input.files) {
        reject();
        return;
      }
      const nFile = input.files.length;
      if (nFile < 1) {
        reject();
      } else {
        const files: File[] = new Array(nFile);
        for (let i = 0; i < nFile; i++) {
          files[i] = input.files.item(i) as File;
        }
        resolve(files);
        // document.body.removeChild(input);
      }
    };
    input.click();
  });
}

export function selectImage(options?: SelectFileOptions): Promise<File[]> {
  if (options && options.capture) {
    options.accept = options.accept || 'image/*;capture=camera';
  }
  return selectFile(options);
}

export function selectVideo(options?: SelectFileOptions): Promise<File[]> {
  if (options && options.capture) {
    options.accept = options.accept || 'image/*;capture=camcorder';
  }
  return selectFile(options);
}

export function selectAudio(options?: SelectFileOptions): Promise<File[]> {
  if (options && options.capture) {
    options.accept = options.accept || 'image/*;capture=microphone';
  }
  return selectFile(options);
}

export function saveBlobToFile(blob: Blob, filename?: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  if (filename) {
    a.download = filename;
  }
  a.href = url;
  if (document.body) {
    a.style.display = 'none';
    a.textContent = 'Download file';
    document.body.appendChild(a);
  }
  a.click();
}

export function saveStringToFile(
  s: string,
  type: BlobType = 'text/plain',
  filename?: string,
) {
  return saveBlobToFile(new Blob([s], { type }), filename);
}
