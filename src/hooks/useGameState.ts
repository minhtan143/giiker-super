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

  const onMoveBlock = useCallback(
    (blockId: string, direction: Direction) => {
      if (gameState.isWin) return false;

      const moved = board.move(blockId, direction);
      if (moved) {
        gameState.addMove(blockId, direction);
        setGameState(gameState);
        setBoard(board);
      }
      return moved;
    },
    [board, gameState]
  );

  //   // Undo the last move
  //   const undoMove = useCallback(() => {
  //     if (!engine || gameState.moves === 0) return false;

  //     const undone = engine.undoMove();
  //     return undone;
  //   }, [engine, gameState.moves]);

  return {
    gameState,
    board,
    onMoveBlock,
  };
}
