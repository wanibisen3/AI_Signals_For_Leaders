type GenerateContentRequest = {
  prompt?: string;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
};

const DEFAULT_MODEL = 'gpt-4o-mini';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfiguration: missing OPENAI_API_KEY' });
  }

  const body: GenerateContentRequest = (() => {
    if (typeof req.body !== 'string') return req.body;
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  })();

  const prompt = body?.prompt?.trim();
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const model = body.model || DEFAULT_MODEL;
  const temperature = body.temperature ?? 0.4;
  const maxTokens = body.maxOutputTokens ?? 1024;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || 'OpenAI request failed'
      });
    }

    const text = data?.choices?.[0]?.message?.content?.trim?.() || '';

    return res.status(200).json({
      text,
      raw: data
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return res.status(500).json({ error: message });
  }
}
