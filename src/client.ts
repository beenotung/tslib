/**
 * Created by beenotung on 12/31/16.
 */
export function localLang (): string {
  return navigator.language.split("-")[0];
}
