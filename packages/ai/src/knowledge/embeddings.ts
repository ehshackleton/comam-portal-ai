import OpenAI from 'openai';
import { getEmbeddingModel, getOpenAiApiKey } from '../config';

let openaiClient: OpenAI | null = null;

function getClient(): OpenAI {
  const apiKey = getOpenAiApiKey();
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY no configurada');
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }

  return openaiClient;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getClient();
  const response = await client.embeddings.create({
    model: getEmbeddingModel(),
    input: text.slice(0, 8000),
  });

  const vector = response.data[0]?.embedding;
  if (!vector) {
    throw new Error('No se pudo generar embedding');
  }

  return vector;
}
