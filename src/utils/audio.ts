// Web Audio API Synthesized Water Droplet Chimes, Giggles & Celebrations

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Realistic bubbly water drop "bloop" sound
 */
export function playDropSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    
    // Quick pitch rise for the water droplet "plop" effect
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.4, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    console.warn('Audio playback error:', e);
  }
}

/**
 * Fun cartoon "Gulp-Gulp" sound effect for kids
 */
export function playCartoonGulp() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    [0, 0.12, 0.24].forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + delay;

      osc.type = 'triangle';
      // Pitch drop mimic of swallowing
      osc.frequency.setValueAtTime(500 + idx * 80, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.1);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.12);
    });
  } catch (e) {
    console.warn('Gulp sound error:', e);
  }
}

/**
 * Mascot Giggle / Happy bounce sound
 */
export function playMascotGiggle() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const pitches = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    pitches.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.07);
    });
  } catch (e) {
    console.warn('Giggle sound error:', e);
  }
}

/**
 * Pleasant reminder chime when time to drink water
 */
export function playReminderChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Harmonic dual bells
    const notes = [587.33, 880, 1174.66]; // D5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      gain.gain.setValueAtTime(0.001, now + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.15 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.65);
    });
  } catch (e) {
    console.warn('Reminder chime error:', e);
  }
}

/**
 * Joyful celebratory victory chime for reaching daily goal
 */
export function playGoalAchievedSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // C Major Arpeggio celebration: C5, E5, G5, C6
    const chords = [523.25, 659.25, 783.99, 1046.5];
    chords.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteStart = now + i * 0.12;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.3, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + 0.85);
    });
  } catch (e) {
    console.warn('Victory chime error:', e);
  }
}
