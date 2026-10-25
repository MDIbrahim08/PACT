'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, Download, Printer, Copy, Check, AlertOctagon, FileText, CheckCircle2, QrCode } from 'lucide-react';
import { Section10Pillars, BSACertificateData } from '@/lib/types';
import { formatHashDisplay } from '@/lib/crypto';

interface EvidenceCertificateProps {
  certificateData: BSACertificateData;
  pillars: Section10Pillars;
  fullCertificateText: string;
}

export const EvidenceCertificate: React.FC<EvidenceCertificateProps> = ({
  certificateData,
  pillars,
  fullCertificateText,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    navigator.clipboard.writeText(fullCertificateText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const isTampered = certificateData.tamperDetected;

  return (
    <div className="bg-surface rounded-2xl border border-brand-border overflow-hidden shadow-elevation">
      
      {/* Certificate Action Topbar */}
      <div className="bg-slate-900 px-4 py-3 border-b border-brand-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 rounded-lg border ${
            isTampered 
              ? 'bg-red-950 text-red-400 border-red-500/40' 
              : 'bg-industrial-950 text-industrial-400 border-industrial-500/40'
          }`}>
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              BSA 2023 §63(4) Electronic Evidence Certificate
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                isTampered 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {isTampered ? 'Tampered / Invalid' : 'Statutory Compliant'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Formerly Indian Evidence Act 1872 Section 65B • Primary Evidence Admissibility
            </p>
          </div>
        </div>

        {/* Certificate Export Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyText}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy Affidavit'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-industrial-600 hover:bg-industrial-500 text-white text-xs font-medium shadow-subtle transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Official Legal Certificate Sheet (Industrial White & Navy Legal Paper Layout) */}
      <div className={`p-6 sm:p-8 bg-slate-950/95 relative transition-all ${
        isTampered ? 'ring-2 ring-red-500/50' : ''
      }`}>
        
        {/* Tamper Alert Watermark Overlay */}
        {isTampered && (
          <div className="absolute inset-0 bg-red-950/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center border-2 border-red-500 animate-fadeIn">
            <AlertOctagon className="w-16 h-16 text-red-400 mb-3 animate-bounce" />
            <h4 className="text-xl sm:text-2xl font-black text-red-200 tracking-wider font-mono">
              TAMPER DETECTED: CERTIFICATE VOIDED
            </h4>
            <p className="text-xs sm:text-sm text-red-300 max-w-md mt-2 font-mono">
              The underlying commercial WhatsApp text has been altered from its initial cryptographic state.
              Under Section 63(4) of Bharatiya Sakshya Adhiniyam, 2023, this electronic evidence is INADMISSIBLE in a court of law.
            </p>
            <div className="mt-4 p-3 bg-black/60 rounded-lg border border-red-500/40 text-[11px] font-mono text-red-200">
              Expected Hash: {certificateData.originalPayloadHash.substring(0, 24)}...<br/>
              Detected Hash: {certificateData.rawPayloadHash.substring(0, 24)}...
            </div>
          </div>
        )}

        {/* Paper Document Container */}
        <div className="max-w-3xl mx-auto bg-slate-900 border border-brand-border rounded-xl p-6 sm:p-8 text-slate-200 shadow-elevation relative overflow-hidden font-sans">
          
          {/* Subtle Legal Seal Background */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 opacity-5 pointer-events-none">
            <ShieldCheck className="w-full h-full text-white" />
          </div>

          {/* Certificate Header */}
          <div className="text-center pb-6 border-b border-slate-800 space-y-1">
            <div className="inline-block px-3 py-1 rounded bg-industrial-950 border border-industrial-500/30 text-[10px] font-mono text-industrial-300 uppercase tracking-widest font-bold mb-1">
              Government of India Admissibility Standard
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-mono">
              BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023
            </h2>
            <h3 className="text-sm font-semibold text-industrial-400 font-mono">
              CERTIFICATE OF ELECTRONIC EVIDENCE UNDER SECTION 63(4)
            </h3>
            <p className="text-[11px] text-slate-400 italic">
              [Corresponding to erstwhile Section 65B(4) of the Indian Evidence Act, 1872]
            </p>
          </div>

          {/* Certificate Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 border-b border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Certificate Identifier:</span>
              <span className="font-mono font-bold text-slate-100">{certificateData.certificateId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Timestamp of Hashing:</span>
              <span className="font-mono text-slate-200">
                {certificateData.generatedDate || new Date().toISOString()} IST
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Certifying Engine:</span>
              <span className="font-semibold text-slate-200">Pact Evidence Node #01 (ISO 27001 compliant)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Device Fingerprint:</span>
              <span className="font-mono text-slate-300">{certificateData.deviceFingerprint}</span>
            </div>
          </div>

          {/* Cryptographic Hash Section */}
          <div className="my-5 p-4 rounded-xl bg-slate-950 border border-industrial-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-industrial-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Lock className="w-3.5 h-3.5" />
                Immutable SHA-256 Digital Fingerprint:
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                256-Bit Cryptographic Lock
              </span>
            </div>
            <div className="bg-black/50 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-emerald-300 break-all select-all leading-relaxed">
              {formatHashDisplay(certificateData.rawPayloadHash)}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 italic">
              * Any modification of single character or whitespace transforms this digest completely via the avalanche effect.
            </p>
          </div>

          {/* Statutory Affirmation Clauses */}
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed py-2">
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider font-mono">
              Statutory Affirmations Pursuant to Section 63(4):
            </h4>
            <ol className="list-decimal pl-5 space-y-2 text-slate-400">
              <li>
                <strong className="text-slate-200">Lawful Custody & Output:</strong> The WhatsApp messages and audio transcripts detailing the commercial agreement were produced by the mobile devices in the ordinary course of regular commercial activities.
              </li>
              <li>
                <strong className="text-slate-200">Device Integrity:</strong> During the period in which the communication occurred, the communication devices operated accurately and without operational defect affecting evidentiary authenticity.
              </li>
              <li>
                <strong className="text-slate-200">Contract Essentials (Section 10, ICA 1872):</strong> The electronic communication satisfies the statutory criteria of lawful consideration ({pillars.price.totalAmount}), competent commercial entities ({pillars.parties.buyer} and {pillars.parties.seller}), and mutual assent.
              </li>
            </ol>
          </div>

          {/* Official Stamp & Sign Off */}
          <div className="pt-6 mt-4 border-t border-slate-800 flex flex-wrap items-end justify-between gap-4">
            <div className="text-[11px] space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Verification Seal:</span>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg bg-industrial-950 border border-industrial-500/40 flex items-center justify-center text-industrial-400 font-mono text-xs font-bold">
                  PACT
                </div>
                <div>
                  <span className="font-bold text-slate-200 block">Digitally Verified & Locked</span>
                  <span className="text-[10px] text-slate-400 font-mono">BSA-63(4) CERT-ID: {certificateData.certificateId.substring(0, 16)}</span>
                </div>
              </div>
            </div>

            <div className="text-right text-[11px]">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Electronic Evidence Custodian</span>
              <div className="font-serif italic text-base text-industrial-300">Pact Cryptographic Notary</div>
              <span className="text-[10px] text-slate-400">Automated Legal Ledger Engine</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
