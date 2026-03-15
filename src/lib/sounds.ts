// Synthesized game sounds using Web Audio API — no external files needed

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.15) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not supported or blocked — silent fail
  }
}

/** Happy ascending chime for correct answers */
export function playCorrect() {
  playTone(523, 0.12, "sine", 0.12); // C5
  setTimeout(() => playTone(659, 0.12, "sine", 0.12), 80); // E5
  setTimeout(() => playTone(784, 0.2, "sine", 0.12), 160); // G5
}

/** Short descending buzz for wrong answers */
export function playWrong() {
  playTone(300, 0.15, "square", 0.08);
  setTimeout(() => playTone(220, 0.2, "square", 0.08), 100);
}

/** Quick tick for timer warning (last 30s) */
export function playTick() {
  playTone(800, 0.05, "sine", 0.06);
}

/** Celebratory fanfare for game completion */
export function playComplete() {
  playTone(523, 0.15, "sine", 0.1);  // C5
  setTimeout(() => playTone(659, 0.15, "sine", 0.1), 120);  // E5
  setTimeout(() => playTone(784, 0.15, "sine", 0.1), 240);  // G5
  setTimeout(() => playTone(1047, 0.3, "sine", 0.12), 360); // C6
}

/** Code collected sound (escape room) */
export function playCollect() {
  playTone(660, 0.1, "sine", 0.1);
  setTimeout(() => playTone(880, 0.15, "sine", 0.1), 80);
}

/** Subtle click for UI interactions */
export function playClick() {
  playTone(600, 0.03, "sine", 0.05);
}
