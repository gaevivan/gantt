import { Injectable } from '@angular/core';
import * as ChartJs from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';
import 'chartjs-adapter-moment';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ZoomPluginOptions } from 'chartjs-plugin-zoom/types/options';
import { BehaviorSubject, combineLatest, Observable, take } from 'rxjs';
import { CHART_BACKGROUND_COLOR_PLUGIN } from '../constants/chart-background-color-plugin.const';
import { GanttStatusColor } from '../constants/gantt-status-color.const';
import { GanttGridScale } from '../declarations/classes/grid-scale.class';
import { GanttTimeLineScale } from '../declarations/classes/time-line-scale.class';
import { GanttWorksScale } from '../declarations/classes/works-scale.class';
import { GanttStatus } from '../declarations/enums/gantt-status.enum';
import { GanttItem } from '../declarations/interfaces/gantt-item.interface';
import { GanttSize } from '../declarations/interfaces/gantt-size.interface';
import { GanttModel } from '../declarations/namespaces/gantt.namespace';
import { GanttStateService } from './gantt-state.service';

ChartJs.Chart.register(
  ChartJs.Legend,
  ChartJs.Tooltip,
  ChartJs.BarElement,
  ChartJs.LineController,
  ChartJs.PointElement,
  ChartJs.LineElement,
  ChartJs.LinearScale,
  ChartJs.BarController,
  zoomPlugin,
  annotationPlugin,
  GanttTimeLineScale,
  GanttWorksScale
);

const TOOLTIP_PLUGIN_OPTIONS: GanttModel.TooltipOptions = {
  enabled: false,
};
const LEGEND_PLUGIN_OPTIONS: GanttModel.LegendOptions = {
  display: false,
};
const ZOOM_PLUGIN_OPTIONS: ZoomPluginOptions = {
  pan: {
    enabled: true,
  },
  zoom: {
    // onZoomStart: (zoomEvent) => GanttBarsService.onZoomStart(zoomEvent),
    // onZoomComplete: ({ chart }: { chart: ChartJs.Chart }) => {
    //   const zoomLevel: number = chart.getZoomLevel();
    // },
    wheel: {
      modifierKey: 'alt',
      enabled: true,
    },
    pinch: {
      enabled: true,
    },
    // mode: 'x',
  },
};

@Injectable()
export class GanttBarsService {
  private readonly itemsList$: Observable<GanttItem[] | null> =
    this.ganttStateService.itemsList$;
  private readonly count$: Observable<number | null> =
    this.ganttStateService.count$;
  private readonly canvas$: Observable<CanvasRenderingContext2D> =
    this.ganttStateService.canvas$;
  private readonly rowHeightPx: number = this.ganttStateService.rowHeightPx;
  private readonly paddingSizePx: number = this.ganttStateService.paddingSizePx;
  private readonly size$: Observable<GanttSize> = this.ganttStateService.size$;
  private readonly chart$: BehaviorSubject<GanttModel.Chart | null> =
    new BehaviorSubject<GanttModel.Chart | null>(null);
  private readonly type$: BehaviorSubject<ChartJs.TimeUnit> =
    new BehaviorSubject<ChartJs.TimeUnit>('day');
  private currentTimeUnit: ChartJs.TimeUnit = 'day';
  private ticksList: string[] = new Array(7)
    .fill(new Date())
    .map((date: Date, index: number) =>
      GanttTimeLineScale.daysToDate(
        GanttTimeLineScale.dateToDays(date) + index
      ).toISOString()
    );

  constructor(private readonly ganttStateService: GanttStateService) {}

  public setTimeUnit(timeUnit: ChartJs.TimeUnit): void {
    // combineLatest([this.chart$.pipe(take(1))]).subscribe(
    //   ([chart]: [GanttModel.Chart | null]) => {
    //     if (timeUnit === this.currentTimeUnit) {
    //       return;
    //     }
    //     if (chart === null) {
    //       return;
    //     }
    //     this.currentTimeUnit = timeUnit;
    //     chart.update();
    //   }
    // );
  }

  public draw(): void {
    combineLatest([
      this.count$.pipe(take(1)),
      this.itemsList$.pipe(take(1)),
      this.canvas$.pipe(take(1)),
    ]).subscribe(
      ([count, itemsList, canvas]: [
        number | null,
        GanttItem[] | null,
        CanvasRenderingContext2D
      ]) => {
        if (itemsList === null || count === null) {
          return;
        }
        const data: GanttModel.Data = this.getData(itemsList);
        const type: GanttModel.Type = 'line';
        const plugins: GanttModel.Plugin[] = [CHART_BACKGROUND_COLOR_PLUGIN];
        const yScale: DeepPartial<ChartJs.LinearScaleOptions> =
          GanttGridScale.getDefaultOptions(10);
        const xScale: DeepPartial<ChartJs.LinearScaleOptions> =
          GanttGridScale.getDefaultOptions(7);
        const options: GanttModel.Options = {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            tooltip: TOOLTIP_PLUGIN_OPTIONS,
            zoom: ZOOM_PLUGIN_OPTIONS,
            legend: LEGEND_PLUGIN_OPTIONS,
          },
          scales: {
            x: xScale,
            y: {
              reverse: true,
              ...yScale,
              ticks: {
                ...yScale.ticks,
                display: false,
              },
            },
          },
        };
        const config: GanttModel.Configuration = {
          type,
          plugins,
          data,
          options,
        };
        const chart: GanttModel.Chart = new GanttModel.Chart(canvas, config);
        this.chart$.next(chart);
      }
    );
  }

  private getData(itemsList: GanttItem[]): GanttModel.Data {
    const dataList: GanttModel.DataList = [];
    const colorsList: string[] = [];
    itemsList.forEach((item: GanttItem) => {
      const colorValue: string =
        GanttStatusColor[item.status] ?? GanttStatusColor[GanttStatus.Default];
      const start: number = GanttTimeLineScale.dateToDays(item.start);
      const end: number = GanttTimeLineScale.dateToDays(item.end);
      // const dataItem: GanttModel.DataUnit = [
      //   item.start.toISOString(),
      //   item.end.toISOString(),
      // ];
      // dataList.push(dataItem);
      dataList.push([start, end]);
      colorsList.push(colorValue);
    });
    console.log({ dataList });
    const dataSet: GanttModel.Dataset = {
      borderWidth: 0,
      backgroundColor: 'red',
      borderColor: 'blue',
      // borderSkipped: false,
      // borderRadius: 2,
      // backgroundColor: colorsList,
      // barThickness: this.rowHeightPx - this.paddingSizePx * 2,
      data: dataList,
    };
    // console.log({ data: dataList, ticks: this.ticksList });
    return {
      datasets: [dataSet],
      labels: new Array(7).fill(''),
      // datasets: [dataSet],
      // labels: new Array(10).fill('').map((v, i) => String(i)),
    };
  }

  // public static onZoomStart(zoomEvent: {
  //   chart: Chart;
  //   event: Event;
  // }): boolean {
  //   const timeScale: TimeScale = zoomEvent.chart.scales['x'] as TimeScale;
  //   const wheelEvent: WheelEvent = zoomEvent.event as WheelEvent;
  //   const isZoomUp: boolean = wheelEvent.deltaY > 0;
  //   const zoomLevel: number = zoomEvent.chart.getZoomLevel();
  //   const currentUnit: TimeUnit | false = timeScale.options.time.unit;
  //   if (currentUnit === false) {
  //     return false;
  //   }
  //   const zoomRange: ZoomRange | undefined =
  //     UNIT_TO_ZOOM_RANGE.get(currentUnit);
  //   if (zoomRange === undefined) {
  //     return false;
  //   }
  //   const isMax: boolean = !isZoomUp && zoomLevel > zoomRange.max;
  //   const isMin: boolean = isZoomUp && zoomLevel < zoomRange.min;
  //   if (isMax || isMin) {
  //     return false;
  //   }
  //   return true;
  // }
}
