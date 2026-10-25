'use client';

import React, { useState } from 'react';
import { 
  MessageCircle, 
  Newspaper, 
  Lightbulb, 
  CheckSquare, 
  LayoutGrid, 
  Shield, 
  Lock, 
  Send, 
  Mic, 
  Volume2, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Award, 
  ExternalLink, 
  Sliders, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  DollarSign, 
  RefreshCw, 
  Plus, 
  ArrowRight,
  Maximize2,
  Minimize2,
  Smartphone
} from 'lucide-react';
import { MuseMascot, AgentState } from '@/components/MuseMascot';
import { SampleDealScenario, SAMPLE_SCENARIOS } from '@/lib/extractionEngine';

export type PactTab = 'chat' | 'feed' | 'ideas' | 'deals' | 'library';

interface PactAppWindowProps {
  layoutMode?: 'docked' | 'mobile';
  onMinimize?: () => void;
  onOpenPrintModal: () => void;
  onOpenCertificateModal: () => void;
  onOpenTamperModal: () => void;
  onOpenVoiceUploader: () => void;
  activeScenario: SampleDealScenario;
  onSelectScenario: (scenario: SampleDealScenario) => void;
  pillars: any;
  ambiguities: any[];
  validityScore: number;
  isTampered: boolean;
  currentHash: string;
  onResolveAmbiguity: (ambiguityId: string, resolutionText: string) => void;
}

export const PactAppWindow: React.FC<PactAppWindowProps> = ({
  layoutMode = 'docked',
  onMinimize,
  onOpenPrintModal,
  onOpenCertificateModal,
  onOpenTamperModal,
  onOpenVoiceUploader,
  activeScenario,
  onSelectScenario,
  pillars,
  ambiguities,
  validityScore,
  isTampered,
  currentHash,
  onResolveAmbiguity,
}) => {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<PactTab>('chat');
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);
  const [activityDrawerTab, setActivityDrawerTab] = useState<'log' | 'approvals'>('approvals');
  const [librarySubTab, setLibrarySubTab] = useState<'artifacts' | 'media'>('artifacts');
  const [isFeedInstructionsOpen, setIsFeedInstructionsOpen] = useState(false);
  const [feedPrompt, setFeedPrompt] = useState('Monitor 45-day MSMED Act §15 payment deadlines & alert 5 days prior.');
  
  // Chat reactions state
  const [selectedReaction, setSelectedReaction] = useState<{ [msgId: string]: string }>({
    'pact-1': '🔒',
    'pact-2': '👍',
  });

  // Approvals Sheet Actions
  const [approvalGranted, setApprovalGranted] = useState(false);

  const handleAllowNudge = (type: 'once' | 'always') => {
    setApprovalGranted(true);
    onResolveAmbiguity('amb-1', 'Delivery fixed strictly by November 10 (pre-Diwali dispatch guaranteed).');
    setTimeout(() => {
      setIsActivityDrawerOpen(false);
    }, 900);
  };

  const agentState: AgentState = isTampered ? 'tampered' : ambiguities.length > 0 ? 'analyzing' : 'locked';

  return (
    <div className={`relative w-full h-full flex flex-col bg-[#080d1a] text-slate-100 select-none overflow-hidden ${
      layoutMode === 'docked' ? 'rounded-3xl border border-white/15 shadow-2xl backdrop-blur-2xl' : 'rounded-[40px]'
    }`}>
      
      {/* ============================================================
          TOP HEADER: Window Bar + Circular Mascot + Status Pill
         ============================================================ */}
      <div className="px-4 py-3 bg-[#0a1020]/95 border-b border-slate-800/80 flex items-center justify-between shrink-0 z-20">
        
        {/* Left: Window Controls / Badge */}
        <div className="flex items-center space-x-2">
          {layoutMode === 'docked' && (
            <div className="flex items-center space-x-1.5 mr-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
          )}
          <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1">
            Pact<span className="text-[#0082fb]">.</span>
            <span className="text-[10px] font-mono font-normal text-slate-400">v2.4</span>
          </span>
        </div>

        {/* Center: Tap Mascot -> Trigger Activity & Approvals Sheet */}
        <div 
          onClick={() => setIsActivityDrawerOpen(!isActivityDrawerOpen)}
          role="button"
          tabIndex={0}
          className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 cursor-pointer transition-all hover:scale-105 active:scale-95 group shadow-sm"
          title="Tap Pact Mascot to view Agent Activity Log & Pending Approvals"
        >
          {/* Circular Video Avatar */}
          <div className="w-6 h-6 rounded-full overflow-hidden border border-[#0082fb] relative bg-white shrink-0">
            <video
              src="/pact-mascot.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-110 bg-white"
            />
          </div>

          <span className="text-[11px] font-medium text-slate-200 group-hover:text-white flex items-center gap-1">
            {isTampered ? (
              <span className="text-red-400 font-bold">Tamper Alert</span>
            ) : approvalGranted ? (
              <span className="text-emerald-400 font-bold">🟢 §63(4) Locked</span>
            ) : (
              <span className="text-cyan-400">🔬 §10 Analyzing</span>
            )}
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isActivityDrawerOpen ? 'rotate-180' : ''}`} />
          </span>
        </div>

        {/* Right: Enforceability Pill & Minimize Button */}
        <div className="flex items-center space-x-2">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
            isTampered 
              ? 'bg-red-500/20 text-red-400 border-red-500/40' 
              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          }`}>
            {validityScore}%
          </span>

          {layoutMode === 'docked' && onMinimize && (
            <button
              onClick={onMinimize}
              className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              title="Minimize Pact companion to corner"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* ============================================================
          AGENT ACTIVITY & APPROVALS SLIDE-DOWN DRAWER
         ============================================================ */}
      {isActivityDrawerOpen && (
        <div className="absolute top-[49px] inset-x-0 z-30 bg-[#0e1424]/98 border-b border-blue-500/30 backdrop-blur-xl p-4 shadow-2xl animate-fadeIn space-y-3">
          
          {/* Sub-tab Navigation */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActivityDrawerTab('approvals')}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all flex items-center space-x-1.5 ${
                  activityDrawerTab === 'approvals'
                    ? 'bg-[#0082fb] text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3 h-3" />
                <span>Needs Review ({approvalGranted ? 0 : 1})</span>
              </button>
              
              <button
                onClick={() => setActivityDrawerTab('log')}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all flex items-center space-x-1.5 ${
                  activityDrawerTab === 'log'
                    ? 'bg-[#0082fb] text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Activity Log</span>
              </button>
            </div>

            <button
              onClick={() => setIsActivityDrawerOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tab Content: Needs Review / Approvals */}
          {activityDrawerTab === 'approvals' && (
            <div className="space-y-2.5">
              {!approvalGranted ? (
                <div className="p-3.5 rounded-2xl bg-[#141b2e] border border-amber-500/30 space-y-2.5">
                  <div className="flex items-start space-x-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Needs Review / Approval Required
                      </span>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        Allow Pact to send polite 'Blame-the-Bot' GST dispatch date nudge to Ibrahim Sweets?
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 pt-1">
                    <button
                      onClick={() => handleAllowNudge('once')}
                      className="py-1.5 px-3 rounded-xl bg-[#0082fb] hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-all text-center"
                    >
                      Allow once
                    </button>
                    <button
                      onClick={() => handleAllowNudge('always')}
                      className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all text-center"
                    >
                      Allow for all deals
                    </button>
                    <button
                      onClick={() => setIsActivityDrawerOpen(false)}
                      className="py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs transition-all text-center"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Approved! Section 29 delivery date locked. Enforceability index updated to 98%.</span>
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Activity Log */}
          {activityDrawerTab === 'log' && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto text-[11px] font-mono pr-1">
              {[
                { time: 'Just now', text: 'Computed Node.js HMAC Notary Seal', status: 'done' },
                { time: '1m ago', text: 'Extracted §10 consideration ₹2,50,000', status: 'done' },
                { time: '2m ago', text: 'Transcribed Hinglish audio', status: 'done' },
                { time: '3m ago', text: 'Dual-Node SHA-256 Digest generated & verified', status: 'done' },
              ].map((item, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{item.text}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ============================================================
          MAIN TAB CONTENT AREA (Tabs 1 to 5)
         ============================================================ */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        
        {/* ==========================================================
            TAB 1: CHAT TAB (Conversational Stream & Artifact Cards)
           ========================================================== */}
        {activeTab === 'chat' && (
          <div className="space-y-3">
            
            {/* Scenario Preset Selector Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 shrink-0 scrollbar-none text-xs">
              {SAMPLE_SCENARIOS.map((s) => {
                const isSelected = s.id === activeScenario.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => onSelectScenario(s)}
                    className={`text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-[#0082fb]/20 text-[#0082fb] border-[#0082fb] font-semibold'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border-slate-800'
                    }`}
                  >
                    {s.title.split('&')[0].trim()}
                  </button>
                );
              })}
            </div>

            {/* Chat Bubble Stream */}
            <div className="space-y-2.5 pt-1">
              {activeScenario.messages.map((msg) => {
                const isBuyer = msg.role === 'buyer';
                const rx = selectedReaction[msg.id];
                return (
                  <div key={msg.id} className={`flex flex-col ${isBuyer ? 'items-start' : 'items-end'}`}>
                    <span className="text-[9px] font-mono text-slate-500 mb-0.5 px-1">
                      {msg.sender} • {msg.timestamp}
                    </span>
                    <div className="relative group max-w-[85%]">
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isBuyer 
                          ? 'bg-[#182238] text-slate-200 border border-slate-700/60' 
                          : 'bg-[#0082fb] text-white shadow-sm'
                      }`}>
                        {msg.text}
                      </div>

                      {/* Emoji reaction display pill */}
                      {rx && (
                        <span className="absolute -bottom-2 right-1.5 px-1.5 py-0.2 bg-slate-900 border border-slate-700 rounded-full text-[10px] shadow-sm">
                          {rx}
                        </span>
                      )}

                      {/* Hover Emoji Reaction Bar */}
                      <div className="absolute -top-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 rounded-full px-1.5 py-0.5 flex space-x-1 shadow-md">
                        {['👍', '❤️', '🔒', '📄'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => setSelectedReaction({ ...selectedReaction, [msg.id]: emoji })}
                            className="hover:scale-125 transition-transform text-[11px]"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* INLINE ARTIFACT PREVIEW CARDS */}
            <div className="pt-2 space-y-2">
              
              {/* Card 1: Government e-Stamp Paper Artifact (Click opens PrintModal) */}
              <div 
                onClick={onOpenPrintModal}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#181d2c] to-amber-950/20 border border-amber-400/40 hover:border-amber-400 cursor-pointer transition-all shadow-md group"
                title="Click to preview official Non-Judicial Stamp Paper"
              >
                <div className="flex items-center justify-between pb-2 border-b border-amber-500/20 mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                      ₹
                    </div>
                    <span className="text-[11px] font-bold text-amber-300">
                      BSA-63-2024 e-Stamp Certificate.pdf
                    </span>
                  </div>
                  <span className="text-[9px] font-mono bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                    PREVIEW
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Non-Judicial Stamp Duty: ₹100</span>
                  <span className="text-amber-300 group-hover:underline flex items-center gap-0.5">
                    Open PDF &rarr;
                  </span>
                </div>
              </div>

              {/* Card 2: Section 10 Pillar Summary Artifact */}
              <div 
                onClick={onOpenCertificateModal}
                className="p-3.5 rounded-2xl bg-[#121829] border border-blue-500/30 hover:border-blue-400 cursor-pointer transition-all shadow-sm"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span className="text-[11px] font-bold text-white">Section 10 Legal Pillars</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    4/4 Verified
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Consideration</span>
                    <span className="font-bold text-slate-200">{pillars.price.totalAmount}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Quantity</span>
                    <span className="font-bold text-slate-200">{pillars.scope.quantity}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==========================================================
            TAB 2: FEED TAB (MSME Legal & Payment Radar)
           ========================================================== */}
        {activeTab === 'feed' && (
          <div className="space-y-3">
            
            {/* Customizable Feed Instructions Drawer Trigger */}
            <div className="p-3 rounded-2xl bg-[#10172a] border border-slate-800">
              <button
                onClick={() => setIsFeedInstructionsOpen(!isFeedInstructionsOpen)}
                className="w-full flex items-center justify-between text-xs text-slate-300 font-semibold"
              >
                <div className="flex items-center space-x-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Feed Instructions & Preferences</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFeedInstructionsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFeedInstructionsOpen && (
                <div className="pt-2 mt-2 border-t border-slate-800 space-y-2">
                  <textarea
                    value={feedPrompt}
                    onChange={(e) => setFeedPrompt(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-[11px] text-slate-200 focus:outline-none focus:border-blue-500"
                    placeholder="Instructions for Pact Radar..."
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Pact personalizes this feed based on your trade sector and jurisdiction.
                  </span>
                </div>
              )}
            </div>

            {/* Feed Cards */}
            <div className="space-y-2.5">
              
              {/* Feed Item 1: MSMED Act §15 45-Day Alert */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#161d30] to-[#0f1422] border border-blue-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                    MSMED Act §15 Alert
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">T-38 Days Left</span>
                </div>
                <h4 className="text-xs font-bold text-white">
                  Payment Protection: Ibrahim Sweets (₹1,75,000 Balance)
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Under MSME Development Act 2006, payment must be released within 45 days of delivery. Compound interest at 3× RBI rate (currently 18.75% p.a.) starts compounding automatically thereafter.
                </p>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-[10px] text-emerald-400 flex items-center justify-between">
                  <span>Accruing Compound Rate:</span>
                  <span className="font-mono font-bold">₹89.86 / day</span>
                </div>
              </div>

              {/* Feed Item 2: GST e-Way Bill Requirement */}
              <div className="p-3.5 rounded-2xl bg-[#121829] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                    GST Rule 138
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Threshold Check</span>
                </div>
                <h4 className="text-xs font-bold text-white">
                  e-Way Bill Required for Consignments &gt; ₹50,000
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  This transaction value is ₹2,50,000 (exceeds ₹50k intra-state threshold). Pact has pre-filled HSN code 4819 for gold-foil boxes ready for 1-click filing.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ==========================================================
            TAB 3: IDEAS TAB (Proactive 1-Click Legal Nudges)
           ========================================================== */}
        {activeTab === 'ideas' && (
          <div className="space-y-3">
            <div className="px-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Proactive Deal Enhancements
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                1-click protections Pact generated by analyzing your negotiation stream:
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  title: 'Lock Diwali Box Dispatch Date',
                  desc: 'Resolves Section 29 Void Uncertainty. Sets strictly Nov 10 delivery.',
                  benefit: '+15% Court Enforceability',
                  actionText: 'Apply Date Lock',
                  onClick: () => handleAllowNudge('once'),
                },
                {
                  title: 'Attach 18% MSMED Compound Interest',
                  desc: 'Injects statutory interest clause under Section 16 of MSMED Act 2006.',
                  benefit: 'Protects Working Capital',
                  actionText: 'Attach Clause',
                  onClick: () => onResolveAmbiguity('amb-2', 'MSMED Act 2006 compound interest clause attached.'),
                },
                {
                  title: 'Draft Part-A e-Way Bill Preview',
                  desc: 'Pre-fills consignor & consignee GSTIN for instant logistics dispatch.',
                  benefit: 'Zero Transit Friction',
                  actionText: 'Draft e-Way Bill',
                  onClick: () => {},
                },
              ].map((idea, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#121829] border border-blue-500/20 space-y-2 hover:border-blue-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{idea.title}</span>
                    <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      {idea.benefit}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {idea.desc}
                  </p>
                  <button
                    onClick={idea.onClick}
                    className="w-full py-1.5 rounded-xl bg-[#0082fb]/20 hover:bg-[#0082fb] text-[#0082fb] hover:text-white border border-[#0082fb]/40 text-xs font-semibold transition-all flex items-center justify-center space-x-1"
                  >
                    <span>{idea.actionText}</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 4: DEALS / GOALS TAB (Active Deals & Timeline)
           ========================================================== */}
        {activeTab === 'deals' && (
          <div className="space-y-3">
            <div className="px-1 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Active Commercial Deals
                </h3>
                <span className="text-[10px] text-slate-400">Total Enforceable Value: ₹23.3 Lakhs</span>
              </div>
              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                3 Contracts
              </span>
            </div>

            <div className="space-y-2">
              {[
                {
                  title: 'Prabhanjan Packaging × Ibrahim Sweets',
                  val: '₹2,50,000',
                  status: isTampered ? 'Tampered' : 'Locked',
                  statusColor: isTampered ? 'text-red-400 border-red-500/30 bg-red-950/30' : 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30',
                  items: '10,000 Gold-Foil Embossed Boxes',
                  timeline: ['Whisper Audio Ingested', '§10 Pillars Validated', 'BSA 2023 §63(4) Hash Sealed'],
                },
                {
                  title: 'Surat Weaving Mills × Bhiwandi Hub',
                  val: '₹16,00,000',
                  status: 'Tracking',
                  statusColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30',
                  items: '500 Bales 100% Combed Cotton Yarn',
                  timeline: ['Audio Transcribed', 'Parties Identified', 'Pending Delivery Date'],
                },
                {
                  title: 'Kulkarni Engineering × Pune Castings',
                  val: '₹4,80,000',
                  status: 'Draft',
                  statusColor: 'text-amber-400 border-amber-500/30 bg-amber-950/30',
                  items: '200 CNC Machined Flanges',
                  timeline: ['Initial Inquiry Received'],
                },
              ].map((deal, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#121829] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[200px]">{deal.title}</span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${deal.statusColor}`}>
                      {deal.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>{deal.items}</span>
                    <span className="font-bold text-white">{deal.val}</span>
                  </div>
                  
                  {/* Step-by-Step Cryptographic Audit Timeline */}
                  <div className="pt-1.5 border-t border-slate-800/80 space-y-1">
                    {deal.timeline.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 5: LIBRARY TAB (Artifacts, Media & Judge Sandbox)
           ========================================================== */}
        {activeTab === 'library' && (
          <div className="space-y-3">
            
            {/* Top 4 Stat Cards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-2xl bg-[#121829] border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Enforceability</span>
                <span className="text-base font-bold text-emerald-400 font-mono">{validityScore}%</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#121829] border border-slate-800">
                <span className="text-slate-400 text-[10px] block">§10 Pillars</span>
                <span className="text-base font-bold text-cyan-400 font-mono">4/4 Valid</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#121829] border border-slate-800">
                <span className="text-slate-400 text-[10px] block">BSA 2023 Seal</span>
                <span className="text-base font-bold text-indigo-400 font-mono">SHA-256</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#121829] border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Deal Value</span>
                <span className="text-base font-bold text-amber-300 font-mono">{pillars.price.totalAmount}</span>
              </div>
            </div>

            {/* Sub-tab: Artifacts | Media */}
            <div className="flex rounded-xl bg-slate-900 p-0.5 border border-slate-800 text-xs">
              <button
                onClick={() => setLibrarySubTab('artifacts')}
                className={`flex-1 py-1 rounded-lg font-medium transition-all ${
                  librarySubTab === 'artifacts' ? 'bg-[#0082fb] text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                Artifacts & Certificates
              </button>
              <button
                onClick={() => setLibrarySubTab('media')}
                className={`flex-1 py-1 rounded-lg font-medium transition-all ${
                  librarySubTab === 'media' ? 'bg-[#0082fb] text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                Media & Voice Notes
              </button>
            </div>

            {librarySubTab === 'artifacts' && (
              <div className="space-y-2">
                {/* 1. e-Stamp Non-Judicial Stamp Paper */}
                <div 
                  onClick={onOpenPrintModal}
                  className="p-3 rounded-2xl bg-[#121829] border border-amber-500/30 hover:border-amber-400 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="font-bold text-white block">Government e-Stamp Paper PDF</span>
                      <span className="text-[10px] text-slate-400 font-mono">Non-Judicial Stamp Duty ₹100</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300">Print / PDF &rarr;</span>
                </div>

                {/* 2. Statutory BSA 2023 §63(4) Certificate */}
                <div 
                  onClick={onOpenCertificateModal}
                  className="p-3 rounded-2xl bg-[#121829] border border-cyan-500/30 hover:border-cyan-400 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="font-bold text-white block">BSA 2023 §63(4) Evidence Slip</span>
                      <span className="text-[10px] text-slate-400 font-mono">Courtroom Admissibility Affidavit</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300">View &rarr;</span>
                </div>

                {/* 3. Judge Tamper Sandbox Dashboard Artifact */}
                <div 
                  onClick={onOpenTamperModal}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-500/40 hover:border-rose-400 cursor-pointer text-xs space-y-1.5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-rose-400" />
                      <span className="font-bold text-white">Judge Tamper Sandbox Artifact</span>
                    </div>
                    <span className="text-[9px] font-mono bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded border border-rose-500/30">
                      LIVE SANDBOX
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300">
                    Test adversary simulation: modify chat characters in real time to observe instant SHA-256 hash avalanche rejection.
                  </p>
                </div>
              </div>
            )}

            {librarySubTab === 'media' && (
              <div className="space-y-2">
                <div 
                  onClick={onOpenVoiceUploader}
                  className="p-3 rounded-2xl bg-[#121829] border border-slate-800 hover:border-blue-500 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <Volume2 className="w-4 h-4 text-[#0082fb]" />
                    <div>
                      <span className="font-bold text-white block">Prabhanjan Hinglish Audio (0:18)</span>
                      <span className="text-[10px] text-slate-400 font-mono">10,000 sweet boxes @ ₹25</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">Transcribed</span>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ============================================================
          BOTTOM INTERACTIVE BAR: Message Input Bar
         ============================================================ */}
      <div className="p-3 bg-[#0a1020]/95 border-t border-slate-800/80 space-y-2 shrink-0 z-20">
        
        {/* Rounded Pill Message Input Box */}
        <div className="flex items-center bg-[#131b2e] border border-slate-700/80 rounded-full px-3 py-1.5 shadow-inner">
          <button
            onClick={onOpenVoiceUploader}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center shrink-0 mr-1.5 transition-colors"
            title="Upload WhatsApp Audio Deal"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          
          <input
            type="text"
            placeholder="Type WhatsApp deal or ask Pact..."
            className="bg-transparent border-none text-xs text-slate-100 placeholder-slate-500 focus:outline-none flex-1 min-w-0"
          />

          <button
            onClick={onOpenVoiceUploader}
            className="w-7 h-7 rounded-full text-slate-400 hover:text-cyan-400 flex items-center justify-center shrink-0 transition-colors"
            title="Record Voice Note"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>

          <button
            className="w-7 h-7 rounded-full bg-[#0082fb] hover:bg-blue-600 text-white flex items-center justify-center shrink-0 ml-1 shadow-sm transition-colors"
          >
            <Send className="w-3 h-3 ml-0.5" />
          </button>
        </div>

        {/* 5-Icon Navigation Bar */}
        <div className="grid grid-cols-5 gap-1 pt-1 border-t border-slate-800/60 text-[10px] text-slate-400 font-medium">
          {[
            { id: 'chat' as PactTab, label: 'Chat', icon: MessageCircle },
            { id: 'feed' as PactTab, label: 'Feed', icon: Newspaper },
            { id: 'ideas' as PactTab, label: 'Ideas', icon: Lightbulb },
            { id: 'deals' as PactTab, label: 'Deals', icon: CheckSquare },
            { id: 'library' as PactTab, label: 'Library', icon: LayoutGrid },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                  isTabActive 
                    ? 'text-[#0082fb] font-bold bg-blue-500/10' 
                    : 'hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isTabActive ? 'text-[#0082fb]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
};
