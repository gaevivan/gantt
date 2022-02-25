import { Injectable } from '@angular/core';
import * as ChartJs from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';
import 'chartjs-adapter-moment';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ZoomPluginOptions } from 'chartjs-plugin-zoom/types/options';
import { BehaviorSubject, combineLatest, Observable, take } from 'rxjs';
import { CHART_BACKGROUND_COLOR_PLUGIN } from '../constants/chart-background-color-plugin.const';
import { GANTT_DATA_PLUGIN } from '../constants/gantt-data-plugin.const';
import { GanttStatusColor } from '../constants/gantt-status-color.const';
import { TIMELINE_LABELS_PLUGIN } from '../constants/timeline-labels-plugin.const';
import { TODAY_LINE_PLUGIN } from '../constants/today-line-plugin.const';
import { GanttListScale } from '../declarations/classes/gantt-list-scale.class';
import { GanttTimeScale } from '../declarations/classes/gantt-time-scale.class';
import { GanttStatus } from '../declarations/enums/gantt-status.enum';
import { GanttItem } from '../declarations/interfaces/gantt-item.interface';
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
    mode: 'x',
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
  private readonly chart$: BehaviorSubject<GanttModel.Chart | null> =
    new BehaviorSubject<GanttModel.Chart | null>(null);
  private currentTimeUnit: ChartJs.TimeUnit = 'day';

  constructor(private readonly ganttStateService: GanttStateService) {}

  public setTimeUnit(timeUnit: ChartJs.TimeUnit): void {
    combineLatest([this.chart$.pipe(take(1))]).subscribe(
      ([chart]: [GanttModel.Chart | null]) => {
        if (timeUnit === this.currentTimeUnit) {
          return;
        }
        if (chart === null) {
          return;
        }
        const scales = chart.options.scales;
        if (scales === undefined) {
          return;
        }
        const x = scales['x'];
        if (x === undefined) {
          return;
        }
        const max = x.max;
        if (x.max === undefined) {
          return;
        }
        x.max = x.max + 49;
        chart.update();
      }
    );
  }

  public openToday(): void {
    this.chart$.pipe(take(1)).subscribe((chart: GanttModel.Chart | null) => {
      if (chart === null) {
        return;
      }
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
          GANTT_DATA_PLUGIN,
          TIMELINE_LABELS_PLUGIN,
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
            y: GanttListScale.getDefaultOptions(count),
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
    itemsList.forEach((item: GanttItem) => {
      const colorValue: string =
        GanttStatusColor[item.status] ?? GanttStatusColor[GanttStatus.Default];
      dataList.push(item.value);
    });
    // const datasetList: ChartJs.ChartDataset<'bar', GanttModel.DataUnit[]>[] =
    //   dataList.map((data, index) => {
    //     const dataset: ChartJs.ChartDataset<'bar', GanttModel.DataUnit[]> = {
    //       type: 'bar',
    //       borderWidth: 6,
    //       borderColor: 'transparent',
    //       borderSkipped: false,
    //       borderRadius: 8,
    //       barThickness: 40,
    //       // barPercentage: 1,
    //       // base: data,
    //       // clip: true,
    //       // categoryPercentage: 1,
    //       backgroundColor: 'transparent',
    //       // GanttStatusColor[
    //       //   Array.from(Object.values(GanttStatus))[
    //       //     Math.floor(Math.random() * 3)
    //       //   ]
    //       // ],
    //       data: [
    //         [0, 1],
    //         ...new Array(dataList.length)
    //           .fill(null)
    //           .map((v, i) => (i === index ? data : null)),
    //       ],
    //     };
    //     return dataset;
    //   });
    // const singleDataSet: ChartJs.ChartDataset<'bar', GanttModel.DataUnit[]> = {
    //   type: 'bar',
    //   borderWidth: 6,
    //   borderSkipped: false,
    //   borderRadius: 8,
    //   barThickness: 40,
    //   xAxisID: 'GanttTimeScale',
    //   yAxisID: 'GanttListScale',
    //   backgroundColor:
    //     GanttStatusColor[
    //       Array.from(Object.values(GanttStatus))[Math.floor(Math.random() * 3)]
    //     ],
    //   data: dataList,
    // };
    return {
      datasets: [
        {
          // type: 'bar',
          hidden: true,
          // xAxisID: 'invisible',
          // yAxisID: 'invisible',
          data: dataList,
        },
      ],
      labels: new Array(dataList.length).fill(''),
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
