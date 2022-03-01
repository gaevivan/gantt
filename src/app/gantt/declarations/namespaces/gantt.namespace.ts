import * as ChartJs from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';
import { GanttStatus } from '../enums/gantt-status.enum';

export namespace GanttModel {
  export type InputDataItem = {
    id: string;
    value: [number, number];
    status: GanttStatus;
  };
  export type DataUnit = [number, number] | null;
  export type DataList = DataUnit[];
  export type Type = 'line' | 'bar';
  export type Dataset = ChartJs.ChartDataset<Type, DataList>;
  export type Data = ChartJs.ChartData<Type, DataList>;
  export type Plugin = ChartJs.Plugin<Type>;
  export type LegendOptions = Partial<ChartJs.LegendOptions<Type>>;
  export type TooltipOptions = Partial<ChartJs.TooltipOptions<Type>>;
  export type AnimationOptions = DeepPartial<ChartJs.AnimationSpec<Type>>;
  export type Configuration = ChartJs.ChartConfiguration<Type, DataList>;
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
