import { GanttUtilities } from '../declarations/namespaces/gantt-utilities.namespace';

export function getQuarterFirstDateFromDate(date: Date): Date {
  const currentDate: Date = new Date(date);
  currentDate.setDate(1);
  const monthIndex: number = date.getMonth();
  const quarter: number = Math.floor(
    monthIndex / GanttUtilities.MONTHS_IN_A_QUARTER
  );
  currentDate.setMonth(quarter * GanttUtilities.MONTHS_IN_A_QUARTER);
  return currentDate;
}
