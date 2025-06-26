import { Position } from "./Position";
import { BlockType, type Size } from "./Types";

export class Block {
  id: string = crypto.randomUUID();
  type: BlockType;
  size: Size;
  position: Position;

  constructor(type: BlockType, position: Position, size: Size) {
    this.type = type;
    this.size = size;
    this.position = position;
  }
}
