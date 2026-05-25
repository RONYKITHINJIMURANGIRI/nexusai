export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { messages, system } = req.body;

    // 1. Map messages from your frontend into Native Gemini format
    const formattedContents = messages.map(msg => ({
      // Gemini uses "model" instead of "assistant"
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const payload = {
      contents: formattedContents,
    };

    // Add your NexusAI system prompt if it exists
    if (system) {
      payload.systemInstruction = {
        parts: [{ text: system }]
      };
    }

    // 2. Call the Native Gemini endpoint directly
    const apiKey = process.env.GEMINI_API_KEY;
    const geminiReq = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const geminiRes = await geminiReq.json();

    // 3. Catch any Google API errors (like bad keys)
    if (geminiRes.error) {
      console.error("Gemini API Error:", geminiRes.error);
      return res.status(500).json({ error: geminiRes.error.message });
    }

    // 4. Safely extract the AI's text from the native response
    const textResponse = geminiRes.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      console.error("Unexpected Data Structure:", JSON.stringify(geminiRes));
      return res.status(500).json({ error: "Missing text in Google response" });
    }

    // 5. Package it back into the Anthropic shape so your UI doesn't crash
    return res.status(200).json({
      content: [
        { text: textResponse }
      ]
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: error.message });
  }
}