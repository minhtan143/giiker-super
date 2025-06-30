import { getRandomInt } from "../utils/randomInt";
import { Block } from "./Block";
import { Direction, type Size } from "./Common";
import { Position } from "./Position";

export class Board {
  blocks: Block[];
  exitPosition: Position;
  size: Size;

  private static readonly DEFAULT_SIZE: Size = { width: 4, height: 5 };
  private static readonly DEFAULT_EXIT_POSITION: Position = new Position(1, 3);

  constructor() {
    this.blocks = [];
    this.exitPosition = Board.DEFAULT_EXIT_POSITION;
    this.size = Board.DEFAULT_SIZE;
  }

  private isValidPosition(block: Block): boolean {
    if (
      block.position.x < 0 ||
      block.position.y < 0 ||
      block.position.x + block.size.width > this.size.width ||
      block.position.y + block.size.height > this.size.height
    ) {
      return false; // Block is out of bounds
    }

    for (const existingBlock of this.blocks) {
      if (existingBlock.id === block.id) {
        continue; // Skip collision check with itself
      }

      if (
        existingBlock.position.x < block.position.x + block.size.width &&
        existingBlock.position.x + existingBlock.size.width >
          block.position.x &&
        existingBlock.position.y < block.position.y + block.size.height &&
        existingBlock.position.y + existingBlock.size.height > block.position.y
      ) {
        return false; // Collision detected with existing block
      }
    }

    return true;
  }

  addBlock(block: Block): boolean {
    if (!this.isValidPosition(block)) return false;

    this.blocks.push(block);
    return true;
  }

  removeBlock(blockId: string): boolean {
    const blockIndex = this.blocks.findIndex((block) => block.id === blockId);
    if (blockIndex === -1) return false;

    this.blocks.splice(blockIndex, 1);
    return true;
  }

  getAvailablePositions(block: Block): Position[] {
    const positions: Position[] = [];

    for (let x = 0; x < this.size.width; x++) {
      for (let y = 0; y < this.size.height; y++) {
        const position = new Position(x, y);
        const tempBlock = new Block(block.type, position);

        if (this.isValidPosition(tempBlock)) {
          positions.push(position);
        }
      }
    }
    return positions;
  }

  getBlockByPosition(position: Position): Block | null {
    return (
      this.blocks.find(
        (block) =>
          position.x >= block.position.x &&
          position.x < block.position.x + block.size.width &&
          position.y >= block.position.y &&
          position.y < block.position.y + block.size.height
      ) || null
    );
  }

  private getBlockById(id: string): Block | null {
    return this.blocks.find((block) => block.id === id) || null;
  }

  move(blockId: string, direction: Direction): boolean {
    const block = this.getBlockById(blockId);
    if (!block) return false;

    const newPosition = new Position(block.position.x, block.position.y);

    switch (direction) {
      case Direction.UP:
        newPosition.y -= 1;
        break;
      case Direction.DOWN:
        newPosition.y += 1;
        break;
      case Direction.LEFT:
        newPosition.x -= 1;
        break;
      case Direction.RIGHT:
        newPosition.x += 1;
        break;
    }

    if (!this.isValidPosition({ ...block, position: newPosition })) {
      return false;
    }

    block.position = newPosition;
    return true;
  }

  shuffle(seed: number = 50000): void {
    const directions = [
      Direction.UP,
      Direction.RIGHT,
      Direction.DOWN,
      Direction.LEFT,
    ];

    while (seed > 0) {
      const blockIndex = getRandomInt(this.blocks.length);
      const directionIndex = getRandomInt(4);

      for (let i = directionIndex; i < directionIndex + 4; i++) {
        const moved = this.move(this.blocks[blockIndex].id, directions[i % 4]);
        if (moved) {
          seed--;
          break;
        }
      }
    }
  }

  clear(): void {
    this.blocks = [];
    this.exitPosition = Board.DEFAULT_EXIT_POSITION;
    this.size = Board.DEFAULT_SIZE;
  }
}
