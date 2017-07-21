import {createDefer, Defer} from "./async";
import {mapI} from "./lang";

export type BlobType = "image/png" | string;

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
    window["reader"] = reader;
    window["res"] = res;
    return res;
  });
}

/* reference: https://ausdemmaschinenraum.wordpress.com/2012/12/06/how-to-save-a-file-from-a-url-with-javascript/ */
export async function saveFile(url: string, filename?: string) {
  const defer = createDefer();
  if (!filename) {
    // Get file name from url.
    filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
  }
  const xhr = new XMLHttpRequest();
  xhr.responseType = "blob";
  xhr.onload = function () {
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
    a.download = filename; // Set the file name.
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    defer.resolve(true);
  };
  xhr.onerror = e => defer.resolve(e);
  xhr.open("GET", url);
  xhr.send();
  return defer.promise;
}
