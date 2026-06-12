import React, { useRef, useEffect } from 'react';
import { GameState } from '../types';
import { GameBoyScreen } from './GameBoyScreen';
import { playClickSound } from './SoundEffects';
import {
  PLAYER_SPRITE_HEIGHT,
  PLAYER_SPRITE_WIDTH,
  ROOM_PIXEL_HEIGHT,
  ROOM_PIXEL_WIDTH,
  collidesWithRoom,
} from '../roomData';

interface GameBoyCasingProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const ROOM_WIDTH = ROOM_PIXEL_WIDTH;
const ROOM_HEIGHT = ROOM_PIXEL_HEIGHT;

export const GameBoyCasing: React.FC<GameBoyCasingProps> = ({ gameState, setGameState }) => {
  const moveIntervalRef = useRef<number | null>(null);

  // Clear movement interval safely
  const stopMoving = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
    setGameState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        isMoving: false,
      },
    }));
  };

  // Start continuous movement in direction while pressing button
  const startMoving = (dx: number, dy: number, dir: 'up' | 'down' | 'left' | 'right') => {
    if (!gameState.powerOn || gameState.bootSequence !== 'playing') return;
    
    // Play a mechanical tap click sound
    playClickSound();
    
    stopMoving();

    const doMove = () => {
      setGameState((prev) => {
        const nextX = Math.max(0, Math.min(ROOM_WIDTH - PLAYER_SPRITE_WIDTH, prev.player.x + dx));
        const nextY = Math.max(0, Math.min(ROOM_HEIGHT - PLAYER_SPRITE_HEIGHT, prev.player.y + dy));
        const hitWall = collidesWithRoom(nextX, nextY);

        if (hitWall) {
          return {
            ...prev,
            player: {
              ...prev.player,
              direction: dir,
              isMoving: false,
            },
          };
        }

        return {
          ...prev,
          player: {
            ...prev.player,
            x: nextX,
            y: nextY,
            direction: dir,
            isMoving: true,
          },
        };
      });
    };

    // Trigger immediate move
    doMove();
    
    // Queue repeating ticker
    moveIntervalRef.current = window.setInterval(doMove, 45);
  };

  // Safe release listeners
  useEffect(() => {
    const handleGlobalRelease = () => {
      stopMoving();
    };
    
    window.addEventListener('mouseup', handleGlobalRelease);
    window.addEventListener('touchend', handleGlobalRelease);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalRelease);
      window.removeEventListener('touchend', handleGlobalRelease);
    };
  }, []);

  // Set up standard interaction button tap
  const handleAButtonPress = () => {
    if (!gameState.powerOn) return;
    playClickSound();

    // Trigger interaction check in the viewport
    const event = new CustomEvent('gb-a-press');
    window.dispatchEvent(event);
  };

  return (
    <div className="grid h-full w-full grid-rows-[minmax(0,1fr)_345px] items-stretch overflow-hidden bg-[#cfd0c9] sm:grid-rows-[minmax(0,1fr)_380px] lg:grid-rows-[minmax(0,1fr)_420px]" id="gameboy-casing-container">
      
      {/* 2. Primary Screen Container - Fills the top frame entirely */}
      <div 
        id="gb-screen-bezel"
        className="relative w-full border-b-4 border-neutral-800 bg-[#1c2014] shadow-inner overflow-hidden min-h-0"
        style={{
          boxShadow: 'inset 0px -4px 12px rgba(0,0,0,0.8)',
        }}
      >
        {/* Active Pixel Screen Viewport - fills top frame completely */}
        <div className="w-full h-full flex items-center justify-center bg-[#1c2014]">
          <GameBoyScreen gameState={gameState} setGameState={setGameState} />
        </div>
      </div>

      {/* 3. Bottom controls Layout panel - Fills bottom */}
      <div className="w-full bg-[#cfd0c9] px-4 py-3 relative flex flex-col justify-center sm:px-6 sm:py-5" style={{ boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.15)' }}>
        <div className="grid w-full grid-cols-2 items-center gap-8 sm:gap-12 md:gap-24">
          
          {/* Left Side: Physical Directional D-Pad */}
          <div className="flex items-center justify-center">
            <div className="relative h-[144px] w-[144px] sm:h-[180px] sm:w-[180px]" id="gb-dpad">
              
              {/* D-Pad Horizontal Bar Background */}
              <div className="absolute left-[5px] top-[53px] h-[44px] w-[135px] rounded bg-gray-800 border-b-2 border-r border-gray-900 shadow-lg sm:left-[6px] sm:top-[66px] sm:h-[54px] sm:w-[168px]" />
              {/* D-Pad Vertical Bar Background */}
              <div className="absolute left-[53px] top-[5px] h-[135px] w-[44px] rounded bg-gray-800 border-b-2 border-r border-gray-900 shadow-lg sm:left-[66px] sm:top-[6px] sm:h-[168px] sm:w-[54px]" />

              {/* Center Rest Cap */}
              <div className="absolute left-[53px] top-[53px] z-10 h-[44px] w-[44px] bg-gray-800 sm:left-[66px] sm:top-[66px] sm:h-[54px] sm:w-[54px]">
                <div className="h-full w-full rounded-full border border-gray-950 bg-gray-900" />
              </div>

              {/* UP BUTTON arrow */}
              <button
                id="gb-dpad-up"
                onMouseDown={() => startMoving(0, -1.2, 'up')}
                onTouchStart={(e) => { e.preventDefault(); startMoving(0, -1.2, 'up'); }}
                onMouseUp={stopMoving}
                onTouchEnd={stopMoving}
                onMouseLeave={stopMoving}
                className="absolute left-[53px] top-[5px] z-20 h-[44px] w-[44px] cursor-pointer flex items-center justify-center active:scale-95 sm:left-[66px] sm:top-[6px] sm:h-[54px] sm:w-[54px]"
              >
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[17px] border-b-gray-400 active:border-b-white sm:border-l-[14px] sm:border-r-[14px] sm:border-b-[20px]" />
              </button>

              {/* DOWN BUTTON arrow */}
              <button
                id="gb-dpad-down"
                onMouseDown={() => startMoving(0, 1.2, 'down')}
                onTouchStart={(e) => { e.preventDefault(); startMoving(0, 1.2, 'down'); }}
                onMouseUp={stopMoving}
                onTouchEnd={stopMoving}
                onMouseLeave={stopMoving}
                className="absolute left-[53px] top-[101px] z-20 h-[44px] w-[44px] cursor-pointer flex items-center justify-center active:scale-95 sm:left-[66px] sm:top-[126px] sm:h-[54px] sm:w-[54px]"
              >
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[17px] border-t-gray-400 active:border-t-white sm:border-l-[14px] sm:border-r-[14px] sm:border-t-[20px]" />
              </button>

              {/* LEFT BUTTON arrow */}
              <button
                id="gb-dpad-left"
                onMouseDown={() => startMoving(-1.2, 0, 'left')}
                onTouchStart={(e) => { e.preventDefault(); startMoving(-1.2, 0, 'left'); }}
                onMouseUp={stopMoving}
                onTouchEnd={stopMoving}
                onMouseLeave={stopMoving}
                className="absolute left-[5px] top-[53px] z-20 h-[44px] w-[44px] cursor-pointer flex items-center justify-center active:scale-95 sm:left-[6px] sm:top-[66px] sm:h-[54px] sm:w-[54px]"
              >
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[17px] border-r-gray-400 active:border-r-white sm:border-t-[14px] sm:border-b-[14px] sm:border-r-[20px]" />
              </button>

              {/* RIGHT BUTTON arrow */}
              <button
                id="gb-dpad-right"
                onMouseDown={() => startMoving(1.2, 0, 'right')}
                onTouchStart={(e) => { e.preventDefault(); startMoving(1.2, 0, 'right'); }}
                onMouseUp={stopMoving}
                onTouchEnd={stopMoving}
                onMouseLeave={stopMoving}
                className="absolute left-[101px] top-[53px] z-20 h-[44px] w-[44px] cursor-pointer flex items-center justify-center active:scale-95 sm:left-[126px] sm:top-[66px] sm:h-[54px] sm:w-[54px]"
              >
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[17px] border-l-gray-400 active:border-l-white sm:border-t-[14px] sm:border-b-[14px] sm:border-l-[20px]" />
              </button>

            </div>
          </div>

          {/* Right Side: Singular Large "A" Interaction Button */}
          <div className="relative flex flex-col items-center justify-center pr-2">
            
            <div className="relative rounded-full border border-gray-400/60 bg-gray-400/30 p-4 shadow-inner sm:p-6">
              
              <div className="flex flex-col items-center">
                <button
                  id="gb-btn-a-physical"
                  onClick={handleAButtonPress}
                  className="h-24 w-24 rounded-full border border-red-950 bg-red-700 active:bg-red-800 cursor-pointer shadow-lg active:shadow-sm sm:h-[120px] sm:w-[120px]"
                  style={{
                    boxShadow: 'inset -2px -2px 0px rgba(0,0,0,0.4), inset 2px 2px 0px rgba(255,255,255,0.2), 0px 4px 6px rgba(0,0,0,0.35)',
                    transform: 'translateY(-2px)',
                  }}
                  onMouseDown={(e) => {
                    const target = e.currentTarget;
                    target.style.transform = 'translateY(1px)';
                  }}
                  onMouseUp={(e) => {
                    const target = e.currentTarget;
                    target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    target.style.transform = 'translateY(-2px)';
                  }}
                >
                  <span className="font-extrabold text-red-900/60 select-none text-5xl leading-none sm:text-6xl">A</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* 4. SELECT / START pills */}
        <div className="flex items-center justify-center space-x-5 pt-6 pb-1 sm:space-x-6 sm:pt-8">

          {/* SELECT Rubber button pill */}
          <div className="flex flex-col items-center">
            <button
              id="gb-btn-select"
              onClick={() => {
                playClickSound();
                setGameState((prev) => ({
                  ...prev,
                  powerOn: true,
                  bootSequence: 'logo_settled',
                  player: {
                    x: 160,
                    y: 96,
                    direction: 'down',
                    isMoving: false,
                    frame: 0,
                    coffeeSpeedBoostUntil: 0
                  },
                  diceValue: null,
                  diceState: 'idle',
                  diceRollTimer: 0,
                  coffeeState: 'idle',
                  coffeeTimer: 0,
                  energyBadge: {
                    text: '',
                    duration: 0
                  },
                  coffeesBrewed: 0,
                  activeBubble: {
                    target: null,
                    x: 0,
                    y: 0,
                    duration: 0
                  },
                  messages: []
                }));
              }}
              className="h-5 w-16 -rotate-20 rounded bg-gray-800 shadow-md active:bg-gray-900 cursor-pointer transition-all duration-100"
            />
            <span className="mt-2 -rotate-20 text-[10px] font-black text-[#30395c] tracking-widest font-mono uppercase">
              SELECT
            </span>
          </div>

          {/* START Rubber button pill */}
          <div className="flex flex-col items-center">
            <button
              id="gb-btn-start"
              onClick={() => {
                playClickSound();
                setGameState((prev) => ({
                  ...prev,
                  powerOn: true,
                  bootSequence: 'fade_to_game',
                  player: {
                    x: 160,
                    y: 96,
                    direction: 'down',
                    isMoving: false,
                    frame: 0,
                    coffeeSpeedBoostUntil: 0
                  },
                  diceValue: null,
                  diceState: 'idle',
                  diceRollTimer: 0,
                  coffeeState: 'idle',
                  coffeeTimer: 0,
                  energyBadge: {
                    text: '',
                    duration: 0
                  },
                  coffeesBrewed: 0,
                  activeBubble: {
                    target: null,
                    x: 0,
                    y: 0,
                    duration: 0
                  },
                  messages: []
                }));
              }}
              className="h-5 w-16 -rotate-20 rounded bg-gray-800 shadow-md active:bg-gray-900 cursor-pointer transition-all duration-100"
            />
            <span className="mt-2 -rotate-20 text-[10px] font-black text-[#30395c] tracking-widest font-mono uppercase">
              START
            </span>
          </div>

        </div>

        {/* Decorative diagonal speaker grill cuts */}
        <div className="absolute bottom-2 right-5 flex space-x-1.5 -rotate-28 opacity-45 pointer-events-none sm:bottom-3 sm:right-6">
          <div className="h-9 w-1.5 rounded-full bg-neutral-700 sm:h-12" />
          <div className="h-9 w-1.5 rounded-full bg-neutral-700 sm:h-12" />
          <div className="h-9 w-1.5 rounded-full bg-neutral-700 sm:h-12" />
          <div className="h-9 w-1.5 rounded-full bg-neutral-700 sm:h-12" />
        </div>

      </div>

    </div>
  );
};
