const HOURS_IN_A_DAY: number = 24;
const SECONDS_IN_A_MINUTE: number = 60;
const MINUTES_IN_AN_HOUR: number = 60;
const MS_IN_A_SECOND: number = 1000;

export function getIndexOfDayInYear(date: Date) {
  return (
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
    HOURS_IN_A_DAY /
    SECONDS_IN_A_MINUTE /
    MINUTES_IN_AN_HOUR /
    MS_IN_A_SECOND
  );
}
