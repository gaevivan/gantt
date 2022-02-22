import { GanttGridScaleOptions } from '../types/gantt-grid-scale-options.type';
import { GanttGridScale } from './gantt-grid-scale.class';

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
        offset: false,
      },
      reverse: true,
      offset: false,
      ticks: {
        ...defaultOptions.ticks,
        display: false,
      },
    };
  }
}
