'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  X, 
  FileText, 
  Share2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  PhoneCall, 
  Check, 
  Send,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export interface SiriVoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRecording: boolean;
  isSpeaking: boolean;
  liveVoiceState: 'listening' | 'processing' | 'speaking' | 'agent-speaking' | 'user-speaking' | null;
  liveVoiceMessage: string;
  recordingSeconds: number;
  onToggleMic: () => void;
  latestUserTranscript?: string;
  latestAssistantReply?: string;
  whatsappActionUrl?: string;
  whatsappTargetName?: string;
  onOpenWorkspace?: () => void;
  userName?: string;
}

export const SiriVoiceCallModal: React.FC<SiriVoiceCallModalProps> = ({
  isOpen,
  onClose,
  isRecording,
  isSpeaking,
  liveVoiceState,
  liveVoiceMessage,
  recordingSeconds,
  onToggleMic,
  latestUserTranscript = '',
  latestAssistantReply = '',
  whatsappActionUrl,
  whatsappTargetName,
  onOpenWorkspace,
  userName = 'Trader',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Keep video looping smoothly whenever open
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isOpen, isRecording, isSpeaking]);

  if (!isOpen) return null;

  const formatSec = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none"
      >
        {/* Dynamic Ambient Background Glow */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-all duration-700 opacity-30 ${
            isRecording 
              ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/40 via-teal-900/10 to-transparent' 
              : isSpeaking
              ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/40 via-indigo-900/10 to-transparent'
              : liveVoiceState === 'processing'
              ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/40 via-orange-900/10 to-transparent'
              : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-slate-900/10 to-transparent'
          }`}
        />

        {/* Top Navigation Bar (Siri/ChatGPT style) */}
        <div className="relative z-10 w-full flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#407ADD] to-[#10B981] p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold tracking-tight text-white font-sans">Pact Voice AI</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                  Siri Mode
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isRecording 
                  ? `Listening (${formatSec(recordingSeconds)})` 
                  : isSpeaking 
                  ? 'Speaking response…' 
                  : liveVoiceState === 'processing' 
                  ? 'Analyzing Indian laws…' 
                  : `Ready for ${userName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenWorkspace && (
              <button
                type="button"
                onClick={onOpenWorkspace}
                className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-xs text-slate-300 hover:text-white border border-slate-700/80 transition-all active:scale-95 flex items-center space-x-1.5"
                title="Switch to Contract Workspace"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Workspace</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all active:scale-95 border border-slate-700/80 shadow-md"
              title="Close Voice Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Centerpiece: Animated Waveform Video & Dynamic Voice Glow */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto w-full max-w-sm mx-auto">
          <div className="relative w-full flex flex-col items-center justify-center">
            {/* Animated Pulse Rings behind the video container */}
            <motion.div
              animate={{
                scale: isRecording ? [1, 1.08, 1] : isSpeaking ? [1, 1.05, 1] : 1,
                opacity: isRecording ? [0.6, 1, 0.6] : isSpeaking ? [0.5, 0.9, 0.5] : 0.3,
              }}
              transition={{ repeat: Infinity, duration: isRecording ? 1.4 : 2, ease: 'easeInOut' }}
              className={`absolute -inset-4 rounded-[2.5rem] blur-xl transition-all duration-500 ${
                isRecording
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : isSpeaking
                  ? 'bg-gradient-to-r from-[#407ADD] to-indigo-500'
                  : 'bg-slate-700/20'
              }`}
            />

            {/* Video Card Container */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border-4 border-slate-800/80 w-[240px] h-[360px] sm:w-[270px] sm:h-[400px] flex items-center justify-center">
              <video
                ref={videoRef}
                src="/pact-avatar-call.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover select-none pointer-events-none"
              />

              {/* Status Overlay badge inside video */}
              <div className="absolute top-4 inset-x-0 flex justify-center pointer-events-none">
                <span className={`px-3 py-1 rounded-full text-[11px] font-medium tracking-wide shadow-sm flex items-center space-x-1.5 ${
                  isRecording 
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : isSpeaking
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900/80 text-slate-200 backdrop-blur-md'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                  <span>
                    {isRecording ? 'Listening to voice…' : isSpeaking ? 'Pact speaking…' : 'Say "Hey Pact"'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Subtitle / Transcription HUD */}
          <div className="w-full mt-5 px-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-center shadow-lg backdrop-blur-md min-h-[70px] flex flex-col items-center justify-center">
              {isRecording ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1.5 text-emerald-400 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Listening to your commercial terms…</span>
                  </div>
                  <p className="text-xs text-slate-300 italic line-clamp-2">
                    {latestUserTranscript ? `"${latestUserTranscript}"` : 'Dictate any deal, payment notice, or ask questions...'}
                  </p>
                </div>
              ) : isSpeaking ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1.5 text-blue-400 text-xs font-medium">
                    <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                    <span>Pact Legal Voice Response:</span>
                  </div>
                  <p className="text-xs text-slate-200 line-clamp-3">
                    {latestAssistantReply || 'Speaking contract summary…'}
                  </p>
                </div>
              ) : liveVoiceState === 'processing' ? (
                <div className="flex items-center justify-center space-x-2 text-amber-400 text-xs">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{liveVoiceMessage || 'Analyzing under Indian Contract Act §10...'}</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-slate-300 font-medium">
                    {latestAssistantReply ? (
                      <span className="line-clamp-2 text-slate-200">Pact: "{latestAssistantReply}"</span>
                    ) : (
                      `Namaste ${userName}! What deal or legal notice can I draft for you?`
                    )}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Say "Hey Pact" anytime or tap the microphone below
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Siri / Call Controller Bar */}
        <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center space-y-3 pt-2 pb-1">
          {/* WhatsApp Direct 1-Click Action Pill (when a legal notice or deal was auto-generated) */}
          {whatsappActionUrl && (
            <motion.a
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              href={whatsappActionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-emerald-300 text-xs font-semibold flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4 text-[#25D366]" />
              <span>Open Pre-Filled WhatsApp for {whatsappTargetName || 'Counterparty'}</span>
            </motion.a>
          )}

          {/* Action Row */}
          <div className="w-full flex items-center justify-around px-4">
            {/* Switch to Full Workspace */}
            <button
              type="button"
              onClick={onOpenWorkspace}
              className="flex flex-col items-center space-y-1 text-slate-400 hover:text-slate-200 transition-colors"
              title="View Complete Legal Contract"
            >
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center active:scale-95 transition-all shadow-md">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-[10px] font-medium tracking-tight">Workspace</span>
            </button>

            {/* Glowing Main Microphone / Push-to-Talk Trigger */}
            <button
              type="button"
              onClick={onToggleMic}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 cursor-pointer ${
                isRecording
                  ? 'bg-gradient-to-tr from-rose-500 to-red-600 text-white ring-8 ring-rose-500/30 animate-pulse scale-105'
                  : 'bg-gradient-to-tr from-[#407ADD] to-[#10B981] text-white hover:scale-105 shadow-emerald-500/30'
              }`}
              title={isRecording ? 'Tap to finish speaking' : 'Tap to speak deal terms'}
            >
              {isRecording ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
              {isRecording && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-400 animate-ping" />
              )}
            </button>

            {/* Close / Hang up Call */}
            <button
              type="button"
              onClick={onClose}
              className="flex flex-col items-center space-y-1 text-slate-400 hover:text-slate-200 transition-colors"
              title="Minimize Assistant"
            >
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center active:scale-95 transition-all shadow-md">
                <PhoneCall className="w-5 h-5 text-rose-400 rotate-[135deg]" />
              </div>
              <span className="text-[10px] font-medium tracking-tight">End Call</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
