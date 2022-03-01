import { Chart, Plugin } from 'chart.js';
import { GanttConfiguration } from '../declarations/namespaces/gantt-configuration.namespace';

export const CHART_BACKGROUND_COLOR_PLUGIN: Plugin = {
  id: 'CHART_BACKGROUND_COLOR_PLUGIN',
  beforeDraw: (chart: Chart) => {
    const ctx = chart.canvas.getContext('2d');
    if (ctx === null) {
      return;
    }
    ctx.save();
    ctx.fillStyle = GanttConfiguration.CHART_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.fillStyle = GanttConfiguration.TIMELINE_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, chart.width, GanttConfiguration.TIMELINE_HEIGHT_PX);
    ctx.restore();
  },
};
