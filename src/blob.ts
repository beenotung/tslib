export async function blobToBuffer(blob: Blob): Promise<Uint8Array> {
  // tslint:disable:no-var-requires
  const arrayBufferToBuffer = require('arraybuffer-to-buffer');
  // tslint:enable:no-var-requires
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(arrayBufferToBuffer(reader.result));
    reader.onerror = e => reject(e);
    reader.readAsArrayBuffer(blob);
  });
}

export function blobToText(blob: Blob): Promise<string | ArrayBuffer> {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result === null) {
        return reject('unexpected null reader.result');
      }
      return resolve(reader.result);
    };
    reader.onerror = e => reject(e);
    reader.readAsText(blob);
  });
}

export function blobToString(blob: Blob): Promise<string> {
  return blobToText(blob).then(x =>
    typeof x === 'string' ? x : arrayBufferToString(x),
  );
}

export function arrayBufferToString(
  array: ArrayBuffer | string,
  encode?: string,
): string {
  if (typeof array === 'string') {
    return array;
  }
  return new TextDecoder(encode).decode(array);
}
