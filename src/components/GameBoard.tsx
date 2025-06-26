import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Block } from "../engine/Block";
import type { Board } from "../engine/Board";
import { Position } from "../engine/Position";
import { BlockType, Direction, type Size } from "../engine/Types";
import "./GameBoard.css";

const GRID_SIZE = 80; // Size of each grid cell in pixels

const COLORS = {
  [BlockType.BIG_SQUARE]: "#FF5252", // Red for target block
  [BlockType.SMALL_SQUARE]: "#4CAF50", // Green
  [BlockType.HORIZONTAL_RECT]: "#2196F3", // Blue
  [BlockType.VERTICAL_RECT]: "#FFC107", // Amber
};

interface GameBoardProps {
  board: Board;
  onMoveBlock: (blockId: string, direction: Direction) => boolean;
  isWin: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onMoveBlock, isWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const BLOCK_MARGIN = 2;

  const [clickedLocation, setClickedLocation] = useState<Position | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  const CANVAS_SIZE: Size = useMemo(
    () => ({
      width: GRID_SIZE * board.size.width,
      height: GRID_SIZE * board.size.height,
    }),
    [board.size.width, board.size.height]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);

    ctx.fillStyle = "#37474F";
    ctx.fillRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);

    ctx.strokeStyle = "#546E7A";
    ctx.lineWidth = 1;
    for (let i = 0; i <= board.size.width; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, CANVAS_SIZE.height);
      ctx.stroke();

      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(CANVAS_SIZE.width, i * GRID_SIZE);
      ctx.stroke();
    }

    // Draw exit zone with LED-style indicator
    const exitX = board.exitPosition.x * GRID_SIZE;
    const exitY = board.exitPosition.y * GRID_SIZE;

    // Exit zone background
    ctx.fillStyle = isWin ? "#4CAF50" : "#ECEFF1";
    ctx.fillRect(exitX, exitY, GRID_SIZE, GRID_SIZE);

    // LED indicator border
    ctx.strokeStyle = isWin ? "#388E3C" : "#B0BEC5";
    ctx.lineWidth = 3;
    ctx.strokeRect(exitX + 5, exitY + 5, GRID_SIZE - 10, GRID_SIZE - 10);

    // Draw blocks
    board.blocks.forEach((block) => {
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
    if (isWin) {
      const targetBlock = board.blocks.find(
        (block) => block.position === board.exitPosition
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
  }, [board, onMoveBlock, isWin, CANVAS_SIZE]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isWin || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setClickedLocation(new Position(mouseX, mouseY));

    const gridX = Math.floor(mouseX / GRID_SIZE);
    const gridY = Math.floor(mouseY / GRID_SIZE);

    const clickedBlock = board.getBlockByPosition(new Position(gridX, gridY));
    setSelectedBlock(clickedBlock);
  };

  const getDirection = (dx: number, dy: number): Direction => {
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? Direction.RIGHT : Direction.LEFT;
    } else {
      return dy > 0 ? Direction.DOWN : Direction.UP;
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isWin || !canvasRef.current) return;

    if (!clickedLocation || !selectedBlock) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = mouseX - clickedLocation.x;
    const dy = mouseY - clickedLocation.y;

    onMoveBlock(selectedBlock.id, getDirection(dx, dy));

    setClickedLocation(null);
    setSelectedBlock(null);
  };

  return (
    <div className="game-board-container">
      <div className="game-board-wrapper">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE.width}
          height={CANVAS_SIZE.height}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="game-canvas"
        />
      </div>
    </div>
  );
};

export default GameBoard;
