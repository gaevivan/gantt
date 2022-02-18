import { TimeScale, TimeScaleOptions } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';
import { GRID_LINE_OPTIONS } from '../../constants/grid-line-options.const';

type GanttTimeLineAxisOptions = DeepPartial<TimeScaleOptions> & {
  type: 'GanttTimeLineAxis';
  backgroundColor: string;
};
// const DEFAULT_CONFIG: Partial<GanttTimeLineAxisOptions> = ;

export class GanttTimeLineScale extends TimeScale {
  public static override id: string = 'GanttTimeLineAxis';

  // public override afterFit(): void {
  //   const scale: GanttTimeLineScale = this.chart.scales[
  //     'x'
  //   ] as GanttTimeLineScale;
  //   scale.height = DEFAULT_TITLE_SIZE;
  //   scale.paddingLeft = 0;
  //   scale.paddingRight = 0;
  //   scale.ticks = new Array(7)
  //     .fill(GanttTimeLineScale.dateToDays(new Date(scale.min)))
  //     .map((day: number, index: number) => {
  //       const value: number = GanttTimeLineScale.daysToDate(
  //         day + index
  //       ).getTime();
  //       return {
  //         value,
  //         major: false,
  //         label: GanttTimeLineScale.prototype.getLabelForValue.bind(
  //           this,
  //           value
  //         )(),
  //       };
  //     });
  //   console.log(this);
  // }

  // public override getLineWidthForValue(value: number): number {
  //   return 0.5;
  // }

  // public override buildTicks(): Tick[] {
  //   return TimeScale.prototype.buildTicks.apply(this);
  // }

  public static dateToDays(date: Date): number {
    return Math.round(date.getTime() / 1000 / 60 / 60 / 24);
  }

  public static daysToDate(days: number): Date {
    return new Date(days * 1000 * 60 * 60 * 24);
  }

  public static getDefaultOptions(): Partial<GanttTimeLineAxisOptions> {
    return {
      // afterFit: (scale) => {
      // },
      backgroundColor: 'white',
      grid: GRID_LINE_OPTIONS,
      position: 'top',
      time: {
        isoWeekday: true,
        round: 'day',
        stepSize: 1,
        unit: 'day',
        minUnit: 'day',
      },
      ticks: {
        labelOffset: 28,
        maxRotation: 0,
        // padding: 6,
        // source: 'labels',
        // autoSkipPadding: 40,
      },
      offset: false,
      type: 'GanttTimeLineAxis',
    };
  }
}
