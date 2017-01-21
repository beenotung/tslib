/**
 * inplace delete all element from the array
 * @return old elements
 * */
export function clear<A>(xs: A[]): A[] {
  return xs.splice(0, xs.length);
}

export function includes<A>(x: A, xs: A[]): boolean {
  return xs.indexOf(x) !== -1;
}

/**
 * only use `===` to compare
 * @warning slow
 * @return new array
 * */
export function unique<A>(xs: A[]): A[] {
  let res: A[] = [];
  xs.forEach(x => {
    if (!includes(x, res))
      res.push(x);
  });
  return res;
}
