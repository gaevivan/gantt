import { GanttFillRectConfig } from '../declarations/interfaces/gantt-fill-rect-config.interface';
import { GanttSquare } from '../declarations/interfaces/gantt-square.interface';

export function getSquareFromConfig(
  config: GanttFillRectConfig,
  borderRadius: number
): GanttSquare {
  return {
    leftTop: { x: config.left, y: config.top },
    leftTopR: { x: config.left + borderRadius, y: config.top },
    leftTopB: { x: config.left, y: config.top + borderRadius },
    rightTop: {
      x: config.left + config.width + borderRadius,
      y: config.top,
    },
    rightTopL: { x: config.left + config.width, y: config.top },
    rightTopB: {
      x: config.left + config.width + borderRadius,
      y: config.top + borderRadius,
    },
    rightBot: {
      x: config.left + config.width + borderRadius,
      y: config.top + config.height + borderRadius,
    },
    rightBotT: {
      x: config.left + config.width + borderRadius,
      y: config.top + config.height,
    },
    rightBotL: {
      x: config.left + config.width,
      y: config.top + config.height + borderRadius,
    },
    leftBot: {
      x: config.left,
      y: config.top + config.height + borderRadius,
    },
    leftBotR: {
      x: config.left + borderRadius,
      y: config.top + config.height + borderRadius,
    },
    leftBotT: { x: config.left, y: config.top + config.height },
  };
}
