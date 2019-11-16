function body(body: string) {
  return `let acc = 0;
  for (let i = 0; i < n; i++) {
    ${body}
    acc += e * e;
  }
  return acc / n;`;
}

`
/**
 * calculate mean square error
 * */

export function mse_2arr(inputs: number[], outputs: number[]): number {
  if (inputs.length !== outputs.length) {
    throw new Error('length mismatch');
  }
  let n = inputs.length;
  ${body(`let e = inputs[i] - outputs[i];`)}
}

export function mse_2d(input_outputs: Array<[number, number]>): number {
  let n = input_outputs.length;
  ${body(`let input_output = input_outputs[i];
    let e = input_output[0] - input_output[1];`)}
}

export function mse_object<T>(data: Array<Record<keyof T, number>>, options: { input: keyof T, output: keyof T }): number {
  let { input, output } = options;
  let n = data.length;
  ${body(`let o = data[i];
    let e = o[input] - o[output];`)}
}

export function mse_by<T>(data: T[], options: {
  input: (t: T) => number
  output: (t: T) => number
}): number {
  let { input, output } = options;
  let n = data.length;
  ${body(`let o = data[i];
    let e = input(o) - output(o);`)}
}
`.trim();
