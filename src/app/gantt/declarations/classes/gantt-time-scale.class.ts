import { ScriptableScaleContext } from 'chart.js';
import { GanttGridScaleOptions } from '../types/gantt-grid-scale-options.type';
import { GanttGridScale } from './gantt-grid-scale.class';

const GRID_LINE_COLOR: string = '#EBEDEE';
const TRANSPARENT_COLOR: string = 'transparent';

export class GanttTimeScale extends GanttGridScale {
  public static override id: string = 'GanttTimeScale';
  public static daysFromToday: number = -2;

  public static override getDefaultOptions(
    ticksCount: number
  ): Partial<GanttGridScaleOptions> {
    const defaultOptions: Partial<GanttGridScaleOptions> =
      GanttGridScale.getDefaultOptions(ticksCount);
    return {
      ...defaultOptions,
      afterFit: (scale) => {
        scale.height = 40;
      },
      grid: {
        ...defaultOptions.grid,
        color: ({ scale, tick }: ScriptableScaleContext) => {
          const xPosition: number = scale.getPixelForValue(tick.value);
          if (xPosition <= 0) {
            return TRANSPARENT_COLOR;
          }
          return GRID_LINE_COLOR;
        },
      },
      min: GanttTimeScale.daysFromToday,
      max: ticksCount + GanttTimeScale.daysFromToday,
    };
  }
}
