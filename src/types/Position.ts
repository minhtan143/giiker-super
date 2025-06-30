/*
  Position.ts
  x and y coordinates for blocks on the board.
  with x is the horizontal position and y is the vertical position.
*/
export class Position {
  constructor(public x: number, public y: number) {}

  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
