import { LinearScaleOptions, TimeUnit } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';

export type GanttTimeScaleOptions = DeepPartial<LinearScaleOptions> & {
  type: 'GanttTimeScale';
  timeUnit: TimeUnit;
  count: number;
};
