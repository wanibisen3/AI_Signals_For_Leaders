export type OpenAIClientOptions = {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
};

export async function generateWithOpenAI(prompt: string, options: OpenAIClientOptions = {}) {
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      model: options.model,
      temperature: options.temperature,
      maxOutputTokens: options.maxOutputTokens
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data as { text: string; raw: unknown };
}
