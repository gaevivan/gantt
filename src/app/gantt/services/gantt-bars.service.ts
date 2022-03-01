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
import { TIMELINE_LABELS_PLUGIN } from '../constants/timeline-labels-plugin.const';
import { TODAY_LINE_PLUGIN } from '../constants/today-line-plugin.const';
import { GanttDate } from '../declarations/classes/gantt-date.class';
import { GanttListScale } from '../declarations/classes/gantt-list-scale.class';
import { GanttTimeScale } from '../declarations/classes/gantt-time-scale.class';
import { GanttConfiguration } from '../declarations/namespaces/gantt-configuration.namespace';
import { GanttUtilities } from '../declarations/namespaces/gantt-utilities.namespace';
import { GanttModel } from '../declarations/namespaces/gantt.namespace';
import { GanttGridScaleOptions } from '../declarations/types/gantt-grid-scale-options.type';
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

const TIME_UNIT_KOEF_MAP: Map<ChartJs.TimeUnit, number> = new Map([
  ['day', 1],
  ['week', 7],
]);

const TIME_UNITS_LIST: ChartJs.TimeUnit[] = [
  'day',
  'week',
  'month',
  'quarter',
  'year',
];
type GetMaxDateForTimeUnitFunction = (
  minDate: Date,
  ticksCount: number
) => Date;

function getMaxDateForDay(minDate: Date, ticksCount: number): Date {
  const maxDate: Date = new Date(minDate);
  maxDate.setDate(maxDate.getDate() + ticksCount);
  return maxDate;
}
function getMaxDateForWeek(minDate: Date, ticksCount: number): Date {
  const maxDate: Date = new Date(minDate);
  maxDate.setDate(
    maxDate.getDate() + ticksCount * GanttUtilities.DAYS_IN_A_WEEK
  );
  return maxDate;
}
function getMaxDateForMonth(minDate: Date, ticksCount: number): Date {
  const maxDate: Date = new Date(minDate);
  maxDate.setMonth(maxDate.getMonth() + ticksCount);
  return maxDate;
}
function getMaxDateForQuarter(minDate: Date, ticksCount: number): Date {
  const maxDate: Date = new Date(minDate);
  maxDate.setMonth(
    maxDate.getMonth() + ticksCount * GanttUtilities.MONTHS_IN_A_QUARTER
  );
  return maxDate;
}
function getMaxDateForYear(minDate: Date, ticksCount: number): Date {
  const maxDate: Date = new Date(minDate);
  maxDate.setFullYear(maxDate.getFullYear() + ticksCount);
  return maxDate;
}

const CONVERT_BY_TYPE: Map<ChartJs.TimeUnit, GetMaxDateForTimeUnitFunction> =
  new Map([
    ['day', getMaxDateForDay],
    ['week', getMaxDateForWeek],
    ['month', getMaxDateForMonth],
    ['quarter', getMaxDateForQuarter],
    ['year', getMaxDateForYear],
  ]);

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
    mode: 'xy',
    overScaleMode: 'y',
  },
  zoom: {
    // onZoomStart: (zoomEvent) => GanttBarsService.onZoomStart(zoomEvent),
    // onZoomComplete: ({ chart }: { chart: ChartJs.Chart }) => {
    //   const zoomLevel: number = chart.getZoomLevel();
    // },
    mode: 'x',
    wheel: {
      modifierKey: 'alt',
      enabled: false,
    },
    pinch: {
      enabled: true,
    },
    // mode: 'x',
  },
};

@Injectable()
export class GanttBarsService {
  private readonly itemsList$: Observable<GanttModel.InputDataItem[] | null> =
    this.ganttStateService.itemsList$;
  private readonly count$: Observable<number | null> =
    this.ganttStateService.count$;
  private readonly canvas$: Observable<CanvasRenderingContext2D> =
    this.ganttStateService.canvas$;
  private readonly chart$: BehaviorSubject<GanttModel.Chart | null> =
    new BehaviorSubject<GanttModel.Chart | null>(null);
  private currentTimeUnit: ChartJs.TimeUnit =
    GanttConfiguration.START_TIME_UNIT;

  constructor(private readonly ganttStateService: GanttStateService) {}

  public setTimeUnit(timeUnit: ChartJs.TimeUnit): void {
    this.currentTimeUnit = timeUnit;
    this.setNewMinMax();
  }

  public scrollByDeltaY(deltaY: number): void {
    this.chart$.pipe(take(1)).subscribe((chart: GanttModel.Chart | null) => {
      if (chart === null) {
        return;
      }
      chart.pan({ x: 0, y: Math.sign(deltaY) * 40 });
    });
  }

  public openToday(): void {
    this.setNewMinMax(GanttConfiguration.START_DAYS_OFFSET_FROM_TODAY);
  }

  public draw(): void {
    combineLatest([
      this.count$.pipe(take(1)),
      this.itemsList$.pipe(take(1)),
      this.canvas$.pipe(take(1)),
    ]).subscribe(
      ([count, itemsList, canvas]: [
        number | null,
        GanttModel.InputDataItem[] | null,
        CanvasRenderingContext2D
      ]) => {
        if (itemsList === null || count === null) {
          return;
        }
        const data: GanttModel.Data = this.getData(itemsList, count);
        const type: GanttModel.Type = 'line';
        const plugins: GanttModel.Plugin[] = [
          CHART_BACKGROUND_COLOR_PLUGIN,
          // GANTT_DATA_PLUGIN,
          TIMELINE_LABELS_PLUGIN,
          TODAY_LINE_PLUGIN,
        ];
        const options: GanttModel.Options = {
          elements: {
            bar: {
              borderWidth: GanttConfiguration.ITEM_PADDING_PX,
              borderSkipped: false,
              borderColor: 'transparent',
              borderRadius:
                GanttConfiguration.ITEM_BORDER_RADIUS_PX +
                GanttConfiguration.ITEM_PADDING_PX,
            },
          },
          animation: ANIMATION_OPTIONS,
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          layout: {
            autoPadding: false,
          },
          plugins: {
            tooltip: TOOLTIP_PLUGIN_OPTIONS,
            zoom: {
              ...ZOOM_PLUGIN_OPTIONS,
              zoom: {
                ...ZOOM_PLUGIN_OPTIONS.zoom,
                onZoomStart: this.onZoomStart.bind(this),
              },
            },
            legend: LEGEND_PLUGIN_OPTIONS,
          },
          scales: {
            x: GanttTimeScale.getDefaultOptions(8) as any,
            y: GanttListScale.getDefaultOptions(count) as any,
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
        this.openToday();
      }
    );
  }

  private setNewMinMax(min: number | null = null): void {
    combineLatest([this.chart$.pipe(take(1))]).subscribe(
      ([chart]: [GanttModel.Chart | null]) => {
        if (chart === null) {
          return;
        }
        if (
          chart.options.scales === undefined ||
          chart.options.scales['x'] === undefined
        ) {
          return;
        }
        const xScale: DeepPartial<GanttGridScaleOptions> = chart.options.scales[
          'x'
        ] as any;
        xScale.timeUnit = this.currentTimeUnit;
        if (min !== null) {
          xScale.min = min;
        }
        const count: number = 8;
        const minDate: Date = new GanttDate(xScale.min).getDate();
        const convertFunc: GetMaxDateForTimeUnitFunction =
          CONVERT_BY_TYPE.get(this.currentTimeUnit) ?? (() => minDate);
        const max: Date = convertFunc(minDate, count);
        xScale.max = GanttDate.dateToDays(max) - GanttDate.getToday();
        chart.update();
      }
    );
  }

  private getData(
    inputList: GanttModel.InputDataItem[],
    count: number
  ): GanttModel.Data {
    const type: GanttModel.Type = 'bar';
    const datasets: GanttModel.Dataset[] = inputList.map(
      (inputItem: GanttModel.InputDataItem) => {
        const dataset: GanttModel.Dataset = {
          type,
          barThickness: GanttConfiguration.ITEM_HEIGHT_PX,
          backgroundColor: GanttStatusColor[inputItem.status],
          data: [inputItem.value],
        };
        return dataset;
      }
    );
    return {
      datasets,
      labels: new Array(1).fill(''),
    };
  }

  private onZoomStart(zoomEvent: {
    chart: ChartJs.Chart;
    event: Event;
  }): boolean {
    // const timeScale: TimeScale = zoomEvent.chart.scales['x'] as TimeScale;
    const wheelEvent: WheelEvent = zoomEvent.event as WheelEvent;
    const isZoomUp: boolean = wheelEvent.deltaY > 0;
    const currentIndex: number = TIME_UNITS_LIST.indexOf(this.currentTimeUnit);
    const isMax: boolean = currentIndex === TIME_UNITS_LIST.length - 1;
    const isMin: boolean = currentIndex === 0;
    if (isMax && isZoomUp) {
      return false;
    }
    if (isMin && !isZoomUp) {
      return false;
    }
    const newIndex: number = isZoomUp ? currentIndex + 1 : currentIndex - 1;
    this.setTimeUnit(TIME_UNITS_LIST[newIndex]);
    return false;
    // const zoomLevel: number = zoomEvent.chart.getZoomLevel();
    // const currentUnit: TimeUnit | false = timeScale.options.time.unit;
    // if (currentUnit === false) {
    //   return false;
    // }
    // const zoomRange: ZoomRange | undefined =
    //   UNIT_TO_ZOOM_RANGE.get(currentUnit);
    // if (zoomRange === undefined) {
    //   return false;
    // }
    // const isMax: boolean = !isZoomUp && zoomLevel > zoomRange.max;
    // const isMin: boolean = isZoomUp && zoomLevel < zoomRange.min;
    // if (isMax || isMin) {
    //   return false;
    // }
    // return true;
  }
}
