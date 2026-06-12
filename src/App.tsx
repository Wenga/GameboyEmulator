import { useState } from 'react';
import { GameState } from './types';
import { GameBoyCasing } from './components/GameBoyCasing';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    powerOn: true,
    bootSequence: 'logo_settled',
    bootProgress: 0,
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
    coffeesBrewed: 0,
    coffeeState: 'idle',
    coffeeTimer: 0,
    energyBadge: {
      text: '',
      duration: 0
    },
    catsPetted: {
      cat1: 0,
      cat2: 0
    },
    activeBubble: {
      target: null,
      x: 0,
      y: 0,
      duration: 0
    },
    messages: []
  });

  return (
    <div className="h-[100dvh] w-screen overflow-hidden select-none bg-[#1c2014] flex items-center justify-center" id="app-wrapper">
      <div className="h-full w-full max-w-[430px] bg-[#cfd0c9] shadow-2xl sm:max-w-[520px] md:max-w-[760px] lg:max-w-[960px]">
        <GameBoyCasing gameState={gameState} setGameState={setGameState} />
      </div>
    </div>
  );
}
