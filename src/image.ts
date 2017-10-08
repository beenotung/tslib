import {createDefer} from "./async";
import {xor} from "./logic";
import {enum_only_string} from "./enum";

/**
 * reference : https://stackoverflow.com/questions/20958078/resize-a-base-64-image-in-javascript-without-using-canvas
 * */
export function imageToCanvas(img: HTMLImageElement, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

export function imageToBase64(img: HTMLImageElement, width: number, height: number): string {
  return imageToCanvas(img, width, height).toDataURL();
}

export async function base64ToImage(data: string): Promise<HTMLImageElement> {
  const defer = createDefer<HTMLImageElement, any>();
  const image = new Image();
  image.onload = () => {
    defer.resolve(image);
  };
  image.src = data;
  return defer.promise;
}

/**
 * TODO check if there are exceptions
 * */
export function checkBase64ImagePrefix(s: string): string {
  return typeof s === "string" && s.startsWith("/9j/")
    ? "data:image/jpeg;base64," + s
    : s;
}

/**
 * data type conversion
 * also work for resizing
 * */
export async function base64ToCanvas(data: string, width?: number, height?: number): Promise<HTMLCanvasElement> {
  const image = await base64ToImage(data);
  if (xor(width, height)) {
    if (width) {
      /* height is not defined */
      height = image.naturalHeight / image.naturalWidth * width;
    } else {
      /* width is not defined */
      width = image.naturalWidth / image.naturalHeight * height;
    }
  } else if (!width && !height) {
    width = image.naturalWidth;
    height = image.naturalHeight;
  }
  return imageToCanvas(image, width, height);
}

export async function resizeBase64Image(data: string, targetWidth: number, targetHeight: number): Promise<string> {
  return (await base64ToCanvas(data, targetWidth, targetHeight)).toDataURL();
}

export interface ISize {
  width: number
  height: number
}

export async function getWidthHeightFromBase64(data: string): Promise<ISize> {
  const image = await base64ToImage(data);
  return {
    width: image.naturalWidth
    , height: image.naturalHeight
  };
}

export enum ResizeType {
  /* with-in the given area, maybe smaller  */
  with_in
    /* at least as large as the given area, maybe larger */
    , at_least
}

enum_only_string(ResizeType);

export function resizeWithRatio(oriSize: ISize, targetSize: ISize, mode: ResizeType): ISize {
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
    width: oriSize.width * rate
    , height: oriSize.height * rate
  };
}

export async function resizeBase64WithRatio(data: string, preferedSize: ISize, mode: ResizeType): Promise<string> {
  const image = await base64ToImage(data);
  const targetSize = resizeWithRatio({
    width: image.naturalWidth
    , height: image.naturalHeight
  }, preferedSize, mode);
  return imageToBase64(image, targetSize.width, targetSize.height);
}
