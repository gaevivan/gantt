import { GanttStatus } from '../declarations/enums/gantt-status.enum';

export const GanttStatusHoverColor: {
  [key: string]: string;
} = {
  [GanttStatus.Default]: '#5995ED',
  [GanttStatus.Success]: '#97DB4F',
  [GanttStatus.Expired]: '#ED1C24',
};
