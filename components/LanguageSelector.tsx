'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { LanguageCode } from '@/lib/translations';

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const languages: { code: LanguageCode; label: string; script: string }[] = [
    { code: 'en', label: 'English', script: 'EN' },
    { code: 'hi', label: 'हिन्दी', script: 'HI' },
    { code: 'ta', label: 'தமிழ்', script: 'TA' },
    { code: 'gu', label: 'ગુજરાતી', script: 'GU' },
  ];

  return (
    <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-brand-border">
      <div className="pl-1.5 pr-1 text-slate-400 flex items-center">
        <Globe className="w-3.5 h-3.5 text-industrial-400" />
      </div>
      <div className="flex items-center space-x-1">
        {languages.map((lang) => {
          const isActive = currentLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onLanguageChange(lang.code)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-industrial-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
              title={`Switch language to ${lang.label}`}
            >
              <span>{lang.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
