import { env } from '../config/env.js';

export async function checkOllamaHealth() {
  try {
    const res = await fetch(`${env.ollamaBaseUrl}/api/tags`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return { ok: false, reason: `Ollama responded with status ${res.status}` };
    const data = await res.json();
    const models = (data.models || []).map((m) => m.name);
    const hasModel = models.some((m) => m === env.ollamaModel || m.startsWith(`${env.ollamaModel}:`));
    return { ok: true, models, hasModel };
  } catch (err) {
    return { ok: false, reason: 'Could not reach Ollama at ' + env.ollamaBaseUrl };
  }
}

// messages: [{role: 'user'|'assistant', content: string}]
export async function chatWithOllama(systemPrompt, messages) {
  const res = await fetch(`${env.ollamaBaseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: env.ollamaModel,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      stream: false,
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Ollama request failed (${res.status}): ${text || 'no details'}`);
  }

  const data = await res.json();
  if (!data?.message?.content) {
    throw new Error('Ollama returned an unexpected response shape.');
  }
  return data.message.content;
}
