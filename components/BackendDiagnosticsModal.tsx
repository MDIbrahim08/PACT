'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  X, 
  Zap, 
  Server, 
  Activity,
  Terminal,
  Clock
} from 'lucide-react';

export interface ServiceCheckResult {
  id: string;
  name: string;
  model: string;
  purpose: string;
  status: 'online' | 'degraded' | 'error';
  latencyMs: number;
  preview?: string;
  credentialUsed: string;
  error?: string;
}

export interface DiagnosticsResponse {
  success: boolean;
  overallStatus: 'all_systems_operational' | 'partial_degradation' | 'error';
  timestamp: string;
  totalLatencyMs: number;
  services: ServiceCheckResult[];
}

interface BackendDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendDiagnosticsModal: React.FC<BackendDiagnosticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DiagnosticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/test-backend');
      if (!res.ok) {
        throw new Error(`Diagnostics endpoint returned HTTP ${res.status}`);
      }
      const json: DiagnosticsResponse = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Failed to ping backend diagnostics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runDiagnostics();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#080d19] border border-slate-700/80 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(0,130,251,0.25)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Bar */}
        <div className="px-5 py-4 bg-[#0a1122] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0082fb] to-blue-700 flex items-center justify-center text-white shadow-glow">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Pact Multi-Model AI & Crypto Diagnostics
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                  LIVE BENCHMARK
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time API ping across all 4 configured LLMs & cryptographic notary engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all active:scale-95"
            title="Close Diagnostics"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Overall Status Banner */}
        <div className="px-5 py-3 bg-[#0c1429] border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                loading ? 'bg-cyan-400' : data?.overallStatus === 'all_systems_operational' ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                loading ? 'bg-cyan-500' : data?.overallStatus === 'all_systems_operational' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
            </span>
            <span className="text-xs font-semibold text-slate-200">
              {loading ? (
                'Pinging AI Models & Computing Notary Seal...'
              ) : data?.overallStatus === 'all_systems_operational' ? (
                '🟢 100% Systems Operational // All 4 AI Models Verified'
              ) : (
                '🟡 Diagnostics Completed with Partial Failovers'
              )}
            </span>
          </div>

          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-[#0082fb]/20 hover:bg-[#0082fb]/30 border border-[#0082fb]/50 text-blue-300 text-xs font-medium flex items-center space-x-1.5 transition-all disabled:opacity-50 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-Test</span>
          </button>
        </div>

        {/* Content Body: Services List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading && !data && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#0082fb] animate-spin" />
              <p className="text-xs text-slate-400 font-mono">Running live health probes against Google Gen AI & OpenRouter...</p>
            </div>
          )}

          {data && (
            <div className="space-y-2.5">
              {data.services.map((svc) => {
                const isOnline = svc.status === 'online';
                return (
                  <div
                    key={svc.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isOnline 
                        ? 'bg-slate-900/80 border-slate-700/80 hover:border-emerald-500/40' 
                        : 'bg-red-950/20 border-red-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center space-x-2">
                        {isOnline ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs sm:text-sm font-bold text-white">{svc.name}</h4>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                              {svc.model}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{svc.purpose}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md flex items-center space-x-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{svc.latencyMs}ms</span>
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase ${
                          isOnline ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}>
                          {isOnline ? 'ONLINE' : 'ERROR'}
                        </span>
                      </div>
                    </div>

                    {/* Preview / Snippet */}
                    {svc.preview && (
                      <div className="mt-2 p-2 rounded-xl bg-black/50 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center space-x-1.5">
                        <Terminal className="w-3 h-3 text-[#0082fb] shrink-0" />
                        <span className="truncate">{svc.preview}</span>
                      </div>
                    )}

                    {/* Error display */}
                    {svc.error && (
                      <div className="mt-2 p-2 rounded-xl bg-red-950/40 border border-red-500/40 text-[11px] font-mono text-red-300">
                        Error: {svc.error}
                      </div>
                    )}

                    {/* Credential attribution */}
                    <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>Auth: {svc.credentialUsed}</span>
                      <span>Verified: {new Date(data.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-[#0a1122] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>BSA 2023 §63(4) Statutory Compliance Sealed</span>
          </div>
          {data && (
            <span>Total Roundtrip: {data.totalLatencyMs}ms</span>
          )}
        </div>
      </div>
    </div>
  );
};
