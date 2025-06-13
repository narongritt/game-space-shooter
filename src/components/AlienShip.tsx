import React from 'react';
import type { Alien } from '../types/game';
import './AlienShip.css';

interface AlienShipProps {
  alien: Alien;
}

const AlienShip: React.FC<AlienShipProps> = ({ alien }) => {
  return (
    <div
      className={`alien-ship alien-${alien.type}`}
      style={{
        left: alien.x,
        top: alien.y,
        width: alien.width,
        height: alien.height,
      }}
    >
      <div className="alien-body">
        <div className="alien-dome"></div>
        <div className="alien-base">
          <div className="alien-light alien-light-1"></div>
          <div className="alien-light alien-light-2"></div>
          <div className="alien-light alien-light-3"></div>
        </div>
      </div>
      <div className="health-bar">
        <div 
          className="health-fill"
          style={{ width: `${(alien.health / alien.maxHealth) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AlienShip;
