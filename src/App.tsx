import "./App.css";
import ControlPanel from "./components/ControlPanel";
import GameBoard from "./components/GameBoard";
import { useGameState } from "./hooks/useGameState";

function App() {
  const { gameState, board, onMoveBlock } = useGameState();

  return (
    <div className="app">
      <div className="game-container">
        <GameBoard
          board={board}
          onMoveBlock={onMoveBlock}
          isWin={gameState.isWin}
        />
        <ControlPanel
          moveCount={gameState.moveCount}
          isWin={gameState.isWin}
          gameMode={gameState.gameMode}
        />
      </div>
      <footer>
        <p>Giiker Super Slide Web Implementation</p>
      </footer>
    </div>
  );
}

export default App;
