import { LinearScaleOptions, TimeScale } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';

type GanttGridScaleOptions = DeepPartial<LinearScaleOptions> & {
  type: 'linear';
};
const GRID_LINE_COLOR: string = '#EBEDEE';
const TRANSPARENT_COLOR: string = 'transparent';

export class GanttGridScale<T = GanttGridScaleOptions> extends TimeScale {
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
        color: GRID_LINE_COLOR,
      },
      alignToPixels: true,
      bounds: 'ticks',
      position: 'top',
      ticks: {
        display: false,
        maxRotation: 0,
        includeBounds: false,
        autoSkip: true,
        autoSkipPadding: 0,
        callback: (tickValue: number | string) => {
          const numberValue: number = Number(Number(tickValue).toFixed(0));
          return numberValue;
        },
        precision: 0,
        maxTicksLimit: ticksCount + 2,
      },
    };
  }
}
