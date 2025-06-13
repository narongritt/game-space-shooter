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

  // Initialize game
  const initializeGame = useCallback(() => {
    setGameState({
      player: createPlayer(),
      bullets: [],
      aliens: [],
      score: 0,
      gameOver: false,
      paused: false,
      level: 1
    });
    lastShotTime.current = 0;
  }, []);

  // Handle keyboard input
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    keysPressed.current.add(event.key.toLowerCase());
    
    if (event.key === ' ') {
      event.preventDefault();
      const now = Date.now();
      if (now - lastShotTime.current > 150) { // Limit shooting rate
        setGameState(prev => {
          if (prev.gameOver || prev.paused) return prev;
          
          const newBullet = createBullet(
            prev.player.x + prev.player.width / 2,
            prev.player.y,
            true
          );
          
          return {
            ...prev,
            bullets: [...prev.bullets.slice(-GAME_CONFIG.MAX_BULLETS + 1), newBullet]
          };
        });
        lastShotTime.current = now;
      }
    }
    
    if (event.key === 'p' || event.key === 'P') {
      setGameState(prev => ({ ...prev, paused: !prev.paused }));
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    keysPressed.current.delete(event.key.toLowerCase());
  }, []);

  // Player movement
  const updatePlayerPosition = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.paused) return prev;
      
      let newX = prev.player.x;
      let newY = prev.player.y;
      
      if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
        newX = Math.max(0, newX - prev.player.speed);
      }
      if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
        newX = Math.min(GAME_CONFIG.CANVAS_WIDTH - prev.player.width, newX + prev.player.speed);
      }
      if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
        newY = Math.max(0, newY - prev.player.speed);
      }
      if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
        newY = Math.min(GAME_CONFIG.CANVAS_HEIGHT - prev.player.height, newY + prev.player.speed);
      }
      
      return {
        ...prev,
        player: { ...prev.player, x: newX, y: newY }
      };
    });
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.paused) return prev;
      
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
      let updatedPlayer = { ...newState.player };
      newState = {
        ...newState,
        aliens: newState.aliens.filter(alien => {
          if (checkCollision(alien, updatedPlayer)) {
            updatedPlayer = { ...updatedPlayer, health: updatedPlayer.health - 20 };
            return false; // Remove alien on collision
          }
          return true;
        }),
        player: updatedPlayer
      };
      
      // Check if player is dead
      if (newState.player.health <= 0) {
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
    
    gameLoopRef.current = setInterval(gameLoop, 1000 / 60); // 60 FPS
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp, gameLoop]);

  const handleRestart = () => {
    initializeGame();
  };

  const handlePause = () => {
    setGameState(prev => ({ ...prev, paused: !prev.paused }));
  };

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
        
        {/* Player */}
        <Spaceship player={gameState.player} />
        
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
        />
      </div>
    </div>
  );
};

export default Game;
