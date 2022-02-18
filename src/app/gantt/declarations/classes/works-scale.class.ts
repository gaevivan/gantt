import { CategoryScale, CategoryScaleOptions } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';
import { GRID_LINE_OPTIONS } from '../../constants/grid-line-options.const';

type GanttWorksAxisOptions = DeepPartial<CategoryScaleOptions> & {
  type: 'GanttWorksAxis';
  backgroundColor: string;
};
const DEFAULT_CONFIG: Partial<GanttWorksAxisOptions> = {
  type: 'GanttWorksAxis',
  bounds: 'ticks',
  grid: GRID_LINE_OPTIONS,
  // min: 0,
  // max: 9,
  ticks: {
    padding: 0,
    // display: false,
    // sampleSize: 10,
    // callback: (v) => {
    //   console.log(v);
    //   return '';
    // }
  },
};

export class GanttWorksScale extends CategoryScale {
  public static override id: string = 'GanttWorksAxis';
  public static getDefaultOptions(
    total: number
  ): Partial<GanttWorksAxisOptions> {
    return {
      ...DEFAULT_CONFIG,
      // labels: new Array(total).fill(''),
    };
  }

  // public override buildTicks(): Tick[] {
  //   // return new Array(10).fill(null).map((v, i) => {
  //   //   console.log(v, this);
  //   //   return {
  //   //     value: this.min + i,
  //   //     label: String(this.min + i),
  //   //   };
  //   // });
  //   return CategoryScale.prototype.buildTicks
  //     .apply(this)
  //     .map((v) => {
  //       console.log(v);
  //       return v;
  //     })
  //     .slice(0, 9);
  // }

  // public override getMinMax(canStack: boolean): { min: number; max: number } {
  //   console.log(this);
  //   return {
  //     min: 0,
  //     max: tho,
  //   };
  // }

  public override getLabelForValue(value: number): string {
    return '1';
  }
}
