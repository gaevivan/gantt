import { LinearScaleOptions, TimeScale } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';

type GanttGridScaleOptions = DeepPartial<LinearScaleOptions> & {
  type: 'linear';
  backgroundColor: string;
};
// const DEFAULT_CONFIG: Partial<GanttTimeLineAxisOptions> = ;

export class GanttGridScale extends TimeScale {
  public static override id: string = 'GanttGridScale';

  public static getDefaultOptions(
    ticksCount: number
  ): Partial<GanttGridScaleOptions> {
    return {
      type: 'linear',
      grid: {
        display: true,
        drawBorder: false,
        drawOnChartArea: true,
        drawTicks: false,
        lineWidth: 1,
        borderDash: [3, 3],
        // color: '#EBEDEE',
        color: 'black',
      },
      bounds: 'ticks',
      position: 'top',
      min: 0,
      max: ticksCount,
      alignToPixels: true,
      ticks: {
        includeBounds: false,
        autoSkip: true,
        autoSkipPadding: 0,
        padding: 0,
        callback: (tickValue: number | string) => {
          return Number(tickValue).toFixed(0);
        },
        precision: 0,
        maxTicksLimit: ticksCount * 2,
      },
    };
  }

  public static dateToDays(date: Date): number {
    return Math.round(date.getTime() / 1000 / 60 / 60 / 24);
  }

  public static daysToDate(days: number): Date {
    return new Date(days * 1000 * 60 * 60 * 24);
  }
}
