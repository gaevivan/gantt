import { GanttPosition } from './gantt-position.interface';

export interface GanttSquare {
  leftTop: GanttPosition;
  leftTopR: GanttPosition;
  leftTopB: GanttPosition;
  rightTop: GanttPosition;
  rightTopL: GanttPosition;
  rightTopB: GanttPosition;
  rightBot: GanttPosition;
  rightBotT: GanttPosition;
  rightBotL: GanttPosition;
  leftBot: GanttPosition;
  leftBotR: GanttPosition;
  leftBotT: GanttPosition;
}
