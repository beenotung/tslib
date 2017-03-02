/**
 * Created by beenotung on 3/2/17.
 */
export function str_contains(pattern: string, target: string, ignore_case = false): boolean {
  if (ignore_case)
    return str_contains(pattern.toLowerCase(), target.toLowerCase());
  return target.indexOf(pattern) != -1;
}
