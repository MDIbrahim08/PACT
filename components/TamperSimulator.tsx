'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  RotateCcw, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  CheckCircle, 
  Flame, 
  FileDiff,
  Gavel
} from 'lucide-react';
import { formatHashDisplay } from '@/lib/crypto';

interface TamperSimulatorProps {
  originalText: string;
  currentText: string;
  originalHash: string;
  currentHash: string;
  isTampered: boolean;
  onModifyText: (newText: string) => void;
  onRestoreOriginal: () => void;
}

export const TamperSimulator: React.FC<TamperSimulatorProps> = ({
  originalText,
  currentText,
  originalHash,
  currentHash,
  isTampered,
  onModifyText,
  onRestoreOriginal,
}) => {
  const [selectedAttack, setSelectedAttack] = useState<string | null>(null);

  // Quick Preset Attack Scenarios for Judges
  const handleTamperAttack = (type: 'price' | 'quantity' | 'advance' | 'character') => {
    setSelectedAttack(type);
    let tampered = originalText;

    if (type === 'price') {
      tampered = originalText.replace(/₹2,50,000/g, '₹1,50,000');
    } else if (type === 'quantity') {
      tampered = originalText.replace(/10,000/g, '5,000');
    } else if (type === 'advance') {
      tampered = originalText.replace(/30% advance on company UPI/g, 'No advance required, 90 days credit');
    } else if (type === 'character') {
      tampered = originalText + '.';
    }

    onModifyText(tampered);
  };

  const handleReset = () => {
    setSelectedAttack(null);
    onRestoreOriginal();
  };

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-elevation ${
      isTampered 
        ? 'bg-red-950/20 border-red-500/60 shadow-glow-red' 
        : 'bg-surface border-brand-border'
    }`}>
      
      {/* Test Bench Header */}
      <div className={`px-4 sm:px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
        isTampered ? 'bg-red-950/50 border-red-500/40' : 'bg-slate-900 border-brand-border'
      }`}>
        <div className="flex items-center space-x-2.5">
          <div className={`p-1.5 rounded-lg border ${
            isTampered 
              ? 'bg-red-900/60 border-red-400 text-red-300' 
              : 'bg-industrial-950 border-industrial-500/40 text-industrial-400'
          }`}>
            <Gavel className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Judge Tamper-Simulation Sandbox
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Interactive Audit
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Test editing the deal text to observe instantaneous cryptographic avalanche failure
            </p>
          </div>
        </div>

        {/* Restore Pristine Button */}
        <button
          onClick={handleReset}
          disabled={!isTampered}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isTampered
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow cursor-pointer active:scale-95'
              : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Pristine Evidence</span>
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        
        {/* Judge Attack Buttons */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Simulate Commercial Contract Forgery (Select an Attack):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            
            <button
              onClick={() => handleTamperAttack('price')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedAttack === 'price' && isTampered
                  ? 'bg-red-950/80 border-red-500 text-white'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-red-400 block font-bold">Attack Scenario A</span>
              <span className="text-xs font-semibold block mt-0.5">Forged Price Discount</span>
              <span className="text-[11px] text-slate-400 block mt-1">Changes ₹2,50,000 → ₹1,50,000</span>
            </button>

            <button
              onClick={() => handleTamperAttack('quantity')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedAttack === 'quantity' && isTampered
                  ? 'bg-red-950/80 border-red-500 text-white'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-red-400 block font-bold">Attack Scenario B</span>
              <span className="text-xs font-semibold block mt-0.5">Short-Delivery Defense</span>
              <span className="text-[11px] text-slate-400 block mt-1">Changes 10,000 → 5,000 boxes</span>
            </button>

            <button
              onClick={() => handleTamperAttack('advance')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedAttack === 'advance' && isTampered
                  ? 'bg-red-950/80 border-red-500 text-white'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-red-400 block font-bold">Attack Scenario C</span>
              <span className="text-xs font-semibold block mt-0.5">Fabricated Credit Terms</span>
              <span className="text-[11px] text-slate-400 block mt-1">Erases 30% advance clause</span>
            </button>

            <button
              onClick={() => handleTamperAttack('character')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedAttack === 'character' && isTampered
                  ? 'bg-red-950/80 border-red-500 text-white'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-red-400 block font-bold">Attack Scenario D</span>
              <span className="text-xs font-semibold block mt-0.5">Single-Byte Stealth Edit</span>
              <span className="text-[11px] text-slate-400 block mt-1">Adds a single period (.)</span>
            </button>

          </div>
        </div>

        {/* Live Cryptographic Fingerprint Verification Box */}
        <div className={`p-4 rounded-xl border transition-all duration-300 ${
          isTampered 
            ? 'bg-red-950/30 border-red-500/60' 
            : 'bg-slate-900/90 border-brand-border'
        }`}>
          
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              {isTampered ? (
                <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              )}
              <span className="text-xs font-bold tracking-wider uppercase text-white font-mono">
                {isTampered ? 'STATUS: FRAUDULENT / HASH MISMATCH' : 'STATUS: CRYPTOGRAPHIC INTEGRITY VERIFIED'}
              </span>
            </div>

            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
              isTampered 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isTampered ? 'EVIDENCE COMPROMISED (BSA §63(4) INVALID)' : '100% BIT-LEVEL MATCH'}
            </span>
          </div>

          {/* Hash Comparison Dual Display */}
          <div className="space-y-3 text-xs font-mono">
            
            {/* Original Immutable Hash */}
            <div className="bg-black/60 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Original Registered Contract Hash (SHA-256):</span>
                <span className="text-emerald-400 font-semibold">LOCKED AT SOURCE</span>
              </div>
              <div className="text-emerald-400 font-mono text-[11px] sm:text-xs break-all select-all">
                {formatHashDisplay(originalHash)}
              </div>
            </div>

            {/* Current Computed Hash */}
            <div className={`p-3 rounded-lg border transition-all ${
              isTampered 
                ? 'bg-red-950/60 border-red-500/60 text-red-200' 
                : 'bg-black/60 border-slate-800 text-emerald-400'
            }`}>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className={isTampered ? 'text-red-300 font-bold' : 'text-slate-400'}>
                  Current Live Ingestion Hash (SHA-256):
                </span>
                <span className={`font-semibold ${isTampered ? 'text-red-400 font-mono' : 'text-emerald-400'}`}>
                  {isTampered ? 'AVALANCHE DEVIATION' : 'PERFECT INTEGRITY'}
                </span>
              </div>
              <div className="font-mono text-[11px] sm:text-xs break-all select-all">
                {formatHashDisplay(currentHash)}
              </div>
            </div>

          </div>

          {/* Legal Consequence Explanation for Judges */}
          <div className="mt-3 text-[11px] text-slate-400 flex items-start space-x-2 pt-2 border-t border-slate-800">
            <Gavel className="w-4 h-4 text-industrial-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-200">Judicial Precedent:</strong> Under <em>Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal (Supreme Court of India, 2020)</em> and Section 63(4) of the <em>Bharatiya Sakshya Adhiniyam, 2023</em>, electronic records require contemporaneous hash locking. Any uncertified screenshot or tampered text is strictly inadmissible as secondary evidence.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
