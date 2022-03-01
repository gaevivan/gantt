import { LinearScaleOptions, TimeUnit } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';

export type GanttGridScaleOptions = DeepPartial<LinearScaleOptions> & {
  type: 'GanttGridScale' | 'GanttTimeScale';
  backgroundColor: string;
  timeUnit: TimeUnit;
};
