export async function waitFor<A>(
  predictor: () => boolean | any,
  producer: () => A,
  interval = 0,
): Promise<A> {
  return new Promise<A>(resolve => {
    const check = () => {
      if (predictor()) {
        resolve(producer())
      } else {
        setTimeout(check, interval)
      }
    }
    check()
  })
}

export function wait<A>(
  args:
    | {
        for: () => A
        interval?: number
      }
    | {
        when: () => boolean | any
        then: () => A
        interval?: number
      },
): Promise<A> {
  return new Promise<A>(resolve => {
    const check =
      'for' in args
        ? () => {
            const result = args.for()
            if (result) {
              resolve(result)
              return
            }
            setTimeout(check, args.interval)
          }
        : () => {
            const ready = args.when()
            if (ready) {
              resolve(args.then())
              return
            }
            setTimeout(check, args.interval)
          }
    check()
  })
}

export async function later(ms?: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** @alias `later(ms?)` */
export const sleep = later

export async function runLater<A>(f: () => A, ms?: number): Promise<A> {
  return new Promise<A>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(f())
      } catch (e) {
        reject(e)
      }
    }, ms)
  })
}
