export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { endpoint, rm, sz } = req.query;

  const ALLOWED = ["kalender", "voteringlista"];
  if (!ALLOWED.includes(endpoint)) {
    return res.status(400).json({ error: "Ogiltigt endpoint" });
  }

  const riksmote = rm || "2025/26";
  const storlek  = sz || "10";

  const urls = {
    kalender:      `https://data.riksdagen.se/kalender/?format=json`,
    voteringlista: `https://data.riksdagen.se/voteringlista/?rm=${encodeURIComponent(riksmote)}&sz=${storlek}&utformat=json`,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(urls[endpoint], {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PartiFokus/1.0; +https://partifokus.se)",
        Accept: "application/json",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(502).json({ error: `Riksdagen svarade med ${response.status}` });
    }

    const data = await response.json();
    res.setHeader("Cache-Control", "public, s-maxage=300");
    res.status(200).json(data);
  } catch (err) {
    clearTimeout(timeout);
    const msg = err.name === "AbortError" ? "Timeout efter 8s" : err.message;
    res.status(500).json({ error: msg });
  }
}