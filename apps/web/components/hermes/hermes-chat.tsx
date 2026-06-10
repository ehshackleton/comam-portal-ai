'use client';

import { HermesChatCore } from './hermes-chat-core';

export function HermesChat({ contactEmail }: { contactEmail: string }) {
  return <HermesChatCore contactEmail={contactEmail} variant="embedded" />;
}
