import {isNumber} from "./lang";
import {enum_only_string} from "./enum";

export function to_semver(s: string): number[] {
  const res = s.split(".").map(x => +x);
  if (res.length !== 3 || res.find(x => !isNumber(x))) {
    throw new TypeError("input is not a valid semver string");
  }
  return res;
}

export function is_semver(s: string): boolean {
  try {
    return to_semver(s).length === 3;
  } catch (e) {
    return false;
  }
}

export function is_newer(base: number[], compare: number[]) {
  return compare[0] > base[0]
    || compare[0] == base[0] && (compare[1] > base[1]
      || compare[1] == base[1] && compare[2] > base[2]);
}

export function is_compatible(base: number[], compare: number[]) {
  return compare[0] == base[0] && (compare[1] == base[1] && compare[2] >= base[2] || compare[1] > base[1]);
}

export enum SemverDiffType {
  breaking, compatible, same, newer
}

enum_only_string(SemverDiffType);

export function getSemverDiffType(base: number[], compare: number[]): SemverDiffType {
  return base.join(".") === compare.join(".") ? SemverDiffType.same
    : is_newer(base, compare) ? SemverDiffType.newer
      : is_compatible(base, compare) ? SemverDiffType.compatible
        : SemverDiffType.breaking;
}
