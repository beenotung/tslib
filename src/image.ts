import { enum_only_string } from './enum';
import { xor } from './logic';

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
 * */
export async function base64ToCanvas(
  data: string,
  width?: number,
  height?: number,
): Promise<HTMLCanvasElement> {
  const image = await base64ToImage(data);
  if (xor(width, height)) {
    if (width) {
      /* height is not defined */
      height = (image.naturalHeight / image.naturalWidth) * width;
    } else {
      /* width is not defined */
      width = (image.naturalWidth / image.naturalHeight) * height;
    }
  } else if (!width && !height) {
    width = image.naturalWidth;
    height = image.naturalHeight;
  }
  return imageToCanvas(image, width, height);
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
  preferedSize: ISize,
  mode: ResizeType,
): Promise<string> {
  const image = await base64ToImage(data);
  const targetSize = resizeWithRatio(
    {
      width: image.naturalWidth,
      height: image.naturalHeight,
    },
    preferedSize,
    mode,
  );
  return imageToBase64(image, targetSize.width, targetSize.height);
}

// reference: image-file-to-base64-exif

function getNewScale(
  image: HTMLImageElement,
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

export function compressImage(
  image: HTMLImageElement,
  mimeType = 'image/jpeg',
  quality = 0.8,
): base64 {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  return canvas.toDataURL(mimeType, quality);
}
