import {setProp} from "./functional";

export function setWindowProp(key: string, value: any) {
  setProp(value, key, window);
}
