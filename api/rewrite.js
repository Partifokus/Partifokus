export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
 
  const { url, title } = req.query;
  if (!url) return res.status(400).json({ error: "URL required" });
 
  const GROQ_KEY = process.env.GROQ_API_KEY;
 
  // If no Groq key, return null (frontend shows original summary)
  if (!GROQ_KEY) {
    return res.status(200).json({ text: null, source: "no_key" });
  }
 
  try {
    // First fetch the article content
    const articleRes = await fetch(url, {
      headers: { "User-Agent": "PartiFokus/1.0 (+https://partifokus.se)" }
    });
    const html = await articleRes.text();
 
    // Extract text content (simple approach)
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 3000)
      .trim();
 
    // Rewrite with Groq (Llama 3)
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: "Du är en neutral svensk politisk journalist. Skriv om nyhetsartiklar på klar, faktabaserad svenska. Var neutral och objektiv. Skriv 3-4 stycken. Inkludera inga egna åsikter."
          },
          {
            role: "user",
            content: `Rubrik: ${title}\n\nArtikeln handlar om:\n${text}\n\nSkriv om detta som en kort, neutral nyhetsartikel på svenska (3-4 stycken, max 400 ord).`
          }
        ]
      })
    });
 
    const data = await groqRes.json();
    const rewritten = data.choices?.[0]?.message?.content || null;
 
    return res.status(200).json({ text: rewritten, source: "groq" });
  } catch (error) {
    return res.status(200).json({ text: null, source: "error" });
  }
}