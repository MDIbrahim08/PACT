'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Gavel,
  Calculator,
  FileText,
  ExternalLink,
  Download,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Clock,
  Printer,
  Sparkles,
  Send
} from 'lucide-react';

interface MsmeSamadhaanModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimantName?: string;
  claimantPhone?: string;
  claimantEmail?: string;
  respondentName?: string;
  principalAmount?: number;
  dealHash?: string;
  certificateId?: string;
}

export function MsmeSamadhaanModal({
  isOpen,
  onClose,
  claimantName = 'Prabhanjan More (Agentics Tech MSME)',
  claimantPhone = '+91 98765 43210',
  claimantEmail = 'contact@agentics.legal',
  respondentName = 'Vardhman Textiles / Buyer Enterprises',
  principalAmount = 245000,
  dealHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  certificateId = 'BSA-63-2024-IN01',
}: MsmeSamadhaanModalProps) {
  const [activeTab, setActiveTab] = useState<'calculator' | 'petition' | 'notice'>('calculator');
  const [principal, setPrincipal] = useState<number>(principalAmount || 245000);
  const [daysDelayed, setDaysDelayed] = useState<number>(75);
  const [rbiBankRate, setRbiBankRate] = useState<number>(6.75); // Current RBI repo/bank rate
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // MSMED Act § 16: Compound interest with monthly rests at 3x RBI Bank Rate
  const statutoryInterestRate = rbiBankRate * 3; // 20.25% p.a.
  
  // Calculate compounding with monthly rests
  const calculation = useMemo(() => {
    const monthlyRate = (statutoryInterestRate / 100) / 12;
    const months = daysDelayed / 30;
    const compoundFactor = Math.pow(1 + monthlyRate, months);
    const totalPayable = principal * compoundFactor;
    const interestAccrued = totalPayable - principal;
    const statutoryDueDays = 45; // Section 15 statutory cap
    const isOverdue = daysDelayed > statutoryDueDays;
    
    return {
      statutoryRate: statutoryInterestRate.toFixed(2),
      interestAccrued: Math.round(interestAccrued),
      totalPayable: Math.round(totalPayable),
      isOverdue,
      daysExceeded: Math.max(0, daysDelayed - statutoryDueDays),
    };
  }, [principal, daysDelayed, statutoryInterestRate]);

  const handleCopyNotice = () => {
    const noticeText = `LEGAL DEMAND NOTICE UNDER SECTION 15 & 16 OF THE MSMED ACT, 2006\n` +
      `Date: ${new Date().toLocaleDateString('en-IN')}\n\n` +
      `To: ${respondentName}\n` +
      `From: ${claimantName}\n\n` +
      `SUBJECT: Statutory Demand for Outstanding Principal Amount of ₹${principal.toLocaleString('en-IN')} with Compound Interest @ ${calculation.statutoryRate}% p.a. (3x RBI Bank Rate).\n\n` +
      `Ref 1: Electronic Commercial Agreement secured via Pact (Certificate ID: ${certificateId})\n` +
      `Ref 2: BSA 2023 §63(4) SHA-256 Tamper Seal: ${dealHash}\n\n` +
      `Take notice that under Section 15 of the Micro, Small and Medium Enterprises Development (MSMED) Act, 2006, payment was mandatorily due within 45 days. The payment has been defaulted by ${daysDelayed} days.\n\n` +
      `Under Section 16 of the MSMED Act, you are liable to pay compound interest with monthly rests at three times the RBI bank rate (Total Claim Amount: ₹${calculation.totalPayable.toLocaleString('en-IN')}).\n\n` +
      `Failure to clear this amount within 15 days will result in immediate filing of MSEFC Form 1 petition before the Micro and Small Enterprise Facilitation Council for statutory arbitration under Section 18 of the MSMED Act, 2006.`;

    navigator.clipboard.writeText(noticeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintPetition = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative z-10 w-full max-w-4xl bg-white dark:bg-neutral-950 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white flex items-center justify-between shrink-0 border-b border-neutral-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Gavel className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base sm:text-lg font-bold">MSME Samadhaan Auto-Filer</h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                    MSMED Act §18
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  MSEFC Form 1 Statutory Petition & 3x RBI Compounding Interest Recovery Engine
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 p-2 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-amber-500" />
              <span>3x RBI Interest Calculator (§16)</span>
            </button>

            <button
              onClick={() => setActiveTab('petition')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'petition'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>MSEFC Form 1 Petition (§18)</span>
            </button>

            <button
              onClick={() => setActiveTab('notice')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'notice'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-emerald-500" />
              <span>Pre-Action Demand Notice</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {/* TAB 1: 3x RBI Interest Calculator */}
            {activeTab === 'calculator' && (
              <div className="space-y-6">
                {/* Statutory Banner */}
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Section 16 Mandate (MSMED Act 2006):</strong> Buyer is statutory bound to pay compound interest with monthly rests at <strong>3x the RBI Bank Rate</strong> from the appointed day (maximum 45 days from delivery). This interest cannot be waived by any private contract!
                  </div>
                </div>

                {/* Calculation Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1.5">
                      Principal Invoice Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                      className="w-full font-mono text-lg font-bold bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-neutral-900 dark:text-white"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">Contracted Goods / Services Price</span>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1.5">
                      Delay Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={daysDelayed}
                      onChange={(e) => setDaysDelayed(Number(e.target.value) || 0)}
                      className="w-full font-mono text-lg font-bold bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-neutral-900 dark:text-white"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">Statutory cap: 45 days (Section 15)</span>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1.5">
                      RBI Base Rate (% p.a.)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      value={rbiBankRate}
                      onChange={(e) => setRbiBankRate(Number(e.target.value) || 0)}
                      className="w-full font-mono text-lg font-bold bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-neutral-900 dark:text-white"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">Statutory 3x = {calculation.statutoryRate}% p.a.</span>
                  </div>
                </div>

                {/* Calculation Summary Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 text-white border border-neutral-800 shadow-xl">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-300">
                        Total Recoverable Claim (Section 16 Breakdown)
                      </span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      Court-Enforceable
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-[11px] text-neutral-400 font-mono">Original Principal</div>
                      <div className="text-xl font-bold font-mono text-white mt-0.5">
                        ₹{principal.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-amber-400 font-mono">3x RBI Compound Interest</div>
                      <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                        +₹{calculation.interestAccrued.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">Monthly compounding rests</span>
                    </div>

                    <div>
                      <div className="text-[11px] text-emerald-400 font-mono">Total Legal Claim Due</div>
                      <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-0.5">
                        ₹{calculation.totalPayable.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2 text-neutral-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Tamper-Sealed Proof: <code className="text-neutral-200">{dealHash.slice(0, 16)}...</code></span>
                    </div>

                    <button
                      onClick={() => setActiveTab('petition')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center space-x-2 transition-all cursor-pointer shadow-md"
                    >
                      <span>Draft MSEFC Form 1 Petition</span>
                      <Gavel className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Official MSEFC Form 1 Petition */}
            {activeTab === 'petition' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-neutral-500">
                    Official Petition Format prescribed under Section 18 of the MSMED Act, 2006 for filing before the Micro & Small Enterprises Facilitation Council.
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrintPetition}
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer border border-neutral-300 dark:border-neutral-700"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Petition</span>
                    </button>
                    <a
                      href="https://samadhaan.msme.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Open Samadhaan Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Petition Document Container */}
                <div className="p-6 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-serif leading-relaxed text-xs shadow-inner space-y-4">
                  <div className="text-center space-y-1 pb-4 border-b border-neutral-300 dark:border-neutral-700">
                    <h3 className="font-bold text-sm uppercase tracking-wide">
                      BEFORE THE MICRO AND SMALL ENTERPRISES FACILITATION COUNCIL (MSEFC)
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Application under Section 18(1) of the Micro, Small and Medium Enterprises Development Act, 2006
                    </p>
                    <p className="font-mono text-[10px] text-neutral-400">
                      Case Filing Ref: PACT-MSEFC-{Date.now().toString().slice(-6)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
                      <div className="font-bold uppercase tracking-wider text-[10px] text-neutral-500 mb-1">
                        Petitioner / Supplier (MSME)
                      </div>
                      <div className="font-bold text-neutral-900 dark:text-white">{claimantName}</div>
                      <div className="text-neutral-500">{claimantPhone} · {claimantEmail}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                        Udyam Verified: UDYAM-MH-01-XXXXXXX
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
                      <div className="font-bold uppercase tracking-wider text-[10px] text-neutral-500 mb-1">
                        Respondent / Buyer (Defaulting Party)
                      </div>
                      <div className="font-bold text-neutral-900 dark:text-white">{respondentName}</div>
                      <div className="text-neutral-500">Commercial Counterparty</div>
                      <div className="text-[10px] text-red-600 dark:text-red-400 font-mono mt-1">
                        Default Status: {daysDelayed} Days Overdue (&gt;45 Day Statutory Cap)
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
                      1. FACTS OF THE ARBITRATION DISPUTE
                    </h4>
                    <p className="text-justify">
                      The Petitioner entered into a binding commercial contract with the Respondent for supply of goods/services. The agreement was confirmed and verified with Section 10 Indian Contract Act pillars and stamped with tamper-evident SHA-256 cryptographic proof pursuant to Section 63(4) of the Bharatiya Sakshya Adhiniyam, 2023.
                    </p>
                    <p className="text-justify">
                      Despite timely delivery by the Petitioner, the Respondent has failed and neglected to make payment within the statutory timeline of 45 days mandated by Section 15 of the MSMED Act, 2006.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
                      2. COMPUTATION OF STATUTORY CLAIM UNDER SECTION 16
                    </h4>
                    <table className="w-full text-left border-collapse border border-neutral-300 dark:border-neutral-700 font-mono text-[11px]">
                      <tbody>
                        <tr className="border-b border-neutral-200 dark:border-neutral-800">
                          <td className="p-2 font-bold bg-neutral-100 dark:bg-neutral-800">Principal Outstanding</td>
                          <td className="p-2">₹{principal.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr className="border-b border-neutral-200 dark:border-neutral-800">
                          <td className="p-2 font-bold bg-neutral-100 dark:bg-neutral-800">Statutory Interest Rate</td>
                          <td className="p-2">{calculation.statutoryRate}% p.a. (3x RBI Bank Rate of {rbiBankRate}%)</td>
                        </tr>
                        <tr className="border-b border-neutral-200 dark:border-neutral-800">
                          <td className="p-2 font-bold bg-neutral-100 dark:bg-neutral-800">Compounding Rests</td>
                          <td className="p-2">Compounded Monthly pursuant to Section 16</td>
                        </tr>
                        <tr className="border-b border-neutral-200 dark:border-neutral-800">
                          <td className="p-2 font-bold bg-neutral-100 dark:bg-neutral-800">Interest Accrued</td>
                          <td className="p-2 text-amber-600 dark:text-amber-400 font-bold">+₹{calculation.interestAccrued.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr className="bg-neutral-50 dark:bg-neutral-900 font-bold">
                          <td className="p-2">TOTAL CLAIM AMOUNT</td>
                          <td className="p-2 text-emerald-600 dark:text-emerald-400 font-bold">₹{calculation.totalPayable.toLocaleString('en-IN')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
                      3. ELECTRONIC EVIDENCE & BSA 2023 §63(4) SEAL
                    </h4>
                    <p className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400 break-all p-2 rounded bg-neutral-100 dark:bg-neutral-800">
                      SHA-256 Digest: {dealHash}<br />
                      Evidence Certificate ID: {certificateId}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-300 dark:border-neutral-700 flex justify-between items-end">
                    <div className="text-[10px] text-neutral-500">
                      Verified under Solemn Affirmation<br />
                      Location: Mumbai / Pune / Bengaluru
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-neutral-900 dark:text-white">{claimantName}</div>
                      <div className="text-[10px] text-neutral-500">Petitioner / Authorized Signatory</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Pre-Action Demand Notice */}
            {activeTab === 'notice' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 flex items-start space-x-3 text-xs text-blue-900 dark:text-blue-200">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Pre-Action Protocol:</strong> Giving a 15-day statutory demand notice gives the defaulting buyer a final opportunity to settle amicably before facing formal arbitration and potential freezing of bank accounts under Section 19 of the MSMED Act.
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={handleCopyNotice}
                    className="absolute top-3 right-3 px-3 py-1.5 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                        <span>Copied Notice!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Full Legal Notice</span>
                      </>
                    )}
                  </button>

                  <pre className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-mono text-[11px] leading-relaxed whitespace-pre-wrap overflow-x-auto">
{`LEGAL DEMAND NOTICE UNDER SECTION 15 & 16 OF THE MSMED ACT, 2006
Date: ${new Date().toLocaleDateString('en-IN')}

To: ${respondentName}
From: ${claimantName} (${claimantPhone})

SUBJECT: Statutory Demand for Outstanding Principal Amount of ₹${principal.toLocaleString('en-IN')} with Compound Interest @ ${calculation.statutoryRate}% p.a. (3x RBI Bank Rate).

Ref 1: Electronic Commercial Agreement secured via Pact (Certificate ID: ${certificateId})
Ref 2: BSA 2023 §63(4) SHA-256 Tamper Seal: ${dealHash}

Dear Sir/Madam,

Take notice that under Section 15 of the Micro, Small and Medium Enterprises Development (MSMED) Act, 2006, payment for supplies delivered was mandatorily due within forty-five (45) days. Your payment has been defaulted by ${daysDelayed} days.

Under Section 16 of the MSMED Act, 2006:
"Where any buyer fails to make payment of the amount to the supplier, the buyer shall be liable to pay compound interest with monthly rests to the supplier on that amount from the appointed day at three times of the bank rate notified by the Reserve Bank."

ACCORDINGLY, OUR STATUTORY CLAIM STANDS AT:
1. Principal Amount: ₹${principal.toLocaleString('en-IN')}
2. Statutory 3x RBI Interest Accrued: ₹${calculation.interestAccrued.toLocaleString('en-IN')}
TOTAL RECOVERABLE CLAIM: ₹${calculation.totalPayable.toLocaleString('en-IN')}

Take notice that if the entire amount of ₹${calculation.totalPayable.toLocaleString('en-IN')} is not paid within fifteen (15) days of this notice, we shall file an online petition in MSEFC Form 1 before the Micro & Small Enterprises Facilitation Council under Section 18 of the MSMED Act, 2006 without any further reference to you.

Please note that under Section 19 of the Act, no court or appellate body will entertain any appeal from your end without a prior mandatory deposit of 75% of the awarded amount.

Yours sincerely,
${claimantName}
Authorized Signatory`}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center space-x-2 text-neutral-500 font-mono">
              <Building2 className="w-4 h-4 text-neutral-400" />
              <span>Ministry of MSME · Gov. of India · Samadhaan Legal Gateway</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleCopyNotice}
                className="px-4 py-2 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black rounded-lg font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Notice</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
