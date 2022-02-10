import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GanttStatus } from './gantt/declarations/enums/gantt-status.enum';
import { GanttItem } from './gantt/declarations/gantt-item.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public readonly itemsList: GanttItem[] = [
    {
      id: '0',
      start: new Date('1995-02-10'),
      end: new Date('1995-02-20'),
      status: GanttStatus.Expired
    },
    {
      id: '1',
      start: new Date('1995-02-10'),
      end: new Date('1995-02-14'),
      status: GanttStatus.Success
    },
    {
      id: '2',
      start: new Date('1995-02-14'),
      end: new Date('1995-02-20'),
      status: GanttStatus.Default
    },
    {
      id: '3',
      start: new Date('1995-02-20'),
      end: new Date('1995-02-25'),
      status: GanttStatus.Default
    },
    {
      id: '4',
      start: new Date('1995-02-20'),
      end: new Date('1995-02-22'),
      status: GanttStatus.Default
    },
    {
      id: '5',
      start: new Date('1995-02-22'),
      end: new Date('1995-02-23'),
      status: GanttStatus.Default
    },
    {
      id: '6',
      start: new Date('1995-02-23'),
      end: new Date('1995-04-23'),
      status: GanttStatus.Default
    },
    {
      id: '7',
      start: new Date('1995-04-23'),
      end: new Date('1995-06-23'),
      status: GanttStatus.Expired
    },
    {
      id: '7',
      start: new Date('1995-06-23'),
      end: new Date('1995-08-23'),
      status: GanttStatus.Success
    },
  ]
}
