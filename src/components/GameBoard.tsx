import React, { useEffect, useRef, useState } from "react";
import type { Block } from "../types/Block";
import { Direction } from "../types/Common";
import type { GameState } from "../types/GameState";
import { Position } from "../types/Position";
import drawBoard, { GRID_SIZE } from "../utils/Draw";
import "./GameBoard.css";

interface GameBoardProps {
  gameState: GameState;
  onMoveBlock: (blockId: string, direction: Direction) => boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onMoveBlock }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [clickedLocation, setClickedLocation] = useState<Position | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    drawBoard(ctx, gameState);
  }, [gameState]);

  useEffect(() => {
    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (gameState.isWin || !canvasRef.current) return;

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

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [clickedLocation, selectedBlock, gameState.isWin, onMoveBlock]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState.isWin || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setClickedLocation(new Position(mouseX, mouseY));

    const gridX = Math.floor(mouseX / GRID_SIZE);
    const gridY = Math.floor(mouseY / GRID_SIZE);

    const clickedBlock = gameState.board.getBlockByPosition(
      new Position(gridX, gridY)
    );
    setSelectedBlock(clickedBlock);
  };

  const getDirection = (dx: number, dy: number): Direction => {
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? Direction.RIGHT : Direction.LEFT;
    } else {
      return dy > 0 ? Direction.DOWN : Direction.UP;
    }
  };

  return (
    <div className="game-board-container">
      <div className="game-board-wrapper">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * gameState.board.size.width}
          height={GRID_SIZE * gameState.board.size.height}
          onMouseDown={handleMouseDown}
          className="game-canvas"
        />
      </div>
    </div>
  );
};

export default GameBoard;
