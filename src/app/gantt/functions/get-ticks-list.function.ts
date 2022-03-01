import { Tick, TimeUnit } from 'chart.js';

export function getTicksList(
  min: number,
  max: number,
  count: number,
  timeUnit: TimeUnit
): Tick[] {
  if (min > max) {
    return [];
  }
  const valuesList: null[] = new Array(count).fill(null);
  const diff: number = max - min;
  const koef: number = Math.round(diff / count);
  // const today = Math.floor(new Date().getTime() / DAY_IN_MS);
  const result: Tick[] = valuesList.map((_: null, index: number) => {
    return {
      value: index * koef + min,
      label: '',
    };
  });
  return result;
}

const DAY_IN_MS: number = 1000 * 60 * 60 * 24;
