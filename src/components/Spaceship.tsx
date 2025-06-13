import React from 'react';
import type { Player } from '../types/game';
import './Spaceship.css';

interface SpaceshipProps {
  player: Player;
  isPlayer2?: boolean;
}

const Spaceship: React.FC<SpaceshipProps> = ({ player, isPlayer2 = false }) => {
  return (
    <div
      className={`spaceship ${isPlayer2 ? 'player2' : 'player1'}`}
      style={{
        left: player.x,
        top: player.y,
        width: player.width,
        height: player.height,
        '--player-color': player.color,
      } as React.CSSProperties}
      data-player-name={player.name}
    >
      <div className="spaceship-body">
        <div className="spaceship-wing spaceship-wing-left"></div>
        <div className="spaceship-cockpit"></div>
        <div className="spaceship-wing spaceship-wing-right"></div>
        <div className="spaceship-engine">
          <div className="engine-flame"></div>
        </div>
      </div>
    </div>
  );
};

export default Spaceship;
