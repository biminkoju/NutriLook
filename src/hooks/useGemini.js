import {useState} from 'react';

export function useGemini(apiKey) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function lookup(query) {
    const food = query.trim();
    if (!food) return;

    if (!apiKey.trim()) {
      setError('Enter your Gemini API key first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const prompt = `You are a nutritionist. Given the food item "${
        food}", return ONLY a JSON object (no markdown, no backticks) with this exact structure:
{
  "name": "display name of the food",
  "serving": "standard serving size (e.g. 100g or 1 cup)",
  "calories": number,
  "protein": number,
  "fat": number,
  "carbs": number,
  "fiber": number,
  "sugar": number,
  "benefits": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"]
}
All macros in grams. Benefits should be short, factual, and specific to this food. Return ONLY the JSON, nothing else.`;

    try {
      const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${
              apiKey.trim()}`,
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              contents: [{parts: [{text: prompt}]}],
              generationConfig: {temperature: 0.2},
            }),
          });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error?.message || `API error ${res.status}`);
      }

      const data = await res.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setResult(parsed);
    } catch (e) {
      setError(
          e.message ||
          'Something went wrong. Check your API key and food name.');
    } finally {
      setLoading(false);
    }
  }

  return {result, loading, error, lookup};
}