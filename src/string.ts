import {forI} from "./lang";
export function str_contains(pattern: string, target: string, ignore_case = false): boolean {
  if (ignore_case)
    return str_contains(pattern.toLowerCase(), target.toLowerCase());
  return target.indexOf(pattern) != -1;
}

/**
 * example : 'change the words' ~> 'Change The Words'
 * */
export function strToCapWords(s: string): string {
  let res = '';
  let lastSpace = true;
  forI(i => {
    if (s[i] == ' ') {
      lastSpace = true;
      res += ' ';
    } else {
      if (lastSpace) {
        res += s[i].toUpperCase();
        lastSpace = false;
      } else {
        res += s[i];
      }
    }
  }, s.length);
  return res;
}
export function string_to_chars(s: string): string[] {
  let res: string[] = [];
  forI(i => res.push(s[i]), s.length);
  return res;
}
