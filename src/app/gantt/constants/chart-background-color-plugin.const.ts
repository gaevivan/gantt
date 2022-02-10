import { Chart, Plugin } from 'chart.js';

const CHART_BACKGROUND_COLOR: string = '#F5F6F7';

export const CHART_BACKGROUND_COLOR_PLUGIN: Plugin<'bar'> = {
  id: 'CHART_BACKGROUND_COLOR_PLUGIN',
  beforeDraw: (chart: Chart<'bar'>) => {
    const ctx = chart.canvas.getContext('2d');
    if (ctx === null) {
      return;
    }
    ctx.save();
    ctx.fillStyle = CHART_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};