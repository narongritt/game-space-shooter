import React from 'react';
import type { GameState } from '../types/game';
import './GameUI.css';

interface GameUIProps {
  gameState: GameState;
  onRestart: () => void;
  onPause: () => void;
  onBackToMenu?: () => void;
}

const GameUI: React.FC<GameUIProps> = ({ gameState, onRestart, onPause, onBackToMenu }) => {
  const { players, score, gameOver, paused, level, gameMode } = gameState;
  
  // Calculate total health for display (average of all players)
  const totalHealth = players.reduce((sum, player) => sum + player.health, 0);
  const maxTotalHealth = players.reduce((sum, player) => sum + player.maxHealth, 0);
  const healthPercentage = maxTotalHealth > 0 ? (totalHealth / maxTotalHealth) * 100 : 0;

  return (
    <div className="game-ui">
      <div className="top-ui">
        <div className="score-section">
          <div className="score">Score: {score.toLocaleString()}</div>
          <div className="level">Level: {level}</div>
        </div>
        
        <div className="health-section">
          <div className="health-label">
            {gameMode === 'coop' ? 'Team Health' : 'Health'}
          </div>
          <div className="health-bar-container">
            <div 
              className="health-bar-fill"
              style={{ width: `${healthPercentage}%` }}
            ></div>
          </div>
          <div className="health-text">{totalHealth}/{maxTotalHealth}</div>
          
          {gameMode === 'coop' && (
            <div className="player-health-details">
              {players.map(player => (
                <div key={player.id} className="player-health" style={{ color: player.color }}>
                  {player.name}: {player.health}/{player.maxHealth}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="controls-section">
          <button 
            className="control-btn pause-btn"
            onClick={onPause}
            disabled={gameOver}
          >
            {paused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
        </div>
      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2 className="game-over-title">Game Over!</h2>
            <div className="final-stats">
              <p>Final Score: <span className="highlight">{score.toLocaleString()}</span></p>
              <p>Level Reached: <span className="highlight">{level}</span></p>
            </div>
            <button 
              className="restart-btn"
              onClick={onRestart}
            >
              🚀 Play Again
            </button>
            {onBackToMenu && (
              <button 
                className="back-to-menu-btn"
                onClick={onBackToMenu}
              >
                🏠 Back to Menu
              </button>
            )}
          </div>
        </div>
      )}

      {paused && !gameOver && (
        <div className="pause-overlay">
          <div className="pause-modal">
            <h2>Game Paused</h2>
            <p>Press Resume to continue</p>
            <div className="pause-controls">
              <button onClick={onPause}>▶️ Resume</button>
              <button onClick={onRestart}>🔄 Restart</button>
              {onBackToMenu && (
                <button onClick={onBackToMenu}>🏠 Menu</button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="instructions">
        {gameMode === 'single' ? (
          <p>🔤 WASD or Arrow Keys to move • 🔫 Space to shoot • ⏸️ P to pause</p>
        ) : (
          <p>Player 1: WASD + Space • Player 2: Arrow Keys + Enter • ⏸️ P to pause</p>
        )}
      </div>
    </div>
  );
};

export default GameUI;
