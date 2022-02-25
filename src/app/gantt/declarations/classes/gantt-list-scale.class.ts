import { ScriptableScaleContext } from 'chart.js';
import { GanttGridScaleOptions } from '../types/gantt-grid-scale-options.type';
import { GanttGridScale } from './gantt-grid-scale.class';

const GRID_LINE_COLOR: string = '#EBEDEE';
const TRANSPARENT_COLOR: string = 'transparent';
const TIMELINE_HEIGHT: number = 40;

export class GanttListScale extends GanttGridScale {
  public static override id: string = 'GanttListScale';

  public static override getDefaultOptions(
    ticksCount: number
  ): Partial<GanttGridScaleOptions> {
    const defaultOptions: Partial<GanttGridScaleOptions> =
      GanttGridScale.getDefaultOptions(ticksCount);
    return {
      ...defaultOptions,
      grid: {
        ...defaultOptions.grid,
        color: ({ tick, scale }: ScriptableScaleContext) => {
          const yPosition: number = scale.getPixelForValue(tick.value);
          if (yPosition <= TIMELINE_HEIGHT) {
            return TRANSPARENT_COLOR;
          }
          return GRID_LINE_COLOR;
        },
      },
      min: 0,
      max: ticksCount,
      reverse: true,
    };
  }
}
