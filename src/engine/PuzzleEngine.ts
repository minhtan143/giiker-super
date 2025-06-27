import { Block } from "../types/Block";
import { Board } from "../types/Board";
import { BlockType, Direction } from "../types/Common";
import { GameState } from "../types/GameState";
import { Position } from "../types/Position";

export class PuzzleEngine {
  constructor() {}

  initializeLevel(): Board {
    const board = new Board();

    board.addBlock(
      new Block(BlockType.BIG_SQUARE, new Position(0, 0), {
        width: 2,
        height: 2,
      })
    );

    return board;
  }

  move(
    gameState: GameState,
    board: Board,
    blockId: string,
    direction: Direction
  ) {
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
      gameState = newGameState;
    }

    return gameState;
  }

  undoMove(gameState: GameState, board: Board) {
    const lastMove = gameState.history[gameState.history.length - 1];

    const newGameState = new GameState(gameState.gameMode);

    newGameState.moveCount = gameState.moveCount - 1;
    newGameState.startTime = gameState.startTime;
    newGameState.history = gameState.history.slice(0, -1);
    newGameState.isWin = gameState.isWin;

    const newBoard = new Board();
    newBoard.blocks = [...board.blocks];
    newBoard.exitPosition = board.exitPosition;
    newBoard.size = board.size;

    newBoard.move(
      lastMove.blockId,
      this.getReversedDirection(lastMove.moveDirection)
    );

    return { newGameState, newBoard };
  }

  private getReversedDirection(direction: Direction): Direction {
    switch (direction) {
      case Direction.UP:
        return Direction.DOWN;
      case Direction.DOWN:
        return Direction.UP;
      case Direction.LEFT:
        return Direction.RIGHT;
      case Direction.RIGHT:
        return Direction.LEFT;
    }
  }

  resetLevel(): Board {
    return this.initializeLevel();
  }
}
