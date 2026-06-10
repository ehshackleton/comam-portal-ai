export function getOpenAiApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY;
}

export function getAiDefaultModel(): string {
  return process.env.AI_DEFAULT_MODEL ?? 'gpt-4o-mini';
}

export function getEmbeddingModel(): string {
  return process.env.AI_EMBEDDING_MODEL ?? 'text-embedding-3-small';
}

export function isPublicAgentEnabled(): boolean {
  return process.env.AI_PUBLIC_AGENT_ENABLED !== 'false';
}

export function getContactEmail(): string {
  return process.env.EMAIL_REPLY_TO ?? 'contacto@comam.cl';
}

export function getConferenceFacts() {
  return {
    year: process.env.CONFERENCE_YEAR ?? '2026',
    city: process.env.CONFERENCE_CITY ?? 'Santiago de Chile',
    name: process.env.CONFERENCE_NAME ?? 'Conferencia COMAM 2026',
    registrationEnabled: process.env.REGISTRATION_ENABLED === 'true',
  };
}
