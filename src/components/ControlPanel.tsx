import React from "react";
import type { GameState } from "../types/GameState";
import "./ControlPanel.css";

interface ControlPanelProps {
  gameState: GameState;
  onResetLevel: () => void;
  onUndoMove: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  gameState,
  onResetLevel,
  onUndoMove,
}) => {
  return (
    <div className="control-panel">
      <div className="level-info">
        <h2>Giiker Super Slide</h2>
        <p>Moves: {gameState.moveCount}</p>
        {gameState.isWin && <p className="win-message">Solved! 🎉</p>}
      </div>

      <div className="controls">
        <button onClick={onResetLevel}>Reset</button>
        <button
          onClick={onUndoMove}
          disabled={gameState.isWin || gameState.moveCount === 0}
        >
          Undo
        </button>
      </div>

      {/* <div className="game-modes">
        <h3>Game Mode</h3>
        <div className="mode-buttons">
          <button
            onClick={() => onChangeGameMode(GameMode.NORMAL)}
            className={gameMode === GameMode.NORMAL ? "active" : ""}
          >
            Normal
          </button>
          <button
            onClick={() => onChangeGameMode(GameMode.LEARN)}
            className={gameMode === GameMode.LEARN ? "active" : ""}
          >
            Learn Mode
          </button>
          <button
            onClick={() => onChangeGameMode(GameMode.CHALLENGE)}
            className={gameMode === GameMode.CHALLENGE ? "active" : ""}
          >
            Challenge
          </button>
        </div>
      </div> */}

      <div className="instructions">
        <h3>How to Play</h3>
        <p>
          Drag the blocks to move them. The goal is to move the big red square
          to the exit.
        </p>
        <p>Blocks can only slide, not lift. They cannot overlap.</p>
      </div>
    </div>
  );
};

export default ControlPanel;
