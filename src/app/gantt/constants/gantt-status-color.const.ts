import { GanttStatus } from '../declarations/enums/gantt-status.enum';

export const GanttStatusColor: {
  [key: string]: string;
} = {
  [GanttStatus.Default]: '#D4E3FA',
  [GanttStatus.Success]: '#E7F7D7',
  [GanttStatus.Expired]: '#FFDBDD',
};
