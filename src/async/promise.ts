export async function promisify<A>(
  f: (...args: any[]) => any,
  args: any[] = [],
): Promise<A> {
  return new Promise<A>((resolve, reject) => {
    f(...args, (err: any, res: A) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export interface PromiseCallback<A> {
  (err: any, res: A): any

  promise: Promise<A>
}

export function genPromiseCallback<A>(): PromiseCallback<A> {
  let resolve: (a: A) => void
  let reject: (e: any) => void
  const p = new Promise<A>((res, rej) => {
    resolve = res
    reject = rej
  })
  const cb = (err: any, res: A) => {
    if (err) {
      reject(err)
    } else {
      resolve(res)
    }
  }
  return Object.assign(cb, { promise: p })
}

export async function runFinally<A>(p: Promise<A>, cb: () => void): Promise<A> {
  try {
    return await p
  } catch (e) {
    return Promise.reject(e)
  } finally {
    cb()
  }
}

/**
 * @description only supported in NodeJS runtime, will throw error in browser runtime
 */
export function getPromiseState(
  p: Promise<unknown>,
): 'pending' | 'fulfilled' | 'rejected' {
  if (typeof require === 'undefined') {
    throw new Error('only supported in NodeJS runtime')
  }
  const util = require('util')
  // Promise { <pending> }
  // Promise { 'the value' }
  // Promise { <rejected> 'the reason' }
  let text = util.inspect(p)
  if (!(text.startsWith('Promise {') && text.endsWith(' }'))) {
    throw new Error('not a promise')
  }
  text = text.slice('Promise {'.length, -' }'.length).trim()
  if (text === '<pending>') {
    return 'pending'
  }
  if (text.startsWith('<rejected>')) {
    return 'rejected'
  }
  return 'fulfilled'
}
