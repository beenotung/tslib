import { enum_only_string } from './enum';

/**
 * reference : https://stackoverflow.com/questions/20958078/resize-a-base-64-image-in-javascript-without-using-canvas
 * */
export function imageToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    throw new Error('unsupported');
  }
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

export function imageToBase64(
  img: HTMLImageElement,
  width: number,
  height: number,
): string {
  return imageToCanvas(img, width, height).toDataURL();
}

export async function base64ToImage(data: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = e => reject(e);
    image.src = data;
  });
}

/**
 * TODO check if there are exceptions
 * */
export function checkBase64ImagePrefix(s: string): string {
  return typeof s === 'string' && s.startsWith('/9j/')
    ? 'data:image/jpeg;base64,' + s
    : s;
}

/**
 * data type conversion
 * also work for resizing
 * FIXME wrap width and height into options object
 * */
export async function base64ToCanvas(
  data: string,
  width?: number,
  height?: number,
): Promise<HTMLCanvasElement> {
  const image = await base64ToImage(data);
  let w: number;
  let h: number;
  if (width && height) {
    w = width;
    h = height;
  } else if (!width && !height) {
    w = image.naturalWidth;
    h = image.naturalHeight;
  } else if (width) {
    // height is not defined
    w = width;
    h = (image.naturalHeight / image.naturalWidth) * width;
  } else if (height) {
    // width is not defined
    w = (image.naturalWidth / image.naturalHeight) * height;
    h = height;
  } else {
    throw new Error(
      'logic error, missing edge case:' + JSON.stringify({ width, height }),
    );
  }
  return imageToCanvas(image, w, h);
}

export async function resizeBase64Image(
  data: string,
  targetWidth: number,
  targetHeight: number,
): Promise<string> {
  return (await base64ToCanvas(data, targetWidth, targetHeight)).toDataURL();
}

export interface ISize {
  width: number;
  height: number;
}

export async function getWidthHeightFromBase64(data: string): Promise<ISize> {
  const image = await base64ToImage(data);
  return {
    width: image.naturalWidth,
    height: image.naturalHeight,
  };
}

export enum ResizeType {
  /* with-in the given area, maybe smaller  */
  with_in,
  /* at least as large as the given area, maybe larger */
  at_least,
}

enum_only_string(ResizeType);

export function resizeWithRatio(
  oriSize: ISize,
  targetSize: ISize,
  mode: ResizeType,
): ISize {
  const widthRate = targetSize.width / oriSize.width;
  const heightRate = targetSize.height / oriSize.height;
  let rate: number;
  switch (mode) {
    case ResizeType.with_in:
      rate = Math.min(widthRate, heightRate);
      break;
    case ResizeType.at_least:
      rate = Math.max(widthRate, heightRate);
      break;
    default:
      throw new TypeError(`unsupported type: ${mode}`);
  }
  return {
    width: oriSize.width * rate,
    height: oriSize.height * rate,
  };
}

export async function resizeBase64WithRatio(
  data: string,
  preferredSize: ISize,
  mode: ResizeType,
): Promise<string> {
  const image = await base64ToImage(data);
  const targetSize = resizeWithRatio(
    {
      width: image.naturalWidth,
      height: image.naturalHeight,
    },
    preferredSize,
    mode,
  );
  return imageToBase64(image, targetSize.width, targetSize.height);
}

// reference: image-file-to-base64-exif

function getNewScale(
  image: { width: number; height: number },
  maxWidth: number,
  maxHeight: number,
) {
  if (image.width <= maxWidth && image.height <= maxHeight) {
    return 1;
  }
  if (image.width > image.height) {
    return image.width / maxWidth;
  } else {
    return image.height / maxHeight;
  }
}

export function resizeImage(
  image: HTMLImageElement,
  maxWidth = image.width,
  maxHeight = image.height,
  mimeType?: string,
  quality?: number,
) {
  const scale = getNewScale(image, maxWidth, maxHeight);
  const scaledWidth = image.width / scale;
  const scaledHeight = image.height / scale;
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.width = scaledWidth;
  canvas.height = scaledHeight;
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('not supported');
  }
  context.drawImage(image, 0, 0, scaledWidth, scaledHeight);
  if (mimeType) {
    return canvas.toDataURL(mimeType, quality || 1);
  } else {
    return canvas.toDataURL();
  }
}

export type base64 = string;

export function transformCentered(
  image: HTMLImageElement,
  flipXY: boolean,
  f: (ctx: CanvasRenderingContext2D) => void,
) {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.width = flipXY ? image.height : image.width;
  canvas.height = flipXY ? image.width : image.height;
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    throw new Error('not supported');
  }
  ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
  f(ctx);
  ctx.translate(-image.width * 0.5, -image.height * 0.5);
  ctx.drawImage(image, 0, 0);
  // return canvas.toDataURL();
  return canvas;
}

export function rotateImage(image: HTMLImageElement) {
  return transformCentered(image, true, ctx => ctx.rotate(0.5 * Math.PI));
}

export function flipImage(image: HTMLImageElement) {
  return transformCentered(image, false, ctx => ctx.scale(-1, 1));
}

/**
 * convert base64/URLEncoded data component to raw binary data held in a string
 * e.g. data:image/jpeg;base64,...
 * */
export function dataURItoBlob(dataURI: string): Blob {
  const [format, payload] = dataURI.split(',');
  const [mimeType /*, encodeType*/] = format.replace(/^data:/, '').split(';');
  let byteString: string;
  if (dataURI.startsWith('data:')) {
    byteString = atob(payload);
  } else {
    byteString = unescape(payload);
  }
  const n = byteString.length;
  const buffer = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    buffer[i] = byteString.charCodeAt(i);
  }
  return new Blob([buffer], { type: mimeType });
}

/**@deprecated use compressImageToBase64() compressImageToBlob() instead */
export function compressImage(
  image: HTMLImageElement,
  mimeType?: string,
  quality = 0.8,
): base64 {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    throw new Error('not supported');
  }
  ctx.drawImage(image, 0, 0);
  if (mimeType) {
    return canvas.toDataURL(mimeType, quality);
  }
  const png = canvas.toDataURL('image/png', quality);
  const jpeg = canvas.toDataURL('image/jpeg', quality);
  return jpeg.length < png.length ? jpeg : png;
}

function populateCompressArgs(args: {
  image: HTMLImageElement;
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  maximumSize?: number;
  quality?: number;
}): {
  image: HTMLImageElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  maximumSize?: number;
  quality?: number;
} {
  const image: HTMLImageElement = args.image;
  const canvas: HTMLCanvasElement =
    args.canvas || document.createElement('canvas');
  const ctx: CanvasRenderingContext2D =
    args.ctx ||
    canvas.getContext('2d') ||
    (() => {
      throw new Error('not supported');
    })();
  let maximumSize = args.maximumSize;
  let quality = args.quality;
  if (!maximumSize && !quality) {
    maximumSize = 1024 * 768; // 768KB
    quality = 0.8;
  }
  return {
    image,
    canvas,
    ctx,
    maximumSize,
    quality,
  };
}

export function compressImageToBase64(args: {
  image: HTMLImageElement;
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  mimeType?: string;
  maximumLength?: number;
  quality?: number;
}): base64 {
  const { image, canvas, ctx, maximumSize, quality } = populateCompressArgs({
    ...args,
    maximumSize: args.maximumLength,
  });
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  let mimeType: string;
  let dataURL: string;
  if (args.mimeType) {
    mimeType = args.mimeType;
    dataURL = canvas.toDataURL(mimeType, quality);
  } else {
    const png = canvas.toDataURL('image/png', quality);
    const jpeg = canvas.toDataURL('image/jpeg', quality);
    if (jpeg < png) {
      mimeType = 'image/jpeg';
      dataURL = jpeg;
    } else {
      mimeType = 'image/png';
      dataURL = png;
    }
  }
  if (!maximumSize) {
    return dataURL;
  }
  for (; dataURL.length > maximumSize; ) {
    const ratio = Math.sqrt(maximumSize / dataURL.length);
    const new_width = Math.round(canvas.width * ratio);
    const new_height = Math.round(canvas.height * ratio);
    if (new_width === canvas.width && new_height === canvas.height) {
      break;
    }
    canvas.width = new_width;
    canvas.height = new_height;
    ctx.drawImage(image, 0, 0, new_width, new_height);
    dataURL = canvas.toDataURL(mimeType, quality);
  }
  return dataURL;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType?: string,
  quality?: number,
): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject('not supported');
        }
      },
      mimeType,
      quality,
    ),
  );
}

export async function compressImageToBlob(args: {
  image: HTMLImageElement;
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  mimeType?: string;
  maximumSize?: number;
  quality?: number;
}): Promise<Blob> {
  const { image, canvas, ctx, maximumSize, quality } = populateCompressArgs(
    args,
  );
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  let mimeType: string;
  let blob: Blob;
  if (args.mimeType) {
    mimeType = args.mimeType;
    blob = await canvasToBlob(canvas, mimeType, quality);
  } else {
    const [png, jpeg] = await Promise.all([
      canvasToBlob(canvas, 'image/png', quality),
      canvasToBlob(canvas, 'image/jpeg', quality),
    ]);
    if (jpeg.size < png.size) {
      mimeType = 'image/jpeg';
      blob = jpeg;
    } else {
      mimeType = 'image/png';
      blob = png;
    }
  }
  if (!maximumSize) {
    return blob;
  }
  for (; blob.size > maximumSize; ) {
    const ratio = Math.sqrt(maximumSize / blob.size);
    const new_width = Math.round(canvas.width * ratio);
    const new_height = Math.round(canvas.height * ratio);
    if (new_width === canvas.width && new_height === canvas.height) {
      break;
    }
    canvas.width = new_width;
    canvas.height = new_height;
    ctx.drawImage(image, 0, 0, new_width, new_height);
    blob = await canvasToBlob(canvas, mimeType, quality);
  }
  return blob;
}
