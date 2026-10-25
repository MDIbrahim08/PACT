/**
 * Preloaded Zero-Latency Audio Manager for "Hey Pact" Wake-Up Chime
 * Primary: /wake-chime.mp3 (preloaded into memory for 0ms latency)
 * Fallback: Web Audio API Dual-Sine Wave Synthesizer (587.33Hz, 880.0Hz)
 */

let wakeAudio: HTMLAudioElement | null = null;

if (typeof window !== 'undefined') {
  try {
    wakeAudio = new Audio('/wake-chime.mp3');
    wakeAudio.preload = 'auto';
    wakeAudio.volume = 0.85;
    // Attempt an initial warm-up load
    wakeAudio.load();
  } catch (err) {
    console.warn('[SoundEffects]: Audio element initialization deferred:', err);
  }
}

export function playFallbackSynthChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    [587.33, 880.0].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.11);
      gain.gain.setValueAtTime(0.001, now + idx * 0.11);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.11 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.11 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.11);
      osc.stop(now + idx * 0.11 + 0.35);
    });
  } catch (err) {
    console.warn('[SoundEffects]: Web Audio API fallback failed:', err);
  }
}

/**
 * Plays the wake-up chime with 0ms delay.
 * Resolves when the chime finishes so microphone recording doesn't capture the chime itself.
 */
export async function playWakeChime(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      return resolve();
    }

    if (!wakeAudio) {
      try {
        wakeAudio = new Audio('/wake-chime.mp3');
        wakeAudio.preload = 'auto';
        wakeAudio.volume = 0.85;
      } catch {}
    }

    if (wakeAudio) {
      let resolved = false;
      const done = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      // Safeguard timeout so speech recognition isn't delayed more than 500ms
      const safetyTimeout = setTimeout(done, 500);

      wakeAudio.currentTime = 0;
      wakeAudio.onended = () => {
        clearTimeout(safetyTimeout);
        done();
      };

      wakeAudio.play().catch(() => {
        clearTimeout(safetyTimeout);
        playFallbackSynthChime();
        setTimeout(done, 350);
      });
    } else {
      playFallbackSynthChime();
      setTimeout(resolve, 350);
    }
  });
}

/**
 * Halts any active chime playback immediately
 */
export function stopWakeChime(): void {
  if (wakeAudio) {
    try {
      wakeAudio.pause();
      wakeAudio.currentTime = 0;
    } catch {}
  }
}
