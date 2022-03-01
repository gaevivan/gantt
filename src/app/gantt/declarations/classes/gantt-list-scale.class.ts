import { ScriptableScaleContext, Tick } from 'chart.js';
import { GanttConfiguration } from '../namespaces/gantt-configuration.namespace';
import { GanttGridScaleOptions } from '../types/gantt-grid-scale-options.type';
import { GanttGridScale } from './gantt-grid-scale.class';

const GRID_LINE_COLOR: string = '#000000';
const TRANSPARENT_COLOR: string = 'transparent';
const rowHeightPx: number = 40;

export class GanttListScale extends GanttGridScale {
  public static override id: string = 'GanttListScale';

  public static override getDefaultOptions(ticksCount: number): any {
    const defaultOptions: Partial<GanttGridScaleOptions> =
      GanttGridScale.getDefaultOptions(ticksCount);
    return {
      ...defaultOptions,
      type: 'GanttListScale',
      afterFit: (scale: GanttGridScale) => {
        // console.log(scale.min, scale.chart.data);
        // scale.height = scale.ticks.length * ticksCount;
      },
      grid: {
        ...defaultOptions.grid,
        color: ({ tick, scale, index }: ScriptableScaleContext) => {
          const yPosition: number = (index + 1) * rowHeightPx;
          if (yPosition <= GanttConfiguration.TIMELINE_HEIGHT_PX) {
            return TRANSPARENT_COLOR;
          }
          return GRID_LINE_COLOR;
        },
        offset: false,
      },
      min: 0,
      max: ticksCount,
      count: ticksCount,
      reverse: true,
    } as GanttGridScaleOptions;
  }

  public override buildTicks(): Tick[] {
    const options: GanttGridScaleOptions = this.options as any;
    // console.log(options);
    return new Array(options.count).fill(null).map((_, index: number) => {
      const value: number = Math.floor(this.min) + index;
      return {
        value,
      };
    });
  }

  public override getMinMax(canStack: boolean): { min: number; max: number } {
    return GanttGridScale.prototype.getMinMax.apply(this, [canStack]);
  }

  public override getPixelForTick(index: number): number {
    return (index + 1) * rowHeightPx;
  }
}
