import { useCallback, useState } from "react";
import { Board } from "../engine/Board";
import { GameState } from "../engine/GameState";
import { Direction, GameMode } from "../engine/Types";
import { PuzzleEngine } from "../utils/PuzzleEngine";

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
