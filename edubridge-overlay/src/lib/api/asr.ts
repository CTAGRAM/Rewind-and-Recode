export const asr = async (blob: Blob, lang: string): Promise<{ text: string; confidence: number; latencyMs: number }> => {
  // Mock ASR implementation
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate latency
  return {
    text: 'Hello, this is a mock transcription.',
    confidence: 0.95,
    latencyMs: 1000
  };
};
