import {createDefer} from "./async";

/**
 * reference : https://stackoverflow.com/questions/20958078/resize-a-base-64-image-in-javascript-without-using-canvas
 * */
export function imageToBase64(img: HTMLImageElement, width: number, height: number): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL();
}

export async function resizeBase64Image(data: string, targetWidth: number, targetHeight: number): Promise<string> {
  const defer = createDefer<string, any>();
  const image = new Image;
  image.onload = () => {
    defer.resolve(imageToBase64(image, targetWidth, targetHeight));
  };
  image.src = data;
  return defer.promise;
}
