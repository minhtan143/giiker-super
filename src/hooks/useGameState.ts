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
        const newGameState = new GameState(gameState.gameMode);
        newGameState.moveCount = gameState.moveCount + 1;
        newGameState.startTime = gameState.startTime;
        newGameState.history = [
          ...gameState.history,
          { blockId, moveDirection: direction },
        ];

        newGameState.isWin = gameState.isWin;

        setGameState(newGameState);

        const boardCopy = new Board();
        boardCopy.blocks = [...board.blocks];
        boardCopy.exitPosition = board.exitPosition;
        boardCopy.size = board.size;
        setBoard(boardCopy);
      }

      return moved;
    },
    [gameState, board]
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
