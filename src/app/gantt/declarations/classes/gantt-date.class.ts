import { RELATIVE_MONTH_LIST } from '../../constants/relative-month-list.const';

export class GanttDate {
  private days: number;
  private date: Date;
  constructor(days: number = 0) {
    this.days = GanttDate.getToday() + days;
    this.date = GanttDate.daysToDate(this.days);
  }

  public getDateWithLocale(): string {
    return `${this.date.getDate()} ${
      RELATIVE_MONTH_LIST[this.date.getMonth() - 1]
    }`;
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

  public getYearAsString(): string {
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
    return Math.floor(new Date().getTime() / DAY_IN_MS);
  }

  public static dateToDays(date: Date): number {
    return Math.floor(date.getTime() / DAY_IN_MS);
  }

  public static daysToDate(days: number): Date {
    return new Date(days * DAY_IN_MS);
  }
}

const DAY_IN_MS: number = 1000 * 60 * 60 * 24;
