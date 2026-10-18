// Web Audio API Synthesizer for Dhaka Sound Effects

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

/**
 * Dhaka Rickshaw Bell ("Tring-Tring!")
 */
export function playRickshawBell() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const strikes = [0, 0.12, 0.28, 0.40];

  strikes.forEach((delay) => {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2450, now + delay);
    osc.frequency.exponentialRampToValueAtTime(1800, now + delay + 0.08);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(3200, now + delay);
    osc2.frequency.exponentialRampToValueAtTime(2600, now + delay + 0.08);

    gain.gain.setValueAtTime(0.18, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.09);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + delay);
    osc.stop(now + delay + 0.1);
    osc2.start(now + delay);
    osc2.stop(now + delay + 0.1);
  });
}

/**
 * Vintage Landline Ringing ("Tringggg... Tringggg...")
 */
export function playPhoneRing() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(440, now);

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(480, now);

  gain.gain.setValueAtTime(0, now);
  // Ring 1
  gain.gain.setValueAtTime(0.15, now + 0.05);
  gain.gain.setValueAtTime(0, now + 0.45);
  // Ring 2
  gain.gain.setValueAtTime(0.15, now + 0.6);
  gain.gain.setValueAtTime(0, now + 1.0);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc1.stop(now + 1.1);
  osc2.start(now);
  osc2.stop(now + 1.1);
}

/**
 * Uncle Angrily Hanging Up ("Line kete dilo!") - Off-hook fast beeps
 */
export function playCallDisconnected() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const beeps = [0, 0.25, 0.5, 0.75];

  beeps.forEach((delay) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now + delay);

    gain.gain.setValueAtTime(0.16, now + delay);
    gain.gain.setValueAtTime(0, now + delay + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + delay);
    osc.stop(now + delay + 0.16);
  });
}

/**
 * Uncle Suspicious Buzzer / Score Decrease
 */
export function playUncleBuzzer() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.linearRampToValueAtTime(90, now + 0.35);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.36);
}

/**
 * Approval Increase / Chime
 */
export function playApprovalChime() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0.15, now + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.26);
  });
}

/**
 * Victory Celebration Fanfare ("Bariwala Convinced!")
 */
export function playVictoryFanfare() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const melody = [
    { freq: 523.25, t: 0, d: 0.12 },
    { freq: 659.25, t: 0.14, d: 0.12 },
    { freq: 783.99, t: 0.28, d: 0.15 },
    { freq: 1046.5, t: 0.45, d: 0.35 },
    { freq: 880.0, t: 0.85, d: 0.15 },
    { freq: 1046.5, t: 1.05, d: 0.5 },
  ];

  melody.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.freq, now + note.t);

    gain.gain.setValueAtTime(0.2, now + note.t);
    gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + note.t);
    osc.stop(now + note.t + note.d);
  });
}
