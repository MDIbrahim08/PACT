'use client';

import React, { useState, useRef } from 'react';
import { Mic, MicOff, Upload, Play, Pause, Volume2, Sparkles, Check, FileAudio, Loader2 } from 'lucide-react';

interface VoiceUploaderProps {
  onTranscriptLoaded: (text: string) => void;
}

export default function VoiceUploader({ onTranscriptLoaded }: VoiceUploaderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [activePlayingIndex, setActivePlayingIndex] = useState<number | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<any>(null);
  const liveTranscriptRef = useRef<string>('');

  const sampleVoiceNotes = [
    {
      title: "Voice Note #1: Prabhanjan (Hinglish)",
      badge: "Packaging Deal",
      duration: "0:24",
      text: "Ibrahim bhai, 10,000 gold-foil boxes dispatch kar dena Diwali ke liye. Rate ₹25 per box fix hai, total ₹2,50,000. 30% advance bhej diya hai UPI pe, baki payment delivery ke turant baad mil jayega. November 10 tak stock factory pahuch jana chahiye."
    },
    {
      title: "Voice Note #2: Surat Cotton Trader",
      badge: "Textiles Deal",
      duration: "0:18",
      text: "Sir 500 bales of 100% combed cotton yarn. Price is ₹32,000 per bale. Delivery at Bhiwandi warehouse by coming Monday. Net 30 days payment term agreed via phone call."
    },
    {
      title: "Voice Note #3: Pune Auto Machinist",
      badge: "CNC Precision",
      duration: "0:21",
      text: "Deshmukh saheb, 500 CNC pinion bevel gears SAE 8620 case hardened 58-62 HRC. Negotiated rate ₹850 per unit = ₹4,25,000 plus GST. Advance 25% credited, balance within 15 days of CMM inspection report."
    }
  ];

  // Start Real Browser Audio Recording & Speech Recognition
  const startRecording = async () => {
    setErrorMessage(null);
    liveTranscriptRef.current = '';
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        await processRecordedAudio();
      };

      // Native browser speech recognition streaming (if available in Chrome/Edge/Safari)
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'hi-IN'; // Multi-dialect support default

          recognition.onresult = (event: any) => {
            let fullText = '';
            for (let i = 0; i < event.results.length; ++i) {
              fullText += event.results[i][0].transcript + ' ';
            }
            liveTranscriptRef.current = fullText.trim();
          };

          recognition.onerror = () => {};
          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch {
          // Non-blocking fallback to raw audio
        }
      }

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone Access Denied:', err);
      setErrorMessage(
        'Microphone permission denied. Please allow microphone access or upload an audio file.'
      );
    }
  };

  // Stop Recording and pipe into /api/transcribe
  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setRecordingTime(0);

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const processRecordedAudio = async () => {
    setIsTranscribing(true);
    setErrorMessage(null);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('file', audioBlob, 'mic-recording.webm');
      if (liveTranscriptRef.current) {
        formData.append('transcript', liveTranscriptRef.current);
      }

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.transcript) {
        onTranscriptLoaded(data.transcript);
      } else if (liveTranscriptRef.current) {
        onTranscriptLoaded(liveTranscriptRef.current);
      } else {
        setErrorMessage(data.error || 'No speech detected in audio recording.');
      }
    } catch (err: any) {
      if (liveTranscriptRef.current) {
        onTranscriptLoaded(liveTranscriptRef.current);
      } else {
        setErrorMessage('Transcription service temporarily unreachable.');
      }
    } finally {
      setIsTranscribing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsTranscribing(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.transcript) {
        onTranscriptLoaded(data.transcript);
      } else {
        setErrorMessage(data.error || 'Unable to transcribe uploaded audio file.');
      }
    } catch (err: any) {
      setErrorMessage('Audio transcription error.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handlePlaySample = (index: number, text: string) => {
    if (activePlayingIndex === index) {
      setActivePlayingIndex(null);
    } else {
      setActivePlayingIndex(index);
      onTranscriptLoaded(text);
      setTimeout(() => setActivePlayingIndex(null), 3000);
    }
  };

  return (
    <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-brand-border shadow-elevation space-y-4">
      {/* Header with Status Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border/60 pb-3">
        <h4 className="text-sm font-bold text-white flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-industrial-950 border border-industrial-500/40 text-industrial-400">
            <Volume2 className="w-4 h-4" />
          </div>
          <span>WhatsApp Voice Note & Speech Engine</span>
        </h4>
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono border border-emerald-500/20 font-medium">
            Live AI Speech-to-Contract
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono">
          {errorMessage}
        </div>
      )}

      {/* Interactive Voice Recording & File Upload Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Live Mic Recording with Browser MediaRecorder */}
        <button
          onClick={toggleRecording}
          disabled={isTranscribing}
          type="button"
          className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
            isRecording
              ? 'bg-red-950/50 border-red-500 text-white shadow-glow-red animate-pulse'
              : 'bg-slate-900/90 hover:bg-slate-800/90 border-brand-border text-slate-200'
          }`}
        >
          <div className="flex items-center space-x-3 text-left">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-600 text-white'
                  : isTranscribing
                  ? 'bg-amber-600 text-white animate-spin'
                  : 'bg-industrial-600 text-white shadow-glow'
              }`}
            >
              {isTranscribing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </div>
            <div>
              <span className="text-xs font-bold block">
                {isTranscribing
                  ? 'Live AI Transcribing...'
                  : isRecording
                  ? 'Recording Voice Note...'
                  : 'Record Live Voice Note'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {isRecording
                  ? `00:${recordingTime.toString().padStart(2, '0')} (Tap to Transcribe)`
                  : 'Speak real deal in Hinglish / English'}
              </span>
            </div>
          </div>

          {/* Animated Waveform when recording */}
          {isRecording && (
            <div className="flex items-center space-x-1 h-5">
              {[8, 16, 22, 12, 24, 14, 18, 10].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-red-400 rounded-full animate-pulse"
                  style={{ height: `${h}px`, animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          )}
        </button>

        {/* Upload Audio File Button (.ogg, .opus, .m4a, .mp3, .wav) */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*,.ogg,.opus,.m4a,.mp3,.wav"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isTranscribing}
            type="button"
            className="w-full h-full p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-brand-border hover:border-industrial-500/50 flex items-center justify-between text-slate-200 transition-all text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 group-hover:bg-industrial-600 text-industrial-400 group-hover:text-white flex items-center justify-center transition-all">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block group-hover:text-white">
                  {uploadedFileName ? 'Uploaded Audio File' : 'Upload WhatsApp Audio'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {uploadedFileName ? uploadedFileName : '.opus, .ogg, .m4a, .mp3, .wav'}
                </span>
              </div>
            </div>
            <FileAudio className="w-4 h-4 text-slate-500 group-hover:text-industrial-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Preset Indian MSME Voice Notes Grid */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Click to Load Real MSME Trade Audio Note:</span>
          <span className="text-industrial-400">1-Click Live Test</span>
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {sampleVoiceNotes.map((note, idx) => {
            const isPlaying = activePlayingIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePlaySample(idx, note.text)}
                className={`p-3 rounded-xl border text-left transition-all group relative overflow-hidden ${
                  isPlaying
                    ? 'bg-industrial-950/80 border-industrial-400 shadow-glow'
                    : 'bg-slate-950/70 hover:bg-slate-900 border-slate-800 hover:border-industrial-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-industrial-300 font-semibold">
                    {note.badge}
                  </span>
                  <span
                    className={`text-[10px] font-mono flex items-center gap-1 ${
                      isPlaying ? 'text-emerald-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Play className="w-3 h-3 text-industrial-400" />
                    )}
                    <span>{isPlaying ? 'Loaded' : note.duration}</span>
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-1">
                  {note.title}
                </div>

                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 italic font-sans leading-relaxed">
                  "{note.text}"
                </p>

                {isPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-industrial-500 to-emerald-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
