import { useCallback, useState } from "react";
import { PuzzleEngine } from "../engine/PuzzleEngine";
import { Board } from "../types/Board";
import { Direction, GameMode } from "../types/Common";
import { GameState } from "../types/GameState";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(
    new GameState(GameMode.NORMAL)
  );
  const [engine] = useState<PuzzleEngine>(new PuzzleEngine());
  const [board, setBoard] = useState<Board>(engine.initializeLevel());

  const handleMoveBlock = useCallback(
    (blockId: string, direction: Direction) => {
      if (gameState.isWin) return false;

      const newGameState = engine.move(gameState, board, blockId, direction);
      if (!newGameState) return false;

      setGameState(newGameState);
      return true;
    },
    [engine, gameState, board]
  );

  const handleUndoMove = useCallback(() => {
    if (!engine || gameState.moveCount === 0) return false;

    const { newGameState, newBoard } = engine.undoMove(gameState, board);
    setGameState(newGameState);
    setBoard(newBoard);
    return true;
  }, [engine, gameState, board]);

  const handleResetLevel = useCallback(() => {
    if (!engine) return false;

    const reset = engine.resetLevel();
    return reset;
  }, [engine]);

  return {
    gameState,
    board,
    handleMoveBlock,
    handleResetLevel,
    handleUndoMove,
  };
}
