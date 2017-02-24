/**
 * For ng2-chart
 */

export type NgChartColor = {
  backgroundColor: string,
  borderColor: string,
  pointBackgroundColor: string,
  pointBorderColor: string,
  pointHoverBackgroundColor: string,
  pointHoverBorderColor: string
}
/**
 * @param r : number [0..255]
 * @param g : number [0..255]
 * @param b : number [0..255]
 * @param a [Optional] : number [0..255]
 * */
export function mkChartColor(r: number, g: number, b: number, a: number = 0): NgChartColor {
  let rgb = r + ',' + g + ',' + b;
  let rgba = rgb + ',' + a;
  return {
    backgroundColor: `rgba(${rgba})`,
    borderColor: `rgba(${rgb},1)`,
    pointBackgroundColor: `rgba(${rgb},1)`,
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: `rgba(${rgb},0.8)`
  };
}
