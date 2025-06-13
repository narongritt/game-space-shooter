interface Position {
  x: number;
  y: number;
}

interface GameEntity extends Position {
  width: number;
  height: number;
  speed: number;
}

interface Player extends GameEntity {
  id: number;
  health: number;
  maxHealth: number;
  color: string;
  name: string;
}

interface Bullet extends GameEntity {
  damage: number;
  isPlayerBullet: boolean;
  playerId?: number;
}

interface Alien extends GameEntity {
  health: number;
  maxHealth: number;
  points: number;
  type: 'small' | 'medium' | 'large';
}

type GameMode = 'single' | 'coop';

interface GameState {
  gameMode: GameMode;
  players: Player[];
  bullets: Bullet[];
  aliens: Alien[];
  score: number;
  gameOver: boolean;
  paused: boolean;
  level: number;
  showModeSelection: boolean;
}

export type { Position, GameEntity, Player, Bullet, Alien, GameState, GameMode };
