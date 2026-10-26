'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Lock, User, Phone, Mail, CheckCircle2, ArrowRight, ExternalLink, X, Check } from 'lucide-react';

export interface UserProfileData {
  fullName: string;
  phone: string;
  email: string;
  acceptedTerms: boolean;
  onDemandMailConsent: boolean;
  contactSyncConsent: boolean;
}

interface UserConsentOnboardingProps {
  onProfileUpdated?: (profile: UserProfileData) => void;
  onOpenPrivacyModal: () => void;
  variant?: 'hero-inline' | 'drawer-card';
  currentProfile?: UserProfileData | null;
}

const DEFAULT_PROFILE: UserProfileData = {
  fullName: '',
  phone: '',
  email: '',
  acceptedTerms: false,
  onDemandMailConsent: true,
  contactSyncConsent: true,
};

export function UserConsentOnboarding({
  onProfileUpdated,
  onOpenPrivacyModal,
  variant = 'hero-inline',
  currentProfile,
}: UserConsentOnboardingProps) {
  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_PROFILE);
  const [isSaved, setIsSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync with currentProfile passed from parent
  useEffect(() => {
    if (currentProfile && currentProfile.fullName) {
      setProfile(currentProfile);
      setIsSaved(true);
    }
  }, [currentProfile]);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pact_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName && parsed.phone) {
          setProfile(parsed);
          setIsSaved(true);
          onProfileUpdated?.(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load user profile', e);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!profile.fullName.trim()) {
      setErrorMessage('Please enter your full name or registered trade name.');
      return;
    }
    if (!profile.phone.trim() || profile.phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for WhatsApp verification.');
      return;
    }
    if (!profile.email.trim() || !profile.email.includes('@')) {
      setErrorMessage('Please enter a valid business email ID for e-Stamp delivery.');
      return;
    }
    if (!profile.acceptedTerms) {
      setErrorMessage('Please accept the Terms & Conditions and Data Security Charter.');
      return;
    }

    try {
      localStorage.setItem('pact_user_profile', JSON.stringify(profile));
      setIsSaved(true);
      setIsModalOpen(false);
      onProfileUpdated?.(profile);
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  };

  return (
    <>
      {/* Lengthy Capsules matching 2nd image width & curvature (w-full max-w-sm) */}
      <div className="w-full max-w-sm mt-3 space-y-2 font-mono">
        {/* Lengthy Capsule 1: MSME Digital Identity */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full px-4 py-2.5 rounded-full bg-white/95 hover:bg-white backdrop-blur-md border border-neutral-300 hover:border-black text-neutral-800 flex items-center justify-between shadow-xs transition-all active:scale-[0.99] group cursor-pointer"
          title="Click to set or edit your MSME Legal Identity"
        >
          <div className="flex items-center space-x-2.5 overflow-hidden min-w-0">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isSaved ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400 group-hover:bg-neutral-600'
              }`}
            />
            <div className="flex items-center space-x-1.5 truncate text-left">
              <span className="text-[11px] text-neutral-500 font-medium shrink-0">Digital ID:</span>
              <span className="text-xs font-semibold text-neutral-900 truncate">
                {isSaved && profile.fullName ? profile.fullName : '+ Add Name, Phone, Email'}
              </span>
              {isSaved && profile.phone && (
                <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline truncate">
                  • {profile.phone}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0 ml-2">
            {isSaved ? (
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-900 border border-neutral-300">
                Verified MSME
              </span>
            ) : (
              <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-neutral-100 group-hover:bg-black group-hover:text-white text-neutral-700 transition-all">
                Setup ↗
              </span>
            )}
          </div>
        </button>

        {/* Lengthy Capsule 2: Terms & Conditions & Privacy Protocol */}
        <button
          type="button"
          onClick={onOpenPrivacyModal}
          className="w-full px-4 py-2.5 rounded-full bg-white/95 hover:bg-white backdrop-blur-md border border-neutral-300 hover:border-black text-neutral-800 flex items-center justify-between shadow-xs transition-all active:scale-[0.99] group cursor-pointer"
          title="Inspect Privacy Policy & Statutory Terms (ICA §10 · BSA §63)"
        >
          <div className="flex items-center space-x-2.5 overflow-hidden min-w-0">
            {isSaved && profile.acceptedTerms ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
            ) : (
              <Shield className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
            )}
            <div className="truncate text-left">
              <span className="text-[11px] font-mono font-medium text-neutral-900 block truncate">
                {isSaved && profile.acceptedTerms
                  ? 'Terms & Conditions Accepted (ICA §10 · BSA §63)'
                  : 'Zero-Storage Privacy Protocol · DPDP Act 2023'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1 shrink-0 ml-2">
            <span className="text-[10px] font-mono font-medium text-neutral-600 group-hover:text-black underline flex items-center space-x-0.5">
              <span>{isSaved && profile.acceptedTerms ? 'View Terms' : 'Data Policy'}</span>
              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>
        </button>
      </div>

      {/* Modal Dialog for Data Collection & Privacy Transparency */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden text-left font-sans text-neutral-900">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 leading-none">MSME Digital Identity Setup</h3>
                  <span className="text-[10px] text-neutral-500 font-mono">Zero-Retention Protocol · ICA §10</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-neutral-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              
              {/* Why We Collect Details Callout */}
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-[11px] text-neutral-600 leading-relaxed">
                <span className="font-semibold text-neutral-900 block mb-0.5">Why we need your details:</span>
                Under Section 10 of the Indian Contract Act 1872 & BSA §63, commercial digital agreements require identifiable parties. Your Name, Phone Number, and Business Email are used solely to sign e-Stamp contracts.
                <strong className="text-black block mt-1">We NEVER read or store your personal mails or chats. We search specific threads on-demand only when you explicitly instruct the bot.</strong>
              </div>

              {/* Input Form Fields in Clean Rows */}
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                {/* Row 1: Full Name */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-700 uppercase font-mono block mb-1">
                    Trader / MSME Legal Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-3.5 h-3.5 text-neutral-400 absolute left-3" />
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      placeholder="e.g. Ramesh Patel / Patel Cotton Traders"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-neutral-50/50"
                    />
                  </div>
                </div>

                {/* Row 2: WhatsApp Mobile */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-700 uppercase font-mono block mb-1">
                    WhatsApp Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-3" />
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 text-xs font-mono focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-neutral-50/50"
                    />
                  </div>
                </div>

                {/* Row 3: Business Email */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-700 uppercase font-mono block mb-1">
                    Business Email ID
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-3" />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="trade@patelcotton.in"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-neutral-50/50"
                    />
                  </div>
                </div>

                {/* Permissions & Consent Checkboxes */}
                <div className="pt-2 border-t border-neutral-100 space-y-2 text-[11px]">
                  <label className="flex items-start space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={profile.acceptedTerms}
                      onChange={(e) => setProfile({ ...profile, acceptedTerms: e.target.checked })}
                      className="mt-0.5 rounded border-neutral-300 text-black focus:ring-black h-3.5 w-3.5"
                    />
                    <span className="text-neutral-700 leading-tight">
                      I accept the <button type="button" onClick={onOpenPrivacyModal} className="text-black underline font-semibold">Terms & Conditions</button> and authorize Pact to generate BSA §63 digital certificates.
                    </span>
                  </label>

                  <label className="flex items-start space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={profile.onDemandMailConsent}
                      onChange={(e) => setProfile({ ...profile, onDemandMailConsent: e.target.checked })}
                      className="mt-0.5 rounded border-neutral-300 text-black focus:ring-black h-3.5 w-3.5"
                    />
                    <span className="text-neutral-600 leading-tight">
                      <strong>On-Demand Mail/Chat Search:</strong> Allow bot to inspect business threads <em>only</em> when explicitly asked by voice or text.
                    </span>
                  </label>
                </div>

                {/* Error message */}
                {errorMessage && (
                  <p className="text-[11px] font-medium text-red-600 font-mono">
                    ⚠️ {errorMessage}
                  </p>
                )}

                {/* Submit & Cancel Buttons */}
                <div className="pt-3 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-black hover:bg-neutral-800 text-white rounded-xl py-2.5 font-medium text-xs shadow-sm transition-all active:scale-95 flex items-center justify-center space-x-1.5"
                  >
                    <span>Save Details & Activate Protection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default UserConsentOnboarding;
