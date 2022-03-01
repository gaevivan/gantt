import { Chart, Plugin, Tick } from 'chart.js';
import { GanttDate } from '../declarations/classes/gantt-date.class';
import { GanttTimeScale } from '../declarations/classes/gantt-time-scale.class';
import { GanttConfiguration } from '../declarations/namespaces/gantt-configuration.namespace';

const TEXT_HEIGHT: number = 10;
const TIME_UNIT_COLOR: string = '#1D1C36';
const YEAR_COLOR: string = '#3D5159';
const TEXT_PADDING: number = 4;
const TEXT_SIZE: number = 10;
const BORDER_HEIGHT: number = 16;
const DELIMITER_COLOR: string = 'rgba(0,0,0,0.1)';

export const TIMELINE_LABELS_PLUGIN: Plugin = {
  id: 'DATE_LABELS_PLUGIN',
  afterDraw: (chart: Chart) => {
    const ctx = chart.canvas.getContext('2d');
    if (ctx === null) {
      return;
    }
    const xAxis: GanttTimeScale = chart.scales['x'] as any;
    ctx.save();
    ctx.beginPath();
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.strokeStyle = DELIMITER_COLOR;
    ctx.lineWidth = 1;
    xAxis.ticks.forEach((tick: Tick, index: number) => {
      // if (index === 0) {
      //   drawTick(ctx, xAxis, tick.value - 1);
      // }
      drawTick(ctx, xAxis, tick);
    });
    ctx.stroke();
    ctx.restore();
  },
};

function drawTick(
  ctx: CanvasRenderingContext2D,
  xAxis: GanttTimeScale,
  tick: Tick
): void {
  const numberTickValue: number = Number(tick.value);
  const dateTickValue: GanttDate = new GanttDate(numberTickValue);
  const tickDateLabel: string = xAxis.getLabelForValue(numberTickValue);
  const tickYearLabel: string = dateTickValue.getYearTimeUnitString();
  ctx.font = `bold ${TEXT_SIZE}px Helvetica`;
  ctx.fillStyle = TIME_UNIT_COLOR;
  const tickLeftPosition: number = xAxis.getPixelForValue(numberTickValue);
  const tickIndex: number = xAxis.ticks.indexOf(tick);
  const nextTickIndex: Tick = xAxis.ticks[tickIndex + 1];
  const prevTickIndex = xAxis.ticks[tickIndex - 1];
  const isLastTick: boolean = nextTickIndex === undefined;
  const nextTickLeftPosition: number = xAxis.getPixelForValue(
    nextTickIndex?.value
  );
  const prevTickLeftPosition: number = xAxis.getPixelForValue(
    prevTickIndex?.value
  );
  const tickWidth: number = isLastTick
    ? tickLeftPosition - prevTickLeftPosition
    : nextTickLeftPosition - tickLeftPosition;
  const yPadding: number =
    (GanttConfiguration.TIMELINE_HEIGHT_PX - BORDER_HEIGHT) / 2;
  ctx.moveTo(tickLeftPosition + tickWidth, yPadding);
  ctx.lineTo(tickLeftPosition + tickWidth, yPadding + BORDER_HEIGHT);
  if (tickYearLabel === tickDateLabel) {
    const yearPadding: number =
      (GanttConfiguration.TIMELINE_HEIGHT_PX - TEXT_HEIGHT) / 2;
    ctx.fillText(tickDateLabel, tickLeftPosition + tickWidth / 2, yearPadding);
    return;
  }
  ctx.fillText(
    tickDateLabel,
    tickLeftPosition + tickWidth / 2,
    TEXT_PADDING * 2
  );
  ctx.font = `400 ${TEXT_SIZE}px Helvetica`;
  ctx.fillStyle = YEAR_COLOR;
  ctx.fillText(
    tickYearLabel,
    tickLeftPosition + tickWidth / 2,
    TEXT_PADDING * 3 + TEXT_HEIGHT
  );
}
