export function getFirstDateOfYearByDate(date: Date): Date {
  const currentDate: Date = new Date(date);
  currentDate.setDate(1);
  currentDate.setMonth(0);
  return currentDate;
}
