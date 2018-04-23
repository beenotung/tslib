/**
 * without +852 prefix
 * */
import {isNumber} from "./lang";
import {string_to_chars} from "./string";

export function is_hk_mobile_phone(x: number | string): boolean {
  if (!x) {
    return false;
  }
  const s = x.toString();
  return s.length === 8
    && (s[0] === "6"
      || s[0] === "9"
      || s[0] === "5"
    )
    ;
}

/**
 * very forgiving
 *
 * @return +852xxxxyyyy if valid
 *         empty string if not valid
 * */
export function to_full_hk_mobile_phone(s: string | number): string {
  if (typeof s === "number") {
    s = s.toString();
  }
  s = string_to_chars(s)
    .filter(x => isNumber(x))
    .join("");
  if (s.length == 8 && is_hk_mobile_phone(s)) {
    return "+852" + s;
  }
  if (s.length == (8 + 3) && s.startsWith("852") && is_hk_mobile_phone((+s) - 85200000000)) {
    return "+" + s;
  }
  return "";
}
