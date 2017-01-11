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

  function genVs(n: number, offset = 1) {
    if (n < offset)
      return '';
    let vs = 't' + offset + ': T' + offset;
    for (let i = offset + 1; i <= n; i++) {
      vs += ', t' + i + ': T' + i;
    }
    return vs;
  }

  function genF(n: number) {
    let ts = genTs(n);
    let vs = genVs(n);
    out(`export type F${n}<${ts},R> = (${vs}) => R;`)
  }

  function genCurryF(n: number) {
    let ts = genTs(n);
    let name = `CurryF${n}`;
    out(`export interface ${name}<${ts},R> extends Function {`);
    out(`  apply(thisArg:any, argArray:[${ts}]):R;`);
    for (let i = 0; i <= n; i++) {
      let vs = genVs(i);
      if (i < n) {
        let tsr = genTs(n, i + 1) + ',R';
        out(`  (${vs}):CurryF${n - i}<${tsr}>;`);
      } else {
        out(`  (${vs}):R;`);
      }
    }
    out(`}`);
  }

  function genCurry(n: number) {
    let ts = genTs(n);
    let t = `<${ts},R>`;
    out(`declare function curry${t}(f${n}:F${n}${t}):CurryF${n}${t};`);
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
  out();
  out('/* curry() annotation */');
  for (let i = 1; i <= deep; i++) {
    genCurry(i);
  }
  console.log(ss.join(''));
}
/** increase the number when needed */
gen(12);
