import "./App.css";
import ControlPanel from "./components/ControlPanel";
import GameBoard from "./components/GameBoard";
import { useGameState } from "./hooks/useGameState";

function App() {
  const { gameState, handleMoveBlock, handleResetLevel, handleUndoMove } =
    useGameState();

  return (
    <div className="app">
      <div className="game-container">
        <GameBoard gameState={gameState} onMoveBlock={handleMoveBlock} />
        <ControlPanel
          gameState={gameState}
          onResetLevel={handleResetLevel}
          onUndoMove={handleUndoMove}
        />
      </div>
      <footer>
        <p>Giiker Super Slide Web Implementation</p>
      </footer>
    </div>
  );
}

export default App;
