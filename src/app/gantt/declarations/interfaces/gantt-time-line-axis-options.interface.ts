import { CartesianScaleOptions } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';

export type GanttTimeLineAxisOptions = DeepPartial<CartesianScaleOptions> & {
  type: 'TimeLineAxis';
  backgroundColor: string;
};
