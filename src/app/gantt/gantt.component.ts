import {
  ChangeDetectionStrategy,
  Component,
  ElementRef, Input,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { TimeUnit } from 'chart.js';
import { Observable, pluck, tap } from 'rxjs';
import { GanttItem } from './declarations/gantt-item.interface';
import { GanttBarsService } from './services/gantt-bars.service';
import { GanttStateService } from './services/gantt-state.service';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
  providers: [GanttStateService, GanttBarsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttComponent {
  @ViewChild('container') public readonly containerRef: ElementRef<HTMLDivElement>;
  @ViewChild('gantt') public readonly ganttRef: ElementRef<HTMLCanvasElement>;
  @Input() public itemsList: GanttItem[] | null = null;
  public readonly height$: Observable<number> = this.ganttStateService.size$.pipe(pluck('height'), tap(console.log));

  constructor(
    private readonly ganttStateService: GanttStateService,
    private readonly ganttBarsService: GanttBarsService
  ) {}

  public ngAfterViewInit(): void {
    const ctx: CanvasRenderingContext2D | null =
      this.ganttRef.nativeElement.getContext('2d');
    if (ctx === null) {
      return;
    }
    this.ganttStateService.setCanvas(ctx);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const itemsList: GanttItem[] | null = changes['itemsList'].currentValue;
    this.ganttStateService.setData(itemsList);
    this.ganttBarsService.draw();
  }

  public onWheel(event: WheelEvent): void {
    if (!event.altKey) {
      return;
    }
    event.preventDefault();
  }

  public setTimeUnit(timeUnit: TimeUnit): void {
    this.ganttBarsService.setTimeUnit(timeUnit);
  }
}
