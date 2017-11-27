import {prop, setProp} from "./functional";

export function setWindowProp(key: string, value: any) {
  setProp(value, key, window);
}

export function getWindownProp(key: string) {
  prop(key, window);
}
