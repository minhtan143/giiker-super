import { BlockType, type Size } from "./Common";
import { Position } from "./Position";

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
