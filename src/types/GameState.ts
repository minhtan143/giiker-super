import { Board } from "./Board";
import { GameMode, type History } from "./Common";

export class GameState {
  moveCount: number;
  gameMode: GameMode;
  startTime: number;
  history: History[];
  isWin: boolean;
  board: Board;

  constructor(
    gameMode: GameMode = GameMode.NORMAL,
    board: Board = new Board()
  ) {
    this.moveCount = 0;
    this.gameMode = gameMode;
    this.startTime = Date.now();
    this.history = [];
    this.isWin = false;
    this.board = board;
  }
}
