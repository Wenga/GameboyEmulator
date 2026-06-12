import React, { useEffect, useRef, useState } from 'react';
import { GameState } from '../types';
import { 
  drawPixelSprite, 
  PLAYER_SPRITES, 
  CAT_GREY_SIT, 
  CAT_GREY_STRETCH, 
  STEAM_PARTICLES,
  ROOM_COFFEE_MACHINE,
  ROOM_SINK,
  ROOM_STOVE_TOP,
  ROOM_FRIDGE_SHORT,
  ROOM_CAT_HOUSE,
  ROOM_SOFA,
  ROOM_KITCHEN_ISLAND,
  ROOM_DICE,
  ROOM_OBI_FIGURE,
  ROOM_BLACK_WHITE_CAT
} from './PixelArtwork';
import { 
  playBumpSound, 
  playCoffeeBrewSound, 
  playCoffeeDrinkSound, 
  playDiceRollSound, 
  playCatMeowSound, 
  playCatPurrSound,
  playForceVoiceSound,
  playBootSound
} from './SoundEffects';
import {
  ROOM_OBJECTS,
  ROOM_PIXEL_HEIGHT,
  ROOM_PIXEL_WIDTH,
  TILE_SIZE,
  PLAYER_CENTER_OFFSET_X,
  PLAYER_CENTER_OFFSET_Y,
  PLAYER_SPRITE_HEIGHT,
  PLAYER_SPRITE_SCALE,
  PLAYER_SPRITE_WIDTH,
  collidesWithRoom,
  getClosestInteractable,
} from '../roomData';
import kitchenIslandAsset from '../assets/room/kitchen-island-96.png';
import fridgeAsset from '../assets/room/fridge-32.png';
import stoveAsset from '../assets/room/stove.png';
import catHouseAsset from '../assets/room/CatHouse.png';
import sofaAsset from '../assets/room/Sofa.png';
import carpetAsset from '../assets/room/Carpet.png';
import catPawAsset from '../assets/room/CatPaw.png';
import tvAsset from '../assets/room/TV.png';
import coffeeMachineAsset from '../assets/room/CoffeeMachine.png';
import sinkAsset from '../assets/room/Sink.png';
import kikiAsset from '../assets/room/Kiki.png';
import yoruAsset from '../assets/room/Yoru.png';
import davidSpriteSheetAsset from '../assets/room/DavidSpriteSheet.png';

interface GameBoyScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const ROOM_WIDTH = ROOM_PIXEL_WIDTH;
const ROOM_HEIGHT = ROOM_PIXEL_HEIGHT;
const DEFAULT_VIEWPORT = { width: 320, height: 160, label: 'desktop-320x160' };
const MOBILE_VIEWPORT_PRESETS = [
  { width: 192, height: 128, label: 'mobile-192x128' },
  { width: 176, height: 117, label: 'mobile-176x117' },
  { width: 160, height: 107, label: 'mobile-160x107' },
];
const TABLET_VIEWPORT_PRESETS = [
  { width: 256, height: 160, label: 'tablet-256x160' },
  { width: 240, height: 150, label: 'tablet-240x150' },
];
const DESKTOP_VIEWPORT_PRESETS = [
  DEFAULT_VIEWPORT,
  { width: 320, height: 180, label: 'desktop-320x180' },
];
const DAVID_FRAME_SIZE = 24;
const DAVID_DIRECTION_ROWS: Record<'up' | 'down' | 'left' | 'right', number> = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};
const DEBUG_ISLAND_OVERLAY = false;

type ViewportPreset = {
  width: number;
  height: number;
  label: string;
};

type ScreenMetrics = {
  cssWidth: number;
  cssHeight: number;
  availableWidth: number;
  availableHeight: number;
  shellWidth: number;
  shellHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  viewportLabel: string;
  scaleMode: 'adaptive' | 'integer';
  fillPercent: number;
  browserWidth: number;
  browserHeight: number;
};

const chooseViewportPreset = (availableWidth: number, availableHeight: number): ViewportPreset & { scale: number; fillPercent: number; scaleMode: 'adaptive' | 'integer' } => {
  const isMobile = availableWidth < 500;
  const presetGroups = isMobile
    ? [MOBILE_VIEWPORT_PRESETS, TABLET_VIEWPORT_PRESETS, DESKTOP_VIEWPORT_PRESETS]
    : availableWidth < 760
      ? [TABLET_VIEWPORT_PRESETS, MOBILE_VIEWPORT_PRESETS, DESKTOP_VIEWPORT_PRESETS]
      : [DESKTOP_VIEWPORT_PRESETS, TABLET_VIEWPORT_PRESETS, MOBILE_VIEWPORT_PRESETS];

  const candidates = presetGroups.flat().map((preset, index) => {
    const rawScale = Math.min(availableWidth / preset.width, availableHeight / preset.height);
    const scale = isMobile ? rawScale : Math.floor(rawScale);
    const safeScale = Math.max(0, scale);
    const cssWidth = preset.width * safeScale;
    const cssHeight = preset.height * safeScale;
    return {
      ...preset,
      scale: safeScale,
      scaleMode: isMobile ? 'adaptive' as const : 'integer' as const,
      cssWidth,
      cssHeight,
      area: cssWidth * cssHeight,
      fillPercent: availableWidth > 0 ? cssWidth / availableWidth : 0,
      priority: index,
    };
  }).filter((candidate) => candidate.scale >= 1);

  if (!candidates.length) {
    return { ...MOBILE_VIEWPORT_PRESETS[MOBILE_VIEWPORT_PRESETS.length - 1], scale: 1, fillPercent: 1, scaleMode: 'adaptive' };
  }

  candidates.sort((a, b) => {
    if (availableWidth < 500) {
      const fillDiff = b.fillPercent - a.fillPercent;
      if (Math.abs(fillDiff) > 0.02) return fillDiff;
    }
    const areaDiff = b.area - a.area;
    if (areaDiff !== 0) return areaDiff;
    return a.priority - b.priority;
  });

  return candidates[0];
};

const PIXEL_FONT_3X5: Record<string, string[]> = {
  A: ['111', '101', '111', '101', '101'],
  B: ['110', '101', '110', '101', '110'],
  C: ['111', '100', '100', '100', '111'],
  D: ['110', '101', '101', '101', '110'],
  E: ['111', '100', '110', '100', '111'],
  F: ['111', '100', '110', '100', '100'],
  G: ['111', '100', '101', '101', '111'],
  H: ['101', '101', '111', '101', '101'],
  I: ['111', '010', '010', '010', '111'],
  K: ['101', '101', '110', '101', '101'],
  L: ['100', '100', '100', '100', '111'],
  M: ['101', '111', '111', '101', '101'],
  N: ['101', '111', '111', '111', '101'],
  O: ['111', '101', '101', '101', '111'],
  P: ['110', '101', '110', '100', '100'],
  R: ['110', '101', '110', '101', '101'],
  S: ['111', '100', '111', '001', '111'],
  T: ['111', '010', '010', '010', '010'],
  U: ['101', '101', '101', '101', '111'],
  V: ['101', '101', '101', '101', '010'],
  W: ['101', '101', '111', '111', '101'],
  Y: ['101', '101', '010', '010', '010'],
  '0': ['111', '101', '101', '101', '111'],
  '1': ['010', '110', '010', '010', '111'],
  '2': ['111', '001', '111', '100', '111'],
  '6': ['111', '100', '111', '101', '111'],
  '+': ['000', '010', '111', '010', '000'],
};

const drawPixelText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  scale: number,
  color: string
) => {
  const glyphWidth = 3;
  const letterSpacing = 1;
  const spaceWidth = 2;
  const normalizedText = text.toUpperCase();
  const width = [...normalizedText].reduce((total, char, index) => {
    const charWidth = char === ' ' ? spaceWidth : glyphWidth;
    return total + charWidth + (index < normalizedText.length - 1 ? letterSpacing : 0);
  }, 0) * scale;
  let x = Math.round(centerX - width / 2);

  ctx.fillStyle = color;
  [...normalizedText].forEach((char) => {
    if (char === ' ') {
      x += (spaceWidth + letterSpacing) * scale;
      return;
    }

    const glyph = PIXEL_FONT_3X5[char];
    if (!glyph) {
      x += (glyphWidth + letterSpacing) * scale;
      return;
    }

    glyph.forEach((row, rowIndex) => {
      [...row].forEach((pixel, colIndex) => {
        if (pixel === '1') {
          ctx.fillRect(x + colIndex * scale, y + rowIndex * scale, scale, scale);
        }
      });
    });
    x += (glyphWidth + letterSpacing) * scale;
  });
};

const drawOutlinedPixelText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  scale: number,
  fillColor: string,
  outlineColor: string
) => {
  const outlineOffset = scale;
  [
    [-outlineOffset, 0],
    [outlineOffset, 0],
    [0, -outlineOffset],
    [0, outlineOffset],
  ].forEach(([dx, dy]) => {
    drawPixelText(ctx, text, centerX + dx, y + dy, scale, outlineColor);
  });
  drawPixelText(ctx, text, centerX, y, scale, fillColor);
};

const drawPixelTextXY = (
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  scaleX: number,
  scaleY: number,
  color: string
) => {
  const glyphWidth = 3;
  const letterSpacing = 1;
  const spaceWidth = 2;
  const width = [...text].reduce((total, char, index) => {
    const charWidth = char === ' ' ? spaceWidth : glyphWidth;
    return total + charWidth + (index < text.length - 1 ? letterSpacing : 0);
  }, 0) * scaleX;
  let x = Math.round(centerX - width / 2);

  ctx.fillStyle = color;
  [...text].forEach((char) => {
    if (char === ' ') {
      x += (spaceWidth + letterSpacing) * scaleX;
      return;
    }

    const glyph = PIXEL_FONT_3X5[char];
    if (!glyph) return;

    glyph.forEach((row, rowIndex) => {
      [...row].forEach((pixel, colIndex) => {
        if (pixel === '1') {
          ctx.fillRect(
            Math.round(x + colIndex * scaleX),
            Math.round(y + rowIndex * scaleY),
            Math.ceil(scaleX),
            Math.ceil(scaleY)
          );
        }
      });
    });
    x += (glyphWidth + letterSpacing) * scaleX;
  });
};

const drawOutlinedPixelTextXY = (
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  scaleX: number,
  scaleY: number,
  fillColor: string,
  outlineColor: string
) => {
  const outlineX = Math.max(1, Math.round(scaleX * 0.45));
  const outlineY = Math.max(1, Math.round(scaleY * 0.45));
  [
    [-outlineX, 0],
    [outlineX, 0],
    [0, -outlineY],
    [0, outlineY],
  ].forEach(([dx, dy]) => {
    drawPixelTextXY(ctx, text, centerX + dx, y + dy, scaleX, scaleY, outlineColor);
  });
  drawPixelTextXY(ctx, text, centerX, y, scaleX, scaleY, fillColor);
};

const drawTitleMountain = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  peakY: number,
  baseY: number,
  width: number,
  color: string
) => {
  const halfWidth = Math.round(width / 2);
  const leftBase = Math.round(centerX - halfWidth);
  const rightBase = Math.round(centerX + halfWidth);
  const peakWidth = Math.max(8, Math.round(width * 0.08));
  const shoulderY = Math.round(peakY + (baseY - peakY) * 0.52);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(leftBase, baseY);
  ctx.lineTo(Math.round(centerX - halfWidth * 0.42), shoulderY);
  ctx.lineTo(Math.round(centerX - peakWidth), Math.round(peakY + 5));
  ctx.lineTo(Math.round(centerX - 4), peakY);
  ctx.lineTo(Math.round(centerX + 4), peakY);
  ctx.lineTo(Math.round(centerX + peakWidth), Math.round(peakY + 5));
  ctx.lineTo(Math.round(centerX + halfWidth * 0.42), shoulderY);
  ctx.lineTo(rightBase, baseY);
  ctx.closePath();
  ctx.fill();
};

const drawTitleEgg = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  bottomY: number,
  height: number,
  fill: string,
  spot: string,
  outline: string
) => {
  const eggHeight = Math.max(18, Math.round(height));
  const eggWidth = Math.round(eggHeight * 0.72);
  const centerY = Math.round(bottomY - eggHeight / 2);

  ctx.fillStyle = outline;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, Math.round(eggWidth / 2) + 1, Math.round(eggHeight / 2) + 1, -0.06, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, Math.round(eggWidth / 2), Math.round(eggHeight / 2), -0.06, 0, Math.PI * 2);
  ctx.fill();

  const drawRoundSpot = (x: number, y: number, size: number) => {
    ctx.fillRect(x, y - 1, size + 1, 1);
    ctx.fillRect(x - 1, y, size + 3, size + 1);
    ctx.fillRect(x, y + size + 1, size + 1, 1);
  };

  ctx.fillStyle = spot;
  const spots: Array<[number, number, number]> = [
    [-0.28, -0.34, 1],
    [0.22, -0.32, 1],
    [-0.33, 0.02, 1],
    [0.26, 0.04, 1],
    [-0.18, 0.34, 1],
    [0.20, 0.34, 1],
  ];
  spots.forEach(([xRatio, yRatio, size]) => {
    const x = Math.round(centerX + xRatio * eggWidth);
    const y = Math.round(centerY + yRatio * eggHeight);
    drawRoundSpot(x, y, size);
  });
};

const drawTitleScreen = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number
) => {
  const dark = '#0f380f';
  const mid = '#306230';
  const light = '#e0f8d0';
  const shadow = '#2b5d3d';

  ctx.fillStyle = '#9bbc0f';
  ctx.fillRect(0, 0, screenWidth, screenHeight);

  const centerX = Math.round(screenWidth / 2);
  const titleBaseline = Math.round(screenHeight * 0.48);
  const dFontSize = Math.max(46, Math.round(screenHeight * 0.45));
  const avidFontSize = Math.max(34, Math.round(screenHeight * 0.34));
  const logoLeft = Math.round(screenWidth * 0.04);
  const avidLeft = Math.round(screenWidth * 0.28);
  const textStroke = Math.max(2, Math.round(screenHeight * 0.025));

  const peakX = centerX;
  const eggHeight = Math.round(screenHeight * 0.17);
  const eggCenterY = Math.round(screenHeight * 0.75);
  const peakY = Math.round(eggCenterY + eggHeight / 2 - 1);
  const baseY = screenHeight + Math.round(screenHeight * 0.04);
  drawTitleMountain(ctx, peakX, peakY, baseY, Math.round(screenWidth * 0.82), dark);
  drawTitleEgg(ctx, peakX, peakY + 1, eggHeight, light, mid, dark);

  ctx.lineJoin = 'round';
  ctx.textBaseline = 'alphabetic';

  ctx.textAlign = 'left';
  ctx.font = `italic 900 ${dFontSize}px Georgia, serif`;
  ctx.fillStyle = shadow;
  ctx.fillText('D', logoLeft + Math.round(screenWidth * 0.015), titleBaseline + Math.round(screenHeight * 0.025));
  ctx.strokeStyle = light;
  ctx.lineWidth = textStroke + 1;
  ctx.strokeText('D', logoLeft, titleBaseline);
  ctx.fillStyle = dark;
  ctx.fillText('D', logoLeft, titleBaseline);

  ctx.font = `900 ${avidFontSize}px Georgia, serif`;
  ctx.fillStyle = shadow;
  ctx.fillText('AVID', avidLeft + Math.round(screenWidth * 0.012), titleBaseline + Math.round(screenHeight * 0.025));
  ctx.strokeStyle = light;
  ctx.lineWidth = textStroke;
  ctx.strokeText('AVID', avidLeft, titleBaseline);
  ctx.fillStyle = dark;
  ctx.fillText('AVID', avidLeft, titleBaseline);

  const avidWidth = ctx.measureText('AVID').width;
  const logoWordCenter = Math.round(avidLeft + avidWidth * 0.48);
  ctx.font = `900 ${Math.max(10, Math.round(screenHeight * 0.095))}px monospace`;
  ctx.textAlign = 'center';
  ctx.strokeStyle = light;
  ctx.lineWidth = Math.max(2, Math.round(screenHeight * 0.018));
  ctx.strokeText('THE LEGEND OF', logoWordCenter, Math.round(screenHeight * 0.225));
  ctx.fillStyle = dark;
  ctx.fillText('THE LEGEND OF', logoWordCenter, Math.round(screenHeight * 0.225));

  ctx.fillStyle = mid;
  ctx.font = `bold ${Math.max(8, Math.round(screenHeight * 0.07))}px monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const tmText = 'TM';
  const tmX = Math.min(
    Math.round(avidLeft + avidWidth + screenWidth * 0.035),
    Math.max(2, Math.round(screenWidth - ctx.measureText(tmText).width - 3))
  );
  ctx.fillText(tmText, tmX, Math.round(screenHeight * 0.31));

  ctx.font = `900 ${Math.max(10, Math.round(screenHeight * 0.075))}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const subtitleY = Math.round(screenHeight * 0.585);
  ctx.strokeStyle = light;
  ctx.lineWidth = Math.max(2, Math.round(screenHeight * 0.018));
  ctx.strokeText('BDAY AWAKENING', centerX, subtitleY);
  ctx.fillStyle = dark;
  ctx.fillText('BDAY AWAKENING', centerX, subtitleY);

  ctx.font = `900 ${Math.max(7, Math.round(screenHeight * 0.055))}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = dark;
  ctx.lineWidth = Math.max(2, Math.round(screenHeight * 0.024));
  ctx.strokeText('@ 2026 DAVID BDAY', centerX, Math.round(screenHeight * 0.89));
  ctx.fillStyle = light;
  ctx.fillText('@ 2026 DAVID BDAY', centerX, Math.round(screenHeight * 0.89));
};

const drawPixelEgg = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  scale: number,
  shellColor: string,
  spotColor: string,
  shadowColor: string
) => {
  const rows = [
    '.....SSSSSS.....',
    '...SSSSSSSSSS...',
    '..SSSSSSSSSSSH..',
    '.SSSSS11SSSSHH..',
    '.SSSS111SSSSHH..',
    'SSSSSSSSS22SHH..',
    'SSSSSSSS222SHH..',
    'SS33SSSSS22SHH..',
    'S3333SSSSSSSHH..',
    'S3333SSSS44SHH..',
    'SS33SSSS444SHH..',
    'SSSSSSSSS44SHH..',
    '.SSSS555SSSSHH..',
    '.SSSS555SSSSHH..',
    '..SSSS55SSSHH...',
    '...SSSSSSSHH....',
    '....SSSSSHH.....',
    '......SSSS......',
  ];
  const width = rows[0].length;
  const height = rows.length;
  const startX = Math.round(centerX - (width * scale) / 2);
  const startY = Math.round(centerY - (height * scale) / 2);

  rows.forEach((row, rowIndex) => {
    [...row].forEach((cell, colIndex) => {
      if (cell === '.') return;
      ctx.fillStyle = cell === 'S' ? shellColor : cell === 'H' ? shadowColor : spotColor;
      ctx.fillRect(startX + colIndex * scale, startY + rowIndex * scale, scale, scale);
    });
  });
};

const drawInteractionBubble = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  tailX: number,
  tailY: number,
  text = '',
  icon?: GameState['activeBubble']['icon'],
  iconImage?: HTMLImageElement | null
) => {
  const textLines = text ? text.split('\n') : [];
  const longestLine = textLines.reduce((longest, line) => Math.max(longest, line.length), 0);
  const w = icon === 'catPaw' ? 44 : icon ? 44 : text ? Math.max(34, longestLine * 4 + 12) : 30;
  const h = icon === 'catPaw' ? 34 : icon ? 30 : textLines.length > 1 ? 12 + textLines.length * 7 : 18;
  const left = Math.round(x - w / 2);
  const top = Math.round(y - h);
  const fill = '#fff8ea';
  const outline = '#171217';
  const inner = '#eadcca';
  const shade = '#cfc2b2';
  const tailTipY = Math.min(tailY, top + h + 8);
  const tailCenter = Math.max(left + 10, Math.min(tailX, left + w - 10));

  ctx.fillStyle = outline;
  ctx.fillRect(left + 4, top, w - 8, 1);
  ctx.fillRect(left + 2, top + 1, w - 4, 1);
  ctx.fillRect(left + 1, top + 2, w - 2, 2);
  ctx.fillRect(left, top + 4, w, h - 7);
  ctx.fillRect(left + 1, top + h - 3, w - 2, 2);
  ctx.fillRect(left + 3, top + h - 1, w - 6, 1);
  ctx.fillRect(tailCenter - 5, top + h - 2, 10, 2);
  ctx.fillRect(tailCenter - 4, top + h, 8, 2);
  ctx.fillRect(tailCenter - 3, top + h + 2, 6, 2);
  ctx.fillRect(tailCenter - 2, top + h + 4, 4, 2);
  ctx.fillRect(tailCenter - 1, top + h + 6, 2, Math.max(1, tailTipY - (top + h + 6)));

  ctx.fillStyle = shade;
  ctx.fillRect(left + 5, top + h, w - 9, 2);
  ctx.fillRect(tailCenter - 2, top + h + 6, 5, 2);

  ctx.fillStyle = fill;
  ctx.fillRect(left + 4, top + 2, w - 8, 1);
  ctx.fillRect(left + 3, top + 3, w - 6, 2);
  ctx.fillRect(left + 2, top + 5, w - 4, h - 10);
  ctx.fillRect(left + 3, top + h - 5, w - 6, 2);
  ctx.fillRect(left + 5, top + h - 3, w - 10, 1);
  ctx.fillRect(tailCenter - 3, top + h - 1, 6, 2);
  ctx.fillRect(tailCenter - 2, top + h + 1, 4, 2);
  ctx.fillRect(tailCenter - 1, top + h + 3, 2, 3);

  ctx.fillStyle = inner;
  ctx.fillRect(left + 5, top + 4, w - 10, 1);
  ctx.fillRect(left + 4, top + 5, 1, h - 10);
  ctx.fillRect(left + 5, top + h - 6, w - 10, 1);
  ctx.fillRect(left + w - 5, top + 5, 1, h - 10);

  if (textLines.length) {
    const firstLineY = textLines.length > 1 ? top + 7 : top + 7;
    textLines.forEach((line, index) => {
      drawPixelText(ctx, line, x, firstLineY + index * 7, 1, '#171217');
    });
  }

  if (icon === 'dice5') {
    drawPixelDice(ctx, Math.round(x - 9), top + 6, 18, 5);
  }

  if (icon === 'catPaw' && iconImage) {
    const iconX = Math.round(x - iconImage.naturalWidth / 2);
    const iconY = Math.round(top + 5);
    ctx.drawImage(iconImage, iconX, iconY, iconImage.naturalWidth, iconImage.naturalHeight);
  }
};

const drawPixelDice = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  face: 2 | 3 | 5
) => {
  const left = Math.round(x);
  const top = Math.round(y);
  const pipSize = size >= 18 ? 3 : 2;
  const pipOffset = size >= 18 ? 4 : size >= 16 ? 4 : 3;
  const center = Math.floor((size - pipSize) / 2);

  ctx.fillStyle = '#171217';
  ctx.fillRect(left + 2, top, size - 4, 1);
  ctx.fillRect(left + 1, top + 1, size - 2, 1);
  ctx.fillRect(left, top + 2, size, size - 4);
  ctx.fillRect(left + 1, top + size - 2, size - 2, 1);
  ctx.fillRect(left + 2, top + size - 1, size - 4, 1);

  ctx.fillStyle = '#fff8ea';
  ctx.fillRect(left + 2, top + 2, size - 4, size - 4);
  ctx.fillStyle = '#eadcca';
  ctx.fillRect(left + 3, top + size - 4, size - 6, 1);
  ctx.fillRect(left + size - 4, top + 3, 1, size - 7);

  const drawPip = (px: number, py: number) => {
    ctx.fillStyle = '#171217';
    ctx.fillRect(left + px, top + py, pipSize, pipSize);
  };

  drawPip(pipOffset, pipOffset);
  drawPip(size - pipOffset - pipSize, size - pipOffset - pipSize);

  if (face === 3 || face === 5) {
    drawPip(center, center);
  }

  if (face === 5) {
    drawPip(size - pipOffset - pipSize, pipOffset);
    drawPip(pipOffset, size - pipOffset - pipSize);
  }
};

const drawObjectDialog = (ctx: CanvasRenderingContext2D, text: string, screenWidth: number, screenHeight: number) => {
  const x = 12;
  const y = screenHeight - 25;
  const w = screenWidth - 24;
  const h = 20;

  ctx.fillStyle = '#171217';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#f5fbfb';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = '#d6eef2';
  ctx.fillRect(x + 4, y + 4, w - 8, 3);
  drawPixelText(ctx, text, screenWidth / 2, y + 8, 1, '#171217');
};

const drawContactShadow = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.fillStyle = 'rgba(74, 55, 37, 0.22)';
  ctx.fillRect(x + 2, y + h - 2, w - 4, 4);
  ctx.fillStyle = 'rgba(74, 55, 37, 0.12)';
  ctx.fillRect(x + 4, y + h + 2, w - 8, 2);
};

const drawCounterBlock = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.fillStyle = '#171217';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 1, y + 1, w - 2, Math.max(1, h - 8));
  ctx.fillStyle = '#e5e7e7';
  for (let tx = x + 4; tx < x + w - 2; tx += 8) {
    for (let ty = y + 3; ty < y + h - 8; ty += 8) {
      ctx.fillRect(tx, ty, 1, 1);
      ctx.fillRect(tx + 4, ty + 4, 1, 1);
    }
  }
  ctx.fillStyle = '#f7f8f8';
  ctx.fillRect(x + 1, y + h - 7, w - 2, 6);
  ctx.fillStyle = '#c7caca';
  ctx.fillRect(x + 3, y + h - 2, w - 6, 1);
  for (let hx = x + 9; hx < x + w - 5; hx += 16) {
    ctx.fillStyle = '#8c9294';
    ctx.fillRect(hx, y + h - 5, 3, 1);
  }
};

const drawWarmFloor = (ctx: CanvasRenderingContext2D) => {
  const plankColors = ['#e4e5e5', '#d6d8d8', '#f3f3f1', '#cdd0d1', '#dee0df'];
  const grainColors = ['#c4c8c9', '#d2d5d6', '#fafaf7'];
  const rowHeight = 8;
  const plankLengths = [32, 24, 40, 28, 36, 20];

  ctx.fillStyle = '#e1e3e3';
  ctx.fillRect(0, 0, ROOM_WIDTH, ROOM_HEIGHT);

  for (let row = 0; row * rowHeight < ROOM_HEIGHT; row += 1) {
    const y = row * rowHeight;
    const offset = -((row % 4) * 9);
    let x = offset;
    let plankIndex = row;

    while (x < ROOM_WIDTH) {
      const length = plankLengths[plankIndex % plankLengths.length];
      const startX = Math.max(0, x);
      const endX = Math.min(ROOM_WIDTH, x + length);
      const w = endX - startX;

      if (w > 0) {
        ctx.fillStyle = plankColors[(row + plankIndex) % plankColors.length];
        ctx.fillRect(startX, y, w, rowHeight);

        ctx.fillStyle = 'rgba(112, 116, 118, 0.2)';
        ctx.fillRect(startX, y, 1, rowHeight);
        ctx.fillRect(startX, y, w, 1);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.fillRect(startX + 1, y + 1, Math.max(1, w - 2), 1);

        const grainX = startX + 4 + ((row * 5 + plankIndex * 3) % Math.max(6, w - 8));
        ctx.fillStyle = grainColors[(row + plankIndex) % grainColors.length];
        ctx.fillRect(grainX, y + 3, Math.min(9, Math.max(2, endX - grainX - 2)), 1);
        if (w > 18) {
          ctx.fillRect(startX + 6, y + 6, 8, 1);
          ctx.fillRect(endX - 12, y + 2, 6, 1);
        }

        if ((row + plankIndex) % 5 === 0 && w > 14) {
          ctx.fillStyle = 'rgba(132, 136, 138, 0.24)';
          ctx.fillRect(startX + Math.floor(w / 2), y + 4, 3, 1);
          ctx.fillRect(startX + Math.floor(w / 2) + 1, y + 3, 1, 2);
        }
      }

      x += length;
      plankIndex += 1;
    }
  }

  ctx.fillStyle = 'rgba(112, 116, 118, 0.16)';
  for (let y = 0; y <= ROOM_HEIGHT; y += rowHeight) {
    ctx.fillRect(0, y, ROOM_WIDTH, 1);
  }
};

const drawCarpet = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = '#171217';
  ctx.fillRect(228, 52, 64, 39);
  ctx.fillStyle = '#b65d65';
  ctx.fillRect(230, 54, 60, 35);
  ctx.fillStyle = '#d78a82';
  ctx.fillRect(234, 58, 52, 27);
  ctx.fillStyle = '#7b404d';
  ctx.fillRect(230, 54, 60, 3);
  ctx.fillRect(230, 86, 60, 3);
  for (let x = 238; x < 284; x += 8) {
    ctx.fillStyle = '#f0c08a';
    ctx.fillRect(x, 62, 3, 2);
    ctx.fillRect(x + 3, 76, 2, 2);
  }
  ctx.fillStyle = '#f4e6cc';
  ctx.fillRect(255, 68, 8, 2);
  ctx.fillRect(258, 65, 2, 8);
};

const drawRoomProps = (ctx: CanvasRenderingContext2D) => {
  // Fridge note/magnets and tiny wall/floor details; decorative only.
  ctx.fillStyle = '#fff7d6';
  ctx.fillRect(133, 8, 6, 5);
  ctx.fillStyle = '#d4453c';
  ctx.fillRect(142, 8, 3, 3);
  ctx.fillStyle = '#468648';
  ctx.fillRect(143, 20, 4, 2);

};

const drawIslandDebugOverlay = (
  ctx: CanvasRenderingContext2D
) => {
  const island = ROOM_OBJECTS.find((object) => object.id === 'kitchen_island');
  if (!island) return;

  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.strokeStyle = '#4f9bff';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= ROOM_PIXEL_WIDTH; x += TILE_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, ROOM_PIXEL_HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y <= ROOM_PIXEL_HEIGHT; y += TILE_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(ROOM_PIXEL_WIDTH, y + 0.5);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#ff3355';
  ctx.lineWidth = 1;
  ctx.strokeRect(island.x + 0.5, island.y + 0.5, island.w - 1, island.h - 1);
  ctx.restore();
};

const drawIslandDebugPanel = (
  ctx: CanvasRenderingContext2D,
  naturalSize: { width: number; height: number },
  displayScale: number,
  cssSize: { width: number; height: number },
  availableSize: { width: number; height: number },
  metrics: ScreenMetrics,
  smoothingDisabled: boolean
) => {
  const island = ROOM_OBJECTS.find((object) => object.id === 'kitchen_island');
  if (!island) return;

  ctx.save();
  ctx.fillStyle = 'rgba(23, 18, 23, 0.82)';
  ctx.fillRect(2, 2, 156, 73);
  ctx.font = '5px monospace';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fff8ea';
  ctx.fillText(`browser ${metrics.browserWidth}x${metrics.browserHeight}`, 5, 5);
  ctx.fillText(`shell ${Math.round(metrics.shellWidth)}x${Math.round(metrics.shellHeight)}`, 5, 12);
  ctx.fillText(`bezel ${Math.round(availableSize.width)}x${Math.round(availableSize.height)}`, 5, 19);
  ctx.fillText(`internal ${metrics.viewportWidth}x${metrics.viewportHeight}`, 5, 26);
  ctx.fillText(`preset ${metrics.viewportLabel}`, 5, 33);
  ctx.fillText(`css ${Math.round(cssSize.width)}x${Math.round(cssSize.height)}`, 5, 40);
  ctx.fillText(`scale ${displayScale.toFixed(2)}x ${metrics.scaleMode} ${Math.round(metrics.fillPercent * 100)}%`, 5, 47);
  ctx.fillText(`smooth ${smoothingDisabled ? 'off' : 'on'} img ${naturalSize.width}x${naturalSize.height}`, 5, 54);
  ctx.fillText(`draw ${island.w}x${island.h}`, 5, 61);
  ctx.restore();
};

export const GameBoyScreen: React.FC<GameBoyScreenProps> = ({ gameState, setGameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const screenWrapperRef = useRef<HTMLDivElement>(null);
  const kitchenIslandImageRef = useRef<HTMLImageElement | null>(null);
  const fridgeImageRef = useRef<HTMLImageElement | null>(null);
  const stoveImageRef = useRef<HTMLImageElement | null>(null);
  const catHouseImageRef = useRef<HTMLImageElement | null>(null);
  const sofaImageRef = useRef<HTMLImageElement | null>(null);
  const carpetImageRef = useRef<HTMLImageElement | null>(null);
  const catPawImageRef = useRef<HTMLImageElement | null>(null);
  const tvImageRef = useRef<HTMLImageElement | null>(null);
  const coffeeMachineImageRef = useRef<HTMLImageElement | null>(null);
  const sinkImageRef = useRef<HTMLImageElement | null>(null);
  const kikiImageRef = useRef<HTMLImageElement | null>(null);
  const yoruImageRef = useRef<HTMLImageElement | null>(null);
  const davidSpriteSheetRef = useRef<HTMLImageElement | null>(null);
  const [cameraX, setCameraX] = useState(0);
  const [cameraY, setCameraY] = useState(0);
  const [frameTick, setFrameTick] = useState(0);
  const [kitchenIslandReady, setKitchenIslandReady] = useState(false);
  const [fridgeReady, setFridgeReady] = useState(false);
  const [stoveReady, setStoveReady] = useState(false);
  const [catHouseReady, setCatHouseReady] = useState(false);
  const [sofaReady, setSofaReady] = useState(false);
  const [carpetReady, setCarpetReady] = useState(false);
  const [catPawReady, setCatPawReady] = useState(false);
  const [tvReady, setTvReady] = useState(false);
  const [coffeeMachineReady, setCoffeeMachineReady] = useState(false);
  const [sinkReady, setSinkReady] = useState(false);
  const [kikiReady, setKikiReady] = useState(false);
  const [yoruReady, setYoruReady] = useState(false);
  const [davidSpriteReady, setDavidSpriteReady] = useState(false);
  const [viewport, setViewport] = useState<ViewportPreset>(DEFAULT_VIEWPORT);
  const screenWidth = viewport.width;
  const screenHeight = viewport.height;
  const [screenScale, setScreenScale] = useState(1);
  const [screenMetrics, setScreenMetrics] = useState<ScreenMetrics>({
    cssWidth: DEFAULT_VIEWPORT.width,
    cssHeight: DEFAULT_VIEWPORT.height,
    availableWidth: DEFAULT_VIEWPORT.width,
    availableHeight: DEFAULT_VIEWPORT.height,
    shellWidth: DEFAULT_VIEWPORT.width,
    shellHeight: DEFAULT_VIEWPORT.height,
    viewportWidth: DEFAULT_VIEWPORT.width,
    viewportHeight: DEFAULT_VIEWPORT.height,
    viewportLabel: DEFAULT_VIEWPORT.label,
    scaleMode: 'integer',
    fillPercent: 1,
    browserWidth: 0,
    browserHeight: 0,
  });
  
  // Animation frames for characters & static assets
  const [steamOffset, setSteamOffset] = useState(0);
  const [activeSteam, setActiveSteam] = useState<{ x: number; y: number; age: number }[]>([]);
  const [hearts, setHearts] = useState<{ x: number; y: number; age: number }[]>([]);
  const [catStates, setCatStates] = useState({
    orangeState: 'sleep' as 'sleep' | 'awake' | 'petting',
    greyState: 'sit' as 'sit' | 'stretch' | 'petting',
    orangeTimer: 100,
    greyTimer: 150,
  });

  useEffect(() => {
    const image = new Image();
    image.src = kitchenIslandAsset;
    image.onload = () => {
      kitchenIslandImageRef.current = image;
      setKitchenIslandReady(true);
    };
  }, []);

  useEffect(() => {
    const image = new Image();
    image.src = fridgeAsset;
    image.onload = () => {
      fridgeImageRef.current = image;
      setFridgeReady(true);
    };
  }, []);

  useEffect(() => {
    const image = new Image();
    image.src = stoveAsset;
    image.onload = () => {
      stoveImageRef.current = image;
      setStoveReady(true);
    };
  }, []);

  useEffect(() => {
    const image = new Image();
    image.src = catHouseAsset;
    image.onload = () => {
      catHouseImageRef.current = image;
      setCatHouseReady(true);
    };
  }, []);

  useEffect(() => {
    const image = new Image();
    image.src = sofaAsset;
    image.onload = () => {
      sofaImageRef.current = image;
      setSofaReady(true);
    };
  }, []);

  useEffect(() => {
    const image = new Image();
    image.src = carpetAsset;
    image.onload = () => {
      carpetImageRef.current = image;
      setCarpetReady(true);
    };
  }, []);

  useEffect(() => {
    const image = new Image();
    image.src = catPawAsset;
    image.onload = () => {
      catPawImageRef.current = image;
      setCatPawReady(true);
    };
  }, []);

  useEffect(() => {
    const image = new Image();
    image.src = tvAsset;
    image.onload = () => {
      tvImageRef.current = image;
      setTvReady(true);
    };
  }, []);

  useEffect(() => {
    const image = new Image();
    image.src = coffeeMachineAsset;
    image.onload = () => {
      coffeeMachineImageRef.current = image;
      setCoffeeMachineReady(true);
    };
  }, []);

  useEffect(() => {
    const image = new Image();
    image.src = sinkAsset;
    image.onload = () => {
      sinkImageRef.current = image;
      setSinkReady(true);
    };
  }, []);

  useEffect(() => {
    const image = new Image();
    image.src = kikiAsset;
    image.onload = () => {
      kikiImageRef.current = image;
      setKikiReady(true);
    };
  }, []);

  useEffect(() => {
    const image = new Image();
    image.src = yoruAsset;
    image.onload = () => {
      yoruImageRef.current = image;
      setYoruReady(true);
    };
  }, []);

  useEffect(() => {
    const image = new Image();
    image.src = davidSpriteSheetAsset;
    image.onload = () => {
      davidSpriteSheetRef.current = image;
      setDavidSpriteReady(true);
    };
  }, []);

  useEffect(() => {
    const wrapper = screenWrapperRef.current;
    if (!wrapper) return;

    const updateScale = () => {
      const rect = wrapper.getBoundingClientRect();
      const selected = chooseViewportPreset(rect.width, rect.height);
      const nextScale = selected.scale;
      const shellRect = document.getElementById('gameboy-casing-container')?.getBoundingClientRect();
      setViewport({
        width: selected.width,
        height: selected.height,
        label: selected.label,
      });
      setScreenScale(nextScale);
      setScreenMetrics({
        cssWidth: selected.width * nextScale,
        cssHeight: selected.height * nextScale,
        availableWidth: rect.width,
        availableHeight: rect.height,
        shellWidth: shellRect?.width || rect.width,
        shellHeight: shellRect?.height || rect.height,
        viewportWidth: selected.width,
        viewportHeight: selected.height,
        viewportLabel: selected.label,
        scaleMode: selected.scaleMode,
        fillPercent: selected.fillPercent,
        browserWidth: window.innerWidth,
        browserHeight: window.innerHeight,
      });
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(wrapper);
    window.addEventListener('resize', updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  // Handle game frame updates
  useEffect(() => {
    if (!gameState.powerOn) return;
    
    const interval = setInterval(() => {
      setFrameTick((prev) => (prev + 1) % 120);

      // Manage steam particles
      if (gameState.coffeeState === 'brewing') {
        if (Math.random() < 0.25) {
          setActiveSteam((prev) => [...prev, { x: 24 + Math.random() * 8, y: 88, age: 0 }]);
        }
      }
      setActiveSteam((prev) => 
        prev
          .map((p) => ({ ...p, y: p.y - 0.5, x: p.x + Math.sin(p.y / 4) * 0.4, age: p.age + 1 }))
          .filter((p) => p.age < 50)
      );

      // Manage heart particles
      setHearts((prev) => 
        prev
          .map((h) => ({ ...h, y: h.y - 0.4, x: h.x + Math.sin(h.y / 2) * 0.2, age: h.age + 1 }))
          .filter((h) => h.age < 45)
      );

      // Random cat behaviors to look alive
      setCatStates((prev) => {
        let { orangeState, greyState, orangeTimer, greyTimer } = prev;
        
        orangeTimer--;
        if (orangeTimer <= 0) {
          orangeState = orangeState === 'sleep' ? 'awake' : 'sleep';
          orangeTimer = 60 + Math.random() * 120;
        }

        greyTimer--;
        if (greyTimer <= 0) {
          greyState = greyState === 'sit' ? 'stretch' : 'sit';
          greyTimer = 80 + Math.random() * 140;
        }

        return { ...prev, orangeState, greyState, orangeTimer, greyTimer };
      });

      // Update durations on system notifications
      setGameState((prev) => {
        if (!prev.powerOn) return prev;
        
        const filteredMessages = prev.messages
          .map((m) => ({ ...m, duration: m.duration - 1 }))
          .filter((m) => m.duration > 0);
        const nextActiveBubble = prev.activeBubble.duration > 0
          ? { ...prev.activeBubble, duration: prev.activeBubble.duration - 1 }
          : { target: null, x: 0, y: 0, duration: 0 } as GameState['activeBubble'];
        const nextEnergyBadge = prev.energyBadge.duration > 0
          ? { ...prev.energyBadge, duration: prev.energyBadge.duration - 1 }
          : { text: '', duration: 0 };

        // Update player walk frame if moving
        let newFrame = prev.player.frame;
        if (prev.player.isMoving) {
          // Walk animation speed
          if (frameTick % 8 === 0) {
            newFrame = prev.player.frame === 1 ? 2 : 1;
          }
        } else {
          newFrame = 0; // Idle
        }

        // Handle dice rolls
        let newDiceVal = prev.diceValue;
        let newDiceState = prev.diceState;
        let newDiceTimer = prev.diceRollTimer;
        if (prev.diceState === 'rolling') {
          newDiceTimer -= 30; // Ms subtraction
          if (newDiceTimer <= 0) {
            newDiceState = 'idle';
            newDiceTimer = 0;
            newDiceVal = Math.floor(Math.random() * 6) + 1;
            
            // Notification
            return {
              ...prev,
              diceValue: newDiceVal,
              diceState: newDiceState,
              diceRollTimer: newDiceTimer,
              player: { ...prev.player, frame: newFrame },
              activeBubble: nextActiveBubble,
              energyBadge: nextEnergyBadge,
              messages: [],
            };
          } else {
            // Pick random face during rolling
            newDiceVal = Math.floor(Math.random() * 6) + 1;
          }
        }

        // Handle coffee brewing
        let newCoffeeTimer = prev.coffeeTimer;
        let newCoffeeState = prev.coffeeState;
        let newBrewedCount = prev.coffeesBrewed;
        if (prev.coffeeState === 'brewing') {
          newCoffeeTimer -= 30;
          if (newCoffeeTimer <= 0) {
            newCoffeeState = 'energized';
            newCoffeeTimer = 1800; // time to show energy badge
            playCoffeeDrinkSound();
            return {
              ...prev,
              coffeeState: newCoffeeState,
              coffeeTimer: newCoffeeTimer,
              player: { ...prev.player, frame: newFrame },
              activeBubble: nextActiveBubble,
              energyBadge: { text: 'ENERGY +0', duration: 90 },
              messages: [],
            };
          }
        } else if (prev.coffeeState === 'energized') {
          newCoffeeTimer -= 30;
          if (newCoffeeTimer <= 0) {
            newCoffeeState = 'idle';
            newCoffeeTimer = 0;
            newBrewedCount++;
          }
        }

        return {
          ...prev,
          diceValue: newDiceVal,
          diceState: newDiceState,
          diceRollTimer: newDiceTimer,
          coffeeState: newCoffeeState,
          coffeeTimer: newCoffeeTimer,
          coffeesBrewed: newBrewedCount,
          activeBubble: nextActiveBubble,
          energyBadge: nextEnergyBadge,
          messages: filteredMessages,
          player: {
            ...prev.player,
            frame: newFrame,
            isMoving: false, // Reset every frame - controls must hold to move
            coffeeSpeedBoostUntil: prev.player.coffeeSpeedBoostUntil,
          }
        };
      });

    }, 30);

    return () => clearInterval(interval);
  }, [gameState.powerOn, gameState.coffeeState, gameState.diceState, frameTick]);

  // Smooth camera tracking
  useEffect(() => {
    if (!gameState.powerOn) return;
    const targetCamX = gameState.player.x - screenWidth / 2 + PLAYER_CENTER_OFFSET_X; // Center screen on player
    const clampedCamX = Math.max(0, Math.min(Math.max(0, ROOM_WIDTH - screenWidth), targetCamX));
    const targetCamY = gameState.player.y - screenHeight / 2 + PLAYER_CENTER_OFFSET_Y;
    const clampedCamY = Math.max(0, Math.min(Math.max(0, ROOM_HEIGHT - screenHeight), targetCamY));
    
    // Smooth scroll interpolation
    const diff = clampedCamX - cameraX;
    if (Math.abs(diff) > 0.2) {
      setCameraX(cameraX + diff * 0.15);
    } else if (cameraX !== clampedCamX) {
      setCameraX(clampedCamX);
    }
    const diffY = clampedCamY - cameraY;
    if (Math.abs(diffY) > 0.2) {
      setCameraY(cameraY + diffY * 0.15);
    } else if (cameraY !== clampedCamY) {
      setCameraY(clampedCamY);
    }
  }, [gameState.player.x, gameState.player.y, cameraX, cameraY, gameState.powerOn, screenWidth, screenHeight]);

  // Bootup sequence timeline controller
  useEffect(() => {
    if (!gameState.powerOn) {
      setGameState((prev) => {
        if (prev.bootSequence === 'off' && prev.bootProgress === 0) return prev;
        return { ...prev, bootSequence: 'off', bootProgress: 0 };
      });
      return;
    }

    if (gameState.bootSequence !== 'fade_to_game') return;
    
    playBootSound();

    const delayPlaying = setTimeout(() => {
      setGameState((prev) => ({ ...prev, bootSequence: 'playing' }));
    }, 1000);

    return () => clearTimeout(delayPlaying);
  }, [gameState.powerOn, gameState.bootSequence]);

  // Direct keyboard triggers for desktop simulators
  useEffect(() => {
    if (!gameState.powerOn || gameState.bootSequence !== 'playing') return;

    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      pressedKeys.add(e.key.toLowerCase());
      
      // Prevent scrolling defaults
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key)) {
        e.preventDefault();
      }

      // Handle interactive key trigger
      if (e.key === 'z' || e.key === 'space' || e.key === ' ' || e.key === 'Enter') {
        triggerInteraction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Movement Loop tick
    const moveInterval = setInterval(() => {
      let dx = 0;
      let dy = 0;
      let targetDir = gameState.player.direction;

      if (pressedKeys.has('arrowup') || pressedKeys.has('w')) {
        dy = -1.5;
        targetDir = 'up';
      } else if (pressedKeys.has('arrowdown') || pressedKeys.has('s')) {
        dy = 1.5;
        targetDir = 'down';
      }

      if (pressedKeys.has('arrowleft') || pressedKeys.has('a')) {
        dx = -1.5;
        targetDir = 'left';
      } else if (pressedKeys.has('arrowright') || pressedKeys.has('d')) {
        dx = 1.5;
        targetDir = 'right';
      }

      if (dx !== 0 || dy !== 0) {
        moveCharacter(dx, dy, targetDir);
      }
    }, 30);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(moveInterval);
    };
  }, [gameState.powerOn, gameState.bootSequence, gameState.player.direction, gameState.coffeeState]);

  // Moves the character while respecting boundaries
  const moveCharacter = (dx: number, dy: number, dir: 'up' | 'down' | 'left' | 'right') => {
    setGameState((prev) => {
      const nextX = Math.max(0, Math.min(ROOM_WIDTH - PLAYER_SPRITE_WIDTH, prev.player.x + dx));
      const nextY = Math.max(0, Math.min(ROOM_HEIGHT - PLAYER_SPRITE_HEIGHT, prev.player.y + dy));
      const hitWall = nextX === prev.player.x && dx !== 0 || nextY === prev.player.y && dy !== 0 || collidesWithRoom(nextX, nextY);

      if (hitWall && Math.abs(dx) > 0.1 && Math.random() < 0.05) {
        playBumpSound();
      }

      if (hitWall) return prev;

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

  // Perform interaction 'A' button based on physical coordinate region
  const triggerInteraction = () => {
    const showBubble = (
      target: GameState['activeBubble']['target'],
      x: number,
      y: number,
      text?: string,
      icon?: GameState['activeBubble']['icon']
    ) => ({
      target,
      x,
      y,
      duration: 90,
      text,
      icon,
    });
    const showObjectName = (text: string): GameState['messages'] => ([
      { id: 'object-name', text, duration: 120, type: 'info' },
    ]);
    const showDelayedEnergyBadge = (text: string) => {
      window.setTimeout(() => {
        playCoffeeDrinkSound();
        setGameState((prev) => ({
          ...prev,
          energyBadge: { text, duration: 90 },
        }));
      }, 700);
    };

    const interactable = getClosestInteractable(gameState.player.x, gameState.player.y);
    
    if (interactable?.id === 'coffee') {
      if (gameState.coffeeState === 'idle') {
        playCoffeeBrewSound();
        setGameState((prev) => ({
          ...prev,
          coffeeState: 'brewing',
          coffeeTimer: 1800, // 1.8 seconds brewing
          activeBubble: showBubble('coffee', interactable.bubbleX, interactable.bubbleY, 'EMPTY'),
          messages: showObjectName('COFFEE MACHINE'),
        }));
      } else {
        setGameState((prev) => ({
          ...prev,
          activeBubble: showBubble('coffee', interactable.bubbleX, interactable.bubbleY, 'EMPTY'),
          messages: showObjectName('COFFEE MACHINE'),
        }));
      }
    }
    else if (interactable?.id === 'dice') {
      if (gameState.diceState === 'idle') {
        playDiceRollSound();
        setGameState((prev) => ({
          ...prev,
          diceState: 'rolling',
          diceRollTimer: 1200, // Roll for 1.2s
          activeBubble: showBubble('dice', interactable.bubbleX, interactable.bubbleY, undefined, 'dice5'),
          messages: showObjectName('DICE'),
        }));
      }
    }
    else if (interactable?.id === 'cat1' || interactable?.id === 'cat2') {
      playCatMeowSound();
      
      if (interactable.id === 'cat1') {
        setHearts((prev) => [...prev, { x: interactable.x, y: interactable.y - 14, age: 0 }]);
        setGameState((prev) => ({
          ...prev,
          catsPetted: { ...prev.catsPetted, cat1: prev.catsPetted.cat1 + 1 },
          activeBubble: showBubble('cat1', interactable.bubbleX, interactable.bubbleY, undefined, 'catPaw'),
          messages: showObjectName('KIKI'),
        }));
        showDelayedEnergyBadge('ENERGY+100');
      } else {
        setHearts((prev) => [...prev, { x: interactable.x, y: interactable.y - 14, age: 0 }]);
        setGameState((prev) => ({
          ...prev,
          catsPetted: { ...prev.catsPetted, cat2: prev.catsPetted.cat2 + 1 },
          activeBubble: showBubble('cat2', interactable.bubbleX, interactable.bubbleY, undefined, 'catPaw'),
          messages: showObjectName('YORU'),
        }));
        showDelayedEnergyBadge('ENERGY+100');
      }
    }
    else if (interactable?.id === 'tv') {
      playForceVoiceSound();
      setGameState((prev) => ({
        ...prev,
        activeBubble: showBubble('tv', interactable.bubbleX, interactable.bubbleY, 'MAY THE FORCE\nBE WITH YOU'),
        messages: showObjectName('TV'),
      }));
    }
    else if (interactable?.id === 'sink'
      || interactable?.id === 'stove'
      || interactable?.id === 'fridge'
      || interactable?.id === 'cat_house'
      || interactable?.id === 'sofa'
      || interactable?.id === 'carpet') {
      const objectNames = {
        sink: 'SINK',
        stove: 'STOVE',
        fridge: 'FRIDGE',
        cat_house: 'CAT HOUSE',
        sofa: 'SOFA',
        carpet: 'CARPET',
      } as const;

      setGameState((prev) => ({
        ...prev,
        activeBubble: { target: null, x: 0, y: 0, duration: 0 },
        messages: showObjectName(objectNames[interactable.id]),
      }));
    }
    // No object nearby
    else {
      playBumpSound();
      setGameState((prev) => ({
        ...prev,
        activeBubble: { target: null, x: 0, y: 0, duration: 0 },
        messages: [],
      }));
    }
  };

  useEffect(() => {
    if (!gameState.powerOn || gameState.bootSequence !== 'playing') return;

    const handlePhysicalAPress = () => {
      triggerInteraction();
    };

    window.addEventListener('gb-a-press', handlePhysicalAPress);
    return () => window.removeEventListener('gb-a-press', handlePhysicalAPress);
  }, [gameState]);

  // Redraw canvas content on updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Nearest neighbor rendering optimization
    ctx.imageSmoothingEnabled = false;

    // Power is OFF: Draw pure blank black/green LCD screen
    if (!gameState.powerOn) {
      ctx.fillStyle = '#1c2014'; // Matrix greenish-dark
      ctx.fillRect(0, 0, screenWidth, screenHeight);
      return;
    }

    // BOOT SEQUENCE: LOGO SLIDE
    if (gameState.bootSequence === 'scrolling' || gameState.bootSequence === 'logo_settled') {
      drawTitleScreen(ctx, screenWidth, screenHeight);
      return;
    }

    // BOOT SEQUENCE: FADE TRANSITION
    if (gameState.bootSequence === 'fade_to_game') {
      ctx.fillStyle = '#0f380f'; // Flashes dark then fade
      ctx.fillRect(0, 0, screenWidth, screenHeight);
      return;
    }

    // -------------------------------------------------------------
    // ACTIVE PLAYING RENDER LAYER
    // -------------------------------------------------------------
    ctx.fillStyle = '#1c2014';
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    ctx.save();
    // Translating camera X direction
    ctx.translate(-cameraX, -cameraY);

    drawWarmFloor(ctx);

    drawContactShadow(ctx, 0, 0, 46, 32);
    drawContactShadow(ctx, 82, 0, 42, 32);
    drawContactShadow(ctx, 0, 32, 32, 96);
    drawCounterBlock(ctx, 0, 0, 46, 32);
    drawCounterBlock(ctx, 82, 0, 42, 32);
    drawCounterBlock(ctx, 0, 32, 32, 96);

    drawContactShadow(ctx, 56, 56, 96, 48);
    if (carpetImageRef.current) {
      ctx.drawImage(carpetImageRef.current, 220, 32, 96, 59);
    } else {
      drawCarpet(ctx);
    }
    drawRoomProps(ctx);

    const spriteByObject = {
      sink: ROOM_SINK,
      coffee_machine: ROOM_COFFEE_MACHINE,
      stove_top: ROOM_STOVE_TOP,
      fridge: ROOM_FRIDGE_SHORT,
      cat_house: ROOM_CAT_HOUSE,
      sofa: ROOM_SOFA,
      kitchen_island: ROOM_KITCHEN_ISLAND,
      dice: ROOM_DICE,
      obi_figure: ROOM_OBI_FIGURE,
      gray_cat: catStates.greyState === 'sit' ? CAT_GREY_SIT : CAT_GREY_STRETCH,
      black_white_cat: ROOM_BLACK_WHITE_CAT,
    };

    ROOM_OBJECTS.forEach((object) => {
      if (object.id === 'kitchen_island' && kitchenIslandImageRef.current) {
        ctx.drawImage(kitchenIslandImageRef.current, object.spriteX, object.spriteY, object.w, object.h);
        return;
      }
      if (object.id === 'fridge' && fridgeImageRef.current) {
        ctx.drawImage(fridgeImageRef.current, object.spriteX, object.spriteY, object.w, object.h);
        return;
      }
      if (object.id === 'sink' && sinkImageRef.current) {
        ctx.drawImage(sinkImageRef.current, object.spriteX, object.spriteY, object.w, object.h);
        return;
      }
      if (object.id === 'coffee_machine' && coffeeMachineImageRef.current) {
        ctx.drawImage(coffeeMachineImageRef.current, object.spriteX, object.spriteY, object.w, object.h);
        return;
      }
      if (object.id === 'stove_top' && stoveImageRef.current) {
        ctx.drawImage(stoveImageRef.current, object.spriteX, object.spriteY, object.w, object.h);
        return;
      }
      if (object.id === 'cat_house' && catHouseImageRef.current) {
        ctx.drawImage(catHouseImageRef.current, object.spriteX, object.spriteY, object.w, object.h);
        return;
      }
      if (object.id === 'sofa' && sofaImageRef.current) {
        ctx.drawImage(sofaImageRef.current, object.spriteX, object.spriteY, object.w, object.h);
        return;
      }
      if (object.id === 'obi_figure' && tvImageRef.current) {
        ctx.drawImage(tvImageRef.current, object.spriteX, object.spriteY, object.w, object.h);
        return;
      }
      if (object.id === 'gray_cat' && kikiImageRef.current) {
        ctx.drawImage(kikiImageRef.current, object.spriteX, object.spriteY, object.w, object.h);
        return;
      }
      if (object.id === 'black_white_cat' && yoruImageRef.current) {
        ctx.drawImage(yoruImageRef.current, object.spriteX, object.spriteY, object.w, object.h);
        return;
      }
      if (object.id === 'dice' && kitchenIslandImageRef.current) {
        drawPixelDice(ctx, object.spriteX + 2, object.spriteY + 2, 12, 2);
        return;
      }

      const sprite = spriteByObject[object.id];
      drawPixelSprite(ctx, sprite, object.spriteX, object.spriteY, object.spriteScale || 1);
    });

    if (DEBUG_ISLAND_OVERLAY) {
      drawIslandDebugOverlay(ctx);
    }

    // Render Animated Steam particles
    activeSteam.forEach((p) => {
      drawPixelSprite(ctx, STEAM_PARTICLES, p.x, p.y, 1);
    });

    // Render Pet Hearts
    hearts.forEach((h) => {
      // Draw a pixel heart
      ctx.fillStyle = '#e63e3e';
      ctx.fillRect(h.x, h.y, 1, 1);
      ctx.fillRect(h.x - 1, h.y - 1, 1, 1);
      ctx.fillRect(h.x + 1, h.y - 1, 1, 1);
      ctx.fillRect(h.x - 2, h.y - 2, 2, 1);
      ctx.fillRect(h.x + 1, h.y - 2, 2, 1);
      ctx.fillRect(h.x - 2, h.y - 3, 2, 1);
      ctx.fillRect(h.x + 1, h.y - 3, 2, 1);
      ctx.fillRect(h.x - 1, h.y - 4, 3, 1);
    });

    // 5. Render character sprite
    if (davidSpriteSheetRef.current) {
      const frame = Math.max(0, Math.min(2, gameState.player.frame));
      const row = DAVID_DIRECTION_ROWS[gameState.player.direction];
      ctx.drawImage(
        davidSpriteSheetRef.current,
        frame * DAVID_FRAME_SIZE,
        row * DAVID_FRAME_SIZE,
        DAVID_FRAME_SIZE,
        DAVID_FRAME_SIZE,
        Math.round(gameState.player.x),
        Math.round(gameState.player.y),
        DAVID_FRAME_SIZE,
        DAVID_FRAME_SIZE
      );
    } else {
      const player_f = PLAYER_SPRITES[gameState.player.frame] || PLAYER_SPRITES[0];
      const player_art = player_f[gameState.player.direction] || player_f.down;
      drawPixelSprite(ctx, player_art, gameState.player.x, gameState.player.y, PLAYER_SPRITE_SCALE);
    }

    if (gameState.activeBubble.target && gameState.activeBubble.duration > 0) {
      drawInteractionBubble(
        ctx,
        gameState.activeBubble.x,
        gameState.activeBubble.y,
        gameState.activeBubble.x,
        gameState.activeBubble.y + 10,
        gameState.activeBubble.text,
        gameState.activeBubble.icon,
        catPawImageRef.current
      );
    }

    ctx.restore();

    // -------------------------------------------------------------
    // STATIC HUD/UI RENDER LAYER
    // -------------------------------------------------------------
    if (DEBUG_ISLAND_OVERLAY) {
      drawIslandDebugPanel(
        ctx,
        {
          width: kitchenIslandImageRef.current?.naturalWidth || 0,
          height: kitchenIslandImageRef.current?.naturalHeight || 0,
        },
        screenScale,
        {
          width: screenMetrics.cssWidth,
          height: screenMetrics.cssHeight,
        },
        {
          width: screenMetrics.availableWidth,
          height: screenMetrics.availableHeight,
        },
        screenMetrics,
        !ctx.imageSmoothingEnabled
      );
    }
    
    ctx.font = '5px monospace';

    const activeMessage = gameState.messages.find((message) => message.duration > 0);
    if (activeMessage) {
      drawObjectDialog(ctx, activeMessage.text, screenWidth, screenHeight);
    }

    // Draw indicator badge if energy has just been gained.
    if (gameState.energyBadge.duration > 0) {
      const badgeX = screenWidth - 60;
      const badgeY = 4;
      ctx.fillStyle = '#171217';
      ctx.fillRect(badgeX, badgeY, 56, 13);
      ctx.fillStyle = '#f7d65f';
      ctx.fillRect(badgeX + 2, badgeY + 2, 52, 9);
      ctx.fillStyle = '#fff4bb';
      ctx.fillRect(badgeX + 4, badgeY + 3, 48, 2);
      drawPixelText(ctx, gameState.energyBadge.text, badgeX + 28, badgeY + 5, 1, '#171217');
    }

  }, [gameState, cameraX, cameraY, frameTick, activeSteam, hearts, catStates, kitchenIslandReady, fridgeReady, stoveReady, catHouseReady, sofaReady, carpetReady, catPawReady, tvReady, coffeeMachineReady, sinkReady, kikiReady, yoruReady, davidSpriteReady, screenScale, screenMetrics, screenWidth, screenHeight]);

  return (
    <div
      ref={screenWrapperRef}
      className="relative w-full h-full bg-[#1c2014] overflow-hidden flex items-center justify-center"
      id="gameboy-screen-wrapper"
    >
      <canvas
        id="gameboy-viewport"
        ref={canvasRef}
        width={screenWidth}
        height={screenHeight}
        className="animate-fade-in"
        style={{
          imageRendering: 'pixelated',
          width: `${screenWidth * screenScale}px`,
          height: `${screenHeight * screenScale}px`,
        }}
      />
      {/* Small Glass screen glare reflection overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
    </div>
  );
};
