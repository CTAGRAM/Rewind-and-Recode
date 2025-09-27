export const transform = async (text: string, lang: string): Promise<{ simplified: string; translated: string }> => {
  // Mock transform for hackathon/demo; real: POST to /api/transform
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000)); // Simulate 0.5-1.5s

  // Simple mock: simplify by shortening, translate to English if non-en
  let simplified = text.replace(/[^\w\s]/g, '').split(' ').slice(0, 8).join(' ').toLowerCase();
  if (simplified.length < 10) simplified = 'Simple version of the text.';

  let translated = text;
  if (lang === 'hi-IN') {
    translated = 'Translated to English: ' + simplified; // Mock
  } else if (lang === 'mr-IN') {
    translated = 'English translation: ' + simplified; // Mock
  } else {
    translated = simplified.charAt(0).toUpperCase() + simplified.slice(1);
  }

  return { simplified, translated };
};
