import { Injectable } from '@angular/core';
import * as ChartJs from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';
import 'chartjs-adapter-moment';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ZoomPluginOptions } from 'chartjs-plugin-zoom/types/options';
import { BehaviorSubject, combineLatest, Observable, take } from 'rxjs';
import { CHART_BACKGROUND_COLOR_PLUGIN } from '../constants/chart-background-color-plugin.const';
import { DATE_LABELS_PLUGIN } from '../constants/date-labels-plugin.const';
import { GanttStatusColor } from '../constants/gantt-status-color.const';
import { TODAY_LINE_PLUGIN } from '../constants/today-line-plugin.const';
import { GanttDate } from '../declarations/classes/gantt-date.class';
import { GanttListScale } from '../declarations/classes/gantt-list-scale.class';
import { GanttTimeScale } from '../declarations/classes/gantt-time-scale.class';
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
  GanttTimeScale,
  GanttListScale
);

const ANIMATION_OPTIONS: GanttModel.AnimationOptions = {
  duration: 0,
};
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
      GanttDate.daysToDate(GanttDate.dateToDays(date) + index).toISOString()
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

  public openToday(): void {
    this.chart$.pipe(take(1)).subscribe((chart: GanttModel.Chart | null) => {
      if (chart === null) {
        return;
      }
      // chart.pan(
      //   {
      //     x: 0,
      //     y: 0,
      //   },
      //   [chart.scales['x'], chart.scales['y']],
      //   'reset'
      // );
      if (
        chart.options.scales === undefined ||
        chart.options.scales['x'] === undefined
      ) {
        return;
      }
      const xScale: DeepPartial<ChartJs.CartesianScaleOptions> =
        chart.options.scales['x'];
      xScale.min = GanttTimeScale.offsetFromToday;
      xScale.max = 7 + GanttTimeScale.offsetFromToday;
      chart.update();
    });
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
        const plugins: GanttModel.Plugin[] = [
          CHART_BACKGROUND_COLOR_PLUGIN,
          DATE_LABELS_PLUGIN,
          TODAY_LINE_PLUGIN,
        ];
        const options: GanttModel.Options = {
          animation: ANIMATION_OPTIONS,
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            tooltip: TOOLTIP_PLUGIN_OPTIONS,
            zoom: ZOOM_PLUGIN_OPTIONS,
            legend: LEGEND_PLUGIN_OPTIONS,
          },
          scales: {
            x: GanttTimeScale.getDefaultOptions(7),
            y: GanttListScale.getDefaultOptions(10),
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
    const dataList: GanttModel.DataList = [
      [0, 5],
      [0, 1],
      [1, 3],
      [3, 5],
    ];
    const colorsList: string[] = [];
    // itemsList.forEach((item: GanttItem) => {
    //   const colorValue: string =
    //     GanttStatusColor[item.status] ?? GanttStatusColor[GanttStatus.Default];
    //   const start: number = GanttDate.dateToDays(item.start);
    //   const end: number = GanttDate.dateToDays(item.end);
    //   // const dataItem: GanttModel.DataUnit = [
    //   //   item.start.toISOString(),
    //   //   item.end.toISOString(),
    //   // ];
    //   // dataList.push(dataItem);
    //   dataList.push([start, end]);
    //   colorsList.push(colorValue);
    // });
    console.log({ dataList });
    const dataSet: GanttModel.Dataset = {
      type: 'line',
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
    // const a: ChartJs.ChartDataset<'bar'> = {
    //   type: 'bar',
    //   borderRadius: 2,
    //   categoryPercentage: 1,
    //   base: 1,
    //   barThickness: 40,
    // };
    return {
      // datasets: [dataSet, dataSet2 as any],
      datasets: dataList.map((data, index) => {
        return {
          type: 'bar',
          borderWidth: 10,
          borderColor: 'transparent',
          borderRadius: 10,
          barThickness: 60,
          // barPercentage: 0.9,
          // base: data,
          // categoryPercentage: 1,
          backgroundColor: GanttStatusColor[GanttStatus.Default],
          data: new Array(dataList.length)
            .fill(null)
            .map((v, i) => (i === index ? data : null)),
        };
      }) as any,
      labels: new Array(dataList.length).fill(''),
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
