import { useState, useEffect } from "react";

const PARTIES = [
  { id: "all", name: "Alla partier",        short: "ALLA", color: "#1a1a1a", bg: "#e8e8e8" },
  { id: "M",   name: "Moderaterna",         short: "M",   color: "#fff",    bg: "#52BDEC" },
  { id: "SD",  name: "Sverigedemokraterna", short: "SD",  color: "#1a1a1a", bg: "#DDCF00" },
  { id: "KD",  name: "Kristdemokraterna",   short: "KD",  color: "#fff",    bg: "#005B8E" },
  { id: "L",   name: "Liberalerna",         short: "L",   color: "#fff",    bg: "#006AB3" },
  { id: "C",   name: "Centerpartiet",       short: "C",   color: "#fff",    bg: "#009933" },
  { id: "S",   name: "Socialdemokraterna",  short: "S",   color: "#fff",    bg: "#EE2020" },
  { id: "V",   name: "Vänsterpartiet",      short: "V",   color: "#fff",    bg: "#AF0000" },
  { id: "MP",  name: "Miljöpartiet",        short: "MP",  color: "#fff",    bg: "#53A318" },
];

const TABS = [
  { id: "nyheter",   label: "Nyheter" },
  { id: "press",     label: "Pressmeddelanden" },
  { id: "riksdagen", label: "Riksdagen" },
  { id: "ledamoter", label: "Ledamöter" },
  { id: "opinion",   label: "Opinion" },
];

const PARTY_KEYWORDS = {
  M:  ["moderaterna", "ulf kristersson", "kristersson"],
  SD: ["sverigedemokraterna", "jimmie åkesson", "åkesson"],
  KD: ["kristdemokraterna", "ebba busch"],
  L:  ["liberalerna", "johan pehrson", "pehrson"],
  C:  ["centerpartiet", "muharrem demirok", "demirok"],
  S:  ["socialdemokraterna", "magdalena andersson", "sossarna"],
  V:  ["vänsterpartiet", "nooshi dadgostar", "dadgostar"],
  MP: ["miljöpartiet", "per bolund", "märta stenevi", "stenevi"],
};

const MOCK_NEWS = [
  { id: "n1", title: "Kristersson: Regeringen satsar på fler poliser", description: "Statsminister Ulf Kristersson presenterade en satsning på 2 000 fler poliser.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 18).toISOString(), source: "SVT", parties: ["M"] },
  { id: "n2", title: "Åkesson: SD kräver hårdare gränskontroller", description: "Sverigedemokraternas partiledare kräver skärpta regler för asylsökande.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 45).toISOString(), source: "Aftonbladet", parties: ["SD"] },
  { id: "n3", title: "Ebba Busch: Familjen måste stå i centrum", description: "Kristdemokraternas partiledare presenterade ett nytt familjepolitiskt paket.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 90).toISOString(), source: "DN", parties: ["KD"] },
  { id: "n4", title: "Liberalerna kräver utredning om AI i skolan", description: "Johan Pehrson presenterade ett skolpaket med fokus på digital kompetens.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 120).toISOString(), source: "SR", parties: ["L"] },
  { id: "n5", title: "Centerpartiet: Jordbruket kvävs av regelkrångel", description: "Muharrem Demirok kräver avreglering för att stärka svenska bönder.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 160).toISOString(), source: "Expressen", parties: ["C"] },
  { id: "n6", title: "Socialdemokraterna vill återinföra värnskatten", description: "Partiet presenterar ekonomiskt alternativ för höginkomsttagare.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 200).toISOString(), source: "SVT", parties: ["S"] },
  { id: "n7", title: "Vänsterpartiet vill stoppa vinstuttag i välfärden", description: "Nooshi Dadgostar presenterar lagförslag om förbud mot vinstuttag.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 240).toISOString(), source: "DN", parties: ["V"] },
  { id: "n8", title: "Miljöpartiet kräver stopp för ny kärnkraft", description: "Per Bolund och MP avvisar regeringens planer som för dyra.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 280).toISOString(), source: "SR", parties: ["MP"] },
  { id: "n9", title: "Moderaterna och KD oeniga om skolpengssystemet", description: "Intern spricka i Tidöalliansen om friskolors vinstuttag.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 320).toISOString(), source: "Aftonbladet", parties: ["M", "KD"] },
  { id: "n10", title: "S och V samlar oppositionen kring ny bostadspolitik", description: "Gemensamt program kräver återinförd hyresreglering i storstäderna.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 360).toISOString(), source: "SVT", parties: ["S", "V"] },
];

const MOCK_PRESS = [
  { id: "p1", title: "Moderaterna presenterar ny jobbpolitik för 2026", description: "M vill sänka arbetsgivaravgifter och förenkla anställningsregler.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(), source: "Moderaterna", party: "M" },
  { id: "p2", title: "Socialdemokraterna: Välfärden ska inte säljas ut", description: "S presenterar valmanifest med fokus på offentlig välfärd.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 60).toISOString(), source: "Socialdemokraterna", party: "S" },
  { id: "p3", title: "SD: Ge polisen mer befogenheter mot gängkriminalitet", description: "Sverigedemokraterna lägger fram trygghetsprogram med utökad polismakt.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 100).toISOString(), source: "Sverigedemokraterna", party: "SD" },
  { id: "p4", title: "KD kräver stärkt barnpolitik och fler familjecentraler", description: "Kristdemokraterna presenterar familjepaket med fokus på tidiga insatser.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 140).toISOString(), source: "Kristdemokraterna", party: "KD" },
  { id: "p5", title: "Liberalerna: Skolan ska prioriteras i nästa budget", description: "L vill öronmärka 5 miljarder extra till skolan i 2027 års budget.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 180).toISOString(), source: "Liberalerna", party: "L" },
  { id: "p6", title: "Centerpartiet: Förenkla för landsbygdsföretagare", description: "C presenterar 12-punktsprogram för stärkt företagande utanför storstäderna.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 220).toISOString(), source: "Centerpartiet", party: "C" },
  { id: "p7", title: "Vänsterpartiet: Inför sex timmars arbetsdag", description: "V lyfter frågan om kortare arbetstid med bibehållen lön.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 260).toISOString(), source: "Vänsterpartiet", party: "V" },
  { id: "p8", title: "Miljöpartiet kräver klimatlag med bindande mål", description: "MP presenterar lagförslag som tvingar regeringen att nå klimatmålen.", link: "#", pubDate: new Date(Date.now() - 1000 * 60 * 300).toISOString(), source: "Miljöpartiet", party: "MP" },
];

const MOCK_VOTES = [
  { id: "v1", titel: "Sänkt skatt för pensionärer", datum: "2026-04-24", ja: 234, nej: 115, beteckning: "2025/26:Sk12", parter: [{ p: "M", r: "Ja" }, { p: "SD", r: "Ja" }, { p: "KD", r: "Ja" }, { p: "L", r: "Ja" }, { p: "C", r: "Ja" }, { p: "S", r: "Nej" }, { p: "V", r: "Nej" }, { p: "MP", r: "Nej" }] },
  { id: "v2", titel: "Utökat stöd till kommuner för välfärd", datum: "2026-04-23", ja: 178, nej: 171, beteckning: "2025/26:Fi8", parter: [{ p: "M", r: "Nej" }, { p: "SD", r: "Nej" }, { p: "KD", r: "Nej" }, { p: "L", r: "Nej" }, { p: "C", r: "Nej" }, { p: "S", r: "Ja" }, { p: "V", r: "Ja" }, { p: "MP", r: "Ja" }] },
  { id: "v3", titel: "Skärpt straff för gängkriminalitet", datum: "2026-04-22", ja: 289, nej: 60, beteckning: "2025/26:Ju5", parter: [{ p: "M", r: "Ja" }, { p: "SD", r: "Ja" }, { p: "KD", r: "Ja" }, { p: "L", r: "Ja" }, { p: "C", r: "Ja" }, { p: "S", r: "Ja" }, { p: "V", r: "Nej" }, { p: "MP", r: "Nej" }] },
  { id: "v4", titel: "Förbud mot vinstuttag i välfärden", datum: "2026-04-21", ja: 115, nej: 234, beteckning: "2025/26:So3", parter: [{ p: "M", r: "Nej" }, { p: "SD", r: "Nej" }, { p: "KD", r: "Nej" }, { p: "L", r: "Nej" }, { p: "C", r: "Nej" }, { p: "S", r: "Ja" }, { p: "V", r: "Ja" }, { p: "MP", r: "Ja" }] },
  { id: "v5", titel: "Ny kärnkraftslag", datum: "2026-04-20", ja: 221, nej: 128, beteckning: "2025/26:N2", parter: [{ p: "M", r: "Ja" }, { p: "SD", r: "Ja" }, { p: "KD", r: "Ja" }, { p: "L", r: "Ja" }, { p: "C", r: "Ja" }, { p: "S", r: "Nej" }, { p: "V", r: "Nej" }, { p: "MP", r: "Nej" }] },
];

const MOCK_DEBATES = [
  { id: "d1", titel: "Frågestund med statsministern", datum: "2026-04-29", tid: "14:00", typ: "Frågestund" },
  { id: "d2", titel: "Debatt om budgetpropositionen 2027", datum: "2026-04-30", tid: "09:00", typ: "Debatt" },
  { id: "d3", titel: "Interpellationsdebatt om klimatpolitiken", datum: "2026-05-05", tid: "13:00", typ: "Interpellation" },
  { id: "d4", titel: "Utskottssammanträde: Socialförsäkringsutskottet", datum: "2026-05-06", tid: "10:00", typ: "Utskott" },
  { id: "d5", titel: "Debatt om migrationslagen", datum: "2026-05-07", tid: "11:00", typ: "Debatt" },
];

const MOCK_MEMBERS = [
  { id: "m1",  namn: "Ulf Kristersson",    parti: "M",  valkrets: "Stockholms län" },
  { id: "m2",  namn: "Jimmie Åkesson",     parti: "SD", valkrets: "Jönköpings län" },
  { id: "m3",  namn: "Ebba Busch",         parti: "KD", valkrets: "Uppsala län" },
  { id: "m4",  namn: "Johan Pehrson",      parti: "L",  valkrets: "Örebro län" },
  { id: "m5",  namn: "Muharrem Demirok",   parti: "C",  valkrets: "Östergötlands län" },
  { id: "m6",  namn: "Magdalena Andersson",parti: "S",  valkrets: "Skåne läns västra" },
  { id: "m7",  namn: "Nooshi Dadgostar",   parti: "V",  valkrets: "Stockholms kommun" },
  { id: "m8",  namn: "Märta Stenevi",      parti: "MP", valkrets: "Skåne läns södra" },
  { id: "m9",  namn: "Anna Kinberg Batra", parti: "M",  valkrets: "Stockholms kommun" },
  { id: "m10", namn: "Anders Ygeman",      parti: "S",  valkrets: "Stockholms kommun" },
  { id: "m11", namn: "Elisabeth Svantesson",parti: "M", valkrets: "Örebro län" },
  { id: "m12", namn: "Per Bolund",         parti: "MP", valkrets: "Stockholms kommun" },
];

const MOCK_POLLS = [
  { id: "o1", datum: "April 2026", källa: "Novus", M: 19.2, SD: 20.1, KD: 5.8, L: 4.9, C: 6.2, S: 31.4, V: 7.1, MP: 5.3 },
  { id: "o2", datum: "Mars 2026",  källa: "Sifo",  M: 18.8, SD: 19.6, KD: 5.5, L: 5.1, C: 6.5, S: 32.1, V: 6.9, MP: 5.5 },
  { id: "o3", datum: "Feb 2026",   källa: "Novus", M: 20.1, SD: 18.9, KD: 5.6, L: 4.8, C: 6.8, S: 31.0, V: 7.3, MP: 5.5 },
  { id: "o4", datum: "Jan 2026",   källa: "SKOP",  M: 19.5, SD: 19.2, KD: 5.4, L: 5.2, C: 6.3, S: 31.8, V: 7.0, MP: 5.6 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getParty(id) {
  return PARTIES.find(p => p.id === id);
}

function detectParties(text) {
  const lower = text.toLowerCase();
  return Object.keys(PARTY_KEYWORDS).filter(k =>
    PARTY_KEYWORDS[k].some(kw => lower.includes(kw))
  );
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "just nu";
  if (diff < 3600) return Math.floor(diff / 60) + " min";
  if (diff < 86400) return Math.floor(diff / 3600) + " tim";
  return Math.floor(diff / 86400) + " dagar";
}

async function fetchRSS(src) {
  try {
    const url = "/api/rss?url=" + encodeURIComponent(src.url);
    const res = await fetch(url);
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const items = Array.from(xml.querySelectorAll("item"));
    return items.slice(0, 20).map(item => ({
      id: item.querySelector("guid")?.textContent || item.querySelector("link")?.textContent || "",
      title: item.querySelector("title")?.textContent || "",
      description: (item.querySelector("description")?.textContent || "").replace(/<[^>]+>/g, "").slice(0, 90),
      link: item.querySelector("link")?.textContent || "#",
      pubDate: item.querySelector("pubDate")?.textContent || "",
      source: src.name,
      party: src.party || null,
      parties: src.party ? [src.party] : detectParties((item.querySelector("title")?.textContent || "") + " " + (item.querySelector("description")?.textContent || "")),
    }));
  } catch (e) {
    return [];
  }
}
      id: item.guid || item.link,
      title: item.title || "",
      description: (item.description || "").replace(/<[^>]+>/g, "").slice(0, 90),
      link: item.link || "#",
      pubDate: item.pubDate,
      source: src.name,
      party: src.party || null,
      parties: src.party ? [src.party] : detectParties((item.title || "") + " " + (item.description || "")),
    }));
  } catch (e) {
    return [];
  }
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function Badge({ id, large }) {
  const p = getParty(id);
  if (!p) return null;
  return (
    <span style={{
      display: "inline-block",
      padding: large ? "3px 8px" : "1px 6px",
      borderRadius: 2,
      fontSize: large ? 11 : 10,
      fontWeight: 700,
      background: p.bg,
      color: p.color,
      letterSpacing: "0.3px",
    }}>
      {p.short}
    </span>
  );
}

function AutoTag() {
  return (
    <span style={{
      background: "#1a1a1a", color: "#e8c84a", fontSize: 9,
      padding: "1px 5px", borderRadius: 2, letterSpacing: "1px",
      textTransform: "uppercase", marginLeft: 6, verticalAlign: "middle",
    }}>
      AUTO
    </span>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, borderBottom: "2px solid #1a1a1a", paddingBottom: 8, marginBottom: 24 }}>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700 }}>{title}</div>
      {count !== undefined && (
        <div style={{ fontSize: 12, color: "#888" }}>
          {count} st <AutoTag />
        </div>
      )}
    </div>
  );
}

function ArticleCard({ title, description, link, source, pubDate, parties, party }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={link === "#" ? undefined : link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", background: "#fff",
        border: hovered ? "1px solid #1a1a1a" : "1px solid #e8e8e6",
        boxShadow: hovered ? "3px 3px 0 #1a1a1a" : "none",
        transform: hovered ? "translate(-1px,-1px)" : "none",
        padding: 18, textDecoration: "none", color: "inherit",
        transition: "all 0.15s", cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>{source}</span>
        {pubDate && <span style={{ fontSize: 10, color: "#bbb" }}>· {timeAgo(pubDate)}</span>}
        <span style={{ flex: 1 }} />
        {party && <Badge id={party} large />}
        {parties && parties.map(pid => <Badge key={pid} id={pid} />)}
      </div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>
        {title}
      </div>
      {description && (
        <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>
          {description}…
        </div>
      )}
      <div style={{ fontSize: 11, color: "#aaa", marginTop: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Läs hela på {source} →
      </div>
    </a>
  );
}

function CardGrid({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {items.map(a => <ArticleCard key={a.id} {...a} />)}
    </div>
  );
}

// ─── TAB CONTENTS ─────────────────────────────────────────────────────────────

function NewsTab({ party }) {
  const [articles, setArticles] = useState(MOCK_NEWS);

  useEffect(() => {
    const sources = [
      { name: "SVT", url: "https://www.svt.se/nyheter/rss.xml" },
      { name: "SR", url: "https://api.sr.se/api/rss/program/83" },
      { name: "DN", url: "https://www.dn.se/rss/" },
      { name: "Aftonbladet", url: "https://rss.aftonbladet.se/rss2/small/pages/sections/senastenytt/" },
      { name: "Expressen", url: "https://feeds.expressen.se/nyheter/" },
      { name: "Google News", url: "https://news.google.com/rss/search?q=moderaterna+OR+socialdemokraterna+OR+sverigedemokraterna&hl=sv&gl=SE&ceid=SE:sv" },
      { name: "Google News", url: "https://news.google.com/rss/search?q=centerpartiet+OR+vänsterpartiet+OR+miljöpartiet+OR+kristdemokraterna&hl=sv&gl=SE&ceid=SE:sv" },
    ];
    Promise.allSettled(sources.map(fetchRSS)).then(results => {
      const fetched = results
        .filter(r => r.status === "fulfilled")
        .flatMap(r => r.value)
        .filter(a => a.parties.length > 0);
      const all = [...MOCK_NEWS, ...fetched];
      const seen = new Set();
      const deduped = all.filter(a => {
        const k = a.title.slice(0, 40).toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      deduped.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

      // Max 7 dagar gamla
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const fresh = deduped.filter(a => new Date(a.pubDate) > sevenDaysAgo);

      // Max 15 per parti
      const partyCount = {};
      const limited = fresh.filter(a => {
        return a.parties.every(pid => {
          partyCount[pid] = partyCount[pid] || 0;
          if (partyCount[pid] >= 15) return false;
          partyCount[pid]++;
          return true;
        });
      });

      setArticles(limited.length > 0 ? limited : deduped.slice(0, 100));
    });
  }, []);

  const filtered = party === "all" ? articles : articles.filter(a => a.parties.includes(party));

  return (
    <div>
      <SectionHeader title={party === "all" ? "Alla nyheter" : getParty(party)?.name} count={filtered.length} />
      <CardGrid items={filtered} />
    </div>
  );
}

function PressTab({ party }) {
  const [items, setItems] = useState(MOCK_PRESS);

  useEffect(() => {
    const sources = [
      { name: "Moderaterna", party: "M", url: "https://moderaterna.se/?feed=rss2" },
      { name: "Socialdemokraterna", party: "S", url: "https://www.socialdemokraterna.se/feed" },
      { name: "Sverigedemokraterna", party: "SD", url: "https://sd.se/feed" },
      { name: "Kristdemokraterna", party: "KD", url: "https://kristdemokraterna.se/feed" },
      { name: "Liberalerna", party: "L", url: "https://www.liberalerna.se/feed" },
      { name: "Centerpartiet", party: "C", url: "https://www.centerpartiet.se/feed" },
      { name: "Vänsterpartiet", party: "V", url: "https://www.vansterpartiet.se/feed" },
      { name: "Miljöpartiet", party: "MP", url: "https://www.mp.se/feed" },
    ];
    Promise.allSettled(sources.map(fetchRSS)).then(results => {
      const fetched = results.filter(r => r.status === "fulfilled").flatMap(r => r.value);
      if (fetched.length > 0) {
        const all = [...fetched, ...MOCK_PRESS];
        const seen = new Set();
        const deduped = all.filter(a => {
          const k = a.title.slice(0, 40).toLowerCase();
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
        deduped.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const fresh = deduped.filter(a => new Date(a.pubDate) > sevenDaysAgo);
        const partyCount = {};
        const limited = fresh.filter(a => {
          partyCount[a.party] = partyCount[a.party] || 0;
          if (partyCount[a.party] >= 15) return false;
          partyCount[a.party]++;
          return true;
        });
        setItems(limited.length > 0 ? limited : deduped.slice(0, 80));
      }
    });
  }, []);

  const filtered = party === "all" ? items : items.filter(a => a.party === party);

  return (
    <div>
      <SectionHeader title="Pressmeddelanden" count={filtered.length} />
      <CardGrid items={filtered} />
    </div>
  );
}

function RiksdagenTab() {
  return (
    <div>
      <SectionHeader title="Senaste omröstningar" />
      {MOCK_VOTES.map(v => {
        const total = v.ja + v.nej;
        const jaPct = Math.round((v.ja / total) * 100);
        return (
          <div key={v.id} style={{ background: "#fff", border: "1px solid #e8e8e6", padding: 20, marginBottom: 14 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{v.titel}</div>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#888", marginBottom: 8 }}>
              <span style={{ color: "#2ecc71", fontWeight: 700 }}>✓ Ja: {v.ja}</span>
              <span style={{ color: "#e74c3c", fontWeight: 700 }}>✗ Nej: {v.nej}</span>
              <span style={{ marginLeft: "auto" }}>{v.datum} · {v.beteckning}</span>
            </div>
            <div style={{ height: 10, background: "#f0f0f0", borderRadius: 2, overflow: "hidden", display: "flex", marginBottom: 14 }}>
              <div style={{ width: jaPct + "%", background: "#2ecc71" }} />
              <div style={{ width: (100 - jaPct) + "%", background: "#e74c3c" }} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {v.parter.map(({ p, r }) => (
                <span key={p} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Badge id={p} />
                  <span style={{ fontSize: 11, color: r === "Ja" ? "#2ecc71" : "#e74c3c", fontWeight: 700 }}>{r}</span>
                </span>
              ))}
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 32 }}>
        <SectionHeader title="Kommande debatter i riksdagen" />
        {MOCK_DEBATES.map(d => (
          <div key={d.id} style={{ background: "#fff", border: "1px solid #e8e8e6", padding: "14px 20px", marginBottom: 10, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, color: "#888", minWidth: 70, fontSize: 13 }}>{d.datum.slice(5)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700 }}>{d.titel}</div>
              <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginTop: 2 }}>{d.typ} · {d.tid}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LedamoterTab({ party }) {
  const filtered = party === "all" ? MOCK_MEMBERS : MOCK_MEMBERS.filter(m => m.parti === party);
  const initials = name => name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <div>
      <SectionHeader title="Riksdagsledamöter" count={filtered.length} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
        {filtered.map(m => {
          const p = getParty(m.parti);
          return (
            <div key={m.id} style={{ background: "#fff", border: "1px solid #e8e8e6", padding: 16, textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: p?.bg, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: p?.color, fontWeight: 700, fontFamily: "Georgia, serif", fontSize: 18 }}>{initials(m.namn)}</span>
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{m.namn}</div>
              <div style={{ marginBottom: 5 }}><Badge id={m.parti} large /></div>
              <div style={{ fontSize: 11, color: "#888" }}>{m.valkrets}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, fontSize: 12, color: "#bbb" }}>
        Visar ett urval. Fullständig lista (349 ledamöter) hämtas från riksdagen.se när sajten är live.
      </div>
    </div>
  );
}

function OpinionTab() {
  const latest = MOCK_POLLS[0];
  const pids = ["M", "SD", "KD", "L", "C", "S", "V", "MP"];

  return (
    <div>
      <SectionHeader title="Opinionsmätningar" />

      <div style={{ background: "#fff", border: "1px solid #e8e8e6", padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700 }}>Senaste mätning – {latest.datum}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{latest.källa}</div>
        </div>
        {pids.map(pid => {
          const p = getParty(pid);
          const pct = latest[pid];
          return (
            <div key={pid} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
              <div style={{ width: 36 }}><Badge id={pid} large /></div>
              <div style={{ flex: 1, height: 22, background: "#f0f0f0", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: (pct * 2.8) + "%", height: "100%", background: p?.bg, minWidth: 4 }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, minWidth: 40, textAlign: "right" }}>{pct}%</div>
            </div>
          );
        })}
        <div style={{ marginTop: 14, fontSize: 12, color: "#aaa", borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
          <span style={{ marginRight: 16 }}>Högerblocket: <strong>{(latest.M + latest.SD + latest.KD + latest.L + latest.C).toFixed(1)}%</strong></span>
          <span>Vänsterblocket: <strong>{(latest.S + latest.V + latest.MP).toFixed(1)}%</strong></span>
        </div>
      </div>

      <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, borderBottom: "2px solid #1a1a1a", paddingBottom: 8, marginBottom: 16 }}>Historik</div>
      {MOCK_POLLS.map(poll => (
        <div key={poll.id} style={{ background: "#fff", border: "1px solid #e8e8e6", padding: "14px 20px", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontFamily: "Georgia, serif", fontWeight: 700 }}>{poll.datum}</div>
            <div style={{ fontSize: 11, color: "#888" }}>{poll.källa}</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {pids.map(pid => (
              <span key={pid} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Badge id={pid} />
                <span style={{ fontSize: 12, fontWeight: 700 }}>{poll[pid]}%</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("nyheter");
  const [party, setParty] = useState("all");

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#fafaf8", minHeight: "100vh", color: "#1a1a1a" }}>

      {/* HEADER */}
      <header style={{ background: "#1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid #2a2a2a" }}>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>PartiFokus</div>
            <div style={{ fontSize: 10, color: "#666", letterSpacing: "2px", textTransform: "uppercase", marginTop: 2 }}>Svensk politisk nyhetsöversikt</div>
          </div>
          <div style={{ fontSize: 11, color: "#666", textAlign: "right" }}>
            <div>⚪ Redaktionellt neutral</div>
            <div style={{ color: "#555", marginTop: 2 }}>Uppdateras automatiskt var 5 min</div>
          </div>
        </div>

        {/* PARTY FILTER */}
        <nav style={{ display: "flex", overflowX: "auto", padding: "0 32px", borderBottom: "1px solid #2a2a2a" }}>
          {PARTIES.map(p => (
            <button
              key={p.id}
              onClick={() => setParty(p.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "11px 12px", fontSize: 10, fontWeight: 600,
                letterSpacing: "1px", textTransform: "uppercase",
                color: party === p.id ? "#fff" : "#555",
                borderBottom: party === p.id ? "3px solid #fff" : "3px solid transparent",
                whiteSpace: "nowrap", transition: "color 0.15s",
              }}
            >
              {p.id !== "all" && (
                <span style={{ display: "inline-block", padding: "1px 4px", borderRadius: 2, fontSize: 9, fontWeight: 700, background: p.bg, color: p.color, marginRight: 4 }}>
                  {p.short}
                </span>
              )}
              {p.name}
            </button>
          ))}
        </nav>

        {/* TAB NAV */}
        <nav style={{ display: "flex", background: "#111", padding: "0 32px", overflowX: "auto" }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "10px 16px", fontSize: 12, fontWeight: 600,
                color: tab === t.id ? "#fff" : "#555",
                borderBottom: tab === t.id ? "3px solid #e8c84a" : "3px solid transparent",
                whiteSpace: "nowrap", transition: "color 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* CONTENT */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        {tab === "nyheter"   && <NewsTab party={party} />}
        {tab === "press"     && <PressTab party={party} />}
        {tab === "riksdagen" && <RiksdagenTab />}
        {tab === "ledamoter" && <LedamoterTab party={party} />}
        {tab === "opinion"   && <OpinionTab />}

        {/* FOOTER */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "2px solid #1a1a1a" }}>
          <div style={{ background: "#fff", border: "1px solid #e8e8e6", padding: "18px 22px", marginBottom: 14 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>⚖️ Juridisk information</div>
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>
              PartiFokus äger inte och har inte skapat något redaktionellt innehåll. Alla artiklar tillhör respektive källa och skyddas av upphovsrätten. PartiFokus är en nyhetsaggregator som hämtar offentliga RSS-flöden. Riksdagsdata hämtas via riksdagen.se öppna API. Kontakt: <strong>kontakt@partifokus.se</strong>
            </div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e8e8e6", padding: "18px 22px", marginBottom: 14 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>🏛️ Redaktionell neutralitet</div>
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>
              PartiFokus är partipolitiskt obunden. Alla riksdagspartier behandlas lika. Koppling till partier sker via automatisk nyckelordsmatchning utan mänsklig bedömning.
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#bbb", lineHeight: 1.8, paddingBottom: 32 }}>
            <div><strong style={{ color: "#999" }}>Källor:</strong> SVT · SR · DN · Aftonbladet · Expressen · Google News · Partiernas presskanaler · riksdagen.se API · Novus · Sifo · SKOP</div>
            <div><strong style={{ color: "#999" }}>Utgivare:</strong> PartiFokus – Utgivningsbevis sökt hos MPRT</div>
            <div style={{ marginTop: 4 }}>© {new Date().getFullYear()} PartiFokus. Drivs ideellt.</div>
          </div>
        </div>
      </main>
    </div>
  );
}
