export const TILE_SIZE = 16;
export const ROOM_TILES_W = 20;
export const ROOM_TILES_H = 9;
export const ROOM_PIXEL_WIDTH = ROOM_TILES_W * TILE_SIZE;
export const ROOM_PIXEL_HEIGHT = ROOM_TILES_H * TILE_SIZE;
export const PLAYER_SPRITE_BASE_WIDTH = 15;
export const PLAYER_SPRITE_BASE_HEIGHT = 15;
export const PLAYER_SPRITE_TARGET_HEIGHT = TILE_SIZE * 1.5;
export const PLAYER_SPRITE_SCALE = PLAYER_SPRITE_TARGET_HEIGHT / PLAYER_SPRITE_BASE_HEIGHT;
export const PLAYER_SPRITE_WIDTH = PLAYER_SPRITE_BASE_WIDTH * PLAYER_SPRITE_SCALE;
export const PLAYER_SPRITE_HEIGHT = PLAYER_SPRITE_BASE_HEIGHT * PLAYER_SPRITE_SCALE;
export const PLAYER_CENTER_OFFSET_X = PLAYER_SPRITE_WIDTH / 2;
export const PLAYER_CENTER_OFFSET_Y = PLAYER_SPRITE_HEIGHT / 2;
export const PLAYER_INTERACTION_OFFSET_X = 7 * PLAYER_SPRITE_SCALE;
export const PLAYER_INTERACTION_OFFSET_Y = 12 * PLAYER_SPRITE_SCALE;

export type RoomObjectId =
  | 'sink'
  | 'coffee_machine'
  | 'stove_top'
  | 'fridge'
  | 'cat_house'
  | 'sofa'
  | 'kitchen_island'
  | 'dice'
  | 'gray_cat'
  | 'black_white_cat'
  | 'obi_figure';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface RoomObject extends Rect {
  id: RoomObjectId;
  spriteX: number;
  spriteY: number;
  spriteScale?: number;
  blocking: boolean;
  interactable?: boolean;
}

export const ROOM_OBJECTS: RoomObject[] = [
  { id: 'sink', x: 0, y: 38, w: 32, h: 32, spriteX: 0, spriteY: 40, spriteScale: 1, blocking: true },
  { id: 'coffee_machine', x: 8, y: 89, w: 24, h: 24, spriteX: 8, spriteY: 91, spriteScale: 1.5, blocking: true, interactable: true },
  { id: 'stove_top', x: 44, y: 0, w: 40, h: 32, spriteX: 44, spriteY: 0, spriteScale: 1, blocking: true },
  { id: 'fridge', x: 124, y: 0, w: 28, h: 32, spriteX: 124, spriteY: 0, spriteScale: 1, blocking: true },
  { id: 'cat_house', x: 172, y: 0, w: 40, h: 32, spriteX: 172, spriteY: 0, spriteScale: 2, blocking: false },
  { id: 'sofa', x: 228, y: 0, w: 80, h: 40, spriteX: 228, spriteY: 0, spriteScale: 2, blocking: true },
  { id: 'kitchen_island', x: 56, y: 56, w: 96, h: 48, spriteX: 56, spriteY: 56, spriteScale: 1, blocking: false },
  { id: 'dice', x: 60, y: 60, w: 16, h: 16, spriteX: 60, spriteY: 60, spriteScale: 1, blocking: false, interactable: true },
  { id: 'gray_cat', x: 175, y: 42, w: 18, h: 18, spriteX: 175, spriteY: 44, spriteScale: 1, blocking: false, interactable: true },
  { id: 'black_white_cat', x: 196, y: 44, w: 14, h: 14, spriteX: 196, spriteY: 46, spriteScale: 1, blocking: false, interactable: true },
  { id: 'obi_figure', x: 244, y: 92, w: 60, h: 53, spriteX: 244, spriteY: 92, spriteScale: 1.5, blocking: false },
];

const COUNTER_COLLIDERS: Rect[] = [
  { x: 0, y: 0, w: 46, h: 32 },
  { x: 82, y: 0, w: 42, h: 32 },
  { x: 0, y: 32, w: 32, h: 96 },
];

const KITCHEN_ISLAND_COLLIDERS: Rect[] = [
  { x: 61, y: 63, w: 86, h: 2 },
  { x: 60, y: 65, w: 90, h: 3 },
  { x: 59, y: 68, w: 91, h: 7 },
  { x: 60, y: 75, w: 88, h: 2 },
  { x: 61, y: 77, w: 86, h: 11 },
  { x: 62, y: 88, w: 85, h: 5 },
  { x: 66, y: 93, w: 77, h: 1 },
  { x: 67, y: 94, w: 75, h: 8 },
  { x: 68, y: 102, w: 73, h: 1 },
];

const TV_COLLIDERS: Rect[] = [
  { x: 248, y: 96, w: 52, h: 45 },
];

const CAT_AREA_COLLIDERS: Rect[] = [
  { x: 176, y: 0, w: 32, h: 32 },
  { x: 177, y: 44, w: 13, h: 18 },
  { x: 199, y: 46, w: 9, h: 14 },
];

export const INTERACTABLES = [
  { id: 'sink' as const, objectId: 'sink' as const, x: 16, y: 68, radius: 24, bubbleX: 16, bubbleY: 45 },
  { id: 'coffee' as const, objectId: 'coffee_machine' as const, x: 26, y: 103, radius: 28, bubbleX: 24, bubbleY: 84 },
  { id: 'stove' as const, objectId: 'stove_top' as const, x: 68, y: 32, radius: 28, bubbleX: 68, bubbleY: 18 },
  { id: 'fridge' as const, objectId: 'fridge' as const, x: 140, y: 32, radius: 26, bubbleX: 140, bubbleY: 18 },
  { id: 'cat_house' as const, objectId: 'cat_house' as const, x: 192, y: 32, radius: 24, bubbleX: 192, bubbleY: 16 },
  { id: 'sofa' as const, objectId: 'sofa' as const, x: 268, y: 40, radius: 34, bubbleX: 268, bubbleY: 16 },
  { id: 'carpet' as const, objectId: 'sofa' as const, x: 268, y: 62, radius: 38, bubbleX: 268, bubbleY: 38 },
  { id: 'dice' as const, objectId: 'dice' as const, x: 68, y: 68, radius: 26, bubbleX: 68, bubbleY: 52 },
  { id: 'cat1' as const, objectId: 'gray_cat' as const, x: 184, y: 51, radius: 24, bubbleX: 184, bubbleY: 37 },
  { id: 'cat2' as const, objectId: 'black_white_cat' as const, x: 203, y: 51, radius: 24, bubbleX: 203, bubbleY: 37 },
  { id: 'tv' as const, objectId: 'obi_figure' as const, x: 274, y: 126, radius: 48, bubbleX: 274, bubbleY: 88 },
];

export function rectsIntersect(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function getPlayerHitbox(x: number, y: number): Rect {
  return {
    x: x + 3 * PLAYER_SPRITE_SCALE,
    y: y + 10 * PLAYER_SPRITE_SCALE,
    w: 10 * PLAYER_SPRITE_SCALE,
    h: 6 * PLAYER_SPRITE_SCALE,
  };
}

export function collidesWithRoom(x: number, y: number) {
  const hitbox = getPlayerHitbox(x, y);
  return ROOM_OBJECTS.some((object) => object.blocking && rectsIntersect(hitbox, object))
    || COUNTER_COLLIDERS.some((rect) => rectsIntersect(hitbox, rect))
    || KITCHEN_ISLAND_COLLIDERS.some((rect) => rectsIntersect(hitbox, rect))
    || TV_COLLIDERS.some((rect) => rectsIntersect(hitbox, rect))
    || CAT_AREA_COLLIDERS.some((rect) => rectsIntersect(hitbox, rect));
}

export function getClosestInteractable(playerX: number, playerY: number) {
  const px = playerX + PLAYER_INTERACTION_OFFSET_X;
  const py = playerY + PLAYER_INTERACTION_OFFSET_Y;

  return INTERACTABLES
    .map((item) => {
    const dx = px - item.x;
    const dy = py - item.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return { item, distance };
    })
    .filter(({ item, distance }) => distance <= item.radius)
    .sort((a, b) => a.distance - b.distance)[0]?.item || null;
}
