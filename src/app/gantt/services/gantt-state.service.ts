import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, ReplaySubject } from 'rxjs';
import { GanttItem } from '../declarations/gantt-item.interface';
import { GanttSize } from '../declarations/gantt-size.interface';
import { getIndexOfDayInYear } from '../functions/get-index-of-day-in-year.function';

@Injectable()
export class GanttStateService {
  public readonly paddingSizePx: number = 6;
  public readonly rowHeightPx: number = 40;
  private readonly itemsListState: BehaviorSubject<GanttItem[] | null> =
    new BehaviorSubject<GanttItem[] | null>(null);
  public readonly itemsList$: Observable<GanttItem[] | null> =
    this.itemsListState.asObservable();
  private readonly canvasState: ReplaySubject<CanvasRenderingContext2D> =
    new ReplaySubject<CanvasRenderingContext2D>(1);
  public readonly canvas$: Observable<CanvasRenderingContext2D> =
    this.canvasState.asObservable();
  public readonly size$: Observable<GanttSize> = this.itemsList$.pipe(
    map((itemsList: GanttItem[] | null) => this.getSize(itemsList))
  );

  public setData(itemsList: GanttItem[] | null): void {
    this.itemsListState.next(itemsList);
  }

  public setCanvas(canvas: CanvasRenderingContext2D): void {
    this.canvasState.next(canvas);
  }

  private getSize(itemsList: GanttItem[] | null): GanttSize {
    if (itemsList === null) {
      return {
        height: 0,
        width: 0,
      };
    }
    const heightPx: number = this.rowHeightPx * itemsList.length + 40;
    const edgesList: number[] = itemsList.map((item: GanttItem) =>
      getIndexOfDayInYear(item.end)
    );
    const widthPx: number = Math.max(...edgesList) + this.paddingSizePx * 2;
    return {
      height: heightPx,
      width: widthPx,
    };
  }
}
