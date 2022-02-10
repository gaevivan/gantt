import { GanttStatus } from "./enums/gantt-status.enum";

export interface GanttItem {
  start: Date;
  end: Date;
  status: GanttStatus;
  id: string;
}