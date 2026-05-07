export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");

  const API_KEY = process.env.YOUTUBE_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "API key missing" });

  const { channelId, type } = req.query;

  try {
    if (type === "live") {
      // Kolla om kanalen sänder live just nu
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${API_KEY}`;
      const r = await fetch(url);
      const data = await r.json();
      const items = data.items || [];
      return res.status(200).json({ live: items.length > 0, videoId: items[0]?.id?.videoId || null });
    }

    if (type === "latest") {
      // Hämta senaste videon från kanalen
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=1&key=${API_KEY}`;
      const r = await fetch(url);
      const data = await r.json();
      const item = data.items?.[0];
      if (!item) return res.status(200).json({ videoId: null });
      return res.status(200).json({
        videoId: item.id.videoId,
        title: item.snippet.title,
        published: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails?.medium?.url
      });
    }

    if (type === "channels") {
      // Kolla live-status för flera kanaler samtidigt
      const channels = [
        { namn: "SVT Nyheter", id: "UCN9NXaK7CzN4qw0pKAu2KSw" },
        { namn: "Riksdagen", id: "UCsyq5TikOg0MDexH3Pqcx4w" },
        { namn: "Socialdemokraterna", id: "UCVnEHqg4pTcFqI6Q4vrUOkw" },
        { namn: "Moderaterna", id: "UCzKoIJxAe4h7qeUfBSGE7mg" },
        { namn: "Sverigedemokraterna", id: "UCrpZ8nKB0FjhCGKSC2dkPZg" },
      ];

      const results = await Promise.all(channels.map(async ch => {
        try {
          const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${ch.id}&eventType=live&type=video&key=${API_KEY}`;
          const r = await fetch(url);
          const data = await r.json();
          const live = (data.items || []).length > 0;
          const videoId = data.items?.[0]?.id?.videoId || null;
          return { ...ch, live, videoId };
        } catch {
          return { ...ch, live: false, videoId: null };
        }
      }));

      return res.status(200).json({ channels: results });
    }

    res.status(400).json({ error: "Invalid type" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}