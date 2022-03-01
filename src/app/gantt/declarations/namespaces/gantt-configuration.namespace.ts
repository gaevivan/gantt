import { TimeUnit } from 'chart.js';

export namespace GanttConfiguration {
  export const START_DAYS_OFFSET_FROM_TODAY: number = -2;
  export const START_TIME_UNIT: TimeUnit = 'week';
  export const TIMELINE_HEIGHT_PX: number = 40;
  export const TIMELINE_BACKGROUND_COLOR: string = '#FFFFFF';
  export const CHART_BACKGROUND_COLOR: string = '#F5F6F7';
  export const ITEM_HEIGHT_PX: number = 40;
  export const ITEM_PADDING_PX: number = 6;
  export const ITEM_BORDER_RADIUS_PX: number = 2;
  export const ITEM_MIN_WIDTH_PX: number = 8;
}
