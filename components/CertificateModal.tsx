'use client';

import React from 'react';
import { X, Lock, ShieldCheck } from 'lucide-react';
import { EvidenceCertificate } from './EvidenceCertificate';
import { Section10Pillars, BSACertificateData } from '@/lib/types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateData: BSACertificateData;
  pillars: Section10Pillars;
  fullCertificateText: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certificateData,
  pillars,
  fullCertificateText,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-brand-border rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Topbar */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-brand-border flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-industrial-950 border border-industrial-500/40 text-industrial-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Bharatiya Sakshya Adhiniyam, 2023 §63(4) Evidence Vault
              </h3>
              <p className="text-[11px] text-slate-400">
                Primary Electronic Admissibility Certificate with SHA-256 Hash Seal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/80">
          <EvidenceCertificate
            certificateData={certificateData}
            pillars={pillars}
            fullCertificateText={fullCertificateText}
          />
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-brand-border flex items-center justify-between text-xs text-slate-400">
          <span>Certificate ID: {certificateData.certificateId}</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            Close Vault
          </button>
        </div>

      </div>
    </div>
  );
};
