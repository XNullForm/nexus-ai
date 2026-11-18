// Vercel serverless function. Keep the API key in Vercel Environment Variables.
const ALLOWED_MODELS = new Set(["gpt-4o-mini", "gpt-4.1-mini"]);
module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(503).json({ error: "AI service is not configured yet." });
  try {
    const body = req.body || {};
    const model = ALLOWED_MODELS.has(body.model) ? body.model : "gpt-4o-mini";
    if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 30) {
      return res.status(400).json({ error: "Please send a valid conversation." });
    }
    const messages = body.messages.map(m => {
      if (!m || !["user", "assistant"].includes(m.role) || typeof m.content !== "string") throw new Error("Invalid message format.");
      return { role: m.role, content: m.content.slice(0, 12000) };
    });
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: [{ role: "system", content: "You are NEXUS AI, a helpful, honest, thoughtful assistant. Be clear and age-appropriate. Never claim to have used tools you did not use." }, ...messages], temperature: 0.7 })
    });
    const result = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({ error: result.error?.message || "AI provider request failed." });
    const reply = result.choices?.[0]?.message?.content;
    if (!reply) return res.status(502).json({ error: "The AI provider returned an empty response." });
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Invalid request." });
  }
};