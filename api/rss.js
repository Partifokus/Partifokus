export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url" });

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PartiFokus/1.0; +https://www.partifokus.se)",
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
        "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
        "Referer": "https://www.google.com/"
      },
      redirect: "follow"
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream error: ${response.status}` });
    }

    const text = await response.text();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(text);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}