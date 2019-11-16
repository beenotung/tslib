/**
 * calculate mean square error
 * */

export function mse_2arr(inputs: number[], outputs: number[]): number {
  if (inputs.length !== outputs.length) {
    throw new Error('length mismatch');
  }
  const n = inputs.length;
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const e = inputs[i] - outputs[i];
    acc += e * e;
  }
  return acc / n;
}

export function mse_2d(input_outputs: Array<[number, number]>): number {
  const n = input_outputs.length;
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const input_output = input_outputs[i];
    const e = input_output[0] - input_output[1];
    acc += e * e;
  }
  return acc / n;
}

export function mse_object<T>(
  data: Array<Record<keyof T, number>>,
  options: { input: keyof T; output: keyof T },
): number {
  const { input, output } = options;
  const n = data.length;
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const o = data[i];
    const e = o[input] - o[output];
    acc += e * e;
  }
  return acc / n;
}

export function mse_by<T>(
  data: T[],
  options: {
    input: (t: T) => number;
    output: (t: T) => number;
  },
): number {
  const { input, output } = options;
  const n = data.length;
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const o = data[i];
    const e = input(o) - output(o);
    acc += e * e;
  }
  return acc / n;
}
