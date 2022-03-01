import { Chart, Plugin, Scale } from 'chart.js';
import { GanttStatus } from '../declarations/enums/gantt-status.enum';
import { GanttModel } from '../declarations/namespaces/gantt.namespace';
import { drawSquare } from '../functions/draw-square.function';
import { GanttStatusColor } from './gantt-status-color.const';

const ITEM_HEIGHT: number = 40;
const ITEM_PADDING: number = 6;
const BORDER_RADIUS: number = 2;
const MIN_WIDTH_PX: number = 8;

export const GANTT_DATA_PLUGIN: Plugin = {
  id: 'GANTT_DATA_PLUGIN',
  afterDraw: (chart: Chart) => {
    const ctx = chart.canvas.getContext('2d');
    if (ctx === null) {
      return;
    }
    const xAxis: Scale = chart.scales['x'];
    const yAxis: Scale = chart.scales['y'];
    const dataset: GanttModel.Dataset = chart.data
      .datasets[0] as GanttModel.Dataset;
    const data: GanttModel.DataList = dataset.data as GanttModel.DataList;
    data.forEach((dataItem: GanttModel.DataUnit | null, index: number) => {
      if (dataItem === null) {
        return;
      }
      const xStartPos: number = xAxis.getPixelForValue(dataItem[0]);
      const xEndPos: number = xAxis.getPixelForValue(dataItem[1]);
      const yPos: number = Math.floor(yAxis.getPixelForValue(index));
      if (yPos < 0) {
        return;
      }
      const widthPx: number = xEndPos - xStartPos - ITEM_PADDING;
      drawSquare(
        ctx,
        {
          top: yPos + ITEM_PADDING,
          left: xStartPos + ITEM_PADDING,
          height: ITEM_HEIGHT - ITEM_PADDING * 2,
          width: widthPx <= MIN_WIDTH_PX ? MIN_WIDTH_PX : widthPx,
        },
        GanttStatusColor[
          Array.from(Object.values(GanttStatus))[Math.floor(index / 3)]
        ],
        BORDER_RADIUS
      );
    });
  },
};
