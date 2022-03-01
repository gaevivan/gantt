import { TimeUnit } from 'chart.js';
import { GanttDate } from '../declarations/classes/gantt-date.class';
import { GanttConfiguration } from '../declarations/namespaces/gantt-configuration.namespace';
import { GanttUtilities } from '../declarations/namespaces/gantt-utilities.namespace';

export function getStartOffsetForTimeUnit(timeUnit: TimeUnit): number {
  const offsetInDays: number = GanttConfiguration.START_DAYS_OFFSET_FROM_TODAY;
  if (timeUnit === 'day') {
    return offsetInDays;
  }
  if (timeUnit === 'week') {
    return offsetInDays * GanttUtilities.DAYS_IN_A_WEEK;
  }
  if (timeUnit === 'month') {
    const offsetDate: Date = new GanttDate(offsetInDays).getDate();
    offsetDate.setMonth(offsetDate.getMonth() + offsetInDays);
    return GanttDate.dateToDays(offsetDate) - GanttDate.getToday();
  }
  return offsetInDays;
}
