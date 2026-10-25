import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { text, language = 'en-IN', speaker } = await req.json().catch(() => ({ text: '' }));

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Text is required for TTS' }, { status: 400 });
    }

    // Strip markdown formatting, URLs, and code blocks for clean pronunciation
    const cleanText = text
      .replace(/[*#_`~>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 320); // Low-latency limit (<500ms synthesis)

    const sarvamKey = process.env.SARVAM_API_KEY || '';
    const elevenKey = process.env.ELEVENLABS_API_KEY || '';

    // ============================================================
    // ENGINE 1: SARVAM AI (Primary Young Indian Multilingual Voice)
    // ============================================================
    if (sarvamKey) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const targetLang = language.includes('hi') ? 'hi-IN' : 'en-IN';
        // Simran is a young, energetic, clear Indian voice; rohan is young male
        const targetSpeaker = speaker === 'male' || speaker === 'rohan' ? 'rohan' : (speaker || 'simran');

        const sarvamRes = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'api-subscription-key': sarvamKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: [cleanText],
            target_language_code: targetLang,
            speaker: targetSpeaker,
            pitch: 0.1,
            pace: 1.12,
            loudness: 1.25,
            speech_sample_rate: 8000,
            enable_preprocessing: true,
            model: 'bulbul:v3',
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (sarvamRes.ok) {
          const sarvamData = await sarvamRes.json();
          if (sarvamData.audios && sarvamData.audios.length > 0) {
            const base64Audio = sarvamData.audios[0];
            const audioBuffer = Buffer.from(base64Audio, 'base64');

            return new Response(audioBuffer, {
              status: 200,
              headers: {
                'Content-Type': 'audio/wav',
                'Content-Length': audioBuffer.byteLength.toString(),
                'x-engine': 'sarvam-ai',
                'Cache-Control': 'public, max-age=3600',
              },
            });
          }
        } else {
          const errText = await sarvamRes.text().catch(() => '');
          console.warn('[Sarvam AI TTS Error, Falling back to ElevenLabs]:', sarvamRes.status, errText);
        }
      } catch (sarvamErr: any) {
        console.warn('[Sarvam AI TTS Exception, Falling back to ElevenLabs]:', sarvamErr?.message);
      }
    }

    // ============================================================
    // ENGINE 2: ELEVENLABS API (Automatic High-Fidelity Young Voice Fallback)
    // ============================================================
    if (elevenKey) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 7000);

        // Sarah (EXAVITQu4vr4xnSDxMaL) - Young, fresh, professional, energetic
        // Or Adam (pNInz6obpgDQGcFmaJgB) if male
        const voiceId = speaker === 'male' ? 'pNInz6obpgDQGcFmaJgB' : 'EXAVITQu4vr4xnSDxMaL';
        const elevenUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;

        const elevenRes = await fetch(elevenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': elevenKey,
            Accept: 'audio/mpeg',
          },
          body: JSON.stringify({
            text: cleanText,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.45,
              similarity_boost: 0.85,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (elevenRes.ok) {
          const audioArrayBuffer = await elevenRes.arrayBuffer();
          return new Response(audioArrayBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'audio/mpeg',
              'Content-Length': audioArrayBuffer.byteLength.toString(),
              'x-engine': 'elevenlabs',
              'Cache-Control': 'public, max-age=3600',
            },
          });
        } else {
          const errText = await elevenRes.text().catch(() => '');
          console.warn('[ElevenLabs Fallback Error]:', elevenRes.status, errText);
        }
      } catch (elevenErr: any) {
        console.warn('[ElevenLabs Fallback Exception]:', elevenErr?.message);
      }
    }

    // ============================================================
    // ENGINE 3: BROWSER NATIVE FALLBACK SIGNAL
    // ============================================================
    return NextResponse.json(
      {
        success: false,
        error: 'Both cloud TTS engines unavailable. Falling back to browser speech synthesis.',
        fallback: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API /api/tts Fatal Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'TTS pipeline failed', fallback: true },
      { status: 500 }
    );
  }
}
