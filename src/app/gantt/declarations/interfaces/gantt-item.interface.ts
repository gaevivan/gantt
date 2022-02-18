import { GanttStatus } from '../enums/gantt-status.enum';

export interface GanttItem {
  id: string;
  start: Date;
  end: Date;
  value: [number, number];
  status: GanttStatus;
}
