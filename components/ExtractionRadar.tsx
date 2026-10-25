'use client';

import React, { useState } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  ChevronRight, 
  FileCheck, 
  Calendar, 
  IndianRupee, 
  Package, 
  Users,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Section10Pillars, AmbiguityFlag } from '@/lib/types';

interface ExtractionRadarProps {
  pillars: Section10Pillars;
  ambiguities: AmbiguityFlag[];
  onResolveAmbiguity: (flagId: string, chosenOption: string) => void;
  onApplyNudge: (nudgeText: string) => void;
}

export const ExtractionRadar: React.FC<ExtractionRadarProps> = ({
  pillars,
  ambiguities,
  onResolveAmbiguity,
  onApplyNudge,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pillars' | 'radar'>('pillars');

  const handleCopyNudge = (flagId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(flagId);
    setTimeout(() => setCopiedId(null), 2000);
    onApplyNudge(text);
  };

  // Overall Contract Enforceability Score
  const unresolvedHigh = ambiguities.filter(a => !a.isResolved && a.severity === 'high').length;
  const unresolvedMedium = ambiguities.filter(a => !a.isResolved && a.severity === 'medium').length;
  const baseScore = 95;
  const validityScore = Math.max(35, baseScore - (unresolvedHigh * 25) - (unresolvedMedium * 10));

  return (
    <div className="bg-surface rounded-2xl border border-brand-border overflow-hidden shadow-elevation flex flex-col h-full">
      
      {/* Header with Enforceability Meter */}
      <div className="bg-slate-900/90 border-b border-brand-border px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-industrial-950 border border-industrial-500/40 text-industrial-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Section 10 Extraction & Ambiguity Radar
            </h3>
            <p className="text-[11px] text-slate-400">
              Indian Contract Act, 1872 • Deterministic Legal Analysis
            </p>
          </div>
        </div>

        {/* Legal Enforceability Index Badge */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-brand-border">
          <span className="text-[11px] text-slate-400">Enforceability Index:</span>
          <div className="flex items-center space-x-1.5">
            <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  validityScore > 80 ? 'bg-emerald-500' : validityScore > 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${validityScore}%` }}
              />
            </div>
            <span className={`text-xs font-mono font-bold ${
              validityScore > 80 ? 'text-emerald-400' : validityScore > 50 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {validityScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-2 border-b border-brand-border bg-slate-950/60 text-xs">
        <button
          onClick={() => setActiveTab('pillars')}
          className={`py-2.5 px-4 font-medium flex items-center justify-center space-x-2 border-b-2 transition-all ${
            activeTab === 'pillars'
              ? 'border-industrial-400 text-white bg-industrial-950/30 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Contract Pillars (§ 10)</span>
        </button>
        <button
          onClick={() => setActiveTab('radar')}
          className={`py-2.5 px-4 font-medium flex items-center justify-center space-x-2 border-b-2 transition-all ${
            activeTab === 'radar'
              ? 'border-amber-400 text-white bg-amber-950/20 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Ambiguity Radar ({ambiguities.filter(a => !a.isResolved).length})</span>
        </button>
      </div>

      {/* Tab 1: Section 10 Pillars Display */}
      {activeTab === 'pillars' && (
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1 max-h-[500px]">
          
          {/* Pillar 1: Parties */}
          <div className="p-3.5 rounded-xl bg-surface-card border border-brand-border/70 hover:border-industrial-500/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-industrial-300">
                <Users className="w-3.5 h-3.5 text-industrial-400" />
                <span>PILLAR 1: COMPETENT PARTIES</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Confidence: {pillars.parties.confidence}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Buyer (Purchaser)</span>
                <span className="font-semibold text-slate-200">{pillars.parties.buyer}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                  GSTIN: {pillars.parties.buyerGst}
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Seller (Vendor)</span>
                <span className="font-semibold text-slate-200">{pillars.parties.seller}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                  GSTIN: {pillars.parties.sellerGst}
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Scope & Subject Matter */}
          <div className="p-3.5 rounded-xl bg-surface-card border border-brand-border/70 hover:border-industrial-500/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-industrial-300">
                <Package className="w-3.5 h-3.5 text-industrial-400" />
                <span>PILLAR 2: DEFINITE OBJECT & SCOPE</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Confidence: {pillars.scope.confidence}%
              </span>
            </div>

            <div className="text-xs space-y-1.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Item Description:</span>
                <span className="font-semibold text-slate-200 text-right">{pillars.scope.itemTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Order Quantity:</span>
                <span className="font-mono font-bold text-industrial-300">{pillars.scope.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Specifications:</span>
                <span className="text-slate-300 text-right">{pillars.scope.specifications}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Packaging:</span>
                <span className="text-slate-300">{pillars.scope.packagingDetails}</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Consideration / Price */}
          <div className="p-3.5 rounded-xl bg-surface-card border border-brand-border/70 hover:border-industrial-500/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-industrial-300">
                <IndianRupee className="w-3.5 h-3.5 text-industrial-400" />
                <span>PILLAR 3: LAWFUL CONSIDERATION</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Confidence: {pillars.price.confidence}%
              </span>
            </div>

            <div className="text-xs space-y-1.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Contract Value:</span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  {pillars.price.totalAmount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Unit Rate:</span>
                <span className="font-mono text-slate-200">{pillars.price.unitPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Advance Status:</span>
                <span className="text-slate-200">{pillars.price.advanceRequired}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Balance Schedule:</span>
                <span className="text-amber-400 text-right">{pillars.price.paymentSchedule}</span>
              </div>
            </div>
          </div>

          {/* Pillar 4: Delivery Date & Timeline */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            pillars.deliveryDate.isVague 
              ? 'bg-amber-950/20 border-amber-500/40' 
              : 'bg-surface-card border-brand-border/70'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-industrial-300">
                <Calendar className="w-3.5 h-3.5 text-industrial-400" />
                <span>PILLAR 4: PERFORMANCE CERTAINTY (§ 29)</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                pillars.deliveryDate.isVague
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {pillars.deliveryDate.isVague ? 'Vague / Low Confidence' : 'Fixed'}
              </span>
            </div>

            <div className="text-xs space-y-1.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Timeline:</span>
                <span className={`font-semibold ${pillars.deliveryDate.isVague ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {pillars.deliveryDate.timeline}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled Date:</span>
                <span className="font-mono text-slate-300">{pillars.deliveryDate.targetDateFormatted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Destination:</span>
                <span className="text-slate-300">{pillars.deliveryDate.deliveryLocation}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Ambiguity Radar with "Blame the Bot" Nudges */}
      {activeTab === 'radar' && (
        <div className="p-4 overflow-y-auto space-y-4 flex-1 max-h-[500px]">
          <div className="bg-industrial-950/60 p-3 rounded-xl border border-industrial-500/30 text-xs text-slate-300">
            <span className="font-semibold text-industrial-300 flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5 text-industrial-400" />
              “Blame-The-Bot” Negotiation Philosophy
            </span>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Indian MSMEs fear losing client trust by demanding formal contracts. Pact generates polite, automated compliance nudges that frame clarity as a software/tax requirement—protecting business relationships while locking legal certainty.
            </p>
          </div>

          {ambiguities.map((flag) => (
            <div
              key={flag.id}
              className={`rounded-xl p-3.5 border transition-all ${
                flag.isResolved
                  ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75'
                  : flag.severity === 'high'
                  ? 'bg-red-950/15 border-red-500/40 shadow-sm'
                  : 'bg-amber-950/15 border-amber-500/40'
              }`}
            >
              {/* Flag Header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`p-1 rounded ${flag.isResolved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {flag.isResolved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  </span>
                  <span className="text-xs font-bold text-white">{flag.title}</span>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider bg-slate-900 border border-slate-700 text-slate-300">
                  {flag.statuteReference.split(',')[0]}
                </span>
              </div>

              {/* Detected Text & Court Hazard */}
              <div className="text-xs space-y-1.5 mb-3 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Flagged Phrase:</span>
                  <span className="font-mono font-semibold text-amber-300">{flag.flaggedText}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  <strong className="text-red-400 font-medium">Litigation Risk:</strong> {flag.legalRisk}
                </p>
              </div>

              {/* Blame-The-Bot WhatsApp Nudge */}
              {!flag.isResolved && (
                <div className="space-y-2">
                  <div className="bg-[#128C7E]/10 border border-[#128C7E]/30 rounded-lg p-2.5">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Polite "Blame-The-Bot" WhatsApp Nudge:
                    </span>
                    <p className="text-xs text-emerald-100 italic font-sans leading-relaxed">
                      {flag.botNudgeText}
                    </p>
                    <div className="flex items-center justify-end mt-2 space-x-2">
                      <button
                        onClick={() => handleCopyNudge(flag.id, flag.botNudgeText)}
                        className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#128C7E] hover:bg-[#075E54] text-white text-[11px] font-medium transition-all"
                      >
                        {copiedId === flag.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === flag.id ? 'Copied to Chat!' : 'Copy to WhatsApp'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 1-Click Fast Resolution Options */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                      Quick Legal Lock (Click to auto-resolve):
                    </span>
                    {flag.resolutionOptions.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => onResolveAmbiguity(flag.id, option)}
                        className="w-full text-left text-xs px-2.5 py-1.5 rounded-md bg-slate-900 hover:bg-industrial-950 text-slate-300 hover:text-industrial-200 border border-slate-800 hover:border-industrial-500/50 flex items-center justify-between transition-all"
                      >
                        <span>{option}</span>
                        <ChevronRight className="w-3 h-3 text-industrial-400 shrink-0 ml-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolved State Display */}
              {flag.isResolved && (
                <div className="text-xs bg-emerald-950/40 border border-emerald-500/30 p-2 rounded-lg text-emerald-300 flex items-center justify-between">
                  <span className="font-mono text-[11px]">Resolved: {flag.resolvedValue}</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Enforceable</span>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
