export enum BlockType {
  BIG_SQUARE = "BIG_SQUARE", // 2x2 block (4 spaces)
  SMALL_SQUARE = "SMALL_SQUARE", // 1x1 block (1 space)
  HORIZONTAL_RECT = "HORIZONTAL_RECT", // 1x2 block (2 spaces horizontal)
  VERTICAL_RECT = "VERTICAL_RECT", // 2x1 block (2 spaces vertical)
}

export enum GameMode {
  NORMAL = "NORMAL",
  LEARN = "LEARN",
  CHALLENGE = "CHALLENGE",
}

export enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

export interface History {
  blockId: string;
  moveDirection: Direction;
}

export interface Size {
  width: number;
  height: number;
}
