export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  
  try {
    // We use Gemini's OpenAI-compatible endpoint here
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gemini-1.5-flash", 
        messages: req.body.messages
      })
    });

    const data = await response.json();

    // We reformat Gemini's answer to look exactly like Anthropic's
    // so your NexusAI frontend doesn't break!
    res.status(200).json({
      content: [
        { text: data.choices[0].message.content }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from Gemini" });
  }
}