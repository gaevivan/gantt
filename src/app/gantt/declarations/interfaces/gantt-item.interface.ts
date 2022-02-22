import { GanttStatus } from '../enums/gantt-status.enum';

export interface GanttItem {
  id: string;
  value: [number, number];
  status: GanttStatus;
}
