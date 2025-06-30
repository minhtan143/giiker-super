import { useState } from "react";
import { PuzzleEngine } from "../engine/PuzzleEngine";
import { Board } from "../types/Board";
import { Direction, GameMode } from "../types/Common";
import { GameState } from "../types/GameState";

export function useGameState() {
  const [engine] = useState<PuzzleEngine>(() => new PuzzleEngine());
  const [gameState, setGameState] = useState<GameState>(
    () => new GameState(GameMode.NORMAL, engine.initializeBoard())
  );

  const handleMoveBlock = (blockId: string, direction: Direction) => {
    if (gameState.isWin) return false;

    const newGameState = engine.move(gameState, blockId, direction);
    if (!newGameState) return false;

    setGameState(newGameState);
    return true;
  };

  const handleUndoMove = () => {
    if (gameState.moveCount === 0) return;

    const newGameState = engine.undoMove(gameState);
    setGameState(newGameState);
  };

  const handleResetLevel = () => {
    setGameState(() => engine.resetLevel(gameState));
  };

  if (!gameState) {
    const emptyBoard = new Board();
    return {
      gameState: new GameState(GameMode.NORMAL, emptyBoard),
      handleMoveBlock,
      handleResetLevel,
      handleUndoMove,
    };
  }

  return {
    gameState,
    handleMoveBlock,
    handleResetLevel,
    handleUndoMove,
  };
}
