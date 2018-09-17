import {createDefer, Defer} from './async/defer';
import {mapI} from './lang';

/**
 * @ref https://www.iana.org/assignments/media-types/media-types.xhtml
 * */
export type BlobType = 'image/png'
  | 'image/*'
  | 'video/*'
  | 'audio/*'
  | string;

function createAsyncFileReader<A> (): [Defer<A, any>, FileReader] {
  const defer = createDefer<A, any>();
  const reader = new FileReader();
  reader.onload = () => defer.resolve(reader.result);
  reader.onerror = defer.reject;
  return [defer, reader];
}

export async function fileToBase64String (file: File): Promise<string> {
  const [defer, reader] = createAsyncFileReader<string>();
  reader.readAsDataURL(file);
  return defer.promise;
}

export async function fileToBinaryString (file: File): Promise<string> {
  const [defer, reader] = createAsyncFileReader<string>();
  reader.readAsBinaryString(file);
  return defer.promise;
}

export async function fileToArray (file: File): Promise<number[]> {
  const s = await(fileToBinaryString(file));
  return mapI((i) => s.charCodeAt(i), s.length);
}

export async function fileToArrayBuffer (file: File): Promise<ArrayBuffer> {
  const [defer, reader] = createAsyncFileReader<ArrayBuffer>();
  reader.readAsArrayBuffer(file);
  return defer.promise;
}

/* reference: https://ausdemmaschinenraum.wordpress.com/2012/12/06/how-to-save-a-file-from-a-url-with-javascript/ */
export async function saveFile (url: string, filename?: string) {
  const defer = createDefer();
  if (!filename) {
    // Get file name from url.
    filename = url.substring(url.lastIndexOf('/') + 1).split('?')[0];
  }
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function () {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
    a.download = filename; // Set the file name.
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    defer.resolve(true);
  };
  xhr.onerror = (e) => defer.resolve(e);
  xhr.open('GET', url);
  xhr.send();
  return defer.promise;
}

export interface SelectFileOptions {
  multiple?: boolean;
  accept?: BlobType;
  pattern?: string;
}

export function selectFile (options?: SelectFileOptions): Promise<File[]> {
  options = options || {};
  return new Promise<File[]>((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    Object.keys(options).forEach((x) => (input[x] = options[x]));
    input.onchange = (e) => {
      const nFile = input.files.length;
      if (nFile < 1) {
        reject();
      } else {
        const files: File[] = new Array(nFile);
        for (let i = 0; i < nFile; i++) {
          files[i] = input.files.item(i);
        }
        resolve(files);
      }
    };
    input.click();
  });
}
