export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { messages, system } = req.body;

    // 1. Format messages for Gemini's endpoint
    const formattedMessages = [];
    if (system) {
      formattedMessages.push({ role: 'system', content: system });
    }
    if (messages) {
      formattedMessages.push(...messages);
    }

    // 2. Call Google Gemini
    const geminiReq = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gemini-1.5-flash',
        messages: formattedMessages
      })
    });

    const geminiRes = await geminiReq.json();

    if (geminiRes.error) {
      console.error("Gemini API Error:", geminiRes.error);
      return res.status(500).json({ error: geminiRes.error.message });
    }

    // 3. Return the exact Anthropic format that your frontend expects
    return res.status(200).json({
      content: [
        { text: geminiRes.choices[0].message.content }
      ]
    });

  } catch (error) {
    console.error("Proxy Error:", error);
    return res.status(500).json({ error: error.message });
  }
}