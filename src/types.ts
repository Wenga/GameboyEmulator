export type FaceDirection = 'down' | 'up' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export interface PlayerState {
  x: number;
  y: number;
  direction: FaceDirection;
  isMoving: boolean;
  frame: number;
  coffeeSpeedBoostUntil: number; // timestamp until speed boost expires
}

export type SpaceType = 'kitchen' | 'dice_counter' | 'living_room';

export interface SpaceInfo {
  type: SpaceType;
  title: string;
  xRange: [number, number];
  description: string;
}

export interface GameState {
  powerOn: boolean;
  bootSequence: 'off' | 'scrolling' | 'logo_settled' | 'fade_to_game' | 'playing';
  bootProgress: number; // 0 to 100
  player: PlayerState;
  diceValue: number | null; // null if never rolled
  diceState: 'idle' | 'rolling';
  diceRollTimer: number; // ms left in roll animation
  coffeesBrewed: number;
  coffeeState: 'idle' | 'brewing' | 'energized';
  coffeeTimer: number;
  energyBadge: {
    text: string;
    duration: number;
  };
  catsPetted: {
    cat1: number; // counts of pet
    cat2: number;
  };
  activeBubble: {
    target: 'coffee' | 'dice' | 'cat1' | 'cat2' | 'tv' | null;
    x: number;
    y: number;
    duration: number;
    text?: string;
    icon?: 'dice5' | 'catPaw';
  };
  messages: Array<{
    id: string;
    text: string;
    duration: number; // ticks/seconds remaining
    type: 'info' | 'success' | 'alert';
  }>;
}
