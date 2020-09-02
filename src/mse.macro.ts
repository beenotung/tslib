function body(body: string) {
  return `let acc = 0
  for (let i = 0; i < n; i++) {
    ${body}
    acc += e * e
  }
  return acc / n`
}

`/**
 * calculate mean square error
 * */

export function mse_2arr(inputs: number[], outputs: number[]): number {
  if (inputs.length !== outputs.length) {
    throw new Error('length mismatch')
  }
  const n = inputs.length
  ${body(`const e = inputs[i] - outputs[i]`)}
}

export function mse_2d(input_outputs: Array<[number, number]>): number {
  const n = input_outputs.length
  ${body(`const input_output = input_outputs[i]
    const e = input_output[0] - input_output[1]`)}
}

export function mse_object<T>(
  data: Array<Record<keyof T, number>>,
  options: { input: keyof T; output: keyof T },
): number {
  const { input, output } = options
  const n = data.length
  ${body(`const o = data[i]
    const e = o[input] - o[output]`)}
}

export function mse_by<T>(
  data: T[],
  options: {
    input: (t: T) => number
    output: (t: T) => number
  },
): number {
  const { input, output } = options
  const n = data.length
  ${body(`const o = data[i]
    const e = input(o) - output(o)`)}
}
`
