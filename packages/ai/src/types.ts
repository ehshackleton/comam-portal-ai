export type HermesSource = {
  type: 'article' | 'document' | 'institutional';
  id?: string;
  title: string;
};

export type PublicContextResult = {
  context: string;
  sources: HermesSource[];
};

export type HermesChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};
