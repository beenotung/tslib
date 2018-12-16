import { forI } from './lang';
import { setMinus, setToArray } from './set';

export function str_contains(
  pattern: string,
  target: string,
  ignore_case = false,
): boolean {
  if (ignore_case) {
    return str_contains(pattern.toLowerCase(), target.toLowerCase());
  }
  return target.indexOf(pattern) !== -1;
}

export function str_contains_any(patterns: string[], target: string, ignore_case = false): boolean {
  return patterns.some(p => str_contains(p, target, ignore_case));
}

/**
 * example : 'change the words' ~> 'Change The Words'
 * */
export function strToCapWords(s: string): string {
  let res = '';
  let lastSpace = true;
  forI(i => {
    if (s[i] === ' ') {
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
  const res: string[] = [];
  forI(i => res.push(s[i]), s.length);
  return res;
}

/* source: https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript */
export function escapeRegExp(str: string): string {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

export function strReplaceAll(
  str: string,
  find: string,
  replace: string,
): string {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export function string_nbyte(s: string): number {
  return encodeURI(s).split(/%..|./).length - 1;
}

export function str_like(a: string, b: string, ignore_case = true) {
  if (ignore_case) {
    return str_like(a.toUpperCase(), b.toUpperCase(), false);
  } else {
    return a.includes(b) || b.includes(a);
  }
}

export function is_non_empty_string(s: string): boolean {
  return typeof s === 'string' && s !== '';
}

export function str_dos2unix(s: string): string {
  return strReplaceAll(s, '\r\n', '\n');
}

export function str_unix2dos(s: string): string {
  return strReplaceAll(s, '\n', '\r\n');
}

export function str_minus(a: string, b: string): string {
  return setToArray(setMinus(new Set(a), new Set(b))).join('');
}
