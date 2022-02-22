import { Chart, Plugin, Scale } from 'chart.js';
import { GanttDate } from '../declarations/classes/gantt-date.class';

const TEXT_HEIGHT: number = 10;
const BACKGROUND_COLOR: string = '#334A54';
const LINE_COLOR: string = BACKGROUND_COLOR;
const TEXT_COLOR: string = '#FFFFFF';
const TEXT_PADDING: number = 4;
const TOP: number = 1;
const TEXT_SIZE: number = 10;

export const TODAY_LINE_PLUGIN: Plugin = {
  id: 'TODAY_LINE_PLUGIN',
  afterDraw: (chart: Chart) => {
    const ctx: CanvasRenderingContext2D | null = chart.canvas.getContext('2d');
    if (ctx === null) {
      return;
    }
    const yAxis: Scale = chart.scales['y'];
    const xAxis: Scale = chart.scales['x'];
    const xValue: number = xAxis.getPixelForValue(0);
    ctx.beginPath();
    ctx.moveTo(xValue, 0);
    drawLine(ctx, xAxis, yAxis);
    drawChip(ctx, xAxis);
    drawText(ctx, xAxis);
  },
};

function drawLine(
  ctx: CanvasRenderingContext2D,
  xAxis: Scale,
  yAxis: Scale
): void {
  const xValue: number = xAxis.getPixelForValue(0);
  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = 1.5;
  ctx.lineTo(xValue, yAxis.bottom);
  ctx.stroke();
}

function drawChip(ctx: CanvasRenderingContext2D, xAxis: Scale): void {
  const xValue: number = xAxis.getPixelForValue(0);
  const todayText: string = new GanttDate().getTodayLineText();
  const textWidth: number = ctx.measureText(todayText).width + TEXT_PADDING * 2;
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(
    xValue - textWidth / 2,
    0,
    textWidth,
    TEXT_HEIGHT + TEXT_PADDING * 2
  );
}

function drawText(ctx: CanvasRenderingContext2D, xAxis: Scale): void {
  const xValue: number = xAxis.getPixelForValue(0);
  const todayText: string = new GanttDate().getTodayLineText();
  ctx.textBaseline = 'top';
  ctx.font = `normal ${TEXT_SIZE}px`;
  ctx.fillStyle = TEXT_COLOR;
  ctx.textAlign = 'center';
  ctx.fillText(todayText, xValue, TOP + TEXT_PADDING);
}
