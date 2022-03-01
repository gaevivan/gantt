import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GanttStatus } from './gantt/declarations/enums/gantt-status.enum';
import { GanttModel } from './gantt/declarations/namespaces/gantt.namespace';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // public readonly itemsList: GanttItem[] = new Array(10)
  //   .fill(null)
  //   .map((date: null, index: number) => {
  //     const start: GanttDate = new GanttDate(Math.floor(Math.random() * 3) - 2);
  //     const end: GanttDate = new GanttDate(Math.floor(Math.random() * 10) + 3);
  //     return {
  //       id: String(index),
  //       value: [start.getDaysFromToday(), end.getDaysFromToday()],
  //       status: Array.from(Object.values(GanttStatus))[
  //         Math.floor(Math.random() * 3)
  //       ],
  //       start,
  //       end,
  //     };
  //   });
  public readonly itemsList: GanttModel.InputDataItem[] = [
    {
      id: '1',
      value: [0, 1],
      status: GanttStatus.Default,
    },
    {
      id: '2',
      value: [2, 8],
      status: GanttStatus.Default,
    },
    {
      id: '3',
      value: [9, 38],
      status: GanttStatus.Success,
    },
    {
      id: '4',
      value: [39, 128],
      status: GanttStatus.Expired,
    },
    {
      id: '4',
      value: [129, 378],
      status: GanttStatus.Default,
    },
  ];

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
