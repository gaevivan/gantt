import { Chart, Plugin, Scale } from 'chart.js';
import { GanttStatus } from '../declarations/enums/gantt-status.enum';
import { GanttConfiguration } from '../declarations/namespaces/gantt-configuration.namespace';
import { GanttModel } from '../declarations/namespaces/gantt.namespace';
import { drawSquare } from '../functions/draw-square.function';
import { GanttStatusColor } from './gantt-status-color.const';

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
      const widthPx: number =
        xEndPos - xStartPos - GanttConfiguration.ITEM_PADDING_PX;
      drawSquare(
        ctx,
        {
          top: yPos + GanttConfiguration.ITEM_PADDING_PX,
          left: xStartPos + GanttConfiguration.ITEM_PADDING_PX,
          height:
            GanttConfiguration.ITEM_HEIGHT_PX -
            GanttConfiguration.ITEM_PADDING_PX * 2,
          width:
            widthPx <= GanttConfiguration.ITEM_MIN_WIDTH_PX
              ? GanttConfiguration.ITEM_MIN_WIDTH_PX
              : widthPx,
        },
        GanttStatusColor[
          Array.from(Object.values(GanttStatus))[Math.floor(index / 3)]
        ],
        GanttConfiguration.ITEM_BORDER_RADIUS_PX
      );
    });
  },
};
