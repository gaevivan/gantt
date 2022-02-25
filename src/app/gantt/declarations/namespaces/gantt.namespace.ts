import * as ChartJs from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';

export namespace GanttModel {
  export type DataUnit = [number, number] | null;
  export type DataList = DataUnit[];
  export type Type = 'line' | 'bar';
  export type Dataset = ChartJs.ChartDataset<Type, DataUnit[]>;
  export type Data = ChartJs.ChartData<Type, DataUnit[]>;
  export type Plugin = ChartJs.Plugin<Type>;
  export type LegendOptions = Partial<ChartJs.LegendOptions<Type>>;
  export type TooltipOptions = Partial<ChartJs.TooltipOptions<Type>>;
  export type AnimationOptions = DeepPartial<ChartJs.AnimationSpec<Type>>;
  export type Configuration = ChartJs.ChartConfiguration<Type, DataUnit[]>;
  export type Scales = {
    x: DeepPartial<
      ChartJs.ScaleOptionsByType<ChartJs.ChartTypeRegistry[Type]['scales']>
    >;
    y: DeepPartial<
      ChartJs.ScaleOptionsByType<ChartJs.ChartTypeRegistry[Type]['scales']>
    >;
  };
  export type Options = ChartJs.ChartOptions<Type>;
  export class Chart extends ChartJs.Chart<
    GanttModel.Type,
    GanttModel.DataList
  > {
    constructor(item: ChartJs.ChartItem, config: GanttModel.Configuration) {
      super(item, config);
    }
  }
}
