'use client';

import React, { useState } from 'react';
import { X, KeyRound, ShieldCheck, Check, AlertCircle } from 'lucide-react';

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionTitle?: string;
}

export const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionTitle = 'Download Section 63 Evidence Certificate'
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVerify = () => {
    if (code === '884260' || code.length === 6) {
      setError('');
      onSuccess();
      onClose();
    } else {
      setError('Invalid 2FA code. Please enter 6-digit code or click Auto-Fill.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 text-white space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5 stroke-[2.5]" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Step-Up 2FA Security Required</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Authorizing: <span className="text-neutral-200 font-medium">{actionTitle}</span>
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Sent to Trader Device:</span>
            <span className="font-mono text-neutral-200">+91 97315 •••••</span>
          </div>

          <div className="space-y-1.5">
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="••••••"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 font-mono text-xl tracking-[0.5em] text-white text-center focus:outline-none focus:border-white"
            />
            {error && (
              <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setCode('884260')}
              className="text-[11px] font-mono text-neutral-400 hover:text-white underline cursor-pointer"
            >
              Auto-fill Demo Code (884260)
            </button>
            <span className="text-[10px] text-neutral-500 font-mono">Expires in 0:45</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium text-xs transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleVerify}
            className="flex-1 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-md"
          >
            Authorize & Proceed
          </button>
        </div>

      </div>
    </div>
  );
};
