import { GanttGridScaleOptions } from '../types/gantt-grid-scale-options.type';
import { GanttGridScale } from './gantt-grid-scale.class';

const DEFAULT_BACKGROUND_COLOR: string = 'white';

export class GanttTimeScale extends GanttGridScale {
  public static override id: string = 'GanttTimeScale';
  public static offsetFromToday: number = -2;

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
      min: GanttTimeScale.offsetFromToday,
      max: ticksCount + GanttTimeScale.offsetFromToday,
      grid: {
        ...defaultOptions.grid,
        // offset: false,
      },
      backgroundColor: DEFAULT_BACKGROUND_COLOR,
    };
  }
}
