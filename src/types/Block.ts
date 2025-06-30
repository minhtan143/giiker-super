import { BlockType, type Size } from "./Common";
import { Position } from "./Position";

export class Block {
  id: string = crypto.randomUUID();
  type: BlockType;
  size: Size;
  position: Position;

  constructor(type: BlockType, position: Position = new Position(0, 0)) {
    this.type = type;
    this.position = position;

    switch (type) {
      case BlockType.BIG_SQUARE:
        this.size = { width: 2, height: 2 };
        break;
      case BlockType.SMALL_SQUARE:
        this.size = { width: 1, height: 1 };
        break;
      case BlockType.HORIZONTAL_RECT:
        this.size = { width: 2, height: 1 };
        break;
      case BlockType.VERTICAL_RECT:
        this.size = { width: 1, height: 2 };
        break;
      default:
        throw new Error(`Unknown block type: ${type}`);
    }
  }
}
