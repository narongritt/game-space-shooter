import type { GameEntity, Bullet, Alien, Player, GameMode } from '../types/game';

export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  PLAYER_SPEED: 5,
  BULLET_SPEED: 8,
  ALIEN_SPEED: 2,
  ALIEN_SPAWN_RATE: 0.02,
  MAX_BULLETS: 20,
  PLAYER_SIZE: { width: 40, height: 40 },
  BULLET_SIZE: { width: 4, height: 12 },
  ALIEN_SIZES: {
    small: { width: 30, height: 30 },
    medium: { width: 50, height: 50 },
    large: { width: 70, height: 70 }
  }
};

export const checkCollision = (a: GameEntity, b: GameEntity): boolean => {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
};

export const createPlayer = (id: number): Player => {
  const player1Color = '#00ff41';
  const player2Color = '#ff4081';
  const player1Name = 'Player 1';
  const player2Name = 'Player 2';
  
  const baseX = GAME_CONFIG.CANVAS_WIDTH / 2 - GAME_CONFIG.PLAYER_SIZE.width / 2;
  const offsetX = id === 1 ? -60 : 60;
  
  return {
    id,
    x: baseX + (id === 2 ? offsetX : 0),
    y: GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PLAYER_SIZE.height - 20,
    width: GAME_CONFIG.PLAYER_SIZE.width,
    height: GAME_CONFIG.PLAYER_SIZE.height,
    speed: GAME_CONFIG.PLAYER_SPEED,
    health: 100,
    maxHealth: 100,
    color: id === 1 ? player1Color : player2Color,
    name: id === 1 ? player1Name : player2Name
  };
};

export const createPlayers = (gameMode: GameMode): Player[] => {
  const players = [createPlayer(1)];
  if (gameMode === 'coop') {
    players.push(createPlayer(2));
  }
  return players;
};

export const createBullet = (x: number, y: number, isPlayerBullet: boolean, playerId?: number): Bullet => ({
  x: x - GAME_CONFIG.BULLET_SIZE.width / 2,
  y,
  width: GAME_CONFIG.BULLET_SIZE.width,
  height: GAME_CONFIG.BULLET_SIZE.height,
  speed: isPlayerBullet ? -GAME_CONFIG.BULLET_SPEED : GAME_CONFIG.BULLET_SPEED,
  damage: 10,
  isPlayerBullet,
  playerId
});

export const createAlien = (): Alien => {
  const types = ['small', 'medium', 'large'] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  const size = GAME_CONFIG.ALIEN_SIZES[type];
  
  const healthMap = { small: 10, medium: 20, large: 30 };
  const pointsMap = { small: 10, medium: 25, large: 50 };
  
  return {
    x: Math.random() * (GAME_CONFIG.CANVAS_WIDTH - size.width),
    y: -size.height,
    width: size.width,
    height: size.height,
    speed: GAME_CONFIG.ALIEN_SPEED + Math.random() * 2,
    health: healthMap[type],
    maxHealth: healthMap[type],
    points: pointsMap[type],
    type
  };
};

export const updateGameEntities = {
  bullets: (bullets: Bullet[]): Bullet[] => {
    return bullets
      .map(bullet => ({
        ...bullet,
        y: bullet.y + bullet.speed
      }))
      .filter(bullet => 
        bullet.y > -bullet.height && 
        bullet.y < GAME_CONFIG.CANVAS_HEIGHT + bullet.height
      );
  },
  
  aliens: (aliens: Alien[]): Alien[] => {
    return aliens
      .map(alien => ({
        ...alien,
        y: alien.y + alien.speed
      }))
      .filter(alien => alien.y < GAME_CONFIG.CANVAS_HEIGHT + alien.height);
  }
};
