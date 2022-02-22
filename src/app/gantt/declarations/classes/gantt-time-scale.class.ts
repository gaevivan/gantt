import { GanttGridScaleOptions } from '../types/gantt-grid-scale-options.type';
import { GanttTimeScaleOptions } from '../types/gantt-time-scale-options.type';
import { GanttGridScale } from './gantt-grid-scale.class';

const DEFAULT_BACKGROUND_COLOR: string = 'white';
const TIME_COLOR: string = '#1D1C36';
const YEAR_COLOR: string = '#3D5159';

export class GanttTimeScale extends GanttGridScale {
  public static override id: string = 'GanttTimeScale';
  public static offsetFromToday: number = -2.5;

  public static override getDefaultOptions(
    ticksCount: number
  ): Partial<GanttTimeScaleOptions> {
    const defaultOptions: Partial<GanttGridScaleOptions> =
      GanttGridScale.getDefaultOptions(ticksCount);
    return {
      ...defaultOptions,
      afterFit: (scale) => {
        scale.height = 40;
      },
      timeUnit: 'day',
      backgroundColor: DEFAULT_BACKGROUND_COLOR,
      min: GanttTimeScale.offsetFromToday,
      max: ticksCount + GanttTimeScale.offsetFromToday,
    };
  }
}
