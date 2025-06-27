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
          gameState={gameState}
          board={board}
          onMoveBlock={onMoveBlock}
        />
        <ControlPanel gameState={gameState} />
      </div>
      <footer>
        <p>Giiker Super Slide Web Implementation</p>
      </footer>
    </div>
  );
}

export default App;
