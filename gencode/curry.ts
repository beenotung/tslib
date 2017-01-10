function gen(deep: number) {
  let ss = [];

  function out(...args: string[]) {
    ss = ss.concat(...args, '\n');
  }

  function genTs(n: number, offset = 1) {
    if (n < offset)
      return '';
    let ts = 'T' + offset;
    for (let i = offset + 1; i <= n; i++) {
      ts += ',T' + i;
    }
    return ts;
  }

  function genF(n: number) {
    let ts = genTs(n);
    let vs = 't1: T1';
    for (let i = 2; i <= n; i++) {
      vs += ', t' + i + ': T' + i;
    }
    out(`export type F${n}<${ts},R> = (${vs}) => R;`)
  }

  function genCurryF(n: number) {
    let ts = genTs(n);
    let name = `CurryF${n}`;
    out(`export type ${name}<${ts},R> =`);
    out(`  () => ${name}<${ts},R>`);
    for (let i = 1; i < n; i++) {
      let tsH = genTs(i);
      let tsT = genTs(n, i + 1);
      out(`    | F${i}<${tsH},CurryF${n - i}<${tsT}, R>>`);
    }
    out(`    | F${n}<${ts},R>`);
    out(`  ;`)
  }

  out('/* F<N> */');
  for (let i = 1; i <= deep; i++) {
    genF(i);
  }
  out();
  out('/* CurryF<> */');
  for (let i = 1; i <= deep; i++) {
    genCurryF(i);
  }
  console.log(ss.join(''));
}
/** increase the number when needed */
gen(12);
