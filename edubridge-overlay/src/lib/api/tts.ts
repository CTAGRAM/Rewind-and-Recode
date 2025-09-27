export const tts = async (text: string, lang: string): Promise<string> => {
  // Mock TTS implementation - returns a data URL for audio
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency
  // In real impl, use Web Speech API or external service
  return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dyvmwh'; // Mock base64 audio
};
