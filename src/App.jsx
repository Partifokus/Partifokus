import { useState, useEffect } from "react";

const GA_ID = "G-DB7QB8N6BE";
// ── Supabase – fyll i dina uppgifter ──────────────────────────────────────────
const SUPABASE_URL  = "https://lkegqtofaxbxzlxxweew.supabase.co";
const SUPABASE_KEY  = "sb_publishable_ICF5j4eq8IkQC2LuCw41uA_uWLJFAPY";
const STATS_TABLE   = "valkompass_stats";
// ─────────────────────────────────────────────────────────────────────────────
const NAVY = "#0D1B2A";
const BLUE = "#1D4ED8";
const GOLD = "#C9A84C";
const GRAY = "#6B7280";

const CAT_IMAGES = {
  Ekonomi:      ["https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=70","https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&q=70","https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=70","https://images.unsplash.com/photo-1638913662295-9630035ef770?w=600&q=70","https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=70"],
  Migration:    ["https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=70","https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=70","https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=70","https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=70"],
  Klimat:       ["https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=70","https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=600&q=70","https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&q=70","https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=70","https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=70"],
  Kriminalitet: ["https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=600&q=70","https://images.unsplash.com/photo-1453945619913-79ec89a82c51?w=600&q=70","https://images.unsplash.com/photo-1584578043786-4e1e7909f0af?w=600&q=70","https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=70"],
  Sjukvård:     ["https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=70","https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600&q=70","https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=70","https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=70"],
  Skola:        ["https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=70","https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=70","https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=70","https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=70"],
  Bostäder:     ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=70","https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=70","https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&q=70","https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=70"],
};
function getCatImage(cat, seed) { const imgs=CAT_IMAGES[cat]||CAT_IMAGES.Ekonomi; return imgs[seed%imgs.length]; }
const HERO_IMAGE = "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=900&q=80";

const PARTIES = [
  { id:"all", name:"Alla partier",        short:"ALLA", color:"#374151", bg:"#E5E7EB" },
  { id:"M",   name:"Moderaterna",         short:"M",   color:"#fff",    bg:"#52BDEC" },
  { id:"SD",  name:"Sverigedemokraterna", short:"SD",  color:"#1a1a1a", bg:"#DDCF00" },
  { id:"KD",  name:"Kristdemokraterna",   short:"KD",  color:"#fff",    bg:"#005B8E" },
  { id:"L",   name:"Liberalerna",         short:"L",   color:"#fff",    bg:"#006AB3" },
  { id:"C",   name:"Centerpartiet",       short:"C",   color:"#fff",    bg:"#009933" },
  { id:"S",   name:"Socialdemokraterna",  short:"S",   color:"#fff",    bg:"#EE2020" },
  { id:"V",   name:"Vänsterpartiet",      short:"V",   color:"#fff",    bg:"#AF0000" },
  { id:"MP",  name:"Miljöpartiet",        short:"MP",  color:"#fff",    bg:"#53A318" },
];

const PARTY_KEYWORDS = {
  M:  ["moderaterna","ulf kristersson","kristersson"],
  SD: ["sverigedemokraterna","jimmie åkesson","åkesson"],
  KD: ["kristdemokraterna","ebba busch"],
  L:  ["liberalerna","simona mohamsson","mohamsson"],
  C:  ["centerpartiet","elisabeth thand ringqvist","thand ringqvist"],
  S:  ["socialdemokraterna","magdalena andersson","sossarna"],
  V:  ["vänsterpartiet","nooshi dadgostar","dadgostar"],
  MP: ["miljöpartiet","daniel helldén","helldén","amanda lind"],
};

const CATEGORY_KEYWORDS = {
  Ekonomi:      ["skatt","budget","ekonomi","tillväxt","inflation","kronor","miljarder","jobb","lön","arbete"],
  Migration:    ["migration","invandring","asyl","flyktingar","utvisning","gräns","uppehållstillstånd"],
  Klimat:       ["klimat","miljö","utsläpp","koldioxid","förnybar","solenergi","kärnkraft","fossil"],
  Kriminalitet: ["brott","polis","gäng","skjutning","straff","kriminalitet","trygghet","fängelse"],
  Sjukvård:     ["sjukvård","vård","sjukhus","sjuksköterska","läkare","hälsa","patient","region"],
  Skola:        ["skola","utbildning","elev","lärare","betyg","gymnasium","förskola"],
  Bostäder:     ["bostad","hyra","bostadspris","byggande","hyresrätt","bostadsrätt"],
};

const POLITICAL_FILTER = [
  "politik","riksdag","regering","parti","minister","statsminister","opposition","riksdagen",
  "moderaterna","socialdemokraterna","sverigedemokraterna","kristdemokraterna","liberalerna","centerpartiet","vänsterpartiet","miljöpartiet",
  "kristersson","andersson","åkesson","busch","mohamsson","thand","helldén","dadgostar",
  "debatt","motion","proposition","budget","reform","lag ","lagstiftning","valet","val 2026",
  "votering","omröstning","utskott","alliansen","tidöavtalet","koalition","mandate",
  "skattepolitik","välfärden","invandringspolitik","klimatpolitik","kriminalpolitik",
  "riksmötet","kammare","talman","partiledare","partiledning"
];
function isPolitical(t) { const l=(t||"").toLowerCase(); return POLITICAL_FILTER.some(kw=>l.includes(kw)); }

const TABS = [
  { id:"nyheter",      label:"Nyheter" },
  { id:"press",        label:"Pressmeddelanden" },
  { id:"omrostningar", label:"Omröstningar" },
  { id:"ledamoter",    label:"Ledamöter" },
  { id:"opinion",      label:"Opinion" },
  { id:"valkompass",   label:"Valkompass" },
  { id:"politikskola", label:"Politikskola" },
];

// Updated party leaders 2026
const PARTY_LEADERS = [
  { id:"m1",  namn:"Ulf Kristersson",     parti:"M",  valkrets:"Stockholms län",    roll:"Partiledare, statsminister", wiki:"https://sv.wikipedia.org/wiki/Ulf_Kristersson",    foto:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Ulf_Kristersson%2C_Tid%C3%B6_Agreement_2022.jpg/240px-Ulf_Kristersson%2C_Tid%C3%B6_Agreement_2022.jpg" },
  { id:"m2",  namn:"Jimmie Åkesson",      parti:"SD", valkrets:"Jönköpings län",    roll:"Partiledare",                 wiki:"https://sv.wikipedia.org/wiki/Jimmie_%C3%85kesson",  foto:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Jimmie_%C3%85kesson_2022%2C_Tidö_Agreement.jpg/240px-Jimmie_%C3%85kesson_2022%2C_Tidö_Agreement.jpg" },
  { id:"m3",  namn:"Ebba Busch",          parti:"KD", valkrets:"Uppsala län",        roll:"Partiledare",                 wiki:"https://sv.wikipedia.org/wiki/Ebba_Busch",           foto:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ebba_Busch_Thor_2022.jpg/240px-Ebba_Busch_Thor_2022.jpg" },
  { id:"m4",  namn:"Simona Mohamsson",     parti:"L",  valkrets:"Stockholms kommun",  roll:"Partiledare",                 wiki:"https://sv.wikipedia.org/wiki/Simona_Mohamsson",     foto:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Simona_Mohamsson_riksdagen.jpg/240px-Simona_Mohamsson_riksdagen.jpg" },
  { id:"m5",  namn:"Elisabeth Thand Ringqvist", parti:"C", valkrets:"Stockholms län", roll:"Partiledare",                wiki:"https://sv.wikipedia.org/wiki/Elisabeth_Thand_Ringqvist", foto:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Elisabeth_Thand_Ringqvist_riksdagen.jpg/240px-Elisabeth_Thand_Ringqvist_riksdagen.jpg" },
  { id:"m6",  namn:"Magdalena Andersson", parti:"S",  valkrets:"Skåne läns västra",  roll:"Partiledare, f.d. statsminister", wiki:"https://sv.wikipedia.org/wiki/Magdalena_Andersson", foto:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Magdalena_Andersson_2021.jpg/240px-Magdalena_Andersson_2021.jpg" },
  { id:"m7",  namn:"Nooshi Dadgostar",    parti:"V",  valkrets:"Stockholms kommun",  roll:"Partiledare",                 wiki:"https://sv.wikipedia.org/wiki/Nooshi_Dadgostar",     foto:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nooshi_Dadgostar_2020.jpg/240px-Nooshi_Dadgostar_2020.jpg" },
  { id:"m8",  namn:"Daniel Helldén",        parti:"MP", valkrets:"Stockholms kommun",  roll:"Partiledare (språkrör)",       wiki:"https://sv.wikipedia.org/wiki/Daniel_Helld%C3%A9n",   foto:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Daniel_Helld%C3%A9n_riksdagen.jpg/240px-Daniel_Helld%C3%A9n_riksdagen.jpg" },
  { id:"m9",  namn:"Amanda Lind",           parti:"MP", valkrets:"Stockholms läns norra", roll:"Partiledare (språkrör)",      wiki:"https://sv.wikipedia.org/wiki/Amanda_Lind",           foto:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Amanda_Lind_riksdagen.jpg/240px-Amanda_Lind_riksdagen.jpg" },
];

const QUESTIONS = [
  { id:1,  text:"Sverige bör investera i ny kärnkraft som en del av energiomställningen",                    cat:"Klimat",       s:{M:1, SD:1, KD:1, L:1, C:0, S:0, V:-1,MP:-1} },
  { id:2,  text:"Sverige bör införa lagstadgade och bindande mål för utsläppsreduktion",                    cat:"Klimat",       s:{M:-1,SD:-1,KD:0, L:0, C:1, S:0, V:1, MP:1 } },
  { id:3,  text:"Den totala invandringen till Sverige bör reduceras i väsentlig utsträckning",              cat:"Migration",    s:{M:1, SD:1, KD:0, L:-1,C:-1,S:0, V:-1,MP:-1} },
  { id:4,  text:"Möjligheterna att utvisa utländska medborgare som begår brott i Sverige bör utökas",      cat:"Migration",    s:{M:1, SD:1, KD:1, L:0, C:0, S:0, V:-1,MP:-1} },
  { id:5,  text:"Sverige bör ta emot fler kvotflyktingar via UNHCR",                                       cat:"Migration",    s:{M:-1,SD:-1,KD:0, L:1, C:1, S:0, V:1, MP:1 } },
  { id:6,  text:"Privata aktörer bör inte ha rätt att ta ut vinst ur skattefinansierad välfärd",           cat:"Ekonomi",      s:{M:-1,SD:0, KD:-1,L:-1,C:-1,S:1, V:1, MP:1 } },
  { id:7,  text:"Den statliga inkomstskatten bör sänkas för låg- och medelinkomsttagare",                  cat:"Ekonomi",      s:{M:1, SD:0, KD:0, L:1, C:1, S:-1,V:-1,MP:-1} },
  { id:8,  text:"Försvarsanslaget bör ökas ytterligare för att möta säkerhetspolitiska utmaningar",        cat:"Ekonomi",      s:{M:1, SD:1, KD:1, L:1, C:1, S:1, V:-1,MP:0 } },
  { id:9,  text:"Arbetsrätten bör moderniseras för att underlätta för arbetsgivare att anpassa personalstyrkan", cat:"Ekonomi", s:{M:1, SD:0, KD:0, L:1, C:1, S:-1,V:-1,MP:-1} },
  { id:10, text:"Straffen för grova våldsbrott och gängrelaterad brottslighet bör skärpas avsevärt",       cat:"Kriminalitet", s:{M:1, SD:1, KD:1, L:0, C:0, S:1, V:-1,MP:-1} },
  { id:11, text:"Polisen bör ges utökade befogenheter att bekämpa organiserad brottslighet",               cat:"Kriminalitet", s:{M:1, SD:1, KD:1, L:0, C:0, S:0, V:-1,MP:-1} },
  { id:12, text:"Det allmänna sjukvårdssystemet bör ges tydlig prioritet framför privata vårdgivare",      cat:"Sjukvård",     s:{M:-1,SD:0, KD:-1,L:-1,C:-1,S:1, V:1, MP:1 } },
  { id:13, text:"Friskolornas etableringsrätt och det fria skolvalet bör begränsas",                       cat:"Skola",        s:{M:-1,SD:-1,KD:-1,L:-1,C:-1,S:0, V:1, MP:1 } },
  { id:14, text:"Nyproduktion av hyresrätter med kontrollerade hyresnivåer bör subventioneras av staten",  cat:"Bostäder",     s:{M:-1,SD:0, KD:-1,L:-1,C:-1,S:1, V:1, MP:1 } },
];

const FAQ_ITEMS = [
  { q:"Vad är PartiFokus?", a:"PartiFokus är en oberoende politisk nyhetstjänst som samlar all svensk politik på ett ställe. Vi aggregerar nyheter från stora svenska medier neutralt utan politisk vinkling." },
  { q:"Är PartiFokus partipolitiskt bunden?", a:"Nej. PartiFokus är helt partipolitiskt obunden. Alla riksdagspartier behandlas lika. Vi tar inte ställning i politiska frågor." },
  { q:"Varifrån kommer nyheterna?", a:"Vi hämtar nyheter från SVT, Sveriges Radio, DN, Aftonbladet, Expressen, Omni, Google News samt partiernas presskanaler via offentliga RSS-flöden." },
  { q:"Äger PartiFokus artiklarna?", a:"Nej. Alla artiklar tillhör respektive källan. PartiFokus visar rubrik och kort ingress, och länkar alltid till originalkällan." },
  { q:"Hur fungerar valkompassen?", a:"Valkompassen innehåller 14 politiska frågor inom sju ämnesområden. Du svarar Ja, Nej eller Vet ej, och vi jämför dina svar med partiernas ståndpunkter. Tar ungefär 2–3 minuter. Resultatet är ett ungefärligt underlag." },
  { q:"Är omröstningen anonym?", a:"Ja, helt anonym. Vi sparar inga personuppgifter och det går inte att spåra din röst." },
  { q:"Hur uppdateras nyheterna?", a:"Nyheterna uppdateras automatiskt var 5:e minut dygnet runt." },
  { q:"Kan jag kontakta PartiFokus?", a:"Ja! Skicka ett mail till partifokus@gmail.com." },
  { q:"Varför ser jag ibland få nyheter om ett parti?", a:"Det beror på att det inte publicerats många nyheter om det partiet den senaste veckan." },
];

const NEWS_SOURCES = [
  { name:"SVT",         url:"https://www.svt.se/nyheter/rss.xml" },
  { name:"SR",          url:"https://api.sr.se/api/rss/program/83" },
  { name:"DN",          url:"https://www.dn.se/rss/" },
  { name:"Aftonbladet", url:"https://rss.aftonbladet.se/rss2/small/pages/sections/senastenytt/" },
  { name:"Expressen",   url:"https://feeds.expressen.se/nyheter/" },
  { name:"Omni",        url:"https://omni.se/rss" },
  { name:"Google News", url:"https://news.google.com/rss/search?q=moderaterna+OR+socialdemokraterna+OR+sverigedemokraterna&hl=sv&gl=SE&ceid=SE:sv" },
  { name:"Google News", url:"https://news.google.com/rss/search?q=centerpartiet+OR+vänsterpartiet+OR+miljöpartiet+OR+kristdemokraterna&hl=sv&gl=SE&ceid=SE:sv" },
  { name:"Google News", url:"https://news.google.com/rss/search?q=riksdagen+OR+regering+OR+budget+OR+politik+Sverige&hl=sv&gl=SE&ceid=SE:sv" },
  { name:"Google News", url:"https://news.google.com/rss/search?q=migration+Sverige+OR+klimat+Sverige+OR+sjukvård+Sverige&hl=sv&gl=SE&ceid=SE:sv" },
];

const PRESS_SOURCES = [
  { name:"Moderaterna",        party:"M",  url:"https://moderaterna.se/?feed=rss2" },
  { name:"Socialdemokraterna", party:"S",  url:"https://www.socialdemokraterna.se/feed" },
  { name:"Sverigedemokraterna",party:"SD", url:"https://sd.se/feed" },
  { name:"Kristdemokraterna",  party:"KD", url:"https://kristdemokraterna.se/feed" },
  { name:"Liberalerna",        party:"L",  url:"https://www.liberalerna.se/feed" },
  { name:"Centerpartiet",      party:"C",  url:"https://www.centerpartiet.se/feed" },
  { name:"Vänsterpartiet",     party:"V",  url:"https://www.vansterpartiet.se/feed" },
  { name:"Miljöpartiet",       party:"MP", url:"https://www.mp.se/feed" },
];

// Shared poll key
const POLL_KEY = "pf_poll_v5";
const POLL_VOTED_KEY = "pf_voted_v5";

function getPollData() { try { return JSON.parse(localStorage.getItem(POLL_KEY)) || {}; } catch { return {}; } }
function getPollVoted() { return localStorage.getItem(POLL_VOTED_KEY) || null; }

function gp(id) { return PARTIES.find(p => p.id === id); }
function detectParties(t) { const l=t.toLowerCase(); return Object.keys(PARTY_KEYWORDS).filter(k=>PARTY_KEYWORDS[k].some(kw=>l.includes(kw))); }
function detectCategory(t) { const l=t.toLowerCase(); for(const [c,w] of Object.entries(CATEGORY_KEYWORDS)){if(w.some(x=>l.includes(x)))return c;} return "Ekonomi"; }
function timeAgo(d) { const s=Math.floor((Date.now()-new Date(d))/1000); if(s<60)return"just nu"; if(s<3600)return Math.floor(s/60)+" min sedan"; if(s<86400)return Math.floor(s/3600)+" tim sedan"; return Math.floor(s/86400)+" dagar sedan"; }

function cleanText(t) {
  return (t||"")
    .replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
    .replace(/&quot;/g,'"').replace(/&#\d+;/g,"").replace(/&[a-z]+;/g," ")
    .replace(/\s+/g," ").trim();
}

// ── Valkompass-räknare via Supabase ───────────────────────────────────────────
async function incrementValkompasCount() {
  try {
    // Hämta nuvarande värde
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${STATS_TABLE}?id=eq.1`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" }
    });
    const rows = await res.json();
    const current = rows[0]?.completions ?? 0;
    // Räkna upp
    await fetch(`${SUPABASE_URL}/rest/v1/${STATS_TABLE}?id=eq.1`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ completions: current + 1 })
    });
    return current + 1;
  } catch { return null; }
}

async function getValkompasCount() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${STATS_TABLE}?id=eq.1`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    const rows = await res.json();
    return rows[0]?.completions ?? 0;
  } catch { return null; }
}
// ─────────────────────────────────────────────────────────────────────────────

function isHomepageLink(url) {
  try {
    if (!url || url === "#") return true;
    const u = new URL(url);
    return u.pathname === "/" || u.pathname === "";
  } catch { return false; }
}

async function fetchRSS(src) {
  try {
    const res = await fetch("/api/rss?url="+encodeURIComponent(src.url));
    const text = await res.text();
    const xml = new DOMParser().parseFromString(text,"text/xml");
    return Array.from(xml.querySelectorAll("item")).slice(0,50).map((item,i) => {
      const title = cleanText(item.querySelector("title")?.textContent||"");
      const desc = cleanText((item.querySelector("description")?.textContent||"").replace(/<[^>]+>/g,"")).slice(0,130);
      const link = item.querySelector("link")?.textContent||"#";
      return { id:item.querySelector("guid")?.textContent||link, title, description:desc, link, pubDate:item.querySelector("pubDate")?.textContent||"", source:src.name, party:src.party||null, parties:src.party?[src.party]:detectParties(title+" "+desc), category:detectCategory(title+" "+desc), imgSeed:i };
    });
  } catch { return []; }
}

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => { const fn=()=>setMobile(window.innerWidth<768); window.addEventListener("resize",fn); return()=>window.removeEventListener("resize",fn); }, []);
  return mobile;
}

function Badge({ id, large }) {
  const p=gp(id); if(!p)return null;
  return <span style={{display:"inline-block",padding:large?"3px 10px":"2px 7px",borderRadius:4,fontSize:large?12:10,fontWeight:700,background:p.bg,color:p.color}}>{p.short}</span>;
}

function CatTag({ cat, dark }) {
  const c={Ekonomi:"#4F46E5",Migration:"#D97706",Klimat:"#059669",Kriminalitet:"#DC2626",Sjukvård:"#2563EB",Skola:"#7C3AED",Bostäder:"#EA580C"};
  return <span style={{fontSize:11,fontWeight:700,color:dark?"#fff":(c[cat]||GRAY),textTransform:"uppercase",letterSpacing:"1px"}}>{cat}</span>;
}

function openArticle(article) {
  if(article.link&&article.link!=="#") window.open(article.link,"_blank","noopener,noreferrer");
}

// ─── ANIMATED COMPASS SVG ────────────────────────────────────────────────────
function CompassSVG() {
  const partyPids = ["M","SD","S","V","C","MP","KD","L"];
  const radius = 110;
  const cx = 160, cy = 160;
  return (
    <svg viewBox="0 0 320 320" width="260" height="260" style={{display:"block",margin:"0 auto"}}>
      <style>{`
        @keyframes rotate { from{transform-origin:160px 160px;transform:rotate(0deg)}to{transform-origin:160px 160px;transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:0.6}50%{opacity:1} }
        .needle{transform-origin:160px 160px;animation:rotate 8s linear infinite}
        .outer-ring{animation:pulse 3s ease-in-out infinite}
      `}</style>

      {/* Outer decorative ring */}
      <circle cx={cx} cy={cy} r={148} fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="1"/>
      <circle cx={cx} cy={cy} r={144} fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="0.5" strokeDasharray="4 8" className="outer-ring"/>

      {/* Background circle */}
      <circle cx={cx} cy={cy} r={80} fill={NAVY} opacity="0.9"/>
      <circle cx={cx} cy={cy} r={80} fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5"/>

      {/* Compass cardinal points */}
      {[{label:"N",angle:0},{label:"O",angle:90},{label:"S",angle:180},{label:"V",angle:270}].map(({label,angle})=>{
        const rad = (angle-90)*Math.PI/180;
        const x = cx + 95*Math.cos(rad);
        const y = cy + 95*Math.sin(rad);
        return <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="11" fill="rgba(201,168,76,0.6)" fontWeight="700">{label}</text>;
      })}

      {/* Tick marks */}
      {Array.from({length:36},(_,i)=>{
        const angle = (i*10-90)*Math.PI/180;
        const r1 = i%9===0?72:i%3===0?74:76;
        const r2 = 80;
        return <line key={i} x1={cx+r1*Math.cos(angle)} y1={cy+r1*Math.sin(angle)} x2={cx+r2*Math.cos(angle)} y2={cy+r2*Math.sin(angle)} stroke="rgba(201,168,76,0.3)" strokeWidth={i%9===0?1.5:0.5}/>;
      })}

      {/* Party badges around the compass */}
      {partyPids.map((pid,i)=>{
        const angle = (i*(360/partyPids.length)-90)*Math.PI/180;
        const x = cx + radius*Math.cos(angle);
        const y = cy + radius*Math.sin(angle);
        const p = gp(pid);
        return (
          <g key={pid}>
            <circle cx={x} cy={y} r={24} fill={p?.bg||"#ccc"} filter="url(#shadow)"/>
            <circle cx={x} cy={y} r={24} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="800" fill={p?.color||"#fff"}>{p?.short}</text>
          </g>
        );
      })}

      {/* Drop shadow filter */}
      <defs>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
        <filter id="glowfilter">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Compass needle */}
      <g className="needle">
        <polygon points={`${cx},${cy-55} ${cx-5},${cy} ${cx},${cy-10} ${cx+5},${cy}`} fill={GOLD} filter="url(#glowfilter)"/>
        <polygon points={`${cx},${cy+55} ${cx-5},${cy} ${cx},${cy+10} ${cx+5},${cy}`} fill="rgba(255,255,255,0.3)"/>
      </g>

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={7} fill={GOLD}/>
      <circle cx={cx} cy={cy} r={3} fill="#fff"/>
    </svg>
  );
}

// ─── SHARED POLL COMPONENT ────────────────────────────────────────────────────
const SB_POLL_TABLE = "poll_votes";

async function sbFetchVotes() {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${SB_POLL_TABLE}?select=party,votes`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    const rows = await r.json();
    const obj = {};
    (rows||[]).forEach(row => { obj[row.party] = row.votes || 0; });
    return obj;
  } catch { return {}; }
}

async function sbIncrementVote(party) {
  try {
    // Hämta nuvarande
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${SB_POLL_TABLE}?party=eq.${party}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    const rows = await r.json();
    const current = rows[0]?.votes || 0;
    await fetch(`${SUPABASE_URL}/rest/v1/${SB_POLL_TABLE}?party=eq.${party}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ votes: current + 1 })
    });
    return current + 1;
  } catch { return null; }
}

function PollWidget({ compact }) {
  const PP=[{id:"S",label:"Socialdemokraterna"},{id:"SD",label:"Sverigedemokraterna"},{id:"M",label:"Moderaterna"},{id:"V",label:"Vänsterpartiet"},{id:"C",label:"Centerpartiet"},{id:"MP",label:"Miljöpartiet"},{id:"KD",label:"Kristdemokraterna"},{id:"L",label:"Liberalerna"},{id:"ovriga",label:"Övriga partier"},{id:"vetej",label:"Vet ej / Röstar inte"}];
  const [sel,setSel]=useState(null);
  const [voted,setVoted]=useState(getPollVoted);
  const [votes,setVotes]=useState({});

  useEffect(()=>{
    sbFetchVotes().then(v=>{ if(Object.keys(v).length>0) setVotes(v); else setVotes(getPollData()); });
  },[]);

  async function submit(){
    if(!sel||voted)return;
    await sbIncrementVote(sel);
    const fresh = await sbFetchVotes();
    setVotes(fresh);
    setVoted(sel);
    localStorage.setItem(POLL_VOTED_KEY, sel);
  }

  const total=Object.values(votes).reduce((a,b)=>a+b,0);

  if(compact&&!voted){
    return(
      <div>
        <div style={{fontSize:12,color:GRAY,marginBottom:12}}>{total>0?`${total.toLocaleString()} röster`:"Bli den första"} · Anonym</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
          {PP.map(({id,label})=>{const p=gp(id);return(
            <div key={id} onClick={()=>setSel(id)} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 8px",borderRadius:6,border:sel===id?`2px solid ${BLUE}`:"1px solid #E5E7EB",background:sel===id?"#EFF6FF":"#FAFAFA",cursor:"pointer"}}>
              <div style={{width:14,height:14,borderRadius:"50%",border:sel===id?`4px solid ${BLUE}`:"2px solid #D1D5DB",background:"#fff",flexShrink:0}}/>
              {p?<span style={{display:"inline-block",padding:"1px 5px",borderRadius:3,fontSize:10,fontWeight:700,background:p.bg,color:p.color}}>{p.short}</span>:<span style={{fontSize:11,color:"#374151",fontWeight:600}}>{label}</span>}
            </div>
          );})}
        </div>
        <button onClick={submit} disabled={!sel} style={{background:sel?NAVY:"#E5E7EB",color:sel?"#fff":"#9CA3AF",border:"none",borderRadius:8,padding:"9px 20px",fontSize:13,fontWeight:700,cursor:sel?"pointer":"not-allowed"}}>Rösta</button>
      </div>
    );
  }

  if(voted||(compact&&voted)){
    return(
      <div>
        {voted&&<div style={{fontSize:12,color:NAVY,fontWeight:600,marginBottom:10}}>✓ Du röstade: {PP.find(p=>p.id===voted)?.label}</div>}
        <div style={{fontSize:11,color:GRAY,marginBottom:10}}>{total>0?`${total.toLocaleString()} röster totalt`:""}</div>
        {PP.map(({id})=>{const p=gp(id);const pct=total>0?Math.round(((votes[id]||0)/total)*100):0;const isV=voted===id;return(
          <div key={id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <div style={{width:compact?28:36,flexShrink:0}}>{p?<span style={{display:"inline-block",padding:"1px 4px",borderRadius:3,fontSize:10,fontWeight:700,background:p.bg,color:p.color}}>{p.short}</span>:<span style={{fontSize:10,color:"#374151",fontWeight:600}}>{PP.find(x=>x.id===id)?.label||"–"}</span>}</div>
            <div style={{flex:1,height:compact?14:16,background:"#F3F4F6",borderRadius:3,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:isV?GOLD:(p?.bg||"#9CA3AF"),minWidth:2,transition:"width .4s"}}/></div>
            <div style={{width:30,fontSize:11,fontWeight:700,textAlign:"right",color:isV?GOLD:"#374151"}}>{pct}%</div>
          </div>
        );})}
        {compact&&<div style={{marginTop:6,fontSize:10,color:GRAY}}>Anonym · kan inte spåras</div>}
      </div>
    );
  }

  return(
    <div>
      <div style={{fontSize:12,color:GRAY,marginBottom:16}}>{total>0?`${total.toLocaleString()} röster`:"Bli den första att rösta"} · Helt anonym</div>
      {PP.map(({id,label})=>{const p=gp(id);const iS=sel===id;return(
        <div key={id} onClick={()=>setSel(id)} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 12px",borderRadius:8,border:iS?`2px solid ${BLUE}`:"1px solid #E5E7EB",background:iS?"#EFF6FF":"#FAFAFA",cursor:"pointer",marginBottom:6,transition:"all .1s"}}>
          <div style={{width:18,height:18,borderRadius:"50%",border:iS?`5px solid ${BLUE}`:"2px solid #D1D5DB",background:"#fff",flexShrink:0}}/>
          {p&&<span style={{display:"inline-block",padding:"2px 7px",borderRadius:4,fontSize:11,fontWeight:700,background:p.bg,color:p.color,flexShrink:0}}>{p.short}</span>}
          <span style={{fontSize:13,color:iS?NAVY:"#374151",fontWeight:iS?600:400}}>{label}</span>
        </div>
      );})}
      <button onClick={submit} disabled={!sel} style={{marginTop:12,background:sel?NAVY:"#E5E7EB",color:sel?"#fff":"#9CA3AF",border:"none",borderRadius:8,padding:"11px 28px",fontSize:14,fontWeight:700,cursor:sel?"pointer":"not-allowed"}}>Rösta</button>
    </div>
  );
}

// ─── VALKOMPASS ──────────────────────────────────────────────────────────────
function Valkompass() {
  const [answers,setAnswers]=useState({});
  const [result,setResult]=useState(null);
  const [totalCount,setTotalCount]=useState(null);
  const progress=Object.keys(answers).length;
  const currentQ=QUESTIONS.find(q=>answers[q.id]===undefined);

  function answer(qid,val){
    const na={...answers,[qid]:val};
    setAnswers(na);
    if(Object.keys(na).length===QUESTIONS.length){
      const scores={};
      PARTIES.filter(p=>p.id!=="all").forEach(p=>{scores[p.id]=0;});
      QUESTIONS.forEach(q=>{const ua=na[q.id];if(ua===0)return;PARTIES.filter(p=>p.id!=="all").forEach(p=>{scores[p.id]+=ua*(q.s[p.id]||0);});});
      const vals=Object.values(scores),mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
      const norm={};Object.entries(scores).forEach(([pid,sc])=>{norm[pid]=Math.round(((sc-mn)/rng)*100);});
      setResult(Object.entries(norm).sort((a,b)=>b[1]-a[1]));
      // Räkna upp i Supabase
      incrementValkompasCount().then(n=>{ if(n!==null) setTotalCount(n); });
    }
  }

  const catColors={Migration:"#D97706",Klimat:"#059669",Ekonomi:"#4F46E5",Kriminalitet:"#DC2626",Sjukvård:"#2563EB",Skola:"#7C3AED",Bostäder:"#EA580C"};

  if(result){
    const wp=gp(result[0][0]);
    return(
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{background:`linear-gradient(135deg,${NAVY} 0%,#1e3a5f 100%)`,borderRadius:20,padding:40,marginBottom:28,textAlign:"center",boxShadow:"0 20px 60px rgba(13,27,42,0.4)"}}>
          <div style={{fontSize:11,color:GOLD,letterSpacing:"3px",textTransform:"uppercase",marginBottom:16}}>🎉 Ditt resultat</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:700,color:"#fff",marginBottom:20,lineHeight:1.3}}>Du passar bäst med<br/><span style={{color:GOLD}}>{wp?.name}</span></div>
          <div style={{width:72,height:72,borderRadius:"50%",background:wp?.bg,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 0 4px rgba(255,255,255,0.2)"}}>
            <span style={{color:wp?.color,fontWeight:700,fontSize:26}}>{wp?.short}</span>
          </div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>Baserat på dina svar på {QUESTIONS.length} frågor</div>
          {totalCount!==null&&<div style={{marginTop:12,fontSize:12,color:"rgba(255,255,255,0.35)",letterSpacing:"0.5px"}}>🗳️ {totalCount.toLocaleString("sv-SE")} personer har gjort valkompassen</div>}
        </div>
        <div style={{background:"#fff",borderRadius:16,padding:24,marginBottom:20,border:"1px solid #E5E7EB"}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:NAVY,marginBottom:16}}>Din fullständiga matchning</div>
          {result.map(([pid,score],i)=>{const p=gp(pid);return(
            <div key={pid} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{width:24,fontSize:12,color:GRAY,textAlign:"right",fontWeight:700}}>{i+1}</div>
              <div style={{width:48}}><Badge id={pid} large/></div>
              <div style={{flex:1,height:24,background:"#F3F4F6",borderRadius:6,overflow:"hidden"}}>
                <div style={{width:`${score}%`,height:"100%",background:i===0?GOLD:(p?.bg||"#E5E7EB"),opacity:i===0?1:0.8,transition:"width 0.6s ease"}}/>
              </div>
              <div style={{width:44,fontSize:14,fontWeight:700,textAlign:"right",color:i===0?GOLD:"#374151"}}>{score}%</div>
            </div>
          );})}
        </div>
        <div style={{textAlign:"center"}}>
          <button onClick={()=>{setAnswers({});setResult(null);}} style={{background:NAVY,color:"#fff",border:"none",borderRadius:10,padding:"14px 32px",fontSize:15,fontWeight:600,cursor:"pointer",marginBottom:12}}>Gör om testet</button>
          <div style={{fontSize:11,color:GRAY}}>Resultatet är ett ungefärligt underlag och inte en exakt bild av partiernas politik.</div>
        </div>
      </div>
    );
  }

  if(!currentQ)return null;

  return(
    <div style={{maxWidth:620,margin:"0 auto"}}>
      {/* Progress */}
      <div style={{background:"#fff",borderRadius:12,padding:"16px 20px",marginBottom:16,border:"1px solid #E5E7EB",display:"flex",alignItems:"center",gap:16}}>
        <div style={{flex:1,height:8,background:"#E5E7EB",borderRadius:4,overflow:"hidden"}}>
          <div style={{width:`${(progress/QUESTIONS.length)*100}%`,height:"100%",background:BLUE,transition:"width .3s",borderRadius:4}}/>
        </div>
        <div style={{fontSize:13,color:NAVY,fontWeight:700,whiteSpace:"nowrap"}}>{progress+1} / {QUESTIONS.length}</div>
      </div>

      {/* Question card */}
      <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.08)"}}>
        <div style={{background:catColors[currentQ.cat]||BLUE,padding:"12px 24px",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:11,fontWeight:700,color:"#fff",textTransform:"uppercase",letterSpacing:"1px"}}>{currentQ.cat}</span>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginLeft:"auto"}}>Fråga {progress+1} av {QUESTIONS.length}</span>
        </div>
        <div style={{padding:"28px 28px 24px"}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY,lineHeight:1.4,marginBottom:32}}>{currentQ.text}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            {[
              {label:"Ja",icon:"✓",val:1,bg:NAVY,color:"#fff"},
              {label:"Vet ej",icon:"?",val:0,bg:"#F3F4F6",color:"#374151"},
              {label:"Nej",icon:"✗",val:-1,bg:"#FEF2F2",color:"#DC2626"}
            ].map(o=>(
              <button key={o.val} onClick={()=>answer(currentQ.id,o.val)} style={{background:o.bg,color:o.color,border:"none",borderRadius:12,padding:"18px 8px",fontWeight:700,fontSize:16,cursor:"pointer",transition:"all .15s",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.15)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <span style={{fontSize:20}}>{o.icon}</span>
                <span>{o.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MEMBER CARD WITH PHOTO ───────────────────────────────────────────────────
function MemberCard({ member }) {
  const [imgError, setImgError] = useState(false);
  const p = gp(member.parti);
  const initials = member.namn.split(" ").map(x=>x[0]).join("").slice(0,2);

  return (
    <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:12,overflow:"hidden",transition:"all .2s",cursor:"pointer"}}
      onClick={()=>window.open(member.wiki,"_blank","noopener,noreferrer")}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)";e.currentTarget.style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
      {/* Photo */}
      <div style={{height:160,background:`linear-gradient(135deg,${p?.bg||NAVY} 0%,${NAVY} 100%)`,position:"relative",overflow:"hidden"}}>
        {!imgError && member.foto ? (
          <img src={member.foto} alt={member.namn} onError={()=>setImgError(true)}
            style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
        ) : (
          <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"rgba(255,255,255,0.3)",fontFamily:"Georgia,serif",fontSize:48,fontWeight:700}}>{initials}</span>
          </div>
        )}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:60,background:"linear-gradient(to top,rgba(0,0,0,0.6),transparent)"}}/>
        <div style={{position:"absolute",bottom:8,left:10}}><Badge id={member.parti} large/></div>
        <div style={{position:"absolute",top:8,right:8,background:"rgba(255,255,255,0.9)",borderRadius:4,padding:"2px 6px",fontSize:10,color:NAVY,fontWeight:600}}>Wikipedia ↗</div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:NAVY,marginBottom:4}}>{member.namn}</div>
        <div style={{fontSize:11,color:GRAY,marginBottom:4}}>{member.roll}</div>
        <div style={{fontSize:10,color:"#9CA3AF"}}>{member.valkrets}</div>
      </div>
    </div>
  );
}

// ─── MODALS ──────────────────────────────────────────────────────────────────
function Modal({ onClose, children }) {
  useEffect(()=>{document.body.style.overflow="hidden";return()=>{document.body.style.overflow="";};},[]);
  return(
    <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"32px 16px",overflowY:"auto"}} onClick={onClose}>
      <div style={{background:"#fff",maxWidth:700,width:"100%",borderRadius:16,overflow:"hidden",position:"relative"}} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:20,background:"none",border:"none",fontSize:24,cursor:"pointer",color:GRAY,zIndex:10}}>×</button>
        {children}
      </div>
    </div>
  );
}

function FAQModal({ onClose }) {
  const [open,setOpen]=useState(null);
  return(
    <Modal onClose={onClose}>
      <div style={{background:NAVY,padding:"28px 32px"}}><div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:"#fff"}}>Vanliga frågor</div></div>
      <div style={{padding:"24px 32px 32px"}}>
        {FAQ_ITEMS.map((item,i)=>(
          <div key={i} style={{borderBottom:"1px solid #F3F4F6"}}>
            <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",textAlign:"left",background:"none",border:"none",padding:"16px 0",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:NAVY}}>{item.q}</span>
              <span style={{fontSize:18,color:GRAY,marginLeft:12}}>{open===i?"−":"+"}</span>
            </button>
            {open===i&&<div style={{fontSize:14,color:GRAY,lineHeight:1.7,paddingBottom:16}}>{item.a}</div>}
          </div>
        ))}
      </div>
    </Modal>
  );
}

function PrivacyModal({ onClose }) {
  return(
    <Modal onClose={onClose}>
      <div style={{background:NAVY,padding:"28px 32px"}}><div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:"#fff"}}>Integritetspolicy</div><div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:4}}>Senast uppdaterad: April 2026</div></div>
      <div style={{padding:"24px 32px 32px",fontSize:14,color:"#374151",lineHeight:1.8}}>
        {[["1. Personuppgiftsansvarig","PartiFokus (partifokus@gmail.com) är personuppgiftsansvarig."],["2. Vilka uppgifter samlar vi in?","PartiFokus samlar inte in personuppgifter. Vi använder Google Analytics för anonym besöksstatistik."],["3. Poll och valkompass","Din röst och svar lagras lokalt i din webbläsare. Dessa skickas inte till någon server."],["4. Cookies","Vi använder Google Analytics-cookies för anonym statistik. Inga marknadsföringscookies används."],["5. Dina rättigheter","Du har rätt att begära information om dina uppgifter. Kontakta oss på partifokus@gmail.com."]].map(([h,t])=><div key={h} style={{marginBottom:20}}><div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:NAVY,marginBottom:6}}>{h}</div><div>{t}</div></div>)}
      </div>
    </Modal>
  );
}

function SourcesModal({ onClose }) {
  const sources=[{name:"SVT Nyheter",url:"https://www.svt.se",desc:"Public service TV"},{name:"Sveriges Radio",url:"https://www.sverigesradio.se",desc:"Public service radio"},{name:"Dagens Nyheter",url:"https://www.dn.se",desc:"Oberoende liberal morgontidning"},{name:"Aftonbladet",url:"https://www.aftonbladet.se",desc:"Kvällstidning"},{name:"Expressen",url:"https://www.expressen.se",desc:"Liberal kvällstidning"},{name:"Omni",url:"https://omni.se",desc:"Nyhetsaggregator"},{name:"Google News",url:"https://news.google.com",desc:"Fångar hundratals svenska medier"},{name:"Moderaterna",url:"https://moderaterna.se",desc:"Officiell presskanal"},{name:"Socialdemokraterna",url:"https://www.socialdemokraterna.se",desc:"Officiell presskanal"},{name:"Sverigedemokraterna",url:"https://sd.se",desc:"Officiell presskanal"},{name:"Kristdemokraterna",url:"https://kristdemokraterna.se",desc:"Officiell presskanal"},{name:"Liberalerna",url:"https://www.liberalerna.se",desc:"Officiell presskanal"},{name:"Centerpartiet",url:"https://www.centerpartiet.se",desc:"Officiell presskanal"},{name:"Vänsterpartiet",url:"https://www.vansterpartiet.se",desc:"Officiell presskanal"},{name:"Miljöpartiet",url:"https://www.mp.se",desc:"Officiell presskanal"},{name:"riksdagen.se",url:"https://www.riksdagen.se",desc:"Riksdagens öppna data"}];
  return(
    <Modal onClose={onClose}>
      <div style={{background:NAVY,padding:"28px 32px"}}><div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:"#fff"}}>Källförteckning</div></div>
      <div style={{padding:"24px 32px 32px"}}>
        {sources.map(s=>(
          <div key={s.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #F3F4F6"}}>
            <div><div style={{fontFamily:"Georgia,serif",fontSize:14,fontWeight:700,color:NAVY}}>{s.name}</div><div style={{fontSize:12,color:GRAY,marginTop:2}}>{s.desc}</div></div>
            <a href={s.url} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:BLUE,fontWeight:600,textDecoration:"none",whiteSpace:"nowrap",marginLeft:16}}>Besök →</a>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function ContactModal({ onClose }) {
  return(
    <Modal onClose={onClose}>
      <div style={{background:NAVY,padding:"28px 32px"}}><div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:"#fff"}}>Kontakta oss</div></div>
      <div style={{padding:"32px 32px 40px",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>✉️</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:NAVY,marginBottom:8}}>Hör av dig!</div>
        <div style={{fontSize:14,color:GRAY,lineHeight:1.7,marginBottom:28,maxWidth:400,margin:"0 auto 28px"}}>Frågor, synpunkter eller samarbete? Skicka ett mail!</div>
        <a href="mailto:partifokus@gmail.com" style={{display:"inline-block",background:NAVY,color:"#fff",borderRadius:8,padding:"14px 32px",fontSize:15,fontWeight:700,textDecoration:"none"}}>partifokus@gmail.com</a>
      </div>
    </Modal>
  );
}

// ─── ARTICLE CARDS ────────────────────────────────────────────────────────────
function BigCard({ article }) {
  const [h,setH]=useState(false);
  const img=getCatImage(article.category,article.imgSeed||0);
  return(
    <div onClick={()=>openArticle(article)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:"#fff",borderRadius:12,overflow:"hidden",cursor:"pointer",border:`1px solid ${h?"#D1D5DB":"#E5E7EB"}`,boxShadow:h?"0 8px 24px rgba(0,0,0,0.1)":"0 1px 4px rgba(0,0,0,0.05)",transition:"all .2s",marginBottom:24}}>
      <div style={{position:"relative",height:340,overflow:"hidden"}}>
        <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .3s",transform:h?"scale(1.03)":"scale(1)"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 50%)"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:28}}>
          <CatTag cat={article.category} dark/>
          <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:"#fff",lineHeight:1.3,marginTop:8,marginBottom:8}}>{article.title}</div>
          <div style={{fontSize:14,color:"rgba(255,255,255,0.8)",lineHeight:1.5}}>{article.description}…</div>
        </div>
      </div>
      <div style={{padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",gap:4}}>{article.parties.map(p=><Badge key={p} id={p}/>)}</div>
        <span style={{fontSize:12,color:GRAY}}>{article.source} · {timeAgo(article.pubDate)}</span>
      </div>
    </div>
  );
}

function MedCard({ article }) {
  const [h,setH]=useState(false);
  const img=getCatImage(article.category,(article.imgSeed||0)+1);
  return(
    <div onClick={()=>openArticle(article)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:"#fff",borderRadius:12,overflow:"hidden",cursor:"pointer",border:`1px solid ${h?"#D1D5DB":"#E5E7EB"}`,boxShadow:h?"0 8px 24px rgba(0,0,0,0.1)":"0 1px 4px rgba(0,0,0,0.05)",transition:"all .2s"}}>
      <div style={{position:"relative",height:180,overflow:"hidden"}}>
        <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .3s",transform:h?"scale(1.04)":"scale(1)"}}/>
      </div>
      <div style={{padding:"14px 16px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><CatTag cat={article.category}/><span style={{fontSize:10,color:"#9CA3AF",marginLeft:"auto"}}>{timeAgo(article.pubDate)}</span></div>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,lineHeight:1.4,color:NAVY,marginBottom:8}}>{article.title}</div>
        <div style={{fontSize:12,color:GRAY,lineHeight:1.5,marginBottom:10}}>{article.description}…</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",gap:4}}>{article.parties.map(p=><Badge key={p} id={p}/>)}</div>
          <span style={{fontSize:11,color:"#9CA3AF"}}>{article.source}</span>
        </div>
      </div>
    </div>
  );
}

function RowCard({ article }) {
  const [h,setH]=useState(false);
  const img=getCatImage(article.category,(article.imgSeed||0)+2);
  return(
    <div onClick={()=>openArticle(article)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:"#fff",borderRadius:12,overflow:"hidden",cursor:"pointer",border:`1px solid ${h?"#D1D5DB":"#E5E7EB"}`,boxShadow:h?"0 8px 24px rgba(0,0,0,0.1)":"0 1px 4px rgba(0,0,0,0.05)",transition:"all .2s",display:"flex",marginBottom:16}}>
      <div style={{width:160,flexShrink:0,overflow:"hidden"}}>
        <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .3s",transform:h?"scale(1.04)":"scale(1)"}}/>
      </div>
      <div style={{padding:"16px 20px",flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><CatTag cat={article.category}/><span style={{fontSize:10,color:"#9CA3AF",marginLeft:"auto"}}>{timeAgo(article.pubDate)}</span></div>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700,lineHeight:1.4,color:NAVY,marginBottom:6}}>{article.title}</div>
        <div style={{fontSize:13,color:GRAY,lineHeight:1.5,marginBottom:10}}>{article.description}…</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {article.parties.map(p=><Badge key={p} id={p}/>)}
            <span style={{fontSize:11,color:"#9CA3AF"}}>{article.source}</span>
          </div>
          <span style={{fontSize:12,color:BLUE,fontWeight:600}}>Läs mer →</span>
        </div>
      </div>
    </div>
  );
}

// ─── LOADING SKELETON ─────────────────────────────────────────────────────────
function SkeletonCard({ big }) {
  return(
    <div style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1px solid #E5E7EB",marginBottom:big?24:0}}>
      <div style={{height:big?340:180,background:"linear-gradient(90deg,#F3F4F6 25%,#E5E7EB 50%,#F3F4F6 75%)",backgroundSize:"400% 100%",animation:"shimmer 1.5s infinite"}}/>
      <div style={{padding:16}}>
        <div style={{height:12,width:"40%",background:"#F3F4F6",borderRadius:4,marginBottom:10}}/>
        <div style={{height:18,width:"90%",background:"#F3F4F6",borderRadius:4,marginBottom:8}}/>
        <div style={{height:18,width:"70%",background:"#F3F4F6",borderRadius:4}}/>
      </div>
    </div>
  );
}
function LoadingState() {
  return(
    <div>
      <style>{`@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>
      <SkeletonCard big/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
        <SkeletonCard/><SkeletonCard/>
      </div>
      <SkeletonCard/><SkeletonCard/><SkeletonCard/>
    </div>
  );
}
function EmptyState({ text="Inga artiklar hittades." }) {
  return(
    <div style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:40,marginBottom:16}}>📭</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:NAVY,marginBottom:8}}>{text}</div>
      <div style={{fontSize:13,color:GRAY}}>Försök igen om en stund — nyheterna uppdateras automatiskt.</div>
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
function NewsTab({ articles, loading }) {
  const mobile=useIsMobile();
  const [catFilter,setCatFilter]=useState("Alla");
  const [partyFilter,setPartyFilter]=useState("all");
  const cats=["Alla",...Object.keys(CATEGORY_KEYWORDS)];
  let filtered=partyFilter==="all"?articles:articles.filter(a=>a.parties.includes(partyFilter));
  if(catFilter!=="Alla")filtered=filtered.filter(a=>a.category===catFilter);
  const [first,...rest]=filtered;
  const [second,third,...remaining]=rest;
  return(
    <div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center",marginBottom:20}}>
        <select value={partyFilter} onChange={e=>setPartyFilter(e.target.value)} style={{border:"1px solid #E5E7EB",borderRadius:8,padding:"8px 12px",fontSize:13,color:NAVY,background:"#fff",fontWeight:600,cursor:"pointer"}}>
          {PARTIES.map(p=><option key={p.id} value={p.id}>{p.id==="all"?"Alla partier":p.name}</option>)}
        </select>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {cats.map(cat=><button key={cat} onClick={()=>setCatFilter(cat)} style={{background:catFilter===cat?NAVY:"#fff",color:catFilter===cat?"#fff":"#374151",border:`1px solid ${catFilter===cat?NAVY:"#E5E7EB"}`,borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>{cat}</button>)}
        </div>
      </div>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY,borderBottom:`2px solid ${NAVY}`,paddingBottom:8,marginBottom:24}}>
        {partyFilter==="all"?"Alla nyheter":gp(partyFilter)?.name} <span style={{fontFamily:"sans-serif",fontSize:13,fontWeight:400,color:GRAY,marginLeft:8}}>{filtered.length} artiklar</span>
      </div>
      {loading ? <LoadingState/> : !first ? <EmptyState text="Inga nyheter hittades just nu."/> : (
        <>
          <BigCard article={first}/>
          {(second||third)&&<div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:20,marginBottom:24}}>{second&&<MedCard article={second}/>}{third&&<MedCard article={third}/>}</div>}
          {remaining.map(a=><RowCard key={a.id} article={a}/>)}
        </>
      )}
    </div>
  );
}

function PressTab({ items, loading }) {
  const mobile=useIsMobile();
  const [partyFilter,setPartyFilter]=useState("all");
  let filtered=partyFilter==="all"?items:items.filter(a=>a.party===partyFilter);
  const withCat=filtered.map(a=>({...a,parties:a.party?[a.party]:[],category:"Ekonomi"}));
  const [first,...rest]=withCat;
  const [second,third,...remaining]=rest;
  return(
    <div>
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:20}}>
        <select value={partyFilter} onChange={e=>setPartyFilter(e.target.value)} style={{border:"1px solid #E5E7EB",borderRadius:8,padding:"8px 12px",fontSize:13,color:NAVY,background:"#fff",fontWeight:600,cursor:"pointer"}}>
          {PARTIES.map(p=><option key={p.id} value={p.id}>{p.id==="all"?"Alla partier":p.name}</option>)}
        </select>
      </div>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY,borderBottom:`2px solid ${NAVY}`,paddingBottom:8,marginBottom:24}}>Pressmeddelanden <span style={{fontFamily:"sans-serif",fontSize:13,fontWeight:400,color:GRAY,marginLeft:8}}>{filtered.length} st</span></div>
      {loading ? <LoadingState/> : !first ? <EmptyState text="Inga pressmeddelanden hittades just nu."/> : (
        <>
          <BigCard article={first}/>
          {(second||third)&&<div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:20,marginBottom:24}}>{second&&<MedCard article={second}/>}{third&&<MedCard article={third}/>}</div>}
          {remaining.map(a=><RowCard key={a.id} article={a}/>)}
        </>
      )}
    </div>
  );
}

const MOCK_VOTES = [
  { id:"v1", titel:"Sänkt skatt för pensionärer",           datum:"2026-04-24", ja:234, nej:115, beteckning:"2025/26:Sk12", parter:[{p:"M",r:"Ja"},{p:"SD",r:"Ja"},{p:"KD",r:"Ja"},{p:"L",r:"Ja"},{p:"C",r:"Ja"},{p:"S",r:"Nej"},{p:"V",r:"Nej"},{p:"MP",r:"Nej"}] },
  { id:"v2", titel:"Utökat stöd till kommuner för välfärd", datum:"2026-04-23", ja:178, nej:171, beteckning:"2025/26:Fi8",  parter:[{p:"M",r:"Nej"},{p:"SD",r:"Nej"},{p:"KD",r:"Nej"},{p:"L",r:"Nej"},{p:"C",r:"Nej"},{p:"S",r:"Ja"},{p:"V",r:"Ja"},{p:"MP",r:"Ja"}] },
  { id:"v3", titel:"Skärpt straff för gängkriminalitet",    datum:"2026-04-22", ja:289, nej:60,  beteckning:"2025/26:Ju5",  parter:[{p:"M",r:"Ja"},{p:"SD",r:"Ja"},{p:"KD",r:"Ja"},{p:"L",r:"Ja"},{p:"C",r:"Ja"},{p:"S",r:"Ja"},{p:"V",r:"Nej"},{p:"MP",r:"Nej"}] },
  { id:"v4", titel:"Förbud mot vinstuttag i välfärden",     datum:"2026-04-21", ja:115, nej:234, beteckning:"2025/26:So3",  parter:[{p:"M",r:"Nej"},{p:"SD",r:"Nej"},{p:"KD",r:"Nej"},{p:"L",r:"Nej"},{p:"C",r:"Nej"},{p:"S",r:"Ja"},{p:"V",r:"Ja"},{p:"MP",r:"Ja"}] },
  { id:"v5", titel:"Ny kärnkraftslag",                      datum:"2026-04-20", ja:221, nej:128, beteckning:"2025/26:N2",   parter:[{p:"M",r:"Ja"},{p:"SD",r:"Ja"},{p:"KD",r:"Ja"},{p:"L",r:"Ja"},{p:"C",r:"Ja"},{p:"S",r:"Nej"},{p:"V",r:"Nej"},{p:"MP",r:"Nej"}] },
];

const MOCK_DEBATES = [
  { id:"d1", titel:"Frågestund med statsministern",            datum:"2026-05-07", tid:"14:00", typ:"Frågestund" },
  { id:"d2", titel:"Debatt om budgetpropositionen 2027",       datum:"2026-05-14", tid:"09:00", typ:"Debatt" },
  { id:"d3", titel:"Interpellationsdebatt om klimatpolitiken", datum:"2026-05-20", tid:"13:00", typ:"Interpellation" },
  { id:"d4", titel:"Debatt om migrationslagen",                datum:"2026-05-28", tid:"11:00", typ:"Debatt" },
];

function OmrostningarTab() {
  return(
    <div>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY,borderBottom:`2px solid ${NAVY}`,paddingBottom:8,marginBottom:24}}>Senaste omröstningar</div>
      {MOCK_VOTES.map(v=>{const tot=v.ja+v.nej,jaPct=Math.round(v.ja/tot*100);return(
        <div key={v.id} style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:12,padding:20,marginBottom:14}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,marginBottom:10,color:NAVY}}>{v.titel}</div>
          <div style={{display:"flex",gap:16,fontSize:12,color:GRAY,marginBottom:8}}><span style={{color:"#059669",fontWeight:700}}>✓ Ja: {v.ja}</span><span style={{color:"#DC2626",fontWeight:700}}>✗ Nej: {v.nej}</span><span style={{marginLeft:"auto"}}>{v.datum} · {v.beteckning}</span></div>
          <div style={{height:8,background:"#F3F4F6",borderRadius:2,overflow:"hidden",display:"flex",marginBottom:14}}><div style={{width:`${jaPct}%`,background:"#059669"}}/><div style={{width:`${100-jaPct}%`,background:"#DC2626"}}/></div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{v.parter.map(({p,r})=><span key={p} style={{display:"flex",alignItems:"center",gap:3}}><Badge id={p}/><span style={{fontSize:11,color:r==="Ja"?"#059669":"#DC2626",fontWeight:700}}>{r}</span></span>)}</div>
        </div>
      );})}
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY,borderBottom:`2px solid ${NAVY}`,paddingBottom:8,marginBottom:24,marginTop:32}}>Kommande debatter</div>
      {MOCK_DEBATES.map(d=>(
        <div key={d.id} style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:10,padding:"14px 20px",marginBottom:10,display:"flex",alignItems:"center",gap:16}}>
          <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:GOLD,minWidth:60,fontSize:13}}>{d.datum.slice(5)}</div>
          <div><div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:NAVY}}>{d.titel}</div><div style={{fontSize:11,color:GRAY,textTransform:"uppercase",letterSpacing:"1px",marginTop:2}}>{d.typ} · {d.tid}</div></div>
        </div>
      ))}
    </div>
  );
}

function LedamoterTab() {
  const [partyFilter,setPartyFilter]=useState("all");
  const filtered=partyFilter==="all"?PARTY_LEADERS:PARTY_LEADERS.filter(m=>m.parti===partyFilter);
  return(
    <div>
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}>
        <select value={partyFilter} onChange={e=>setPartyFilter(e.target.value)} style={{border:"1px solid #E5E7EB",borderRadius:8,padding:"8px 12px",fontSize:13,color:NAVY,background:"#fff",fontWeight:600,cursor:"pointer"}}>
          {PARTIES.map(p=><option key={p.id} value={p.id}>{p.id==="all"?"Alla partier":p.name}</option>)}
        </select>
      </div>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY,borderBottom:`2px solid ${NAVY}`,paddingBottom:8,marginBottom:8}}>Partiledare</div>
      <div style={{fontSize:13,color:GRAY,marginBottom:24}}>Klicka på en ledamot för att läsa mer på Wikipedia.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16}}>
        {filtered.map(m=><MemberCard key={m.id} member={m}/>)}
      </div>
    </div>
  );
}

function OpinionTab() {
  const POLLS_DATA = [
    { id:"o1", datum:"April 2026",    källa:"Novus", M:19.2, SD:20.1, KD:5.8, L:4.9, C:6.2, S:31.4, V:7.1, MP:5.3 },
    { id:"o2", datum:"Mars 2026",     källa:"Sifo",  M:18.8, SD:19.6, KD:5.5, L:5.1, C:6.5, S:32.1, V:6.9, MP:5.5 },
    { id:"o3", datum:"Februari 2026", källa:"Novus", M:20.1, SD:18.9, KD:5.6, L:4.8, C:6.8, S:31.0, V:7.3, MP:5.5 },
  ];
  const pids=["M","SD","KD","L","C","S","V","MP"];
  const visas=POLLS_DATA.slice(0,6);
  const latest=visas[0];
  return(
    <div>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY,borderBottom:`2px solid ${NAVY}`,paddingBottom:8,marginBottom:24}}>Opinionsmätningar <span style={{fontFamily:"sans-serif",fontSize:12,fontWeight:400,color:GRAY,marginLeft:8}}>Källa: Novus / Sifo</span></div>
      <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:12,padding:24,marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:20}}><div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:NAVY}}>Senaste – {latest.datum}</div><div style={{fontSize:12,color:GRAY}}>{latest.källa}</div></div>
        {pids.map(pid=>{const p=gp(pid),pct=latest[pid];return(<div key={pid} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}><div style={{width:40}}><Badge id={pid} large/></div><div style={{flex:1,height:22,background:"#F3F4F6",borderRadius:2,overflow:"hidden"}}><div style={{width:`${pct*2.8}%`,height:"100%",background:p?.bg,minWidth:4}}/></div><div style={{fontSize:13,fontWeight:700,minWidth:40,textAlign:"right",color:NAVY}}>{pct}%</div></div>);})}
        <div style={{marginTop:14,fontSize:12,color:GRAY,borderTop:"1px solid #F3F4F6",paddingTop:12}}>Högerblocket: <strong>{(latest.M+latest.SD+latest.KD+latest.L+latest.C).toFixed(1)}%</strong><span style={{margin:"0 12px"}}>·</span>Vänsterblocket: <strong>{(latest.S+latest.V+latest.MP).toFixed(1)}%</strong></div>
      </div>
      {visas.map(poll=>(
        <div key={poll.id} style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:10,padding:"14px 20px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div style={{fontFamily:"Georgia,serif",fontWeight:700,color:NAVY}}>{poll.datum}</div><div style={{fontSize:11,color:GRAY}}>{poll.källa}</div></div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{pids.map(pid=><span key={pid} style={{display:"flex",alignItems:"center",gap:3}}><Badge id={pid}/><span style={{fontSize:12,fontWeight:700,color:NAVY}}>{poll[pid]}%</span></span>)}</div>
        </div>
      ))}
    </div>
  );
}

// ─── POLITIKSKOLA ─────────────────────────────────────────────────────────────
const POLITIKSKOLA = [
  {
    id:"sverige", titel:"Så fungerar Sverige", icon:"🏛️", color:"#1D4ED8",
    desc:"Lär dig hur riksdag, regering och kommuner hänger ihop.",
    avsnitt:[
      { rubrik:"Riksdagen", text:"Riksdagen är Sveriges parlament och den högsta beslutande församlingen. Den består av 349 ledamöter som väljs av svenska folket vart fjärde år. Riksdagen stiftar lagar, beslutar om statens budget och granskar regeringens arbete. Ledamöterna väljs genom proportionella val, vilket innebär att partiernas antal platser speglar hur många röster de fick." },
      { rubrik:"Regeringen", text:"Regeringen leder landet och genomför de beslut som riksdagen fattar. I spetsen för regeringen sitter statsministern, som utses av riksdagens talman efter att ett nytt riksdagsval hållits. Statsministern väljer sedan sina ministrar. Regeringen kan styra landet så länge den har riksdagens förtroende — annars kan riksdagen rösta bort den genom en misstroendeomröstning." },
      { rubrik:"Kommuner och regioner", text:"Sverige är uppdelat i 290 kommuner och 21 regioner. Kommunerna ansvarar för skola, äldreomsorg och socialtjänst. Regionerna ansvarar främst för sjukvård och kollektivtrafik. Både kommuner och regioner har egna folkvalda fullmäktige och rätt att ta ut skatt. Det är därför du betalar kommunalskatt utöver den statliga inkomstskatten." },
    ],
    quiz:[
      { fraga:"Hur många ledamöter finns i riksdagen?", alt:["249","349","449","149"], svar:1 },
      { fraga:"Vem utser statsministern?", alt:["Kungen","Riksdagen","Talmannen","Folket direkt"], svar:2 },
      { fraga:"Vad ansvarar regionerna främst för?", alt:["Skolan","Sjukvården","Polisen","Försvaret"], svar:1 },
    ]
  },
  {
    id:"rostar", titel:"Så röstar du", icon:"🗳️", color:"#059669",
    desc:"Allt du behöver veta om hur det svenska valsystemet fungerar.",
    avsnitt:[
      { rubrik:"Valsystemet", text:"Sverige har ett proportionellt valsystem, vilket innebär att riksdagens sammansättning speglar hur folket röstat. För att ett parti ska komma in i riksdagen krävs att det får minst 4 procent av rösterna i hela landet, eller minst 12 procent i en enskild valkrets. Det finns tre typer av val: riksdagsval, regionval och kommunval — alla hålls samma dag vart fjärde år." },
      { rubrik:"Hur man röstar", text:"På valdagen går du till din vallokal med röstkort och legitimation. Du väljer en valsedel för det parti du vill rösta på. Du kan också skriva in ett namn på valsedeln för att ge en personröst till en specifik kandidat inom partiet. Förtidsröstning finns tillgänglig under veckorna innan valdagen på bibliotek och andra röstningslokaler." },
      { rubrik:"Vad händer efter valet?", text:"När rösterna räknats och mandaten fördelats inleds regeringsbildningen. Riksdagens talman håller samtal med partiledarna och ger sedan uppdraget att bilda regering till den person som bedöms ha bäst förutsättningar att leda en regering med riksdagens stöd. Denna person — vanligtvis ledaren för det största blocket — försöker sedan förhandla fram en koalition eller ett samarbetsavtal." },
    ],
    quiz:[
      { fraga:"Hur ofta hålls riksdagsval i Sverige?", alt:["Vart 3:e år","Vart 4:e år","Vart 5:e år","Vart 6:e år"], svar:1 },
      { fraga:"Hur många procent av rösterna krävs för att komma in i riksdagen?", alt:["2%","3%","4%","5%"], svar:2 },
      { fraga:"Vad innebär en personröst?", alt:["Du röstar på en person från ett annat parti","Du röstar på en specifik kandidat inom partiet","Du röstar två gånger","Du röstar blankt"], svar:1 },
    ]
  },
  {
    id:"partier", titel:"Partierna & ideologierna", icon:"⚖️", color:"#7C3AED",
    desc:"Förstå skillnaden mellan höger och vänster och vad partierna egentligen vill.",
    avsnitt:[
      { rubrik:"Höger och vänster", text:"Den politiska skalan från vänster till höger handlar ursprungligen om synen på ekonomi och statens roll. Vänstern vill generellt ha mer statlig styrning, starkare offentlig sektor och mer omfördelning av resurser. Högern föredrar mer marknadsekonomi, lägre skatter och mer utrymme för privata alternativ. De flesta partier befinner sig dock någonstans mitt på skalan och kombinerar idéer från båda hållen." },
      { rubrik:"Blockpolitik", text:"I Sverige brukar partierna delas in i två block: högerblocket (Tidöpartierna: M, SD, KD, L) och vänsterblocket (S, V, MP). Centerpartiet är ett undantag som historiskt samarbetat med båda blocken. Blocken samarbetar ofta i riksdagen, men det är inte ovanligt att partier röstar tvärs över blockgränserna i enskilda frågor." },
      { rubrik:"Partiernas grundideologier", text:"M=konservatism/liberalism, SD=socialkonservatism/nationalism, KD=kristdemokrati, L=klassisk liberalism, C=liberalism/agrarianism, S=socialdemokrati, V=demokratisk socialism, MP=grön politik. Alla partier blandar dock ideologier i praktiken, och det är deras faktiska politik — inte etiketten — som räknas." },
    ],
    quiz:[
      { fraga:"Vilken fråga är mest typiskt 'vänster'?", alt:["Sänkta skatter","Fri marknad","Stärkt offentlig välfärd","Minskad statlig reglering"], svar:2 },
      { fraga:"Vilka partier ingår i Tidöpartierna?", alt:["M, C, KD, L","M, SD, KD, L","S, V, MP, C","M, SD, S, C"], svar:1 },
      { fraga:"Vilket parti brukar kallas 'mitt på skalan' och samarbetat med båda blocken?", alt:["KD","MP","C","L"], svar:2 },
    ]
  },
  {
    id:"begrepp", titel:"Politiska begrepp", icon:"📖", color:"#D97706",
    desc:"Förstå de ord som används i politiska debatter och riksdagen.",
    avsnitt:[
      { rubrik:"Riksdagsbeslut: Motion och proposition", text:"En motion är ett förslag som en riksdagsledamot eller ett parti lägger fram i riksdagen. Det kan handla om allt från nya lagar till att be regeringen utreda något. En proposition är däremot ett lagförslag som kommer från regeringen. Propositioner har ofta större chans att gå igenom eftersom de backas upp av den sittande regeringen." },
      { rubrik:"Interpellation och frågestund", text:"En interpellation är en formell skriftlig fråga som en riksdagsledamot ställer till en minister. Ministern måste svara, och det följs av en debatt i riksdagen — ett viktigt verktyg för oppositionen att granska makten. En frågestund är ett kortare och mer informellt format där ledamöter ställer korta frågor direkt till statsministern eller ministrarna." },
      { rubrik:"Budget och statsskuld", text:"Statens budget är en plan för hur landets pengar ska tas in (via skatter och avgifter) och spenderas (på sjukvård, försvar, skola m.m.). Om staten spenderar mer än den tar in uppstår ett underskott, och statsskulden växer. Riksdagen beslutar om budgeten varje höst. Budgetpolitik är ofta den viktigaste politiska skiljelinjen mellan blocken." },
    ],
    quiz:[
      { fraga:"Vad är en proposition?", alt:["En fråga från en ledamot till en minister","Ett lagförslag från regeringen","En omröstning i riksdagen","En interpellationsdebatt"], svar:1 },
      { fraga:"Vad kallas den formella skriftliga frågan till en minister?", alt:["Motion","Proposition","Interpellation","Frågestund"], svar:2 },
      { fraga:"Vad händer om staten spenderar mer än den tar in?", alt:["Överskott uppstår","Statsskulden minskar","Underskott uppstår och skulden växer","Skatterna sänks automatiskt"], svar:2 },
    ]
  },
];

const SB_QUIZ_TABLE = "quiz_stats";

async function sbIncrementQuiz(id) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${SB_QUIZ_TABLE}?id=eq.${id}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    const rows = await r.json();
    const current = rows[0]?.completions || 0;
    await fetch(`${SUPABASE_URL}/rest/v1/${SB_QUIZ_TABLE}?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ completions: current + 1 })
    });
    return current + 1;
  } catch { return null; }
}

async function sbGetQuizCount(id) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${SB_QUIZ_TABLE}?id=eq.${id}&select=completions`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    const rows = await r.json();
    return rows[0]?.completions || 0;
  } catch { return null; }
}

function PolitikskolaQuiz({ quiz, quizId }) {
  const [answers,setAnswers]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const [count,setCount]=useState(null);
  const score=submitted?quiz.filter((q,i)=>answers[i]===q.svar).length:0;

  useEffect(()=>{ sbGetQuizCount(quizId).then(n=>{ if(n!==null) setCount(n); }); },[quizId]);

  function handleSubmit(){
    setSubmitted(true);
    sbIncrementQuiz(quizId).then(n=>{ if(n!==null) setCount(n); });
  }

  return(
    <div style={{background:"#F9FAFB",borderRadius:16,padding:24,marginTop:32,border:"1px solid #E5E7EB"}}>
      <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:4}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:NAVY}}>🧠 Testa dina kunskaper</div>
        {count!==null&&<div style={{fontSize:11,color:GRAY}}>{count.toLocaleString("sv-SE")} har gjort detta quiz</div>}
      </div>
      <div style={{fontSize:13,color:GRAY,marginBottom:24}}>Välj rätt svar på varje fråga.</div>
      {quiz.map((q,qi)=>(
        <div key={qi} style={{marginBottom:20}}>
          <div style={{fontWeight:700,color:NAVY,fontSize:14,marginBottom:10}}>{qi+1}. {q.fraga}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {q.alt.map((a,ai)=>{
              const chosen=answers[qi]===ai;
              const correct=submitted&&ai===q.svar;
              const wrong=submitted&&chosen&&ai!==q.svar;
              return(
                <button key={ai} onClick={()=>!submitted&&setAnswers(prev=>({...prev,[qi]:ai}))}
                  style={{background:correct?"#DCFCE7":wrong?"#FEE2E2":chosen?"#EFF6FF":"#fff",border:`2px solid ${correct?"#16A34A":wrong?"#DC2626":chosen?"#1D4ED8":"#E5E7EB"}`,borderRadius:10,padding:"10px 14px",fontSize:13,cursor:submitted?"default":"pointer",textAlign:"left",color:NAVY,fontWeight:chosen||correct?600:400,transition:"all .1s"}}>
                  {a}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!submitted?(
        <button onClick={handleSubmit} disabled={Object.keys(answers).length<quiz.length}
          style={{background:Object.keys(answers).length<quiz.length?"#E5E7EB":NAVY,color:Object.keys(answers).length<quiz.length?"#9CA3AF":"#fff",border:"none",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:700,cursor:Object.keys(answers).length<quiz.length?"not-allowed":"pointer",marginTop:8}}>
          Kolla svaren
        </button>
      ):(
        <div style={{marginTop:16,display:"flex",alignItems:"center",gap:16}}>
          <div style={{background:score===quiz.length?"#DCFCE7":score>=quiz.length/2?"#FEF9C3":"#FEE2E2",borderRadius:12,padding:"12px 20px"}}>
            <span style={{fontWeight:700,fontSize:16,color:NAVY}}>{score}/{quiz.length} rätt</span>
            <span style={{fontSize:13,color:GRAY,marginLeft:8}}>{score===quiz.length?"Perfekt! 🎉":score>=quiz.length/2?"Bra jobbat!":"Försök igen!"}</span>
          </div>
          <button onClick={()=>{setAnswers({});setSubmitted(false);}} style={{background:"none",border:"1px solid #E5E7EB",borderRadius:8,padding:"10px 18px",fontSize:13,cursor:"pointer",color:NAVY}}>Försök igen</button>
        </div>
      )}
    </div>
  );
}

function PolitikskolaTab() {
  const [activeKat,setActiveKat]=useState(null);
  if(activeKat){
    const kat=POLITIKSKOLA.find(k=>k.id===activeKat);
    return(
      <div style={{maxWidth:760,margin:"0 auto"}}>
        <button onClick={()=>setActiveKat(null)} style={{background:"none",border:"none",color:BLUE,fontSize:14,fontWeight:600,cursor:"pointer",marginBottom:24,display:"flex",alignItems:"center",gap:6}}>← Tillbaka till Politikskolan</button>
        <div style={{background:`linear-gradient(135deg,${kat.color} 0%,${NAVY} 100%)`,borderRadius:20,padding:"32px 40px",marginBottom:32}}>
          <div style={{fontSize:36,marginBottom:8}}>{kat.icon}</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:"#fff",marginBottom:8}}>{kat.titel}</div>
          <div style={{fontSize:15,color:"rgba(255,255,255,0.7)"}}>{kat.desc}</div>
        </div>
        {kat.avsnitt.map((a,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:16,padding:28,marginBottom:16,border:"1px solid #E5E7EB"}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:NAVY,marginBottom:12,paddingBottom:10,borderBottom:`2px solid ${kat.color}`}}>{a.rubrik}</div>
            <div style={{fontSize:15,color:"#374151",lineHeight:1.8}}>{a.text}</div>
          </div>
        ))}
        <PolitikskolaQuiz quiz={kat.quiz} quizId={kat.id}/>
      </div>
    );
  }
  return(
    <div>
      <div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:NAVY,marginBottom:8}}>Politikskola</div>
      <div style={{fontSize:15,color:GRAY,marginBottom:32,maxWidth:600}}>Lär dig hur Sverige styrs, hur valet fungerar och vad de politiska begreppen betyder. Varje avsnitt avslutas med ett quiz.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
        {POLITIKSKOLA.map(kat=>(
          <div key={kat.id} onClick={()=>setActiveKat(kat.id)} style={{background:"#fff",borderRadius:16,overflow:"hidden",border:"1px solid #E5E7EB",cursor:"pointer",transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
            <div style={{height:8,background:kat.color}}/>
            <div style={{padding:"24px 24px 20px"}}>
              <div style={{fontSize:32,marginBottom:12}}>{kat.icon}</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:NAVY,marginBottom:8}}>{kat.titel}</div>
              <div style={{fontSize:13,color:GRAY,lineHeight:1.6,marginBottom:16}}>{kat.desc}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,color:GRAY}}>{kat.avsnitt.length} avsnitt · {kat.quiz.length} quizfrågor</span>
                <span style={{fontSize:13,color:kat.color,fontWeight:700}}>Läs mer →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ articles, onTabChange, loading }) {
  const mobile=useIsMobile();
  const top=articles.slice(0,5);
  return(
    <div>
      {/* HERO */}
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?24:48,alignItems:"center",marginBottom:56}}>
        <div>
          <div style={{fontSize:12,color:BLUE,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:16}}>Oberoende politisk analys</div>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:mobile?36:50,fontWeight:700,color:NAVY,lineHeight:1.15,marginBottom:16}}>Fakta före vägval.<br/>Fokus före åsikt.</h1>
          <div style={{display:"flex",gap:mobile?16:28,marginBottom:28}}>
            {[{icon:"⚖️",t:"Oberoende",d:"Inga kopplingar. Inga agendor."},{icon:"⚡",t:"Realtid",d:"Senaste nyheterna. Dygnet runt."},{icon:"🗂️",t:"Samlat",d:"All svensk politik på ett ställe."}].map(f=>(
              <div key={f.t} style={{flex:1}}><div style={{fontSize:22,marginBottom:4}}>{f.icon}</div><div style={{fontSize:13,fontWeight:700,color:NAVY,marginBottom:2}}>{f.t}</div><div style={{fontSize:11,color:GRAY,lineHeight:1.4}}>{f.d}</div></div>
            ))}
          </div>
          <button onClick={()=>onTabChange("nyheter")} style={{background:NAVY,color:"#fff",border:"none",borderRadius:8,padding:"14px 28px",fontSize:15,fontWeight:700,cursor:"pointer"}}>Senaste nyheterna →</button>
        </div>
        {!mobile&&top[0]&&(
          <div style={{position:"relative",borderRadius:16,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.15)",cursor:"pointer"}} onClick={()=>openArticle(top[0])}>
            <img src={HERO_IMAGE} alt="" style={{width:"100%",height:420,objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(13,27,42,0.85) 0%,transparent 50%)"}}/>
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:24}}>
              <div style={{fontSize:10,color:GOLD,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>SENASTE NYHET</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#fff",lineHeight:1.3,marginBottom:8}}>{top[0].title}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>{timeAgo(top[0].pubDate)}</span><span style={{fontSize:13,color:GOLD,fontWeight:600}}>Läs artikeln →</span></div>
            </div>
          </div>
        )}
        {!mobile&&loading&&(
          <div style={{borderRadius:16,overflow:"hidden",height:420,background:"linear-gradient(90deg,#F3F4F6 25%,#E5E7EB 50%,#F3F4F6 75%)",backgroundSize:"400% 100%",animation:"shimmer 1.5s infinite"}}/>
        )}
      </div>

      {/* DET HÄNDER JUST NU */}
      <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:20}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:NAVY}}>Det händer just nu</div>
        <button onClick={()=>onTabChange("nyheter")} style={{background:"none",border:"none",color:BLUE,fontSize:13,fontWeight:600,cursor:"pointer"}}>Visa alla →</button>
      </div>
      {loading ? (
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(4,1fr)",gap:20,marginBottom:56}}>
          {[1,2,3,4].map(i=><SkeletonCard key={i}/>)}
        </div>
      ) : top.length > 0 ? (
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(4,1fr)",gap:20,marginBottom:56}}>
          {top.slice(1,5).map(a=><MedCard key={a.id} article={a}/>)}
        </div>
      ) : (
        <EmptyState text="Hämtar nyheter..."/>
      )}

      {/* UTFORSKA – valkompass + poll + politikskola */}
      <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:NAVY,marginBottom:20}}>Utforska politik på ditt sätt</div>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:20,marginBottom:56}}>

        {/* Valkompass */}
        <div style={{background:`linear-gradient(135deg,${NAVY} 0%,#1e3a5f 100%)`,borderRadius:20,padding:24,cursor:"pointer",overflow:"hidden",position:"relative",display:"flex",flexDirection:"column"}} onClick={()=>onTabChange("valkompass")}>
          <div style={{fontSize:11,color:GOLD,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:6}}>🗳️ Valkompass 2026</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:19,fontWeight:700,color:"#fff",lineHeight:1.3,marginBottom:6}}>Osäker på var du<br/>står inför valet?</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.65)",marginBottom:16}}>Svara på 14 frågor och se vilket parti du matchar bäst.</div>
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg viewBox="0 0 320 260" width="100%" height="180" style={{display:"block"}}>
              <style>{`@keyframes spin{from{transform-origin:160px 130px;transform:rotate(0deg)}to{transform-origin:160px 130px;transform:rotate(360deg)}}.mini-needle{transform-origin:160px 130px;animation:spin 8s linear infinite}`}</style>
              {["M","SD","S","V","C","MP","KD","L"].map((pid,i)=>{
                const angle=(i*(360/8)-90)*Math.PI/180;
                const cx=160,cy=130,r=105;
                const x=cx+r*Math.cos(angle),y=cy+r*Math.sin(angle);
                const p=gp(pid);
                return(<g key={pid}><circle cx={x} cy={y} r={24} fill={p?.bg||"#ccc"} filter="url(#ms)"/><text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="800" fill={p?.color||"#fff"}>{p?.short}</text></g>);
              })}
              <circle cx={160} cy={130} r={36} fill={NAVY} stroke="rgba(201,168,76,0.5)" strokeWidth="2"/>
              <g className="mini-needle">
                <polygon points="160,100 156,130 160,118 164,130" fill={GOLD}/>
                <polygon points="160,160 156,130 160,142 164,130" fill="rgba(255,255,255,0.25)"/>
              </g>
              <circle cx={160} cy={130} r={6} fill={GOLD}/>
              <defs><filter id="ms" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25"/></filter></defs>
            </svg>
          </div>
          <button style={{background:GOLD,color:NAVY,border:"none",borderRadius:8,padding:"10px 16px",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%"}}>Gör testet nu →</button>
        </div>

        {/* Poll */}
        <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:20,padding:24}}>
          <div style={{fontSize:11,color:BLUE,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:6}}>📊 Folkopinionen</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:19,fontWeight:700,color:NAVY,lineHeight:1.3,marginBottom:6}}>Vart lutar din röst<br/>inför valet 2026?</div>
          <div style={{fontSize:12,color:GRAY,marginBottom:14}}>Rösta anonymt – se resultatet direkt.</div>
          <PollWidget compact/>
        </div>

        {/* Politikskola */}
        <div style={{background:"linear-gradient(135deg,#7C3AED 0%,#4F46E5 100%)",borderRadius:20,padding:24,cursor:"pointer",display:"flex",flexDirection:"column",justifyContent:"space-between"}} onClick={()=>onTabChange("politikskola")}>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:6}}>🎓 Politikskola</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:19,fontWeight:700,color:"#fff",lineHeight:1.3,marginBottom:10}}>Förstår du skillnaden mellan en motion och en proposition?</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.6,marginBottom:20}}>Lär dig hur Sverige faktiskt styrs — från riksdag till kommunhus. Guider, förklaringar och quiz för alla nivåer.</div>
          </div>
          <button style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"2px solid rgba(255,255,255,0.3)",borderRadius:8,padding:"10px 16px",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%",backdropFilter:"blur(4px)"}}>Utforska Politikskolan →</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab]=useState("hem");
  const [party,setParty]=useState("all");
  const [news,setNews]=useState([]);
  const [press,setPress]=useState([]);
  const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(null);
  const mobile=useIsMobile();

  useEffect(()=>{
    Promise.allSettled(NEWS_SOURCES.map(fetchRSS)).then(results=>{
      const fetched=results.filter(r=>r.status==="fulfilled").flatMap(r=>r.value).filter(a=>!isHomepageLink(a.link)&&isPolitical(a.title+" "+(a.description||"")));
      const thirtyDays=Date.now()-30*24*60*60*1000;
      const seen=new Set();
      const deduped=fetched.filter(a=>{const k=a.title.slice(0,40).toLowerCase();if(seen.has(k))return false;seen.add(k);return !a.pubDate||new Date(a.pubDate)>thirtyDays;});
      deduped.sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));
      setNews(deduped);
      setLoading(false);
    });
    Promise.allSettled(PRESS_SOURCES.map(fetchRSS)).then(results=>{
      const fetched=results.filter(r=>r.status==="fulfilled").flatMap(r=>r.value).filter(a=>!isHomepageLink(a.link));
      if(fetched.length>0){const seen=new Set();const deduped=fetched.filter(a=>{const k=a.title.slice(0,40).toLowerCase();if(seen.has(k))return false;seen.add(k);return true;});deduped.sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));setPress(deduped);}
    });
  },[]);

  useEffect(()=>{if(window.gtag)window.gtag("config",GA_ID,{page_path:"/"+tab});},[tab]);

  function changeTab(newTab){setTab(newTab);setParty("all");window.scrollTo({top:0,behavior:"smooth"});}

  return(
    <div style={{fontFamily:"system-ui,sans-serif",background:"#F9FAFB",minHeight:"100vh",color:NAVY}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} @keyframes rotate{from{transform-origin:160px 160px;transform:rotate(0deg)}to{transform-origin:160px 160px;transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:0.6}50%{opacity:1}} .needle{transform-origin:160px 160px;animation:rotate 8s linear infinite} .outer-ring{animation:pulse 3s ease-in-out infinite}`}</style>

      {modal==="faq"&&<FAQModal onClose={()=>setModal(null)}/>}
      {modal==="privacy"&&<PrivacyModal onClose={()=>setModal(null)}/>}
      {modal==="sources"&&<SourcesModal onClose={()=>setModal(null)}/>}
      {modal==="contact"&&<ContactModal onClose={()=>setModal(null)}/>}

      {/* HEADER */}
      <header style={{background:"#fff",borderBottom:"1px solid #E5E7EB",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:`0 ${mobile?16:32}px`,height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={()=>changeTab("hem")} style={{background:"none",border:"none",cursor:"pointer",padding:0,textAlign:"left"}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY}}>Parti<span style={{color:BLUE,borderBottom:`2px solid ${BLUE}`,paddingBottom:1}}>Fokus</span></div>
            <div style={{fontSize:11,color:GRAY,letterSpacing:"1px",marginTop:4,fontWeight:600}}>Politik. Inget annat.</div>
          </button>
          {!mobile&&<nav style={{display:"flex",gap:2}}>
            <button onClick={()=>changeTab("hem")} style={{background:"none",border:"none",cursor:"pointer",padding:"8px 14px",fontSize:14,fontWeight:tab==="hem"?700:400,color:tab==="hem"?NAVY:GRAY,borderBottom:tab==="hem"?`2px solid ${NAVY}`:"2px solid transparent",whiteSpace:"nowrap"}}>Hem</button>
            {TABS.map(t=><button key={t.id} onClick={()=>changeTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",padding:"8px 14px",fontSize:14,fontWeight:tab===t.id?700:400,color:tab===t.id?NAVY:GRAY,borderBottom:tab===t.id?`2px solid ${NAVY}`:"2px solid transparent",whiteSpace:"nowrap"}}>{t.label}</button>)}
          </nav>}
          {mobile&&<select value={tab} onChange={e=>changeTab(e.target.value)} style={{border:"1px solid #E5E7EB",borderRadius:8,padding:"6px 10px",fontSize:13,color:NAVY,background:"#fff"}}><option value="hem">Hem</option>{TABS.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</select>}
        </div>
      </header>

      <main style={{maxWidth:1200,margin:"0 auto",padding:`${mobile?24:40}px ${mobile?16:32}px`}}>
        {tab==="hem"         &&<HomePage articles={news} onTabChange={changeTab} loading={loading}/>}
        {tab==="nyheter"     &&<NewsTab articles={news} loading={loading}/>}
        {tab==="press"       &&<PressTab items={press} loading={loading}/>}
        {tab==="omrostningar"&&<OmrostningarTab/>}
        {tab==="ledamoter"   &&<LedamoterTab/>}
        {tab==="opinion"     &&<OpinionTab/>}
        {tab==="politikskola"&&<PolitikskolaTab/>}
        {tab==="valkompass"  &&(
          <div>
            {/* Hero-header för valkompassen */}
            <div style={{background:`linear-gradient(135deg,${NAVY} 0%,#1e3a5f 100%)`,borderRadius:20,padding:mobile?"32px 24px":"48px 56px",marginBottom:40,display:"flex",flexDirection:mobile?"column":"row",alignItems:"center",gap:32,overflow:"hidden",position:"relative"}}>
              <div style={{position:"absolute",top:-40,right:-40,width:240,height:240,borderRadius:"50%",background:"rgba(201,168,76,0.06)"}}/> 
              <div style={{position:"absolute",bottom:-60,left:-20,width:180,height:180,borderRadius:"50%",background:"rgba(201,168,76,0.04)"}}/>
              <div style={{flex:1,position:"relative"}}>
                <div style={{display:"inline-block",background:"rgba(201,168,76,0.15)",borderRadius:20,padding:"5px 14px",fontSize:11,color:GOLD,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:16}}>🗳️ Valkompass 2026</div>
                <div style={{fontFamily:"Georgia,serif",fontSize:mobile?28:38,fontWeight:700,color:"#fff",lineHeight:1.25,marginBottom:14}}>Var står du<br/>inför valet?</div>
                <div style={{fontSize:15,color:"rgba(255,255,255,0.65)",lineHeight:1.65,marginBottom:0,maxWidth:420}}>Svara på 14 frågor om aktuella politiska frågor och se hur väl du stämmer överens med riksdagspartierna.</div>
              </div>
              <div style={{flexShrink:0}}>
                <CompassSVG/>
              </div>
            </div>

            {/* Info-badges */}
            <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(3,1fr)",gap:16,marginBottom:40}}>
              {[
                {icon:"🎯",title:"14 frågor",desc:"Inom sju politiska ämnesområden"},
                {icon:"⚡",title:"Snabbt & enkelt",desc:"Tar ungefär 2–3 minuter att genomföra"},
                {icon:"🔒",title:"Helt anonymt",desc:"Dina svar lagras aldrig på någon server"},
              ].map(f=>(
                <div key={f.title} style={{background:"#fff",borderRadius:14,padding:"20px 22px",border:"1px solid #E5E7EB",display:"flex",gap:14,alignItems:"flex-start"}}>
                  <span style={{fontSize:26,flexShrink:0}}>{f.icon}</span>
                  <div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:NAVY,marginBottom:4}}>{f.title}</div>
                    <div style={{fontSize:12,color:GRAY,lineHeight:1.5}}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY,marginBottom:20,paddingBottom:10,borderBottom:`2px solid ${NAVY}`}}>Hitta ditt parti</div>
            <Valkompass/>
          </div>
        )}
      </main>

      <footer style={{background:NAVY,marginTop:64,padding:`48px ${mobile?20:32}px 32px`}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"2fr 1fr 1fr 1fr",gap:mobile?24:40,marginBottom:40}}>
            <div style={{gridColumn:mobile?"span 2":"auto"}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#fff",marginBottom:4}}>Parti<span style={{color:GOLD}}>Fokus</span></div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:12,fontWeight:600}}>Politik. Inget annat.</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.7}}>Oberoende politisk nyhetstjänst. Partipolitiskt neutral. Alla artiklar tillhör respektive källa.</div>
            </div>
            <div>
              <div style={{fontSize:11,color:GOLD,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12}}>Utforska</div>
              {[["nyheter","Nyheter"],["press","Pressmeddelanden"],["omrostningar","Omröstningar"],["ledamoter","Ledamöter"],["opinion","Opinion"],["valkompass","Valkompass"]].map(([id,label])=>(
                <div key={id} onClick={()=>changeTab(id)} style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:8,cursor:"pointer"}} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.45)"}>{label}</div>
              ))}
            </div>
            <div>
              <div style={{fontSize:11,color:GOLD,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12}}>Om oss</div>
              {[["sources","Källor"],["privacy","Integritetspolicy"]].map(([id,label])=>(
                <div key={id} onClick={()=>setModal(id)} style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:8,cursor:"pointer"}} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.45)"}>{label}</div>
              ))}
            </div>
            <div>
              <div style={{fontSize:11,color:GOLD,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12}}>Mer</div>
              {[["contact","Kontakt"],["faq","Vanliga frågor"]].map(([id,label])=>(
                <div key={id} onClick={()=>setModal(id)} style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:8,cursor:"pointer"}} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.45)"}>{label}</div>
              ))}
            </div>
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:20,display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(255,255,255,0.25)",flexWrap:"wrap",gap:8}}>
            <span>© {new Date().getFullYear()} PartiFokus. Drivs ideellt.</span>
            <span>partifokus@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}