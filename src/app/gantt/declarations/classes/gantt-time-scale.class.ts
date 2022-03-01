import { ScriptableScaleContext, Tick } from 'chart.js';
import { getQuarterFirstDateFromDate } from '../../functions/get-quarter-first-date-from-date.function';
import { GanttConfiguration } from '../namespaces/gantt-configuration.namespace';
import { GanttUtilities } from '../namespaces/gantt-utilities.namespace';
import { GanttGridScaleOptions } from '../types/gantt-grid-scale-options.type';
import { GanttTimeScaleOptions } from '../types/gantt-time-scale-options.type';
import { GanttDate } from './gantt-date.class';
import { GanttGridScale } from './gantt-grid-scale.class';

const GRID_LINE_COLOR: string = '#EBEDEE';
const TRANSPARENT_COLOR: string = 'transparent';

export class GanttTimeScale extends GanttGridScale {
  public static override id: string = 'GanttTimeScale';

  public static override getDefaultOptions(ticksCount: number): any {
    const defaultOptions: Partial<GanttGridScaleOptions> =
      GanttGridScale.getDefaultOptions(ticksCount);
    return {
      ...defaultOptions,
      type: 'GanttTimeScale',
      afterFit: (scale: GanttGridScale) => {
        scale.height = GanttConfiguration.TIMELINE_HEIGHT_PX;
        // console.log(scale.top);
      },
      grid: {
        ...defaultOptions.grid,
        color: ({ scale, tick }: ScriptableScaleContext) => {
          const xPosition: number = scale.getPixelForValue(tick.value);
          if (xPosition <= 0) {
            return TRANSPARENT_COLOR;
          }
          return GRID_LINE_COLOR;
        },
      },
      timeUnit: GanttConfiguration.START_TIME_UNIT,
      min: GanttConfiguration.START_DAYS_OFFSET_FROM_TODAY,
      max: ticksCount + GanttConfiguration.START_DAYS_OFFSET_FROM_TODAY,
      count: ticksCount,
    } as GanttGridScaleOptions;
  }

  public override getLabelForValue(value: number): string {
    const options: GanttTimeScaleOptions = this.options as any;
    if (options.timeUnit === 'day') {
      return new GanttDate(value).getDayTimeUnitString();
    }
    if (options.timeUnit === 'week') {
      return new GanttDate(value).getWeekTimeUnitString();
    }
    if (options.timeUnit === 'month') {
      return new GanttDate(value).getMonthTimeUnitString();
    }
    if (options.timeUnit === 'quarter') {
      return new GanttDate(value).getQuarterTimeUnitString();
    }
    return new GanttDate(value).getYearTimeUnitString();
  }

  public override buildTicks(): Tick[] {
    const options: GanttTimeScaleOptions = this.options as any;
    if (options.timeUnit === 'day') {
      return this.getDayTicksList();
    }
    if (options.timeUnit === 'week') {
      return this.getWeekTicksList();
    }
    if (options.timeUnit === 'month') {
      return this.getMonthTicksList();
    }
    if (options.timeUnit === 'quarter') {
      return this.getQuarterTicksList();
    }
    return this.getYearTicksList();
  }

  private getDayTicksList(): Tick[] {
    const options: GanttTimeScaleOptions = this.options as any;
    const step: number = (this.max - this.min) / options.count;
    return new Array(options.count).fill(null).map((_, index: number) => {
      const value: number = Math.round(this.min + step * index);
      return {
        value,
      };
    });
  }

  private getWeekTicksList(): Tick[] {
    const options: GanttTimeScaleOptions = this.options as any;
    const minBasedOnToday: number =
      Math.round(this.min / GanttUtilities.DAYS_IN_A_WEEK) *
      GanttUtilities.DAYS_IN_A_WEEK;
    const step: number = (this.max - this.min) / options.count;
    return new Array(options.count).fill(null).map((_, index: number) => {
      return {
        value: Math.round(minBasedOnToday + step * index),
      };
    });
  }

  private getMonthTicksList(): Tick[] {
    const options: GanttTimeScaleOptions = this.options as any;
    const minDate: Date = new GanttDate(Math.round(this.min)).getDate();
    return new Array(options.count).fill(null).map((_, index: number) => {
      const currentDate: Date = new Date(minDate);
      currentDate.setDate(1);
      currentDate.setMonth(currentDate.getMonth() + index);
      const days: number =
        GanttDate.dateToDays(currentDate) - GanttDate.getToday();
      return {
        value: days,
      };
    });
  }

  private getQuarterTicksList(): Tick[] {
    const options: GanttTimeScaleOptions = this.options as any;
    const minDate: Date = new GanttDate(Math.round(this.min)).getDate();
    const firstDateInMinQuarter: Date = getQuarterFirstDateFromDate(minDate);
    return new Array(options.count).fill(null).map((_, index: number) => {
      const currentDate: Date = new Date(firstDateInMinQuarter);
      const quarterIndex: number =
        currentDate.getMonth() + index * GanttUtilities.MONTHS_IN_A_QUARTER;
      const yearDelta: number = Math.floor(
        quarterIndex / GanttUtilities.MONTHS_IN_A_YEAR
      );
      currentDate.setFullYear(currentDate.getFullYear() + yearDelta);
      currentDate.setMonth(
        quarterIndex - yearDelta * GanttUtilities.MONTHS_IN_A_YEAR
      );
      const days: number =
        GanttDate.dateToDays(currentDate) - GanttDate.getToday();
      return {
        value: days,
      };
    });
  }

  private getYearTicksList(): Tick[] {
    const options: GanttTimeScaleOptions = this.options as any;
    const minDate: Date = new GanttDate(Math.round(this.min)).getDate();
    const minDateYear: number = minDate.getFullYear();
    return new Array(options.count).fill(null).map((_, index: number) => {
      const currentDate: Date = new Date(minDate);
      currentDate.setDate(1);
      currentDate.setMonth(0);
      currentDate.setFullYear(minDateYear + index);
      const days: number =
        GanttDate.dateToDays(currentDate) - GanttDate.getToday();
      return {
        value: days,
      };
    });
  }
}
