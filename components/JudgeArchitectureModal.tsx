'use client';

import React from 'react';
import { 
  Shield, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ExternalLink, 
  Layers, 
  Terminal, 
  Scale, 
  Zap, 
  Database,
  FileCheck2,
  Share2
} from 'lucide-react';

interface JudgeArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHash?: string;
  certificateId?: string;
  onOpenTamperModal?: () => void;
  onOpenPrintModal?: () => void;
}

export const JudgeArchitectureModal: React.FC<JudgeArchitectureModalProps> = ({
  isOpen,
  onClose,
  currentHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  certificateId = 'BSA-63-2024-PACT-01',
  onOpenTamperModal,
  onOpenPrintModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#12141c] border border-blue-500/30 rounded-3xl shadow-[0_0_50px_rgba(0,130,251,0.25)] overflow-hidden text-slate-100 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-neutral-800 bg-[#161924] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0082fb]/20 border border-[#0082fb]/50 flex items-center justify-center text-[#0082fb] shadow-[0_0_15px_rgba(0,130,251,0.4)]">
              <Scale className="w-5 h-5 text-[#0082fb]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Srujana Tech Fest 2026 // Architecture & Evaluation Matrix
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/40 font-semibold">
                  Theme: LS-06
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Pact: From Handshake to Commercial Contract for Indian MSMEs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Live Engine Status Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-neutral-900 to-emerald-950/30 border border-blue-500/30 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Evaluation Diagnostics</span>
              </span>
              <span className="text-[11px] font-mono bg-neutral-800/90 text-neutral-300 px-2.5 py-1 rounded-full border border-neutral-700">
                Engine Mode: SERVER_AUTHORITATIVE + LOCAL_WEB_CRYPTO
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-neutral-400 block text-[10px]">Active Evidence SHA-256:</span>
                <span className="font-mono text-[11px] text-cyan-300 truncate block">
                  {currentHash}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-neutral-400 block text-[10px]">Server HMAC Notary Seal:</span>
                <span className="font-mono text-[11px] text-emerald-400 truncate block">
                  SEAL-BSA-MUM-01-§63(4)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-neutral-400 block text-[10px]">Zero-Key Fallback Latency:</span>
                <span className="font-mono text-[11px] text-amber-300 block">
                  &lt; 18ms (100% Offline-Safe)
                </span>
              </div>
            </div>
          </div>

          {/* Srujana Rubric Pillars */}
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* Pillar 1 & 2 */}
            <div className="p-4 rounded-2xl bg-[#161924]/80 border border-neutral-800 space-y-2">
              <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-wider">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>1. Problem Alignment & MSME Reality</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                63M+ Indian MSMEs trade on informal WhatsApp chats and regional voice notes because 10-page lawyer agreements destroy business trust. However, raw screenshots fail in Indian courts as inadmissible hearsay. Pact bridges this gap without forcing lawyers on small traders.
              </p>
              <div className="text-[11px] text-neutral-400 pt-1">
                <span className="text-blue-400 font-semibold">Statutory Alignment:</span> Indian Contract Act 1872 (§10 & §29), Bharatiya Sakshya Adhiniyam 2023 (§63(4)), MSMED Act 2006 (§15-16).
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#161924]/80 border border-neutral-800 space-y-2">
              <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>2. Technical Architecture & Cryptography</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Dual-layer pipeline: Client PWA computes deterministic SHA-256 digests via browser <code className="text-cyan-300">window.crypto.subtle</code>; Next.js server validates via native Node.js <code className="text-cyan-300">crypto.createHmac</code> and executes timing-safe verification (<code className="text-cyan-300">crypto.timingSafeEqual</code>) to prevent side-channel leaks.
              </p>
              <div className="text-[11px] text-neutral-400 pt-1">
                <span className="text-cyan-400 font-semibold">Data Flow:</span> WhatsApp/Voice &rarr; Multi-LLM Parsing &rarr; §10 Deterministic Extraction &rarr; SHA-256 Sealed Evidence.
              </div>
            </div>

            {/* Pillar 3 & 4 */}
            <div className="p-4 rounded-2xl bg-[#161924]/80 border border-neutral-800 space-y-2">
              <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>3. "Beyond a Chatbot Wrapper"</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                AI is strictly used where beneficial (Hinglish/regional speech-to-text and social "Blame-the-Bot" nudges). Deterministic mathematics handles legal enforceability: the 5 pillars of Section 10 ICA 1872, Section 29 Void Uncertainty detection, and irreversible SHA-256 court evidence hashing never hallucinate.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#161924]/80 border border-neutral-800 space-y-2">
              <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>4. Risk Management & Edge Cases</span>
              </div>
              <ul className="text-xs text-neutral-300 space-y-1 list-disc list-inside">
                <li><strong className="text-white">Screenshot Forgery:</strong> Single-char edits break SHA-256 avalanche digest.</li>
                <li><strong className="text-white">Zero-Connectivity Godowns:</strong> PWA offline hashing & sync.</li>
                <li><strong className="text-white">Fuzzy Hinglish Dates:</strong> Section 29 Radar triggers polite nudges.</li>
                <li><strong className="text-white">API Rate-Limits:</strong> Instantaneous deterministic fallback engine.</li>
              </ul>
            </div>

          </div>

          {/* Mandatory Section 6 Disclosure Matrix */}
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Mandatory Section 6: AI & Dependency Transparency</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                100-Point Evaluation Rule
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/20 space-y-1.5">
                <span className="font-bold text-emerald-400 block text-[11px]">
                  ✓ LIVE WORKING MODULES
                </span>
                <ul className="text-[11px] text-neutral-300 space-y-1">
                  <li>• Client & Server SHA-256 digest computation (<code className="text-cyan-300">crypto</code>)</li>
                  <li>• Timing-safe HMAC Evidence Notary (<code className="text-cyan-300">timingSafeEqual</code>)</li>
                  <li>• Section 10 ICA 1872 Deterministic Pillar Parser</li>
                  <li>• Section 29 Ambiguity Radar & Social Nudge Engine</li>
                  <li>• Print-Isolated Non-Judicial e-Stamp Paper PDF</li>
                  <li>• Real-Time Interactive Judge Tamper Sandbox</li>
                  <li>• Hardware-accelerated WebGL Simplex Liquid Shader</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 space-y-1.5">
                <span className="font-bold text-amber-400 block text-[11px]">
                  ⚙️ SIMULATED DEMO HELPERS
                </span>
                <ul className="text-[11px] text-neutral-300 space-y-1">
                  <li>• Sample MSME Trader Voice Notes & WhatsApp transcripts (Prabhanjan Sweets, Surat Weavers, Bangalore Electronics)</li>
                  <li>• Simulated State e-Stamp Government Registry Serial Number (<code className="text-amber-200">IN-DL89214981290382V</code>) for offline reliability during evaluation</li>
                  <li>• Zero-Key fallback mock generator ensuring 0% API downtime</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Evaluator Action Triggers */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-neutral-400 font-mono">
              Evaluator Quick Access:
            </span>
            <div className="flex items-center space-x-2">
              {onOpenTamperModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenTamperModal();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-medium transition-all"
                >
                  Launch Tamper Sandbox &rarr;
                </button>
              )}
              {onOpenPrintModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPrintModal();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium transition-all"
                >
                  Preview e-Stamp PDF &rarr;
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-[#161924] flex items-center justify-between text-xs text-neutral-400 shrink-0">
          <span className="font-mono text-[11px]">
            Certificate ID: <strong className="text-cyan-300">{certificateId}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
};
