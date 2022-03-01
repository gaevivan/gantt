import { LinearScale, LinearScaleOptions } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';

type GanttGridScaleOptions = DeepPartial<LinearScaleOptions> & {
  type: 'GanttGridScale';
};

export class GanttGridScale<T = GanttGridScaleOptions> extends LinearScale {
  public static override id: string = 'GanttGridScale';

  public static getDefaultOptions(
    ticksCount: number
  ): Partial<GanttGridScaleOptions> {
    return {
      type: 'GanttGridScale',
      grid: {
        display: true,
        drawBorder: false,
        drawOnChartArea: true,
        drawTicks: false,
        lineWidth: 1,
        borderDash: [3, 3],
        borderWidth: 1,
      },
      alignToPixels: true,
      bounds: 'ticks',
      position: 'top',
      ticks: {
        stepSize: 1,
        display: false,
        maxRotation: 0,
        includeBounds: false,
        autoSkip: false,
        autoSkipPadding: 0,
        callback: (tickValue: number | string) => {
          const numberValue: number = Number(tickValue);
          return numberValue;
        },
        maxTicksLimit: ticksCount,
      },
    };
  }
}
