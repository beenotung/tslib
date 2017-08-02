import {createDefer} from "./async";
import {xor} from "./logic";

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
  const image = new Image;
  image.onload = () => {
    defer.resolve(image);
  };
  image.src = data;
  return defer.promise;
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
