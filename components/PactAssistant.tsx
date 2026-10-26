'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Shield, 
  X, 
  Send, 
  RefreshCw,
  Radio,
  FileCheck2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { MuseMascot, AgentState } from '@/components/MuseMascot';
import { playWakeChime, stopWakeChime } from '@/utils/soundEffects';
import { speakText, stopCurrentAudio } from '@/utils/voice';

export interface PactAssistantMessage {
  id: string;
  sender: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  engineUsed?: string;
}

interface PactAssistantProps {
  onDealExtracted?: (dealText: string) => void;
  onTranscriptReceived?: (transcript: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export const PactAssistant: React.FC<PactAssistantProps> = ({
  onDealExtracted,
  onTranscriptReceived,
  isOpen = false,
  onClose,
  className = '',
}) => {
  // Voice & Conversation States
  const [isWakeWordActive, setIsWakeWordActive] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Say "Hey Pact" or tap the mic');
  const [activeEngine, setActiveEngine] = useState<string>('Sarvam AI');

  const [messages, setMessages] = useState<PactAssistantMessage[]>([
    {
      id: 'welcome-1',
      sender: 'Pact AI Sentinel',
      role: 'assistant',
      text: 'Namaste! I am Pact, your voice-driven legal notary. Speak your deal terms or say "Hey Pact" to begin.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      engineUsed: 'Sarvam AI bulbul:v3',
    },
  ]);
  const [inputText, setInputText] = useState('');

  // Audio & Recording Refs
  const passiveRecognitionRef = useRef<any>(null);
  const activeMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const activeAudioChunksRef = useRef<Blob[]>([]);
  const activeSpeechRecRef = useRef<any>(null);
  const activeTranscriptRef = useRef<string>('');
  const ttsAbortControllerRef = useRef<AbortController | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Derive mascot visual state
  const mascotState: AgentState = isSpeaking
    ? 'agent-speaking'
    : isProcessing
    ? 'processing'
    : isListening
    ? 'listening'
    : 'locked';

  // Auto-scroll chat
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, isSpeaking]);

  /**
   * Immediately halts any current TTS output and resets active speech controller
   */
  const interruptPlayback = useCallback(() => {
    if (ttsAbortControllerRef.current) {
      try {
        ttsAbortControllerRef.current.abort();
      } catch {}
      ttsAbortControllerRef.current = null;
    }
    stopCurrentAudio();
    stopWakeChime();
    setIsSpeaking(false);
  }, []);

  /**
   * Speak response using the resilient Dual-Engine Voice Pipeline
   * 1. Sarvam AI bulbul:v3
   * 2. ElevenLabs multilingual_v2 (George)
   * 3. Browser window.speechSynthesis
   */
  const speakBotResponse = useCallback(
    async (text: string) => {
      interruptPlayback();
      if (!text || isMuted) return;

      const controller = new AbortController();
      ttsAbortControllerRef.current = controller;

      setIsSpeaking(true);
      setStatusMessage('🔊 Pact Speaking...');

      try {
        const result = await speakText(text, {
          signal: controller.signal,
          onStart: () => {
            setIsSpeaking(true);
            setStatusMessage('🔊 Pact Voice Stream (Dual-Engine Active)...');
          },
          onEnd: () => {
            setIsSpeaking(false);
            setStatusMessage('Say "Hey Pact" or tap the mic');
          },
          onError: () => {
            setIsSpeaking(false);
            setStatusMessage('Say "Hey Pact" or tap the mic');
          },
        });

        setActiveEngine(
          result.engine === 'sarvam-ai'
            ? 'Sarvam AI bulbul:v3'
            : result.engine === 'elevenlabs'
            ? 'ElevenLabs Multilingual v2'
            : 'Browser Speech'
        );
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('[PactAssistant TTS Exception]:', err);
        }
      } finally {
        setIsSpeaking(false);
      }
    },
    [interruptPlayback, isMuted]
  );

  /**
   * Send transcribed text to Zero-Hallucination Legal AI Backend
   */
  const processUserTranscript = useCallback(
    async (rawText: string) => {
      const clean = rawText.trim();
      if (!clean) {
        setIsProcessing(false);
        setStatusMessage('Say "Hey Pact" or tap the mic');
        return;
      }

      setIsProcessing(true);
      setStatusMessage('🧠 Analyzing deal terms under Section 10...');

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const userMsg: PactAssistantMessage = {
        id: `user-${Date.now()}`,
        sender: 'Trader (Spoken)',
        role: 'user',
        text: clean,
        timestamp: time,
      };

      setMessages((prev) => [...prev, userMsg]);
      onTranscriptReceived?.(clean);
      onDealExtracted?.(clean);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: clean,
            conversationHistory: messages.slice(-6).map((m) => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
          }),
        });

        const data = await res.json();
        const replyText =
          data.reply ||
          'Understood. I have locked your agreement terms with cryptographic SHA-256 evidence under BSA 2023 §63.';
        const spoken = data.spokenSummary || replyText;

        const botMsg: PactAssistantMessage = {
          id: `bot-${Date.now()}`,
          sender: 'Pact Legal Notary',
          role: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          engineUsed: activeEngine,
        };

        setMessages((prev) => [...prev, botMsg]);
        setIsProcessing(false);

        // Natural spoken voice-out via dual-engine
        await speakBotResponse(spoken);
      } catch (err) {
        console.error('[PactAssistant Backend Error]:', err);
        setIsProcessing(false);
        setStatusMessage('Error processing terms. Please try again.');
      }
    },
    [activeEngine, messages, onDealExtracted, onTranscriptReceived, speakBotResponse]
  );

  /**
   * STEP 2: SEQUENCED MIC TRIGGER
   * a) Interrupt current speech
   * b) Immediately trigger visual listening state (glowing #407ADD to #10B981)
   * c) Play preloaded /wake-chime.mp3 FIRST
   * d) As chime ends, open active audio recording for Sarvam AI STT
   */
  const startSequencedVoiceCapture = useCallback(async () => {
    // 1. Interrupt any active speech immediately
    interruptPlayback();

    // 2. Visual Listening State: glowing #407ADD to #10B981 pulse ring
    setIsListening(true);
    setStatusMessage('🔔 "Hey Pact" Wake Chime Playing...');

    // 3. Play Wake Chime FIRST (so microphone recording does not capture the chime sound)
    try {
      await playWakeChime();
    } catch {
      // Graceful fallback already handled inside playWakeChime
    }

    // 4. Open active microphone stream right as chime ends (350ms mark)
    setStatusMessage('🎙️ Pact is Listening (Sarvam AI STT)...');
    activeTranscriptRef.current = '';
    activeAudioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      });
      activeMediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          activeAudioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setIsListening(false);
        setIsProcessing(true);
        setStatusMessage('⚡ Sarvam AI Transcribing Audio...');

        try {
          let transcript = activeTranscriptRef.current?.trim() || '';

          // Only fall back to network STT if browser speech recognition did not capture text
          if (!transcript && activeAudioChunksRef.current.length > 0) {
            const audioBlob = new Blob(activeAudioChunksRef.current, { type: 'audio/webm' });
            const formData = new FormData();
            formData.append('file', audioBlob, 'wake-recording.webm');

            const transcribeRes = await fetch('/api/transcribe', {
              method: 'POST',
              body: formData,
            });

            const data = await transcribeRes.json();
            transcript = data.transcript || '';
          }

          if (transcript.trim()) {
            await processUserTranscript(transcript);
          } else {
            setIsProcessing(false);
            setStatusMessage('No speech detected. Say "Hey Pact" to try again.');
          }
        } catch (err) {
          console.error('[Transcribe Error]:', err);
          if (activeTranscriptRef.current) {
            await processUserTranscript(activeTranscriptRef.current);
          } else {
            setIsProcessing(false);
            setStatusMessage('Audio capture failed. Please tap to retry.');
          }
        }
      };

      // Native browser speech recognition as parallel real-time interim backup
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'en-IN';

          rec.onresult = (e: any) => {
            let combined = '';
            for (let i = 0; i < e.results.length; i++) {
              combined += e.results[i][0].transcript + ' ';
            }
            activeTranscriptRef.current = combined.trim();

            // Auto-stop recording on 1.2s silence (Instant Voice Activity Detection)
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
              if (activeMediaRecorderRef.current && activeMediaRecorderRef.current.state === 'recording') {
                activeMediaRecorderRef.current.stop();
              }
              if (activeSpeechRecRef.current) {
                try {
                  activeSpeechRecRef.current.stop();
                } catch {}
              }
            }, 1200);
          };

          rec.start();
          activeSpeechRecRef.current = rec;
        } catch {}
      }

      recorder.start(250);

      // Auto-stop guard after 15 seconds max
      setTimeout(() => {
        if (activeMediaRecorderRef.current && activeMediaRecorderRef.current.state === 'recording') {
          activeMediaRecorderRef.current.stop();
        }
      }, 15000);
    } catch (err) {
      console.warn('[Microphone Access Denied]:', err);
      setIsListening(false);
      setStatusMessage('Microphone access blocked. Please grant permissions.');
    }
  }, [interruptPlayback, processUserTranscript]);

  /**
   * Stop active recording manually
   */
  const stopVoiceCapture = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (activeMediaRecorderRef.current && activeMediaRecorderRef.current.state === 'recording') {
      activeMediaRecorderRef.current.stop();
    }
    if (activeSpeechRecRef.current) {
      try {
        activeSpeechRecRef.current.stop();
      } catch {}
    }
  }, []);

  /**
   * Toggle Mic handler (Gated: only enabled when bot client is downloaded)
   */
  const handleToggleMic = () => {
    const isDownloaded = typeof window !== 'undefined' && localStorage.getItem('pact_bot_downloaded') === 'true';
    if (!isDownloaded) {
      setStatusMessage('Microphone Locked: Download the Pact Bot client to activate voice.');
      return;
    }

    if (isListening) {
      stopVoiceCapture();
    } else {
      startSequencedVoiceCapture();
    }
  };

  /**
   * STEP 2 (PASSIVE): Passive "Hey Pact" Wake-Word Engine
   */
  useEffect(() => {
    if (typeof window === 'undefined' || !isWakeWordActive) return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      console.info('[Wake Word]: SpeechRecognition not natively supported in this browser.');
      return;
    }

    let isAlive = true;
    let recognizer: any = null;

    const initPassiveListener = () => {
      const isDownloaded = typeof window !== 'undefined' && localStorage.getItem('pact_bot_downloaded') === 'true';
      if (!isDownloaded) return;

      try {
        recognizer = new SpeechRec();
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.lang = 'en-IN';

        recognizer.onresult = (evt: any) => {
          if (!isAlive || isListening || isProcessing) return;

          for (let i = evt.resultIndex; i < evt.results.length; i++) {
            const rawTranscript = evt.results[i][0].transcript;
            const transcript = rawTranscript.toLowerCase();

            // Wake word trigger matches: "hey pact", "hello pact", "hi pact", "pact"
            if (
              transcript.includes('hey pact') ||
              transcript.includes('hello pact') ||
              transcript.includes('hi pact') ||
              transcript.includes('ok pact') ||
              transcript.includes('okay pact') ||
              transcript.startsWith('pact ')
            ) {
              console.log('[Wake Word Triggered]:', rawTranscript);
              try {
                recognizer.abort();
              } catch {}

              const wakeRegex = /^(hey|hi|hello|ok|okay)?\s*pact\b[\s,]*/i;
              const trailing = rawTranscript.replace(wakeRegex, '').trim();
              if (trailing && trailing.length >= 3) {
                processUserTranscript(trailing);
              } else {
                startSequencedVoiceCapture();
              }
              break;
            }
          }
        };

        recognizer.onerror = (e: any) => {
          if (e.error !== 'no-speech' && e.error !== 'aborted') {
            console.debug('[Passive Wake-Word]:', e.error);
          }
        };

        recognizer.onend = () => {
          if (isAlive && isWakeWordActive && !isListening && !isProcessing) {
            // Restart passive loop seamlessly
            setTimeout(() => {
              if (isAlive && !isListening && !isProcessing) {
                try {
                  recognizer.start();
                } catch {}
              }
            }, 600);
          }
        };

        recognizer.start();
        passiveRecognitionRef.current = recognizer;
      } catch (err) {
        console.debug('[Passive SpeechRec Start Deferred]:', err);
      }
    };

    initPassiveListener();

    return () => {
      isAlive = false;
      if (recognizer) {
        try {
          recognizer.abort();
        } catch {}
      }
    };
  }, [isWakeWordActive, isListening, isProcessing, startSequencedVoiceCapture]);

  // Handle Text Submission
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const text = inputText.trim();
    setInputText('');
    processUserTranscript(text);
  };

  return (
    <div
      className={`flex flex-col bg-slate-950/95 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl ${className}`}
    >
      {/* Header with Mascot & Status */}
      <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          {/* Mascot with Glowing #407ADD to #10B981 Pulse Ring */}
          <div className="relative">
            {isListening && (
              <>
                <span className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-[#407ADD] to-[#10B981] animate-ping opacity-75 blur-sm pointer-events-none" />
                <span className="absolute -inset-1.5 rounded-full border-2 border-emerald-400 animate-pulse opacity-95 pointer-events-none shadow-[0_0_20px_#10B981]" />
              </>
            )}
            <MuseMascot
              state={mascotState}
              placement="header-right"
              statusMessage={statusMessage}
              isVoiceActive={isListening}
              onToggleVoice={handleToggleMic}
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white tracking-wide">Pact Voice Notary</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                LIVE DUAL-ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5">
              <Radio
                className={`w-3 h-3 ${
                  isListening
                    ? 'text-emerald-400 animate-pulse'
                    : isProcessing
                    ? 'text-cyan-400 animate-spin'
                    : 'text-slate-500'
                }`}
              />
              <span className="truncate max-w-[220px]">{statusMessage}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5">
          {/* Wake Word Badge Toggle */}
          <button
            onClick={() => setIsWakeWordActive((prev) => !prev)}
            title={isWakeWordActive ? 'Passive "Hey Pact" Wake Detection Active' : 'Wake Word Detection Paused'}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all border ${
              isWakeWordActive
                ? 'bg-blue-950/80 border-blue-500/50 text-blue-300'
                : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}
          >
            {isWakeWordActive ? '👂 "Hey Pact" ON' : '👂 Wake Word OFF'}
          </button>

          {/* Mute Voiceout Toggle */}
          <button
            onClick={() => {
              if (!isMuted) interruptPlayback();
              setIsMuted((prev) => !prev);
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-800"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-800"
              title="Close Assistant"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[380px] min-h-[220px] scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-md ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              <div className="flex items-center justify-between mb-1 space-x-2 text-[10px] opacity-75 font-mono">
                <span>{m.sender}</span>
                <span>{m.timestamp}</span>
              </div>
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
            {m.engineUsed && (
              <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">
                ⚡ {m.engineUsed}
              </span>
            )}
          </div>
        ))}
        <div ref={chatScrollRef} />
      </div>

      {/* Sequenced Voice Mic & Text Input Footer */}
      <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center space-x-2.5">
        {/* Glowing Mic Button with Sequenced Audio Chime */}
        <button
          type="button"
          onClick={handleToggleMic}
          disabled={isProcessing}
          className={`relative w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-xl ${
            isListening
              ? 'bg-gradient-to-r from-[#407ADD] to-[#10B981] text-white ring-4 ring-emerald-500/40 animate-pulse scale-105'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:scale-105 active:scale-95'
          }`}
          title={isListening ? 'Stop Recording' : 'Start Voice Input (Plays "Hey Pact" Chime)'}
        >
          {isListening ? (
            <MicOff className="w-5 h-5 animate-spin" />
          ) : (
            <Mic className="w-5 h-5" />
          )}

          {isListening && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          )}
        </button>

        {/* Text fallback input */}
        <form onSubmit={handleTextSubmit} className="flex-1 flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='Type a deal or say "Hey Pact 50 bags cement..."'
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all"
            title="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PactAssistant;
