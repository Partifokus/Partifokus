export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  try {
    // Hämta senaste omröstningar från riksdagen
    const url = "https://data.riksdagen.se/voteringlista/?rm=2024%2F25&sz=20&utformat=json";
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PartiFokus/1.0; +https://www.partifokus.se)",
        "Accept": "application/json, */*",
        "Referer": "https://www.riksdagen.se/"
      }
    });

    if (!response.ok) {
      // Fallback - returnera mockdata om riksdagen blockerar
      return res.status(200).json({ mock: true, items: getMockVotes() });
    }

    const data = await response.json();
    const votes = data?.voteringlista?.votering || [];

    const formatted = votes.slice(0, 20).map(v => ({
      id: v.votering_id,
      titel: v.titel || v.beteckning || "Riksdagsomröstning",
      datum: v.datum,
      ja: parseInt(v.ja) || 0,
      nej: parseInt(v.nej) || 0,
      avstar: parseInt(v.avstar) || 0,
      franvarande: parseInt(v.franvarande) || 0,
      utfall: parseInt(v.ja) > parseInt(v.nej) ? "bifall" : "avslag",
      beteckning: v.beteckning,
      rm: v.rm
    }));

    res.status(200).json({ mock: false, items: formatted });
  } catch (e) {
    res.status(200).json({ mock: true, items: getMockVotes() });
  }
}

function getMockVotes() {
  return [
    { id:"1", titel:"Sänkt drivmedelsskatt", datum:"2025-03-15", ja:175, nej:174, avstar:0, franvarande:0, utfall:"bifall" },
    { id:"2", titel:"Utökade polisbefogenheter mot gängbrottslighet", datum:"2025-03-10", ja:280, nej:65, avstar:4, franvarande:0, utfall:"bifall" },
    { id:"3", titel:"Höjt förslagsanslag till försvaret", datum:"2025-02-28", ja:290, nej:55, avstar:4, franvarande:0, utfall:"bifall" },
    { id:"4", titel:"Vinstbegränsning i välfärden", datum:"2025-02-20", ja:164, nej:185, avstar:0, franvarande:0, utfall:"avslag" },
    { id:"5", titel:"Slopad karensdag", datum:"2025-02-14", ja:164, nej:185, avstar:0, franvarande:0, utfall:"avslag" },
  ];
}