import { useCallback, useState } from "react";
import { PuzzleEngine } from "../engine/PuzzleEngine";
import { Direction } from "../types/Common";
import { GameState } from "../types/GameState";

export function useGameState() {
  const [engine] = useState<PuzzleEngine>(new PuzzleEngine());
  const [gameState, setGameState] = useState<GameState>(engine.resetLevel());

  const handleMoveBlock = useCallback(
    (blockId: string, direction: Direction) => {
      if (gameState.isWin) return false;

      const newGameState = engine.move(gameState, blockId, direction);
      if (!newGameState) return false;

      setGameState(newGameState);
      return true;
    },
    [engine, gameState]
  );

  const handleUndoMove = useCallback(() => {
    if (!engine || gameState.moveCount === 0) return false;

    const newGameState = engine.undoMove(gameState);
    setGameState(newGameState);
    return true;
  }, [engine, gameState]);

  const handleResetLevel = useCallback(() => {
    if (!engine) return false;

    const gameState = engine.resetLevel();
    setGameState(gameState);
    return true;
  }, [engine]);

  return {
    gameState,
    handleMoveBlock,
    handleResetLevel,
    handleUndoMove,
  };
}
