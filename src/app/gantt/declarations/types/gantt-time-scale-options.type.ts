import { LinearScaleOptions, TimeUnit } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';

export type GanttTimeScaleOptions = DeepPartial<LinearScaleOptions> & {
  type: 'linear';
  backgroundColor: string;
  timeUnit: TimeUnit;
};
