import { Block } from "../types/Block";
import { Board } from "../types/Board";
import { BlockType, Direction } from "../types/Common";
import { GameState } from "../types/GameState";
import { Position } from "../types/Position";
import { getRandomInt } from "../utils/randomInt";
import { shuffle } from "../utils/shuffle";

export class PuzzleEngine {
  constructor() {}

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

      newGameState.isWin = this.isGameWon(newGameState.board);
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

  resetLevel(gameState: GameState): GameState {
    return new GameState(gameState.gameMode, this.initializeBoard());
  }

  initializeBoard(): Board {
    const board = new Board();

    const rectHorRectCount = getRandomInt(6);
    const blocks: Block[] = [
      // new Block(BlockType.BIG_SQUARE),
      ...Array(rectHorRectCount)
        .fill(null)
        .map(() => new Block(BlockType.HORIZONTAL_RECT)),
      ...Array(5 - rectHorRectCount)
        .fill(null)
        .map(() => new Block(BlockType.VERTICAL_RECT)),
      ...Array(4)
        .fill(null)
        .map(() => new Block(BlockType.SMALL_SQUARE)),
    ];

    do {
      board.clear();
      board.addBlock(new Block(BlockType.BIG_SQUARE, new Position(1, 3)));

      this.randomizeBoard(board, blocks);
      board.shuffle();
    } while (this.isGameWon(board));

    return board;
  }

  private randomizeBoard(
    board: Board,
    blocks: Block[],
    currentBlockIndex: number = 0
  ): boolean {
    if (currentBlockIndex >= blocks.length) return true;
    const currentBlock = blocks[currentBlockIndex];

    const availablePositions = shuffle(
      board.getAvailablePositions(currentBlock)
    );

    while (availablePositions.length > 0) {
      currentBlock.position = availablePositions[0];
      availablePositions.shift();

      if (board.addBlock(currentBlock)) {
        if (this.randomizeBoard(board, blocks, currentBlockIndex + 1)) {
          return true;
        }

        board.removeBlock(currentBlock.id);
      }
    }

    return false;
  }

  private isGameWon(board: Board): boolean {
    const bigSquare = board.blocks.find(
      (block) =>
        block.type === BlockType.BIG_SQUARE &&
        block.position.x === board.exitPosition.x &&
        block.position.y === board.exitPosition.y
    );
    return !!bigSquare;
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
