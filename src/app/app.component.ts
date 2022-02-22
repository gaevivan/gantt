import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GanttDate } from './gantt/declarations/classes/gantt-date.class';
import { GanttStatus } from './gantt/declarations/enums/gantt-status.enum';
import { GanttItem } from './gantt/declarations/interfaces/gantt-item.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public readonly itemsList: GanttItem[] = new Array(4)
    .fill(null)
    .map((date: null, index: number) => {
      const start: Date = GanttDate.daysToDate(index);
      const end: Date = GanttDate.daysToDate(index + index);
      return {
        id: String(index),
        value: [GanttDate.dateToDays(start), GanttDate.dateToDays(end)],
        status: Array.from(Object.values(GanttStatus))[
          Math.floor(Math.random() * 3)
        ],
        start,
        end,
      };
    });
  /**
   * [
    {
      id: '0',
      start: new Date('2000-01-01'),
      end: new Date('2001-01-01'),
      status: GanttStatus.Expired,
      value: [30, 40],
    },
    {
      id: '1',
      start: new Date('2001-01-01'),
      end: new Date('2002-01-01'),
      status: GanttStatus.Success,
      value: [40, 50],
    },
    {
      id: '2',
      start: new Date('2002-01-01'),
      end: new Date('2003-01-01'),
      status: GanttStatus.Default,
      value: [50, 400],
    },
    {
      id: '3',
      start: new Date('2003-01-01'),
      end: new Date('2004-01-01'),
      status: GanttStatus.Default,
      value: [400, 1000],
    },
    {
      id: '4',
      start: new Date('2004-01-01'),
      end: new Date('2006-01-01'),
      status: GanttStatus.Default,
      value: [2000, 3000],
    },
    {
      id: '5',
      start: new Date('2006-01-01'),
      end: new Date('2010-01-01'),
      status: GanttStatus.Default,
      value: [3001, 3002],
    },
    {
      id: '6',
      start: new Date('2006-01-01'),
      end: new Date('2010-01-01'),
      status: GanttStatus.Expired,
      value: [3003, 3004],
    },
    {
      id: '7',
      start: new Date('2010-01-01'),
      end: new Date('2012-01-01'),
      status: GanttStatus.Expired,
      value: [3005, 3006],
    },
    {
      id: '7',
      start: new Date('2010-01-01'),
      end: new Date('2012-01-01'),
      status: GanttStatus.Success,
      value: [3008, 3009],
    },
  ];
   */
}
