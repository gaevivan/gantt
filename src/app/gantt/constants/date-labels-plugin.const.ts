import { Chart, Plugin, Scale, Tick } from 'chart.js';
import { GanttDate } from '../declarations/classes/gantt-date.class';

const TEXT_HEIGHT: number = 10;
const TIME_UNIT_COLOR: string = '#1D1C36';
const YEAR_COLOR: string = '#3D5159';
const TEXT_PADDING: number = 4;
const TEXT_SIZE: number = 10;
const TIME_LINE_HEIGHT: number = 40;
const BORDER_HEIGHT: number = 16;
const DELIMITER_COLOR: string = 'rgba(0,0,0,0.1)';

export const DATE_LABELS_PLUGIN: Plugin = {
  id: 'DATE_LABELS_PLUGIN',
  afterDraw: (chart: Chart) => {
    const ctx = chart.canvas.getContext('2d');
    if (ctx === null) {
      return;
    }
    const xAxis = chart.scales['x'];
    ctx.save();
    ctx.beginPath();
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.strokeStyle = DELIMITER_COLOR;
    ctx.lineWidth = 1;
    xAxis.ticks.forEach((tickValue: Tick) => drawTick(ctx, xAxis, tickValue));
    ctx.stroke();
    ctx.restore();
  },
};

function drawTick(
  ctx: CanvasRenderingContext2D,
  xAxis: Scale,
  tickValue: Tick
): void {
  const numberTickValue: number = Number(Number(tickValue.value).toFixed(0));
  const date: GanttDate = new GanttDate(numberTickValue);
  ctx.font = `bold ${TEXT_SIZE}px Helvetica`;
  ctx.fillStyle = TIME_UNIT_COLOR;
  const xPos: number = xAxis.getPixelForValue(tickValue.value);
  const width: number = Math.floor(
    xPos - xAxis.getPixelForValue(tickValue.value - 1)
  );
  const yPadding: number = (TIME_LINE_HEIGHT - BORDER_HEIGHT) / 2;
  ctx.moveTo(xPos + width, yPadding);
  ctx.lineTo(xPos + width, yPadding + BORDER_HEIGHT);
  ctx.fillText(date.getDateWithLocale(), xPos + width / 2, TEXT_PADDING * 2);
  ctx.font = `400 ${TEXT_SIZE}px Helvetica`;
  ctx.fillStyle = YEAR_COLOR;
  ctx.fillText(
    date.getYearAsString(),
    xPos + width / 2,
    TEXT_PADDING * 3 + TEXT_HEIGHT
  );
}
