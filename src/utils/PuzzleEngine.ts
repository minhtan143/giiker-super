import { Block } from "../engine/Block";
import { Board } from "../engine/Board";
import { Position } from "../engine/Position";
import { BlockType } from "../engine/Types";

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
