import { LinearScaleOptions } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';

export type GanttGridScaleOptions = DeepPartial<LinearScaleOptions> & {
  type: 'linear';
  backgroundColor: string;
};
