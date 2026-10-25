'use client';

import React, { useState } from 'react';
import { MessageSquare, Mic, Play, Pause, Send, Plus, RefreshCw, Sparkles, Check, Paperclip, Phone, MoreVertical } from 'lucide-react';
import { ChatMessage } from '@/lib/types';
import { SAMPLE_SCENARIOS, SampleDealScenario } from '@/lib/extractionEngine';

interface WhatsAppSimulatorProps {
  chatText: string;
  onChatTextChange: (newText: string) => void;
  activeScenarioId: string;
  onSelectScenario: (scenario: SampleDealScenario) => void;
  onApplyNudgeToChat: (nudgeText: string) => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({
  chatText,
  onChatTextChange,
  activeScenarioId,
  onSelectScenario,
  onApplyNudgeToChat,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState<'interactive' | 'raw_editor'>('interactive');
  const [customInput, setCustomInput] = useState('');
  const [copiedNudge, setCopiedNudge] = useState(false);

  const activeScenario = SAMPLE_SCENARIOS.find(s => s.id === activeScenarioId) || SAMPLE_SCENARIOS[0];

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formatted = `${chatText}\n\n[${time}] Ibrahim (Buyer): ${customInput.trim()}`;
    onChatTextChange(formatted);
    setCustomInput('');
  };

  return (
    <div className="bg-surface rounded-2xl border border-brand-border overflow-hidden shadow-elevation flex flex-col h-full">
      
      {/* Top Controls: MSME Scenario Selector */}
      <div className="bg-slate-900/90 border-b border-brand-border px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              WhatsApp Deal Ingestion Simulator
            </span>
          </div>

          {/* Toggle between Interactive Chat View & Raw Text Ingestion */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-brand-border/60 text-xs">
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                activeTab === 'interactive'
                  ? 'bg-industrial-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chat UI
            </button>
            <button
              onClick={() => setActiveTab('raw_editor')}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                activeTab === 'raw_editor'
                  ? 'bg-industrial-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw Transcript Editor
            </button>
          </div>
        </div>

        {/* Real Indian MSME Scenario Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
          <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">Load MSME Case:</span>
          {SAMPLE_SCENARIOS.map((scenario) => {
            const isSelected = scenario.id === activeScenarioId;
            return (
              <button
                key={scenario.id}
                onClick={() => onSelectScenario(scenario)}
                className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-industrial-950 text-industrial-300 border-industrial-500 font-medium shadow-glow'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 border-slate-700/60'
                }`}
              >
                {scenario.title.split('&')[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* WhatsApp Interface Header */}
      <div className="bg-[#128C7E] text-white px-4 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-emerald-800/80 flex items-center justify-center font-bold text-sm border border-emerald-300/30">
            {activeScenario.title[0]}
          </div>
          <div>
            <h4 className="text-sm font-semibold leading-tight">{activeScenario.title}</h4>
            <p className="text-[11px] text-emerald-100 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-200"></span>
              {activeScenario.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-emerald-100">
          <Phone className="w-4 h-4 opacity-75" />
          <MoreVertical className="w-4 h-4 opacity-75" />
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'interactive' ? (
        <div className="flex-1 p-4 bg-[#0B141A] overflow-y-auto space-y-3 min-h-[380px] max-h-[440px]">
          
          {/* Encryption Notice */}
          <div className="text-center my-2">
            <span className="inline-block bg-[#182229] text-[#ffd279] text-[10px] px-3 py-1 rounded-md border border-[#222e35] max-w-xs">
              🔒 Encrypted conversation. Pact Evidence Lock is active under Bharatiya Sakshya Adhiniyam 2023 §63(4).
            </span>
          </div>

          {/* Render Scenario Messages */}
          {activeScenario.messages.map((msg) => {
            const isBuyer = msg.role === 'buyer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isBuyer ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm relative shadow-subtle ${
                    isBuyer
                      ? 'bg-[#202C33] text-slate-100 rounded-tl-none border border-slate-700/40'
                      : 'bg-[#005C4B] text-slate-100 rounded-tr-none border border-emerald-600/40'
                  }`}
                >
                  {/* Sender Name */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[11px] font-semibold ${isBuyer ? 'text-[#53BDEB]' : 'text-emerald-300'}`}>
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>

                  {/* Message Body with Highlight for Ambiguous Words */}
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>

                  {/* Flag indicator if text has legal ambiguity */}
                  {msg.isFlagged && (
                    <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px]">
                      <span className="text-amber-400 font-mono flex items-center gap-1">
                        ⚠️ Ambiguity Flagged
                      </span>
                      <span className="text-slate-400 italic">Vague timeline/terms</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Simulated WhatsApp Voice Note */}
          <div className="flex flex-col items-end">
            <div className="max-w-[85%] sm:max-w-[78%] rounded-xl rounded-tr-none px-3.5 py-2.5 bg-[#005C4B] text-slate-100 border border-emerald-600/40 shadow-subtle">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                  <Mic className="w-3 h-3 text-emerald-300" />
                  Prabhanjan (Voice Note)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">10:28 AM</span>
              </div>

              {/* Audio Player Component */}
              <div className="flex items-center space-x-3 bg-black/20 p-2 rounded-lg">
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center transition-all shadow"
                >
                  {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>

                {/* Animated Audio Waveform */}
                <div className="flex-1 flex items-center space-x-1 h-6">
                  {[4, 12, 18, 8, 22, 16, 26, 14, 20, 10, 15, 7, 24, 19, 11, 6].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isPlayingAudio ? 'bg-emerald-300 animate-pulse' : 'bg-emerald-700/80'
                      }`}
                      style={{ height: `${isPlayingAudio ? (h * 1.2) % 24 + 4 : h}px` }}
                    />
                  ))}
                </div>

                <span className="text-[11px] font-mono text-emerald-200">0:14</span>
              </div>

              <div className="mt-2 text-[11px] bg-black/30 p-2 rounded text-slate-300 border-l-2 border-emerald-400">
                <span className="text-emerald-400 font-semibold block text-[10px] uppercase">Automated Audio Transcript:</span>
                “Bhai tension mat lo, 10,000 boxes printing press pe chadh gaye hain. 28th ko gaadi bhej dunga.”
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Raw Ingestion Mode for Arbitrary Chat Pastes */
        <div className="flex-1 p-3 bg-slate-950 flex flex-col">
          <label className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Raw WhatsApp Export / Transcript Input:</span>
            <span className="font-mono text-[10px] text-industrial-400">
              {chatText.length} characters ingested
            </span>
          </label>
          <textarea
            value={chatText}
            onChange={(e) => onChatTextChange(e.target.value)}
            rows={12}
            className="w-full flex-1 bg-surface-card border border-brand-border rounded-xl p-3 text-xs sm:text-sm font-mono text-slate-200 focus:outline-none focus:border-industrial-400 focus:ring-1 focus:ring-industrial-400 transition-all resize-none leading-relaxed"
            placeholder="Paste your WhatsApp chat export or voice note transcript here..."
          />
        </div>
      )}

      {/* WhatsApp Message Input Bar */}
      <form onSubmit={handleSendCustomMessage} className="bg-[#202C33] p-2.5 flex items-center space-x-2 border-t border-[#2a3942]">
        <button
          type="button"
          onClick={() => {
            const template = `[10:32 AM] Ibrahim (Buyer): Confirming delivery date: Thursday, 28th October at 4 PM. Balance ₹1,75,000 within 15 days via RTGS.`;
            onChatTextChange(`${chatText}\n\n${template}`);
          }}
          title="Append clear contractual response"
          className="text-slate-400 hover:text-industrial-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Simulate sending a WhatsApp reply..."
          className="flex-1 bg-[#2A3942] text-xs sm:text-sm text-slate-100 placeholder-slate-400 px-3.5 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />

        <button
          type="submit"
          className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all shadow"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>

    </div>
  );
};
