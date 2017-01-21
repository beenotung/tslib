/**
 * Created by beenotung on 1/21/17.
 */
export function is_uuid(s: string): boolean {
  let ss = s.split('-');
  return ss.length === 5
    && ss[0].length === 8
    && ss[1].length === 4
    && ss[2].length === 4
    && ss[3].length === 4
    && ss[4].length === 12
    ;
}
