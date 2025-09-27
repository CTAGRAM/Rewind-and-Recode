import demoSentences from './demoSentences.json';

export const demoCycle = (setCaption: (caption: any) => void, setMetrics: (metrics: any) => void) => {
  // Mock: Cycle through demo sentences for testing
  let index = 0;
  const interval = setInterval(() => {
    if (index >= demoSentences.length) {
      clearInterval(interval);
      return;
    }
    const sentence = demoSentences[index];
    setCaption({
      main: sentence.text,
      simplified: sentence.text.toLowerCase(),
      lang: sentence.lang,
      confidence: 95 + Math.random() * 5,
    });
    setMetrics({
      asrConfidence: 95 + Math.random() * 5,
      phraseMatch: 80 + Math.random() * 20,
      latency: 1000 + Math.random() * 2000,
    });
    index++;
  }, 3000); // Change every 3 seconds
};
