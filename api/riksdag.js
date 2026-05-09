export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");

  try {
    const rm = req.query.rm || "2024%2F25";
    const sz = req.query.sz || "20";

    // Hämta omröstningslista
    const listUrl = `https://data.riksdagen.se/voteringlista/?rm=${rm}&sz=${sz}&utformat=json`;
    const listRes = await fetch(listUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PartiFokus/1.0; +https://www.partifokus.se)",
        "Accept": "application/json, */*",
        "Referer": "https://www.riksdagen.se/sv/riksdagen/omrostningar-och-beslut/"
      }
    });

    if (!listRes.ok) throw new Error(`List API: ${listRes.status}`);

    const listData = await listRes.json();
    const voteringar = listData?.voteringlista?.votering || [];

    // Om ingen data eller tom titel — använd mockdata
    if (voteringar.length === 0 || !voteringar[0]?.titel) {
      throw new Error("Empty or invalid data from riksdagen");
    }

    // Hämta partiröster för de 10 senaste
    const results = await Promise.all(voteringar.slice(0, 15).map(async v => {
      try {
        const detUrl = `https://data.riksdagen.se/votering/${v.votering_id}/json`;
        const detRes = await fetch(detUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; PartiFokus/1.0)",
            "Accept": "application/json",
            "Referer": "https://www.riksdagen.se/"
          }
        });

        let partiRoster = {};
        if (detRes.ok) {
          const detData = await detRes.json();
          const roster = detData?.votering?.votering_roster?.votering_roster_rad || [];
          // Gruppera per parti
          const grupper = {};
          roster.forEach(r => {
            if (!grupper[r.parti]) grupper[r.parti] = { Ja: 0, Nej: 0, Avstår: 0, Frånvarande: 0 };
            grupper[r.parti][r.rost] = (grupper[r.parti][r.rost] || 0) + 1;
          });
          // Hitta dominant röst per parti
          Object.entries(grupper).forEach(([parti, roster]) => {
            const max = Object.entries(roster).sort((a, b) => b[1] - a[1])[0];
            partiRoster[parti] = max[0];
          });
        }

        return {
          id: v.votering_id,
          titel: v.titel || v.beteckning || "Riksdagsomröstning",
          datum: v.datum,
          ja: parseInt(v.ja) || 0,
          nej: parseInt(v.nej) || 0,
          avstar: parseInt(v.avstar) || 0,
          franvarande: parseInt(v.franvarande) || 0,
          utfall: parseInt(v.ja) > parseInt(v.nej) ? "bifall" : "avslag",
          beteckning: v.beteckning,
          rm: v.rm,
          partiRoster
        };
      } catch {
        return {
          id: v.votering_id,
          titel: v.titel || v.beteckning,
          datum: v.datum,
          ja: parseInt(v.ja) || 0,
          nej: parseInt(v.nej) || 0,
          avstar: parseInt(v.avstar) || 0,
          franvarande: parseInt(v.franvarande) || 0,
          utfall: parseInt(v.ja) > parseInt(v.nej) ? "bifall" : "avslag",
          beteckning: v.beteckning,
          partiRoster: {}
        };
      }
    }));

    res.status(200).json({ mock: false, items: results });
  } catch (e) {
    // Fallback med mockdata
    res.status(200).json({
      mock: true,
      items: [
        { id:"1", titel:"Sänkt drivmedelsskatt", datum:"2026-04-24", ja:175, nej:174, avstar:0, franvarande:0, utfall:"bifall", beteckning:"2025/26:Sk12", partiRoster:{M:"Ja",SD:"Ja",KD:"Ja",L:"Ja",C:"Nej",S:"Nej",V:"Nej",MP:"Nej"} },
        { id:"2", titel:"Utökade polisbefogenheter", datum:"2026-04-10", ja:280, nej:65, avstar:4, franvarande:0, utfall:"bifall", beteckning:"2025/26:JuU15", partiRoster:{M:"Ja",SD:"Ja",KD:"Ja",L:"Ja",C:"Ja",S:"Ja",V:"Nej",MP:"Nej"} },
        { id:"3", titel:"Höjt försvarsanslag", datum:"2026-03-28", ja:290, nej:55, avstar:4, franvarande:0, utfall:"bifall", beteckning:"2025/26:FöU6", partiRoster:{M:"Ja",SD:"Ja",KD:"Ja",L:"Ja",C:"Ja",S:"Ja",V:"Nej",MP:"Avstår"} },
        { id:"4", titel:"Vinstbegränsning i välfärden", datum:"2026-03-15", ja:164, nej:185, avstar:0, franvarande:0, utfall:"avslag", beteckning:"2025/26:SoU8", partiRoster:{M:"Nej",SD:"Nej",KD:"Nej",L:"Nej",C:"Nej",S:"Ja",V:"Ja",MP:"Ja"} },
        { id:"5", titel:"Slopad karensdag", datum:"2026-02-20", ja:164, nej:185, avstar:0, franvarande:0, utfall:"avslag", beteckning:"2025/26:SfU9", partiRoster:{M:"Nej",SD:"Nej",KD:"Nej",L:"Nej",C:"Nej",S:"Ja",V:"Ja",MP:"Ja"} },
      ]
    });
  }
}