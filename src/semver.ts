import {isNumber} from './lang';

export function to_semver(s: string): number[] {
  const res = s.split('.').map(x => +x);
  if (res.length !== 3 || res.find(x => !isNumber(x))) {
    throw new TypeError('input is not a valid semver string');
  }
  return res;
}

export function is_newer(base: number[], compare: number[]) {
  return compare[0] > base[0]
    || compare[0] == base[0] && (compare[1] > base[1]
      || compare[1] == base[1] && compare[2] > base[2]);
}
