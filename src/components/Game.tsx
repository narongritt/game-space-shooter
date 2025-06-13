import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, Alien, Bullet, GameMode } from '../types/game';
import { 
  GAME_CONFIG, 
  createPlayers, 
  createBullet, 
  createAlien, 
  checkCollision, 
  updateGameEntities 
} from '../utils/gameLogic';
import Spaceship from './Spaceship';
import AlienShip from './AlienShip';
import BulletComponent from './Bullet';
import GameUI from './GameUI';
import ModeSelection from './ModeSelection';
import './Game.css';

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    gameMode: 'single',
    players: [],
    bullets: [],
    aliens: [],
    score: 0,
    gameOver: false,
    paused: false,
    level: 1,
    showModeSelection: true
  });

  const keysPressed = useRef<Set<string>>(new Set());
  const lastShotTime = useRef<{ [key: number]: number }>({});
  const gameLoopRef = useRef<number>(0);

  // Initialize game with selected mode
  const initializeGame = useCallback((gameMode: GameMode) => {
    const players = createPlayers(gameMode);
    setGameState({
      gameMode,
      players,
      bullets: [],
      aliens: [],
      score: 0,
      gameOver: false,
      paused: false,
      level: 1,
      showModeSelection: false
    });
    lastShotTime.current = {};
    players.forEach(player => {
      lastShotTime.current[player.id] = 0;
    });
  }, []);

  // Handle mode selection
  const handleModeSelect = useCallback((mode: GameMode) => {
    initializeGame(mode);
  }, [initializeGame]);

  // Handle keyboard input
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    keysPressed.current.add(event.key.toLowerCase());
    
    const now = Date.now();
    
    // Player 1 shooting (Space)
    if (event.key === ' ') {
      event.preventDefault();
      if (gameState.players[0] && now - (lastShotTime.current[1] || 0) > 150) {
        setGameState(prev => {
          if (prev.gameOver || prev.paused || prev.showModeSelection) return prev;
          
          const player1 = prev.players[0];
          const newBullet = createBullet(
            player1.x + player1.width / 2,
            player1.y,
            true,
            1
          );
          
          return {
            ...prev,
            bullets: [...prev.bullets.slice(-GAME_CONFIG.MAX_BULLETS + 1), newBullet]
          };
        });
        lastShotTime.current[1] = now;
      }
    }
    
    // Player 2 shooting (Enter)
    if (event.key === 'Enter') {
      event.preventDefault();
      if (gameState.players[1] && now - (lastShotTime.current[2] || 0) > 150) {
        setGameState(prev => {
          if (prev.gameOver || prev.paused || prev.showModeSelection) return prev;
          
          const player2 = prev.players[1];
          if (player2) {
            const newBullet = createBullet(
              player2.x + player2.width / 2,
              player2.y,
              true,
              2
            );
            
            return {
              ...prev,
              bullets: [...prev.bullets.slice(-GAME_CONFIG.MAX_BULLETS + 1), newBullet]
            };
          }
          return prev;
        });
        lastShotTime.current[2] = now;
      }
    }
    
    // Pause game
    if (event.key === 'p' || event.key === 'P') {
      setGameState(prev => ({ ...prev, paused: !prev.paused }));
    }
    
    // Restart game
    if (event.key === 'r' || event.key === 'R') {
      if (gameState.gameOver) {
        initializeGame(gameState.gameMode);
      }
    }
  }, [gameState.players, gameState.gameOver, gameState.gameMode, initializeGame]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    keysPressed.current.delete(event.key.toLowerCase());
  }, []);

  // Player movement
  const updatePlayerPosition = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.paused || prev.showModeSelection) return prev;
      
      const updatedPlayers = prev.players.map(player => {
        let newX = player.x;
        let newY = player.y;
        
        if (player.id === 1) {
          // Player 1 controls: WASD
          if (keysPressed.current.has('a')) {
            newX = Math.max(0, newX - player.speed);
          }
          if (keysPressed.current.has('d')) {
            newX = Math.min(GAME_CONFIG.CANVAS_WIDTH - player.width, newX + player.speed);
          }
          if (keysPressed.current.has('w')) {
            newY = Math.max(0, newY - player.speed);
          }
          if (keysPressed.current.has('s')) {
            newY = Math.min(GAME_CONFIG.CANVAS_HEIGHT - player.height, newY + player.speed);
          }
        } else if (player.id === 2) {
          // Player 2 controls: Arrow keys
          if (keysPressed.current.has('arrowleft')) {
            newX = Math.max(0, newX - player.speed);
          }
          if (keysPressed.current.has('arrowright')) {
            newX = Math.min(GAME_CONFIG.CANVAS_WIDTH - player.width, newX + player.speed);
          }
          if (keysPressed.current.has('arrowup')) {
            newY = Math.max(0, newY - player.speed);
          }
          if (keysPressed.current.has('arrowdown')) {
            newY = Math.min(GAME_CONFIG.CANVAS_HEIGHT - player.height, newY + player.speed);
          }
        }
        
        return { ...player, x: newX, y: newY };
      });
      
      return { ...prev, players: updatedPlayers };
    });
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.paused || prev.showModeSelection) return prev;
      
      let newState = { ...prev };
      
      // Update bullets
      newState = {
        ...newState,
        bullets: updateGameEntities.bullets(newState.bullets)
      };
      
      // Update aliens
      newState = {
        ...newState,
        aliens: updateGameEntities.aliens(newState.aliens)
      };
      
      // Spawn new aliens
      if (Math.random() < GAME_CONFIG.ALIEN_SPAWN_RATE * (1 + newState.level * 0.1)) {
        newState = {
          ...newState,
          aliens: [...newState.aliens, createAlien()]
        };
      }
      
      // Check bullet-alien collisions
      let updatedScore = newState.score;
      const remainingBullets: Bullet[] = [];
      let updatedAliens = [...newState.aliens];
      
      newState.bullets.forEach(bullet => {
        if (!bullet.isPlayerBullet) {
          remainingBullets.push(bullet);
          return;
        }
        
        let hit = false;
        updatedAliens = updatedAliens.map(alien => {
          if (!hit && checkCollision(bullet, alien)) {
            hit = true;
            const newHealth = alien.health - bullet.damage;
            if (newHealth <= 0) {
              updatedScore += alien.points;
              return null;
            }
            return { ...alien, health: newHealth };
          }
          return alien;
        }).filter((alien): alien is Alien => alien !== null);
        
        if (!hit) {
          remainingBullets.push(bullet);
        }
      });
      
      newState = {
        ...newState,
        bullets: remainingBullets,
        aliens: updatedAliens,
        score: updatedScore
      };
      
      // Check alien-player collisions
      const updatedPlayers = [...newState.players];
      
      newState = {
        ...newState,
        aliens: newState.aliens.filter(alien => {
          for (let i = 0; i < updatedPlayers.length; i++) {
            if (checkCollision(alien, updatedPlayers[i])) {
              updatedPlayers[i] = { 
                ...updatedPlayers[i], 
                health: updatedPlayers[i].health - 20 
              };
              return false; // Remove alien on collision
            }
          }
          return true;
        }),
        players: updatedPlayers
      };
      
      // Check if all players are dead
      const alivePlayers = newState.players.filter(player => player.health > 0);
      if (alivePlayers.length === 0) {
        newState = { ...newState, gameOver: true };
      }
      
      // Level progression
      const newLevel = Math.floor(newState.score / 1000) + 1;
      if (newLevel > newState.level) {
        newState = { ...newState, level: newLevel };
      }
      
      return newState;
    });
    
    updatePlayerPosition();
  }, [updatePlayerPosition]);

  // Set up event listeners and game loop
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    if (!gameState.showModeSelection) {
      gameLoopRef.current = setInterval(gameLoop, 1000 / 60); // 60 FPS
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp, gameLoop, gameState.showModeSelection]);

  const handleRestart = () => {
    initializeGame(gameState.gameMode);
  };

  const handlePause = () => {
    setGameState(prev => ({ ...prev, paused: !prev.paused }));
  };

  const handleBackToMenu = () => {
    setGameState(prev => ({ ...prev, showModeSelection: true, gameOver: false, paused: false }));
  };

  if (gameState.showModeSelection) {
    return (
      <div className="game-container">
        <ModeSelection onModeSelect={handleModeSelect} />
      </div>
    );
  }

  return (
    <div className="game-container">
      <div 
        className="game-canvas"
        style={{
          width: GAME_CONFIG.CANVAS_WIDTH,
          height: GAME_CONFIG.CANVAS_HEIGHT
        }}
      >
        {/* Background */}
        <div className="space-background">
          <div className="stars"></div>
          <div className="stars-2"></div>
          <div className="stars-3"></div>
        </div>
        
        {/* Players */}
        {gameState.players.map((player) => (
          <Spaceship 
            key={`player-${player.id}`} 
            player={player} 
            isPlayer2={player.id === 2}
          />
        ))}
        
        {/* Bullets */}
        {gameState.bullets.map((bullet, index) => (
          <BulletComponent key={`bullet-${index}`} bullet={bullet} />
        ))}
        
        {/* Aliens */}
        {gameState.aliens.map((alien, index) => (
          <AlienShip key={`alien-${index}`} alien={alien} />
        ))}
        
        {/* UI */}
        <GameUI 
          gameState={gameState}
          onRestart={handleRestart}
          onPause={handlePause}
          onBackToMenu={handleBackToMenu}
        />
      </div>
    </div>
  );
};

export default Game;
