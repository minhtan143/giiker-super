import { Block } from "../types/Block";
import { Board } from "../types/Board";
import { BlockType } from "../types/Common";
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
}
