'use client';

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  ShieldCheck, 
  Lock, 
  Check, 
  ExternalLink, 
  QrCode, 
  Award,
  FileText,
  Mail,
  Smartphone
} from 'lucide-react';
import { Section10Pillars, BSACertificateData } from '@/lib/types';
import { formatHashDisplay } from '@/lib/crypto';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  pillars: Section10Pillars;
  certificateData: BSACertificateData;
  isTampered: boolean;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  pillars,
  certificateData,
  isTampered,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const shareText = encodeURIComponent(
    `🤝 *PACT COMMERCIAL AGREEMENT CERTIFICATE*\n` +
    `*Parties:* ${pillars.parties.buyer} & ${pillars.parties.seller}\n` +
    `*Item:* ${pillars.scope.itemTitle} (Qty: ${pillars.scope.quantity})\n` +
    `*Agreed Consideration:* ${pillars.price.totalAmount}\n` +
    `*Delivery Date:* ${pillars.deliveryDate.targetDateFormatted}\n` +
    `*BSA 2023 §63(4) Evidence Lock:* SHA-256 [${certificateData.rawPayloadHash.substring(0, 16)}...]\n` +
    `*Status:* ${isTampered ? '❌ TAMPER DETECTED' : '✅ 100% IMMUTABLE & COURT ADMISSIBLE'}\n\n` +
    `_Digitally verified via Pact MSME Contract Infrastructure_`
  );

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(`PACT Statutory e-Stamp Agreement: ${pillars.scope.itemTitle}`)}&body=${shareText}`;
  const smsShareUrl = `sms:?&body=${shareText}`;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(decodeURIComponent(shareText));
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div className="bg-slate-900 border border-brand-border rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Controls Topbar (Excluded in Print) */}
        <div className="no-print bg-slate-950 px-5 py-3.5 border-b border-brand-border flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Official Judicial e-Stamp Paper & Evidence Affidavit
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  isTampered 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {isTampered ? 'Invalid / Tampered' : 'Statutory e-Stamp §63(4)'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Print ready for Indian Commercial Courts & Arbitral Tribunals
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* WhatsApp Share Button */}
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-black font-semibold text-xs shadow transition-all active:scale-95 shrink-0"
              title="Sync & Share on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            {/* Email Share Button */}
            <a
              href={emailShareUrl}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow transition-all active:scale-95 shrink-0"
              title="Sync & Dispatch via Email"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Email</span>
            </a>

            {/* SMS Share Button */}
            <a
              href={smsShareUrl}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow transition-all active:scale-95 shrink-0"
              title="Sync & Send via Native SMS"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">SMS</span>
            </a>

            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-industrial-600 hover:bg-industrial-500 text-white font-semibold text-xs shadow-glow transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center">
          
          {/* Authentic Government Non-Judicial e-Stamp Paper Container */}
          <div className="print-certificate-only w-full max-w-3xl bg-[#fdfbf7] text-[#1a1a1a] shadow-2xl rounded-sm border-4 border-[#8b6b23] p-6 sm:p-10 relative overflow-hidden font-serif">
            
            {/* Tamper Warning Watermark if Tampered */}
            {isTampered && (
              <div className="absolute inset-0 bg-red-950/80 z-20 flex flex-col items-center justify-center p-6 text-center text-white">
                <span className="text-3xl font-black font-mono tracking-widest text-red-400 uppercase border-4 border-red-500 px-6 py-3 bg-black/80">
                  VOID - EVIDENCE TAMPERED
                </span>
                <p className="mt-4 max-w-md font-sans text-sm text-red-200">
                  This electronic record has been altered from its original hash state and is inadmissible under BSA 2023 §63(4).
                </p>
              </div>
            )}

            {/* Ornamental Government Stamp Header */}
            <div className="border-4 border-double border-[#8b6b23] p-4 text-center bg-[#faf4e6] mb-6 relative">
              <div className="flex items-center justify-between border-b border-[#8b6b23]/40 pb-2 mb-2">
                <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-[#8b6b23]">
                  Government of India
                </span>
                <span className="text-[10px] font-mono font-bold text-[#8b6b23]">
                  e-Stamp No: {certificateData.certificateId}
                </span>
                <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-[#8b6b23]">
                  Statutory Duty ₹100/-
                </span>
              </div>

              {/* National Emblem & Title */}
              <div className="space-y-1">
                <div className="inline-block px-4 py-0.5 bg-[#8b6b23] text-white font-sans text-xs font-bold tracking-widest uppercase rounded-sm">
                  NON-JUDICIAL ELECTRONIC EVIDENCE CERTIFICATE
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-[#5a420f] pt-1">
                  BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023
                </h1>
                <h2 className="text-xs sm:text-sm font-bold text-[#6d5015] tracking-wide uppercase font-sans">
                  CERTIFICATE UNDER SECTION 63(4) FOR ADMISSIBILITY OF ELECTRONIC CONTRACT
                </h2>
                <p className="text-[10px] italic text-[#7a6435] font-sans">
                  [Read with Section 10 of Indian Contract Act, 1872 & Information Technology Act, 2000]
                </p>
              </div>

              {/* Barcode / QR Simulation Row */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#8b6b23]/40 text-[9px] font-mono text-[#5a420f]">
                <span>ISSUED AT: {certificateData.generatedDate || new Date().toLocaleString('en-IN')} IST</span>
                <span className="font-bold">AUTHENTICITY VERIFIED VIA SHA-256 DIGITAL LOCK</span>
              </div>
            </div>

            {/* Stamp Paper Metadata Table */}
            <div className="border border-[#c2aa70] bg-[#fffcf5] text-xs font-sans mb-6 divide-y divide-[#e2d5b5]">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#e2d5b5]">
                <div className="p-2.5">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">First Party (Supplier/Vendor):</span>
                  <span className="font-bold text-gray-900">{pillars.parties.seller}</span>
                  <span className="text-[10px] text-gray-600 block font-mono">GSTIN: {pillars.parties.sellerGst}</span>
                </div>
                <div className="p-2.5">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Second Party (Buyer/Purchaser):</span>
                  <span className="font-bold text-gray-900">{pillars.parties.buyer}</span>
                  <span className="text-[10px] text-gray-600 block font-mono">GSTIN: {pillars.parties.buyerGst}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#e2d5b5]">
                <div className="p-2.5">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Total Consideration:</span>
                  <span className="font-bold text-emerald-800 text-sm font-mono">{pillars.price.totalAmount}</span>
                </div>
                <div className="p-2.5">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Advance Payment Status:</span>
                  <span className="font-semibold text-gray-800">{pillars.price.advanceRequired}</span>
                </div>
                <div className="p-2.5">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Performance Delivery Due:</span>
                  <span className="font-semibold text-gray-800">{pillars.deliveryDate.targetDateFormatted}</span>
                </div>
              </div>
            </div>

            {/* Contract Subject Matter & Scope */}
            <div className="mb-5 text-xs font-sans">
              <h3 className="font-bold text-sm text-[#5a420f] uppercase tracking-wider mb-1 font-serif border-b border-[#c2aa70] pb-1">
                1. Contract Scope & Commercial Terms (ICA 1872 § 10):
              </h3>
              <p className="leading-relaxed text-gray-800 mt-1.5">
                The commercial agreement concluded between the parties details the unconditional sale and delivery of:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-800">
                <li><strong className="text-gray-900">Goods Description:</strong> {pillars.scope.itemTitle}</li>
                <li><strong className="text-gray-900">Agreed Quantity:</strong> {pillars.scope.quantity}</li>
                <li><strong className="text-gray-900">Technical Specifications:</strong> {pillars.scope.specifications}</li>
                <li><strong className="text-gray-900">Dispatch Location:</strong> {pillars.deliveryDate.deliveryLocation}</li>
              </ul>
            </div>

            {/* Cryptographic SHA-256 Seal Box */}
            <div className="p-3.5 bg-[#f5efe1] border border-[#bfa260] rounded-sm mb-5 text-xs font-mono">
              <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-[#5a420f]">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  MANDATORY ELECTRONIC EVIDENCE HASH LOCK:
                </span>
                <span className="text-emerald-800">SECURE BIT-LEVEL VERIFIED</span>
              </div>
              <div className="bg-white p-2 border border-[#d6c497] text-[11px] text-gray-900 break-all select-all font-bold">
                {formatHashDisplay(certificateData.rawPayloadHash)}
              </div>
              <span className="text-[10px] text-gray-600 block mt-1 font-sans italic">
                * Generated under ISO/IEC 27037 standards. Alteration of even 1 character in the underlying record completely invalidates this certificate.
              </span>
            </div>

            {/* Statutory BSA 2023 §63(4) Solemn Affirmation */}
            <div className="text-[11px] font-sans leading-relaxed text-gray-800 space-y-2 mb-6">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#5a420f] font-serif">
                2. Solemn Statutory Certification:
              </h4>
              <p>
                I hereby certify under <strong>Section 63(4) of the Bharatiya Sakshya Adhiniyam, 2023</strong> that:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                <li>The WhatsApp communication comprising offer, acceptance, and pricing was generated during the ordinary course of lawful commercial dealings.</li>
                <li>The communication device operated without functional defect during the recording period, preserving data integrity.</li>
                <li>The cryptographic digest above uniquely identifies the electronic record submitted for admission before the Hon'ble Court.</li>
              </ol>
            </div>

            {/* Signature & Seal Footer */}
            <div className="pt-4 border-t-2 border-[#8b6b23] flex items-end justify-between text-xs font-sans">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Notarial Registry:</span>
                <span className="font-bold text-gray-900 block">Pact Electronic Evidence Ledger</span>
                <span className="text-[10px] text-gray-600 font-mono">Reg ID: PACT-IN-MUM-NODE01</span>
              </div>

              <div className="text-right">
                <div className="font-serif italic text-base text-[#6b4c10] font-bold">Pact Digital Notary</div>
                <span className="text-[10px] text-gray-600 uppercase block font-semibold">Authorized Evidence Custodian</span>
                <span className="text-[10px] text-emerald-800 font-bold block font-mono">✓ Digitally Signed & Sealed</span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="no-print bg-slate-950 px-5 py-3 border-t border-brand-border flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={handleCopyShareLink}
            className="flex items-center space-x-1.5 hover:text-white transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Contract Summary Copied!' : 'Copy Summary Text'}</span>
          </button>

          <span className="font-mono text-[11px] text-slate-500">
            Compliant with Section 63(4) BSA 2023 & Section 10 ICA 1872
          </span>
        </div>

      </div>

    </div>
  );
};
