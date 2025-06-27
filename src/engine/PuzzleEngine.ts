import { Block } from "../types/Block";
import { Board } from "../types/Board";
import { BlockType, Direction, GameMode } from "../types/Common";
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

  move(gameState: GameState, blockId: string, direction: Direction) {
    if (gameState.isWin) return false;

    const moved = gameState.board.move(blockId, direction);

    if (moved) {
      const newGameState = new GameState(gameState.gameMode, gameState.board);
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

  undoMove(gameState: GameState): GameState {
    const lastMove = gameState.history[gameState.history.length - 1];

    const newGameState = new GameState(gameState.gameMode, gameState.board);

    newGameState.moveCount = gameState.moveCount - 1;
    newGameState.startTime = gameState.startTime;
    newGameState.history = gameState.history.slice(0, -1);
    newGameState.isWin = gameState.isWin;

    newGameState.board.move(
      lastMove.blockId,
      this.getReversedDirection(lastMove.moveDirection)
    );

    return newGameState;
  }

  resetLevel(): GameState {
    return new GameState(GameMode.NORMAL, this.initializeLevel());
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
}
