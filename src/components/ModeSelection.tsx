import React from 'react';
import type { GameMode } from '../types/game';
import './ModeSelection.css';

interface ModeSelectionProps {
  onModeSelect: (mode: GameMode) => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ onModeSelect }) => {
  return (
    <div className="mode-selection-overlay">
      <div className="mode-selection-container">
        <h1 className="game-title">Space Shooter</h1>
        <h2 className="mode-title">เลือกโหมดเกม</h2>
        
        <div className="mode-buttons">
          <button 
            className="mode-button single-player"
            onClick={() => onModeSelect('single')}
          >
            <div className="mode-icon">🚀</div>
            <h3>1 ผู้เล่น</h3>
            <p>เล่นคนเดียว</p>
            <div className="controls">
              <span>WASD หรือ ลูกศร = เคลื่อนที่</span>
              <span>Space = ยิง</span>
            </div>
          </button>
          
          <button 
            className="mode-button coop-player"
            onClick={() => onModeSelect('coop')}
          >
            <div className="mode-icon">🚀🚀</div>
            <h3>2 ผู้เล่น</h3>
            <p>เล่นร่วมมือกัน</p>
            <div className="controls">
              <span>ผู้เล่น 1: WASD + Space</span>
              <span>ผู้เล่น 2: ลูกศร + Enter</span>
            </div>
          </button>
        </div>
        
        <div className="instructions">
          <p>กด P เพื่อหยุดเกมชั่วคราว | กด R เพื่อเริ่มเกมใหม่</p>
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;
