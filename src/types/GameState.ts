import type { GameMode, History } from "./Common";

export class GameState {
  moveCount: number;
  gameMode: GameMode;
  startTime: number;
  history: History[];
  isWin: boolean;

  constructor(gameMode: GameMode) {
    this.moveCount = 0;
    this.gameMode = gameMode;
    this.startTime = Date.now();
    this.history = [];
    this.isWin = false;
  }
}
