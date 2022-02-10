import { Injectable } from '@angular/core';
import {
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CartesianScaleOptions,
  CategoryScale,
  Chart,
  ChartData,
  ChartDataset,
  ChartOptions,
  Decimation,
  DoughnutController,
  Filler,
  GridLineOptions,
  Legend,
  LegendOptions,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PieController,
  Plugin,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
  SubTitle,
  TimeScale,
  TimeScaleOptions,
  TimeSeriesScale,
  TimeUnit,
  Title,
  Tooltip
} from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';
import 'chartjs-adapter-moment';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ZoomPluginOptions } from 'chartjs-plugin-zoom/types/options';
import { BehaviorSubject, combineLatest, Observable, take } from 'rxjs';
import { CHART_BACKGROUND_COLOR_PLUGIN } from '../constants/chart-background-color-plugin.const';
import { GanttStatus } from '../declarations/enums/gantt-status.enum';
import { GanttItem } from '../declarations/gantt-item.interface';
import { GanttSize } from '../declarations/gantt-size.interface';
import { GanttStateService } from './gantt-state.service';

Chart.register(
  annotationPlugin,
  zoomPlugin,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
);
Chart.defaults.plugins.tooltip.enabled = false;

const DEFAULT_COLOR: string = '#DCEEFF';

type GanttChart = Chart<'bar', [string, string][]>;
type GanttChartDataset = ChartDataset<'bar', [string, string][]>;
type GanttChartData = ChartData<'bar', [string, string][]>;
type GanttPlugin = Plugin<'bar'>;
type GanttLegendOptions = Partial<LegendOptions<'bar'>>;
type GanttXAxisOptions = DeepPartial<TimeScaleOptions> &
  DeepPartial<CartesianScaleOptions> & {
    type: 'time';
    backgroundColor: string;
  };

const LEGEND_OPTIONS: GanttLegendOptions = {
  display: false,
};
const ZOOM_OPTIONS: ZoomPluginOptions = {
  pan: {
    enabled: true,
    mode: 'x',
  },
  zoom: {
    // onZoomStart: (zoomEvent) => this.onZoomStart(zoomEvent),
    onZoomStart: (zoomEvent) => false,
    wheel: {
      modifierKey: 'alt',
      enabled: true,
      speed: 0.2,
    },
    pinch: {
      enabled: true,
    },
    mode: 'x',
  },
};
const COLOR_BY_STATUS_MAP: Map<GanttStatus, string> = new Map([
  [GanttStatus.Default, DEFAULT_COLOR],
  [GanttStatus.Success, '#C6F7E7'],
  [GanttStatus.Expired, '#FDE1D9'],
]);
const GRID_LINE_OPTIONS: Partial<GridLineOptions> = {
  display: true,
  drawBorder: false,
  drawOnChartArea: true,
  drawTicks: false,
  lineWidth: 1,
  borderDash: [3, 3],
  // color: '#EBEDEE',
  color: 'black',
};
const X_AXIS_OPTIONS: GanttXAxisOptions = {
  backgroundColor: 'white',
  afterFit: function (scale) {
    scale.height = DEFAULT_TITLE_SIZE;
  },
  type: 'time',
  bounds: 'ticks',
  display: true,
  time: {
    // parser: (a) => {
    //   console.log(a);
    //   return 1;
    // },
    stepSize: 1,
    isoWeekday: true,
    round: 'day',
    minUnit: 'day',
    unit: 'day',
    displayFormats: {
      // week: 'D MMM',
      // month: 'MMM',
      // quarter: 'MMM YYYY',
      // year: 'YYYY',
    },
  },
  ticks: {
    maxRotation: 0,
    minRotation: 0,
    // sampleSize: 10,
    // source: 'data',
    align: 'start',
    autoSkip: true,
    // callback: function(a,b,c) {
    //   console.log(this, a,b,c);
    //   return '1'
    // }
    // padding: 6,
  },
  offset: false,
  position: 'top',
  grid: GRID_LINE_OPTIONS,
};
const DEFAULT_TITLE_SIZE: number = 40;
interface ZoomRange {
  default: number;
  max: number;
  min: number;
}
const UNIT_TO_ZOOM_RANGE: Map<TimeUnit, ZoomRange> = new Map([
  ['day', { min: 0.6, default: 1, max: 1.5 }],
  ['week', { min: 0.6, default: 0.6, max: 0.6 }],
  ['month', { min: 0.5, default: 0.5, max: 0.5 }],
  ['quarter', { min: 0.4, default: 0.4, max: 0.4 }],
  ['year', { min: 0.4, default: 0.4, max: 0.4 }],
]);

@Injectable()
export class GanttBarsService {
  private readonly itemsList$: Observable<GanttItem[] | null> =
    this.ganttStateService.itemsList$;
  private readonly canvas$: Observable<CanvasRenderingContext2D> =
    this.ganttStateService.canvas$;
  private readonly rowHeightPx: number = this.ganttStateService.rowHeightPx;
  private readonly paddingSizePx: number = this.ganttStateService.paddingSizePx;
  private readonly size$: Observable<GanttSize> = this.ganttStateService.size$;
  private readonly chart$: BehaviorSubject<GanttChart | null> =
    new BehaviorSubject<GanttChart | null>(null);

  constructor(private readonly ganttStateService: GanttStateService) {}

  public setTimeUnit(timeUnit: TimeUnit): void {
    this.chart$.pipe(take(1)).subscribe((chart: GanttChart | null) => {
      if (chart === null) {
        return;
      }
      const timeScale: TimeScale = chart.scales['x'] as TimeScale;
      timeScale.options.time.unit = timeUnit;
      const zoomRange: ZoomRange | undefined = UNIT_TO_ZOOM_RANGE.get(timeUnit);
      if (zoomRange === undefined) {
        return;
      }
      chart.resetZoom('none');
    });
  }

  public draw(): void {
    combineLatest([
      this.size$.pipe(take(1)),
      this.itemsList$.pipe(take(1)),
      this.canvas$.pipe(take(1)),
    ]).subscribe(
      ([size, itemsList, canvas]: [
        GanttSize,
        GanttItem[] | null,
        CanvasRenderingContext2D
      ]) => {
        if (itemsList === null) {
          return;
        }
        const total: number = itemsList.length;
        const chartData: GanttChartData = this.getData(itemsList);
        const pluginsList: GanttPlugin[] = [CHART_BACKGROUND_COLOR_PLUGIN];
        const chart: GanttChart = new Chart(canvas, {
          type: 'bar',
          plugins: pluginsList,
          data: chartData,
          options: this.getChartOptions(total),
        });
        this.chart$.next(chart);
      }
    );
  }

  private getData(itemsList: GanttItem[]): GanttChartData {
    const dataList: [string, string][] = [];
    const colorsList: string[] = [];
    itemsList.forEach((item: GanttItem) => {
      const dataValue: [string, string] = [
        item.start.toISOString(),
        item.end.toISOString(),
      ];
      const colorValue: string =
        COLOR_BY_STATUS_MAP.get(item.status) ?? DEFAULT_COLOR;
      dataList.push(dataValue);
      colorsList.push(colorValue);
    });
    const dataSet: GanttChartDataset = {
      borderWidth: 0,
      borderRadius: 2,
      backgroundColor: colorsList,
      barThickness: this.rowHeightPx - this.paddingSizePx * 2,
      data: dataList,
    };
    return { datasets: [dataSet] };
  }

  private getChartOptions(total: number): ChartOptions<'bar'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        annotation: {
          annotations: [
            {
              type: 'line',
              scaleID: 'x',
              value: (() => {
                const newDate: Date = new Date();
                console.log(newDate);
                return newDate.toISOString();
              })(),
              borderWidth: 2,
              borderColor: '#334A54',
              label: {
                padding: {
                  top: 2,
                  bottom: 2,
                  left: 4,
                  right: 4
                },
                font: {
                  size: 10
                },
                backgroundColor: '#334A54',
                borderRadius: 2,
                color: '#FFFFFF',
                content: (() => {
                  const today: Date = new Date();
                  return `${today.getDate()}.${('0' + (today.getMonth() + 1)).slice(-2)}.${today.getFullYear().toString().slice(2, 4)}`;
                }),
                // content: new Date().toISOString().split('T')[0].split('-').reverse().join('.'),
                enabled: true,
                position: 'start',
              },
            },
          ],
        },
        zoom: ZOOM_OPTIONS,
        legend: LEGEND_OPTIONS,
      },
      scales: {
        x: X_AXIS_OPTIONS,
        y: {
          type: 'category',
          bounds: 'ticks',
          labels: new Array(total).fill(''),
          grid: GRID_LINE_OPTIONS,
        },
        // xToday: {
        //   type: 'category',
        //   labels: [new Date().toISOString()],
        //   // grid: ,
        // }
      },
    };
  }

  // private onZoomStart(zoomEvent: { chart: Chart; event: Event }): boolean {
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
