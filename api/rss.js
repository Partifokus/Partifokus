export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { url } = req.query;

  if (!url) return res.status(400).json({ error: "URL required" });

  // Avkoda URL om den är dubbel-enkodad
  const decoded = decodeURIComponent(url);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(decoded, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PartiFokus/1.0; +https://partifokus.se)",
        Accept:
          "application/rss+xml, application/xml, text/xml, application/atom+xml, */*",
        "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res
        .status(502)
        .json({ error: `Upstream ${response.status}: ${decoded}` });
    }

    const text = await response.text();

    // Kontrollera att svaret faktiskt är XML
    if (!text.trim().startsWith("<")) {
      return res.status(502).json({ error: "Response is not XML" });
    }

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=300"); // Cacha 5 min på Vercel edge
    res.status(200).send(text);
  } catch (err) {
    clearTimeout(timeout);
    const msg = err.name === "AbortError" ? "Timeout after 8s" : err.message;
    res.status(500).json({ error: msg });
  }
}