import type { Board } from "./Board";
import type { GameMode, History } from "./Common";

export class GameState {
  moveCount: number;
  gameMode: GameMode;
  startTime: number;
  history: History[];
  isWin: boolean;
  board: Board;

  constructor(gameMode: GameMode, board: Board) {
    this.moveCount = 0;
    this.gameMode = gameMode;
    this.startTime = Date.now();
    this.history = [];
    this.isWin = false;
    this.board = board;
  }
}
