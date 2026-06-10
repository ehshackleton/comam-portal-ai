import { openai } from '@ai-sdk/openai';
import type { CoreMessage } from 'ai';
import { streamText } from 'ai';
import { getAiDefaultModel, getOpenAiApiKey } from './config';
import { buildHermesSystemPrompt } from './prompts/hermes';

export type StreamHermesReplyInput = {
  messages: CoreMessage[];
  contextBlock: string;
  onFinish?: (text: string) => Promise<void> | void;
};

export function streamHermesReply({ messages, contextBlock, onFinish }: StreamHermesReplyInput) {
  const apiKey = getOpenAiApiKey();
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY no configurada');
  }

  return streamText({
    model: openai(getAiDefaultModel()),
    system: buildHermesSystemPrompt(contextBlock),
    messages,
    maxTokens: 1024,
    onFinish: async ({ text }) => {
      await onFinish?.(text);
    },
  });
}
