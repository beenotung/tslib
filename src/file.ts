import {createDefer} from './async';
/**
 * Created by beenotung on 5/26/17.
 */
export async function fileToBase64(file: File): Promise<string> {
  file.size;
  const defer = createDefer<string, any>();
  const reader = new FileReader();
  reader.onload = () => defer.resolve(reader.result);
  reader.onerror = defer.reject;
  reader.readAsDataURL(file);
  return defer.promise;
}
export type BlobType = 'image/png' | string;
