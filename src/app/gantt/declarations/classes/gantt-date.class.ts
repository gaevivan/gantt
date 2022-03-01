import { MONTH_LIST } from '../../constants/month-list.const';
import { RELATIVE_MONTH_LIST } from '../../constants/relative-month-list.const';
import { GanttUtilities } from '../namespaces/gantt-utilities.namespace';

export class GanttDate {
  private days: number;
  private date: Date;
  constructor(days: number = 0) {
    this.days = GanttDate.getToday() + days;
    this.date = GanttDate.daysToDate(this.days);
  }

  public getDayTimeUnitString(): string {
    return `${this.date.getDate()} ${
      RELATIVE_MONTH_LIST[this.date.getMonth()]
    }`;
  }

  public getWeekTimeUnitString(): string {
    const nextDate: Date = new GanttDate(
      this.days - GanttDate.getToday() + GanttUtilities.DAYS_IN_A_WEEK - 1
    ).getDate();
    return `${this.date.getDate()} - ${nextDate.getDate()} ${
      RELATIVE_MONTH_LIST[nextDate.getMonth()]
    }`;
  }

  public getMonthTimeUnitString(): string {
    return `${MONTH_LIST[this.date.getMonth()]}`;
  }

  public getQuarterTimeUnitString(): string {
    const monthIndex: number = this.date.getMonth();
    const quarter: number = Math.round(
      monthIndex / GanttUtilities.MONTHS_IN_A_QUARTER
    );
    return `Q${quarter + 1}`;
  }

  public setMonth(month: number): void {
    this.date.setMonth(month);
    this.days = GanttDate.dateToDays(this.date) - GanttDate.getToday();
  }

  public getDate(): Date {
    return this.date;
  }

  public getDays(): number {
    return this.days;
  }

  public isToday(): boolean {
    return this.days === 0;
  }

  public getDaysFromToday(): number {
    return this.days - GanttDate.getToday();
  }

  public getIsoString(): string {
    return this.date.toISOString();
  }

  public getYearTimeUnitString(): string {
    return this.date.getFullYear().toString();
  }

  public getDateAsString(): string {
    return this.getIsoString().split('T')[0];
  }

  public getTodayLineText(): string {
    const today: GanttDate = new GanttDate();
    const year: string = today.getDate().getFullYear().toString().slice(2, 4);
    return `${today.getDayAsString()}.${today.getMonthAsString()}.${year}`;
  }

  public getDayAsString(): string {
    return ('0' + this.date.getDate()).slice(-2);
  }

  public getMonthAsString(): string {
    return ('0' + (this.date.getMonth() + 1)).slice(-2);
  }

  public static getToday(): number {
    return Math.floor(new Date().getTime() / GanttUtilities.DAY_IN_MS);
  }

  public static dateToDays(date: Date): number {
    return Math.floor(date.getTime() / GanttUtilities.DAY_IN_MS);
  }

  public static daysToDate(days: number): Date {
    return new Date(days * GanttUtilities.DAY_IN_MS);
  }
}
