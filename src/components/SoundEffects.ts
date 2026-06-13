let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Resume context if suspended (common in browsers)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Helper to create retro synth envelope
function playTone({
  frequency,
  duration,
  type = 'square',
  startVolume = 0.1,
  endVolume = 0,
  pitchSweep = 0, // direction/hz to sweep pitch during tone
}: {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  startVolume?: number;
  endVolume?: number;
  pitchSweep?: number;
}) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  
  if (pitchSweep !== 0) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(10, frequency + pitchSweep),
      ctx.currentTime + duration
    );
  }

  gainNode.gain.setValueAtTime(startVolume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    Math.max(0.0001, endVolume),
    ctx.currentTime + duration
  );

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export const playBootSound = () => {
  // Game Boy chime: Eb5 (622Hz) then Bb6 (1864Hz)
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  // High ping tone
  playTone({ frequency: 659.25, duration: 0.15, type: 'square', startVolume: 0.1 }); // E5
  setTimeout(() => {
    playTone({ frequency: 1046.50, duration: 0.45, type: 'square', startVolume: 0.15 }); // C6
  }, 120);
};

export const playClickSound = () => {
  // A tiny noise pop for buttons
  playTone({ frequency: 2000, duration: 0.02, type: 'sine', startVolume: 0.2, pitchSweep: -1500 });
};

export const playBumpSound = () => {
  // Low bass thump when hitting a border
  playTone({ frequency: 120, duration: 0.08, type: 'triangle', startVolume: 0.25, pitchSweep: -60 });
};

export const playCoffeeBrewSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Staccato bubbling tones
  for (let i = 0; i < 7; i++) {
    setTimeout(() => {
      const freq = 150 + Math.random() * 100;
      playTone({
        frequency: freq,
        duration: 0.08,
        type: 'square',
        startVolume: 0.05,
        pitchSweep: 50,
      });
    }, i * 120);
  }

  // Finished beep
  setTimeout(() => {
    playTone({ frequency: 880, duration: 0.2, type: 'triangle', startVolume: 0.1 });
  }, 1000);
};

export const playCoffeeDrinkSound = () => {
  // Speed boost powerup chime: three rapid ascending arpeggios
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone({
        frequency: freq,
        duration: 0.12,
        type: 'sine',
        startVolume: 0.15,
        pitchSweep: 200,
      });
    }, idx * 70);
  });
};

export const playDiceRollSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Dice rolling clatter
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const isLow = i % 2 === 0;
      playTone({
        frequency: isLow ? 180 : 350,
        duration: 0.06,
        type: isLow ? 'triangle' : 'sawtooth',
        startVolume: 0.1,
        pitchSweep: isLow ? -50 : 100,
      });
    }, i * 100);
  }

  // Result chime
  setTimeout(() => {
    playTone({ frequency: 1318.51, duration: 0.25, type: 'square', startVolume: 0.1, pitchSweep: -300 }); // E6 down
  }, 850);
};

export const playCatMeowSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.42;

  const voice = ctx.createOscillator();
  const harmonic = ctx.createOscillator();
  const gain = ctx.createGain();
  const harmonicGain = ctx.createGain();

  voice.type = 'triangle';
  harmonic.type = 'sine';

  voice.frequency.setValueAtTime(520, now);
  voice.frequency.exponentialRampToValueAtTime(980, now + 0.12);
  voice.frequency.exponentialRampToValueAtTime(650, now + duration);

  harmonic.frequency.setValueAtTime(1040, now);
  harmonic.frequency.exponentialRampToValueAtTime(1500, now + 0.12);
  harmonic.frequency.exponentialRampToValueAtTime(900, now + duration);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.09, now + 0.16);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  harmonicGain.gain.setValueAtTime(0.0001, now);
  harmonicGain.gain.exponentialRampToValueAtTime(0.035, now + 0.05);
  harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

  voice.connect(gain);
  harmonic.connect(harmonicGain);
  gain.connect(ctx.destination);
  harmonicGain.connect(ctx.destination);

  voice.start(now);
  harmonic.start(now);
  voice.stop(now + duration);
  harmonic.stop(now + duration);

  setTimeout(() => {
    playTone({
      frequency: 760,
      duration: 0.09,
      type: 'sine',
      startVolume: 0.05,
      pitchSweep: -120,
    });
  }, 280);
};

export const playCatPurrSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Sub-bass rhythmic motor sound mimicking a purr
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      playTone({
        frequency: 60,
        duration: 0.15,
        type: 'triangle',
        startVolume: 0.2,
      });
    }, i * 200);
  }
};

export const playForceVoiceSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const syllables = [
    { start: 0, freq: 170, filter: 760, dur: 0.14 },
    { start: 0.16, freq: 245, filter: 1180, dur: 0.12 },
    { start: 0.29, freq: 205, filter: 920, dur: 0.16 },
    { start: 0.48, freq: 130, filter: 640, dur: 0.2 },
    { start: 0.72, freq: 190, filter: 1040, dur: 0.18 },
    { start: 0.94, freq: 155, filter: 700, dur: 0.26 },
  ];

  syllables.forEach(({ start, freq, filter, dur }, index) => {
    const osc = ctx.createOscillator();
    const buzz = ctx.createOscillator();
    const filterNode = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const buzzGain = ctx.createGain();
    const t = now + start;

    osc.type = 'sawtooth';
    buzz.type = 'square';
    filterNode.type = 'bandpass';
    filterNode.frequency.setValueAtTime(filter, t);
    filterNode.frequency.linearRampToValueAtTime(filter + (index % 2 === 0 ? 180 : -140), t + dur);
    filterNode.Q.setValueAtTime(7, t);

    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.linearRampToValueAtTime(freq + (index % 2 === 0 ? 34 : -26), t + dur * 0.55);
    osc.frequency.linearRampToValueAtTime(freq - 12, t + dur);

    buzz.frequency.setValueAtTime(freq * 1.5, t);
    buzz.frequency.linearRampToValueAtTime(freq * 1.25, t + dur);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.5, t + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.17, t + dur * 0.72);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    buzzGain.gain.setValueAtTime(0.066, t);
    buzzGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(filterNode);
    filterNode.connect(gain);
    buzz.connect(buzzGain);
    buzzGain.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    buzz.start(t);
    osc.stop(t + dur);
    buzz.stop(t + dur);
  });
};
