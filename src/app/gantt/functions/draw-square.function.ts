import { GanttFillRectConfig } from '../declarations/interfaces/gantt-fill-rect-config.interface';
import { GanttSquare } from '../declarations/interfaces/gantt-square.interface';
import { getSquareFromConfig } from './get-square-from-config.function';

export function drawSquare(
  canvas: CanvasRenderingContext2D,
  config: GanttFillRectConfig,
  color: string,
  borderRadius: number
): void {
  const square: GanttSquare = getSquareFromConfig(config, borderRadius);
  canvas.beginPath();
  canvas.strokeStyle = color;
  canvas.fillStyle = color;
  canvas.lineWidth = 1;
  canvas.moveTo(square.leftTopR.x, square.leftTopR.y);
  canvas.lineTo(square.rightTopL.x, square.rightTopL.y);
  canvas.quadraticCurveTo(
    square.rightTop.x,
    square.rightTop.y,
    square.rightTopB.x,
    square.rightTopB.y
  );
  canvas.lineTo(square.rightBotT.x, square.rightBotT.y);
  canvas.quadraticCurveTo(
    square.rightBot.x,
    square.rightBot.y,
    square.rightBotL.x,
    square.rightBotL.y
  );
  canvas.lineTo(square.leftBotR.x, square.leftBotR.y);
  canvas.quadraticCurveTo(
    square.leftBot.x,
    square.leftBot.y,
    square.leftBotT.x,
    square.leftBotT.y
  );
  canvas.lineTo(square.leftTopB.x, square.leftTopB.y);
  canvas.quadraticCurveTo(
    square.leftTop.x,
    square.leftTop.y,
    square.leftTopR.x,
    square.leftTopR.y
  );
  canvas.closePath();
  canvas.fill();
  canvas.stroke();
}
