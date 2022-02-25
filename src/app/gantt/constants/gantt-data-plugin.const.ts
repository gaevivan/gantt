import { Chart, Plugin, Scale, Tick } from 'chart.js';
import { GanttDate } from '../declarations/classes/gantt-date.class';
import { GanttStatus } from '../declarations/enums/gantt-status.enum';
import { drawSquare } from '../functions/draw-square.function';
import { GanttStatusColor } from './gantt-status-color.const';

const TEXT_HEIGHT: number = 10;
const TIME_UNIT_COLOR: string = '#1D1C36';
const YEAR_COLOR: string = '#3D5159';
const TEXT_PADDING: number = 4;
const TEXT_SIZE: number = 10;
const BORDER_HEIGHT: number = 16;
const DELIMITER_COLOR: string = 'rgba(0,0,0,0.1)';

const TIME_LINE_HEIGHT: number = 40;
const ITEM_HEIGHT: number = 40;
const ITEM_PADDING: number = 6;
const BORDER_RADIUS: number = 2;

export const GANTT_DATA_PLUGIN: Plugin = {
  id: 'GANTT_DATA_PLUGIN',
  afterDraw: (chart: Chart) => {
    const ctx = chart.canvas.getContext('2d');
    if (ctx === null) {
      return;
    }
    const xAxis = chart.scales['x'];
    const yAxis = chart.scales['y'];
    const dataset = chart.data.datasets[0];
    const data: [number, number][] = dataset.data as any;
    console.log(data);
    // const
    // ctx.save();
    // ctx.beginPath();
    // // ctx.textBaseline = 'top';
    // // ctx.textAlign = 'center';
    // // ctx.strokeStyle = DELIMITER_COLOR;
    // // ctx.lineWidth = 1;
    data.forEach((dataItem, index) => {
      const xStartPos: number = xAxis.getPixelForValue(dataItem[0]);
      const xEndPos: number = xAxis.getPixelForValue(dataItem[1]);
      const yPos: number = yAxis.getPixelForValue(index);
      drawSquare(
        ctx,
        {
          top: yPos + ITEM_PADDING,
          left: xStartPos + ITEM_PADDING,
          height: ITEM_HEIGHT - ITEM_PADDING,
          width: xEndPos - xStartPos - ITEM_PADDING,
        },
        GanttStatusColor[
          Array.from(Object.values(GanttStatus))[Math.floor(index / 3)]
        ],
        BORDER_RADIUS
      );
    });

    // ctx.stroke();
    // ctx.restore();
  },
};

function drawBar(
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
  ctx.moveTo(xPos + width / 2, yPadding);
  ctx.lineTo(xPos + width / 2, yPadding + BORDER_HEIGHT);
  ctx.fillText(date.getDateWithLocale(), xPos, TEXT_PADDING * 2);
  ctx.font = `400 ${TEXT_SIZE}px Helvetica`;
  ctx.fillStyle = YEAR_COLOR;
  ctx.fillText(date.getYearAsString(), xPos, TEXT_PADDING * 3 + TEXT_HEIGHT);
}
