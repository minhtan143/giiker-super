import { BlockType } from "../types/Common";
import type { GameState } from "../types/GameState";

export const GRID_SIZE = 80;
const BLOCK_MARGIN = 2;

const COLORS = {
  [BlockType.BIG_SQUARE]: "#FF5252", // Red for target block
  [BlockType.SMALL_SQUARE]: "#4CAF50", // Green
  [BlockType.HORIZONTAL_RECT]: "#2196F3", // Blue
  [BlockType.VERTICAL_RECT]: "#FFC107", // Amber
};

export default function drawBoard(
  ctx: CanvasRenderingContext2D,
  gameState: GameState
) {
  const canvas = ctx.canvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#37474F";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#546E7A";
  ctx.lineWidth = 1;
  for (let i = 0; i <= gameState.board.size.width; i++) {
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(i * GRID_SIZE, 0);
    ctx.lineTo(i * GRID_SIZE, canvas.height);
    ctx.stroke();

    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, i * GRID_SIZE);
    ctx.lineTo(canvas.width, i * GRID_SIZE);
    ctx.stroke();
  }

  // Draw exit zone with LED-style indicator
  const exitX = gameState.board.exitPosition.x * GRID_SIZE;
  const exitY = gameState.board.exitPosition.y * GRID_SIZE;

  // Exit zone background - now 2x2 to match BIG_SQUARE size
  ctx.fillStyle = gameState.isWin ? "#4CAF50" : "#F5CECE";
  ctx.fillRect(exitX, exitY, GRID_SIZE * 2, GRID_SIZE * 2);

  // Draw diagonal lines in exit zone
  ctx.beginPath();
  ctx.strokeStyle = gameState.isWin ? "#388E3C" : "#B0BEC5";
  ctx.lineWidth = 2;
  // First diagonal (top-left to bottom-right)
  ctx.moveTo(exitX + 5, exitY + 5);
  ctx.lineTo(exitX + GRID_SIZE * 2 - 5, exitY + GRID_SIZE * 2 - 5);
  // Second diagonal (top-right to bottom-left)
  ctx.moveTo(exitX + GRID_SIZE * 2 - 5, exitY + 5);
  ctx.lineTo(exitX + 5, exitY + GRID_SIZE * 2 - 5);
  ctx.stroke();

  // LED indicator border - also 2x2 now
  ctx.strokeStyle = gameState.isWin ? "#388E3C" : "#B0BEC5";
  ctx.lineWidth = 3;
  ctx.strokeRect(exitX + 5, exitY + 5, GRID_SIZE * 2 - 10, GRID_SIZE * 2 - 10);

  // Draw blocks
  gameState.board.blocks.forEach((block) => {
    const { x, y } = block.position;
    const pixelX = x * GRID_SIZE;
    const pixelY = y * GRID_SIZE;

    // Get dimensions based on block type
    let width = GRID_SIZE;
    let height = GRID_SIZE;

    switch (block.type) {
      case BlockType.BIG_SQUARE:
        width = GRID_SIZE * 2;
        height = GRID_SIZE * 2;
        break;
      case BlockType.HORIZONTAL_RECT:
        width = GRID_SIZE * 2;
        break;
      case BlockType.VERTICAL_RECT:
        height = GRID_SIZE * 2;
        break;
    }

    // Fill block with color
    ctx.fillStyle = COLORS[block.type];
    ctx.fillRect(
      pixelX + BLOCK_MARGIN,
      pixelY + BLOCK_MARGIN,
      width - BLOCK_MARGIN * 2,
      height - BLOCK_MARGIN * 2
    );

    // Add highlight effect (gradient)
    const gradient = ctx.createLinearGradient(
      pixelX + BLOCK_MARGIN,
      pixelY + BLOCK_MARGIN,
      pixelX + width - BLOCK_MARGIN,
      pixelY + height - BLOCK_MARGIN
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(
      pixelX + BLOCK_MARGIN,
      pixelY + BLOCK_MARGIN,
      width - BLOCK_MARGIN * 2,
      height - BLOCK_MARGIN * 2
    );
  });

  // Win animation - only if game is won
  if (gameState.isWin) {
    const targetBlock = gameState.board.blocks.find(
      (block) =>
        block.type === BlockType.BIG_SQUARE &&
        block.position.x === gameState.board.exitPosition.x &&
        block.position.y === gameState.board.exitPosition.y
    );
    if (targetBlock) {
      const { x, y } = targetBlock.position;
      const pixelX = x * GRID_SIZE;
      const pixelY = y * GRID_SIZE;

      // Glow effect around target block
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(
        pixelX + GRID_SIZE,
        pixelY + GRID_SIZE,
        GRID_SIZE * 1.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
}
