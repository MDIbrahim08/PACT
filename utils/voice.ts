/**
 * Unified Voice Pipeline Utility with Automatic Multi-Engine Fallback
 * Primary TTS: Sarvam AI (bulbul:v3 / bulbul:v1)
 * Secondary TTS: ElevenLabs (eleven_multilingual_v2)
 * Tertiary TTS: Browser Native window.speechSynthesis
 */

let activeAudio: HTMLAudioElement | null = null;
let activeAbortController: AbortController | null = null;

export interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  signal?: AbortSignal;
  language?: string;
}

export interface SpeakResult {
  success: boolean;
  engine: 'sarvam-ai' | 'elevenlabs' | 'browser-speech-synthesis';
  error?: string;
}

/**
 * Stops any currently playing audio stream or speech synthesis
 */
export function stopCurrentAudio() {
  if (activeAbortController) {
    try {
      activeAbortController.abort();
    } catch {}
    activeAbortController = null;
  }

  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio.src = '';
    } catch {}
    activeAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Cleans raw text for crisp speech by removing markdown, symbols, and URLs
 */
export function sanitizeTextForSpeech(text: string): string {
  return text
    .replace(/[*#_`~>]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fallback to browser native SpeechSynthesis
 */
function speakWithBrowserSpeech(
  text: string,
  options?: SpeakOptions
): Promise<SpeakResult> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      options?.onError?.(new Error('Browser speech synthesis not supported'));
      return resolve({
        success: false,
        engine: 'browser-speech-synthesis',
        error: 'SpeechSynthesis unavailable',
      });
    }

    try {
      window.speechSynthesis.cancel();
      const cleanText = sanitizeTextForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Prefer cute, friendly high-clarity voices (Zira, Jenny, Samantha, Veena, Heera)
      const voices = window.speechSynthesis.getVoices();
      const cuteVoice = voices.find(
        (v) =>
          v.name.includes('Jenny') ||
          v.name.includes('Zira') ||
          v.name.includes('Samantha') ||
          v.name.includes('Veena') ||
          v.name.includes('Heera') ||
          v.name.includes('Google UK English Female') ||
          v.name.includes('Google US English') ||
          (v.lang.includes('en') && !v.name.includes('David') && !v.name.includes('George') && !v.name.includes('Rishi'))
      );
      if (cuteVoice) {
        utterance.voice = cuteVoice;
      }

      // High, cute animated companion pitch and cheerful tempo
      utterance.pitch = 1.35;
      utterance.rate = 1.08;

      utterance.onstart = () => {
        options?.onStart?.();
      };

      utterance.onend = () => {
        options?.onEnd?.();
        resolve({ success: true, engine: 'browser-speech-synthesis' });
      };

      utterance.onerror = (e) => {
        options?.onEnd?.();
        resolve({
          success: false,
          engine: 'browser-speech-synthesis',
          error: e.error || 'SpeechSynthesis failed',
        });
      };

      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      options?.onEnd?.();
      resolve({
        success: false,
        engine: 'browser-speech-synthesis',
        error: err.message,
      });
    }
  });
}

/**
 * High-resilient speakText with auto-fallback:
 * Step 1: /api/tts (Sarvam AI bulbul model)
 * Step 2: /api/tts (ElevenLabs multilingual model)
 * Step 3: window.speechSynthesis (Browser native)
 */
export async function speakText(
  text: string,
  options?: SpeakOptions
): Promise<SpeakResult> {
  stopCurrentAudio();
  if (!text || !text.trim()) {
    return { success: false, engine: 'sarvam-ai', error: 'Empty text' };
  }

  const cleanText = sanitizeTextForSpeech(text);
  const controller = new AbortController();
  activeAbortController = controller;

  // Listen to external signal if provided
  if (options?.signal) {
    options.signal.addEventListener('abort', () => {
      controller.abort();
      stopCurrentAudio();
    });
  }

  try {
    options?.onStart?.();

    // Call unified backend dual-engine endpoint
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanText,
        language: options?.language || 'en-IN',
      }),
      signal: controller.signal,
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      const engineHeader = (res.headers.get('x-engine') || 'sarvam-ai') as
        | 'sarvam-ai'
        | 'elevenlabs';

      if (contentType.includes('audio')) {
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        // Perkier, cheerful tempo matching the cute mascot
        audio.playbackRate = 1.05;
        activeAudio = audio;

        return new Promise<SpeakResult>((resolve) => {
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            activeAudio = null;
            options?.onEnd?.();
            resolve({ success: true, engine: engineHeader });
          };

          audio.onerror = async () => {
            URL.revokeObjectURL(audioUrl);
            activeAudio = null;
            // Silent fallback to browser speech synthesis
            const fallbackRes = await speakWithBrowserSpeech(cleanText, options);
            resolve(fallbackRes);
          };

          audio
            .play()
            .catch(async () => {
              // Browser autoplay policy blocked or decode error -> fallback
              const fallbackRes = await speakWithBrowserSpeech(cleanText, options);
              resolve(fallbackRes);
            });
        });
      }
    }

    // Backend returned fallback flag or non-audio -> gracefully fall back to browser speech
    return await speakWithBrowserSpeech(cleanText, options);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      options?.onEnd?.();
      return { success: false, engine: 'sarvam-ai', error: 'Aborted' };
    }

    // Fall back to browser speech
    return await speakWithBrowserSpeech(cleanText, options);
  }
}
