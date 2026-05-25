export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  
  try {
    // 1. Grab your NexusAI payload (including your custom system prompt)
    const { messages, system, temperature } = req.body;

    let openAiMessages = [];
    
    // 2. If your frontend sends the NexusAI persona, format it for Gemini
    if (system) {
      openAiMessages.push({ role: "system", content: system });
    }
    
    // 3. Add the rest of the user/assistant chat history
    if (messages && messages.length > 0) {
      openAiMessages = [...openAiMessages, ...messages.map(m => ({
        role: m.role,
        content: m.content
      }))];
    }

    // 4. Send it to the free Gemini engine
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gemini-1.5-flash", 
        messages: openAiMessages,
        temperature: temperature || 0.7,
      })
    });

    const data = await response.json();

    // 5. Catch any errors so we can actually see them in Vercel logs
    if (data.error) {
      console.error("Gemini Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    // 6. Repackage the answer to look EXACTLY like Anthropic's Claude
    res.status(200).json({
      id: "msg_gemini_mock",
      type: "message",
      role: "assistant",
      model: "claude-mock",
      content: [
        { 
          type: "text", 
          text: data.choices[0].message.content 
        }
      ]
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
}