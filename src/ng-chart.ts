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
export class LineChartData {
  data: number[];
  label: string;
}
export class NgChartParams {
  lineChartData: LineChartData[];
  lineChartLabels: String[];
  lineChartOptions?: {
    responsive?: boolean
  };
  lineChartColors?: NgChartColor[];
  lineChartLegend?: boolean;
  lineChartType: LineChartType;

  /* set default config */
  constructor(data: LineChartData[], labels: String[], type: LineChartType) {
    this.lineChartData = data;
    this.lineChartLabels = labels;
    this.lineChartOptions = {responsive: true};
    this.lineChartLegend = true;
    this.lineChartType = type;
  }
}
export type LineChartType = 'line' | 'pie' | string;
