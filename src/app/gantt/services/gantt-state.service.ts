import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  ReplaySubject,
} from 'rxjs';
import { GanttSize } from '../declarations/interfaces/gantt-size.interface';
import { GanttConfiguration } from '../declarations/namespaces/gantt-configuration.namespace';
import { GanttModel } from '../declarations/namespaces/gantt.namespace';

@Injectable()
export class GanttStateService {
  public readonly rowHeightPx: number = 40;
  private readonly countState: BehaviorSubject<number | null> =
    new BehaviorSubject<number | null>(null);
  public readonly count$: Observable<number | null> =
    this.countState.asObservable();
  private readonly itemsListState: BehaviorSubject<
    GanttModel.InputDataItem[] | null
  > = new BehaviorSubject<GanttModel.InputDataItem[] | null>(null);
  public readonly itemsList$: Observable<GanttModel.InputDataItem[] | null> =
    this.itemsListState.asObservable();
  private readonly canvasState: ReplaySubject<CanvasRenderingContext2D> =
    new ReplaySubject<CanvasRenderingContext2D>(1);
  public readonly canvas$: Observable<CanvasRenderingContext2D> =
    this.canvasState.asObservable();
  public readonly size$: Observable<GanttSize> = combineLatest([
    this.count$,
    this.itemsList$,
  ]).pipe(
    map(
      ([count, itemsList]: [
        number | null,
        GanttModel.InputDataItem[] | null
      ]) => this.getSize(count, itemsList)
    )
  );

  public setData(itemsList: GanttModel.InputDataItem[] | null): void {
    this.itemsListState.next(itemsList);
  }

  public setCount(count: number | null): void {
    this.countState.next(count);
  }

  public setCanvas(canvas: CanvasRenderingContext2D): void {
    this.canvasState.next(canvas);
  }

  private getSize(
    count: number | null,
    itemsList: GanttModel.InputDataItem[] | null
  ): GanttSize {
    if (count === null || itemsList === null) {
      return {
        height: 0,
        width: 0,
      };
    }
    const heightPx: number =
      this.rowHeightPx * count + GanttConfiguration.TIMELINE_HEIGHT_PX;
    const edgesList: number[] = itemsList.map(
      (item: GanttModel.InputDataItem) => item.value[1]
    );
    const widthPx: number = Math.max(...edgesList);
    return {
      height: heightPx,
      width: widthPx,
    };
  }
}
