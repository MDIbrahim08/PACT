import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

export async function GET(req: NextRequest): Promise<NextResponse<DiagnosticsResponse>> {
  const startTime = Date.now();
  const services: ServiceCheckResult[] = [];

  const googleToken = process.env.GOOGLE_ACCESS_TOKEN || process.env.GOOGLE_API_KEY || '';
  const nvidiaKey = process.env.OPENROUTER_NVIDIA_KEY || '';
  const deepseekKey = process.env.OPENROUTER_DEEPSEEK_KEY || '';
  const llamaKey = process.env.OPENROUTER_LLAMA_KEY || '';

  // -------------------------------------------------------------
  // 1. TEST: Google Gemini (Gemini 3.5 / 3.8 Live & Flash)
  // -------------------------------------------------------------
  const geminiStart = Date.now();
  try {
    if (!googleToken) {
      throw new Error('GOOGLE_ACCESS_TOKEN / GOOGLE_API_KEY not configured in .env.local');
    }

    const ai = new GoogleGenAI({ apiKey: googleToken });
    const res = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: 'Respond with exactly: "Gemini 3.8 Live Online"',
    });

    const text = res.text?.trim() || 'Gemini Live Connected';
    services.push({
      id: 'gemini',
      name: 'Google Gemini Live & Flash',
      model: 'gemini-3.5-flash (@google/genai)',
      purpose: 'Live Voice Streaming & Indian Contract Act Legal Mediation',
      status: 'online',
      latencyMs: Date.now() - geminiStart,
      preview: text.length > 80 ? text.slice(0, 80) + '...' : text,
      credentialUsed: process.env.GOOGLE_ACCESS_TOKEN ? 'GOOGLE_ACCESS_TOKEN' : 'GOOGLE_API_KEY',
    });
  } catch (err: any) {
    services.push({
      id: 'gemini',
      name: 'Google Gemini Live & Flash',
      model: 'gemini-3.5-flash (@google/genai)',
      purpose: 'Live Voice Streaming & Indian Contract Act Legal Mediation',
      status: 'error',
      latencyMs: Date.now() - geminiStart,
      credentialUsed: 'GOOGLE_ACCESS_TOKEN',
      error: err.message || 'Gemini connectivity failed',
    });
  }

  // -------------------------------------------------------------
  // Helper for OpenRouter calls
  // -------------------------------------------------------------
  const callOpenRouter = async (
    id: string,
    name: string,
    model: string,
    purpose: string,
    key: string,
    keyName: string,
    prompt: string
  ): Promise<ServiceCheckResult> => {
    const t0 = Date.now();
    if (!key) {
      return {
        id,
        name,
        model,
        purpose,
        status: 'error',
        latencyMs: 0,
        credentialUsed: keyName,
        error: `${keyName} not configured in .env.local`,
      };
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
          'HTTP-Referer': 'https://pact-msme.in',
          'X-Title': 'Pact Live Diagnostics',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 40,
          temperature: 0.1,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const choice = data.choices?.[0];
      const reply = (choice?.message?.content || choice?.message?.reasoning || 'Model active and verified').trim();

      return {
        id,
        name,
        model,
        purpose,
        status: 'online',
        latencyMs: Date.now() - t0,
        preview: reply.length > 80 ? reply.slice(0, 80) + '...' : reply,
        credentialUsed: keyName,
      };
    } catch (err: any) {
      return {
        id,
        name,
        model,
        purpose,
        status: 'error',
        latencyMs: Date.now() - t0,
        credentialUsed: keyName,
        error: err.message || 'Request failed',
      };
    }
  };

  // -------------------------------------------------------------
  // 2. TEST: NVIDIA Nemotron 70B (Section 10 Pillar Extraction)
  // -------------------------------------------------------------
  const nvidiaResult = await callOpenRouter(
    'nvidia',
    'NVIDIA Nemotron 70B',
    'nvidia/nemotron-3.5-super-vl',
    'Section 10 Contract Pillar Extraction (Offer, Acceptance, Consideration)',
    nvidiaKey,
    'OPENROUTER_NVIDIA_KEY',
    'Confirm Section 10 contract engine status in 5 words.'
  );
  services.push(nvidiaResult);

  // -------------------------------------------------------------
  // 3. TEST: DeepSeek R1 / Reasoning (Legal Ambiguity Analysis)
  // -------------------------------------------------------------
  const deepseekResult = await callOpenRouter(
    'deepseek',
    'DeepSeek Reasoning Engine',
    'deepseek/deepseek-v4.1-flash',
    'Legal Risk Ambiguity Detection (Section 29 Uncertainty & MSMED Act)',
    deepseekKey,
    'OPENROUTER_DEEPSEEK_KEY',
    'Assess commercial risk: Delivery "soon" is legally ambiguous under Section 29.'
  );
  services.push(deepseekResult);

  // -------------------------------------------------------------
  // 4. TEST: Meta Llama 3.3 70B (Diplomatic Nudge Generation)
  // -------------------------------------------------------------
  const llamaResult = await callOpenRouter(
    'llama',
    'Meta Llama 3.3 70B',
    'meta-llama/llama-3.3-70b-instruct',
    'Blame-The-Bot Diplomatic Nudge & WhatsApp Commercial Synthesis',
    llamaKey,
    'OPENROUTER_LLAMA_KEY',
    'Generate a 1-sentence polite WhatsApp nudge for delivery date clarification.'
  );
  services.push(llamaResult);

  // -------------------------------------------------------------
  // 5. TEST: Node.js Web Crypto & HMAC Notary Seal
  // -------------------------------------------------------------
  const cryptoStart = Date.now();
  try {
    const payload = `PACT_BENCHMARK_${Date.now()}`;
    const hash = crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
    const hmac = crypto.createHmac('sha256', 'PACT_GOV_SEAL_KEY_MUMBAI_2026').update(hash).digest('hex');

    services.push({
      id: 'crypto',
      name: 'Node.js Web Crypto & HMAC Notary',
      model: 'Dual-Node SHA-256 + HMAC-SHA256',
      purpose: 'Bharatiya Sakshya Adhiniyam 2023 (§63(4)) Electronic Evidence Sealing',
      status: 'online',
      latencyMs: Date.now() - cryptoStart,
      preview: `SHA-256: ${hash.slice(0, 16)}... | Seal: SEAL-BSA-${hmac.slice(0, 8).toUpperCase()}`,
      credentialUsed: 'Native Node.js crypto engine (Zero Network Latency)',
    });
  } catch (err: any) {
    services.push({
      id: 'crypto',
      name: 'Node.js Web Crypto & HMAC Notary',
      model: 'Dual-Node SHA-256 + HMAC-SHA256',
      purpose: 'Bharatiya Sakshya Adhiniyam 2023 (§63(4)) Electronic Evidence Sealing',
      status: 'error',
      latencyMs: Date.now() - cryptoStart,
      credentialUsed: 'Native crypto engine',
      error: err.message,
    });
  }

  const allOnline = services.every((s) => s.status === 'online');
  const anyOnline = services.some((s) => s.status === 'online');

  const overallStatus = allOnline
    ? 'all_systems_operational'
    : anyOnline
    ? 'partial_degradation'
    : 'error';

  return NextResponse.json({
    success: true,
    overallStatus,
    timestamp: new Date().toISOString(),
    totalLatencyMs: Date.now() - startTime,
    services,
  });
}
