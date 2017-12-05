import * as arraybufferToBuffer from "arraybuffer-to-buffer";

export async function blobToBuffer(blob: Blob): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(arraybufferToBuffer(reader.result));
    reader.onerror = e => reject(e);
    reader.readAsArrayBuffer(blob);
  });
}

export function blobToText(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = e => reject(e);
    reader.readAsText(blob);
  });
}
