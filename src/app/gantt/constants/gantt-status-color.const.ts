import { GanttStatus } from '../declarations/enums/gantt-status.enum';

export const GanttStatusColor: {
  [key: string]: string;
} = {
  [GanttStatus.Default]: '#5995ED',
  [GanttStatus.Success]: '#97DB4F',
  [GanttStatus.Expired]: '#F14B52',
};
