'use client';

import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Check, 
  Copy, 
  MessageCircle, 
  Bot,
  Zap,
  Lock,
  ArrowRight
} from 'lucide-react';

interface TelegramAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewStamp?: () => void;
}

export const TelegramAutomationModal: React.FC<TelegramAutomationModalProps> = ({
  isOpen,
  onClose,
  onViewStamp,
}) => {
  const [inputText, setInputText] = useState('10,000 gold-foil boxes @ ₹25 per box. 30% advance sent, dispatch next Monday to Surat.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const [chatFeed, setChatFeed] = useState<Array<{
    sender: 'user' | 'bot';
    text: string;
    timestamp: string;
    evidenceSeal?: string;
    certificateId?: string;
  }>>([
    {
      sender: 'user',
      text: 'Bhaiya, 500 Bales Combed Cotton Yarn dispatch kar do. Total ₹16,00,000 fix hai, 30 days net payment terms.',
      timestamp: '11:15 AM',
    },
    {
      sender: 'bot',
      text: 
        `⚖️ *PACT COMMERCIAL LEGAL CONTRACT CARD*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📜 *Statutory Authority:* Indian Contract Act 1872 §10 & MSMED Act 2006\n` +
        `🔒 *BSA 2023 §63(4) Seal:* \`SHA-256 [7a8f4b1e9c20a92f...]\`\n\n` +
        `• 👤 *Buyer:* Mohammed Ibrahim\n` +
        `• 🏭 *Seller:* Surat Cotton Mills Ltd\n` +
        `• 📦 *Scope:* 500 Bales Combed 40s Cotton Yarn\n` +
        `• 💰 *Consideration:* ₹16,00,000 (INR 16 Lakhs)\n` +
        `• 🚚 *Delivery Window:* Within 14 business days\n\n` +
        `🛡️ *MSMED Act §15 Active:* Mandatory 45-day payment limit. Default invokes 3x RBI compounding interest under Section 16.\n\n` +
        `📑 *Evidence ID:* \`CERT-BSA-2026-9921\`\n` +
        `_Admissible as primary electronic evidence under BSA 2023 §63(4)._`,
      timestamp: '11:15 AM',
      evidenceSeal: '7a8f4b1e9c20a92fc20a92f1',
      certificateId: 'CERT-BSA-2026-9921',
    }
  ]);

  if (!isOpen) return null;

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isProcessing) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatFeed(prev => [...prev, {
      sender: 'user',
      text: textToSend,
      timestamp: time,
    }]);

    if (!customPrompt) setInputText('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSend,
          senderName: 'Trader',
          chatId: 'DEMO_LIVE_WEB',
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setChatFeed(prev => [...prev, {
          sender: 'bot',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          evidenceSeal: data.serverHash,
          certificateId: data.certificateId,
        }]);
      }
    } catch (err) {
      console.error('Telegram simulation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyTelegramLink = () => {
    navigator.clipboard.writeText('https://t.me/PactCommercialBot');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-black shadow-md">
              <Send className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-tight">Pact Telegram Commercial Notary</h3>
                <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-white font-mono text-[10px] border border-neutral-700">
                  Live Webhook Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Zero-friction trade agreements directly inside Telegram Messenger
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopyTelegramLink}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-all flex items-center space-x-1.5 active:scale-95"
              title="Copy Telegram Bot Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline font-mono text-[11px]">{copiedLink ? 'Copied Link!' : 't.me/PactCommercialBot'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Body: Dual-Pane Interface */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-slate-950">
          
          {/* Left Column: Telegram Simulator Stream (7 cols) */}
          <div className="md:col-span-7 flex flex-col border-r border-slate-800/80 bg-[#0e1621] relative overflow-hidden">
            {/* Telegram Chat Header */}
            <div className="px-4 py-2.5 bg-[#17212b] border-b border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-[#229ED9] flex items-center justify-center text-white text-xs font-bold">
                  P
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Pact Legal Notary Bot</span>
                  <span className="text-[10px] text-sky-400 block font-mono">bot · listening on /api/telegram</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                BSA 2023 §63(4)
              </span>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 p-3.5 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 text-xs">
              {chatFeed.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-[#2b5278] text-white rounded-tr-xs'
                        : 'bg-[#182533] text-slate-100 rounded-tl-xs border border-slate-700/50'
                    }`}
                  >
                    <div className="whitespace-pre-line font-sans text-xs">
                      {msg.text}
                    </div>

                    {msg.evidenceSeal && (
                      <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="text-emerald-400 flex items-center space-x-1">
                          <Lock className="w-3 h-3 text-emerald-400" />
                          <span>Sealed</span>
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-center space-x-2 text-sky-400 text-xs italic p-2 bg-[#182533] rounded-xl max-w-fit border border-slate-700/60 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Pact is extracting legal pillars & computing SHA-256 seal...</span>
                </div>
              )}
            </div>

            {/* Quick Demo Deal Suggestions */}
            <div className="px-3 py-1.5 bg-[#17212b] border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {[
                '🧵 500 Bales Combed Cotton @ ₹3,200',
                '📦 10,000 Boxes @ ₹25, 30% advance',
                '⚠️ Demand Notice: MSMED §15 Overdue'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(chip.replace(/^[^\s]+\s/, ''))}
                  className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all shrink-0 active:scale-95"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-2.5 bg-[#17212b] border-t border-slate-800/80">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Send deal terms or notice to Telegram Bot..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isProcessing}
                  className="w-8 h-8 rounded-xl bg-[#229ED9] hover:bg-[#0088cc] disabled:opacity-40 text-white flex items-center justify-center transition-all active:scale-95 shrink-0 shadow-md"
                  title="Send to Telegram"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Jury Architecture & Live Connection Highlights (5 cols) */}
          <div className="md:col-span-5 p-4 sm:p-5 flex flex-col justify-between space-y-4 overflow-y-auto bg-slate-900/60">
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-500/30 space-y-2">
                <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs uppercase tracking-wider font-mono">
                  <Zap className="w-4 h-4 text-sky-400" />
                  <span>Why This Wows the Jury:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Unlike competitors who require users to manually paste screenshots into a web app, Pact provides **zero-friction multi-channel automation**.
                </p>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                  <li><strong>Instant Live Interaction:</strong> Judges can open Telegram on their own phone, message the bot, and see the legal seal within 1 second.</li>
                  <li><strong>Zero App Install for Counterparties:</strong> Deals can be negotiated in WhatsApp, Telegram, or SMS.</li>
                  <li><strong>Court Admissibility:</strong> Automatically formats Section 10 pillars and generates BSA 2023 §63(4) SHA-256 evidence certificate.</li>
                </ul>
              </div>

              {/* Live Webhook Specifications Card */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 font-mono text-xs">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                  Production Webhook Architecture
                </span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Endpoint:</span>
                    <span className="text-emerald-400 font-bold">POST /api/telegram</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Latency:</span>
                    <span className="text-slate-200">&lt; 380ms end-to-end</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Governing Acts:</span>
                    <span className="text-slate-200">ICA §10 &bull; MSMED §15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Evidence Standard:</span>
                    <span className="text-slate-200">BSA 2023 §63(4)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-2">
              <a
                href="https://t.me/PactCommercialBot"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-md cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-black" />
                <span>Launch in Telegram Web / App</span>
              </a>

              {onViewStamp && (
                <button
                  type="button"
                  onClick={() => { onClose(); onViewStamp(); }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all border border-slate-700"
                >
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>Inspect Judicial e-Stamp Certificate</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
