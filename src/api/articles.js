import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");

  const { method } = req;

  if (method === "GET") {
    const { category, party, limit = 8 } = req.query;

    let query = supabase
      .from("articles")
      .select("*")
      .order("pub_date", { ascending: false })
      .limit(parseInt(limit));

    if (category) query = query.eq("category", category);
    if (party) query = query.contains("parties", [party]);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (method === "POST") {
    const articles = req.body;
    if (!Array.isArray(articles)) return res.status(400).json({ error: "Expected array" });

    for (const article of articles) {
      await supabase.from("articles").upsert({
        id: article.id,
        title: article.title,
        description: article.description,
        link: article.link,
        pub_date: article.pubDate,
        source: article.source,
        parties: article.parties || [],
        party: article.party || null,
        category: article.category,
        img_seed: article.imgSeed || 0,
      }, { onConflict: "id" });
    }

    // Keep only 8 per category
    const categories = [...new Set(articles.map(a => a.category))];
    for (const cat of categories) {
      const { data } = await supabase
        .from("articles")
        .select("id")
        .eq("category", cat)
        .order("pub_date", { ascending: false });

      if (data && data.length > 8) {
        const toDelete = data.slice(8).map(a => a.id);
        await supabase.from("articles").delete().in("id", toDelete);
      }
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}