import React from 'react';
import type { Bullet } from '../types/game';
import './Bullet.css';

interface BulletProps {
  bullet: Bullet;
}

const BulletComponent: React.FC<BulletProps> = ({ bullet }) => {
  const getPlayerBulletClass = () => {
    if (!bullet.isPlayerBullet) return 'alien-bullet';
    if (bullet.playerId === 2) return 'player2-bullet';
    return 'player1-bullet';
  };

  return (
    <div
      className={`bullet ${getPlayerBulletClass()}`}
      style={{
        left: bullet.x,
        top: bullet.y,
        width: bullet.width,
        height: bullet.height,
      }}
    >
      <div className="bullet-core"></div>
      <div className="bullet-trail"></div>
    </div>
  );
};

export default BulletComponent;
