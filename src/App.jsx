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
  Ekonomi:      ["https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&q=70","https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=600&q=70","https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=600&q=70","https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?w=600&q=70"],
  Migration:    ["https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=70","https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&q=70","https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=70","https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600&q=70"],
  Klimat:       ["https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=70","https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=600&q=70","https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&q=70","https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=70"],
  Kriminalitet: ["https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=600&q=70","https://images.unsplash.com/photo-1453945619913-79ec89a82c51?w=600&q=70","https://images.unsplash.com/photo-1619012766733-26e9c13b7c3b?w=600&q=70","https://images.unsplash.com/photo-1534330207526-8e81f10ec6fc?w=600&q=70"],
  Sjukvård:     ["https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&q=70","https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=70","https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=70","https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=70"],
  Skola:        ["https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=70","https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=70","https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=70","https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=70"],
  Bostäder:     ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=70","https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=70","https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&q=70","https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=70"],
  Politik:      ["https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&q=70","https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=600&q=70","https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=600&q=70","https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=600&q=70"],
};
function getCatImage(cat, seed) {
  const imgs=CAT_IMAGES[cat]||CAT_IMAGES.Politik;
  return imgs[Math.abs(seed||0)%imgs.length];
}
function ImgWithFallback({ src, alt, style }) {
  const [err,setErr]=useState(false);
  const fallback="https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&q=70";
  return <img src={err?fallback:src} alt={alt||""} style={style} onError={()=>setErr(true)}/>;
}
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

const POLLS_DATA_HOME = [
  { id:"o1", datum:"April 2026", källa:"Novus", M:19.2, SD:20.1, KD:5.8, L:4.9, C:6.2, S:31.4, V:7.1, MP:5.3 },
  { id:"o2", datum:"Mars 2026",  källa:"Sifo",  M:18.8, SD:19.6, KD:5.5, L:5.1, C:6.5, S:32.1, V:6.9, MP:5.5 },
  { id:"o3", datum:"Feb 2026",   källa:"Novus", M:20.1, SD:18.9, KD:5.6, L:4.8, C:6.8, S:31.0, V:7.3, MP:5.5 },
];

const TABS = [
  { id:"nyheter",      label:"Nyheter" },
  { id:"press",        label:"Pressmeddelanden" },
  { id:"omrostningar", label:"Omröstningar" },
  { id:"ledamoter",    label:"Ledamöter" },
  { id:"opinion",      label:"Opinion" },
  { id:"valkompass",   label:"Valkompass" },
  { id:"politikskola", label:"Politikskola" },
  { id:"jamfor",       label:"Partierna jämför" },
  { id:"quiz",         label:"Veckans quiz" },
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
  { id:1,  text:"Ska Sverige investera i att bygga ny kärnkraft?",                                      cat:"Klimat",       s:{M:1, SD:1, KD:1, L:1, C:0, S:0, V:-1,MP:-1} },
  { id:2,  text:"Ska Sverige ha lagstadgade och bindande klimatmål för att minska utsläppen?",           cat:"Klimat",       s:{M:-1,SD:-1,KD:0, L:0, C:1, S:0, V:1, MP:1 } },
  { id:3,  text:"Ska Sverige ta emot färre asylsökande än idag?",                                       cat:"Migration",    s:{M:1, SD:1, KD:0, L:-1,C:-1,S:0, V:-1,MP:-1} },
  { id:4,  text:"Ska det bli lättare att utvisa utländska medborgare som begår brott i Sverige?",       cat:"Migration",    s:{M:1, SD:1, KD:1, L:0, C:0, S:0, V:-1,MP:-1} },
  { id:5,  text:"Ska privata företag tillåtas driva skattefinansierade skolor och sjukhus med vinst?",  cat:"Ekonomi",      s:{M:1, SD:0, KD:1, L:1, C:1, S:-1,V:-1,MP:-1} },
  { id:6,  text:"Ska inkomstskatten sänkas för de flesta löntagare?",                                   cat:"Ekonomi",      s:{M:1, SD:0, KD:0, L:1, C:1, S:-1,V:-1,MP:-1} },
  { id:7,  text:"Ska straffen för gängkriminalitet och grova våldsbrott skärpas?",                      cat:"Kriminalitet", s:{M:1, SD:1, KD:1, L:0, C:0, S:1, V:-1,MP:-1} },
  { id:8,  text:"Ska Sverige ha kvar sitt NATO-medlemskap?",                                            cat:"Försvar",      s:{M:1, SD:1, KD:1, L:1, C:1, S:1, V:-1,MP:0 } },
  { id:9,  text:"Ska det offentliga sjukvårdssystemet prioriteras framför privata vårdgivare?",         cat:"Sjukvård",     s:{M:-1,SD:0, KD:-1,L:-1,C:-1,S:1, V:1, MP:1 } },
  { id:10, text:"Ska friskolorna ha rätt att etablera sig fritt i hela Sverige?",                       cat:"Skola",        s:{M:1, SD:1, KD:1, L:1, C:1, S:0, V:-1,MP:-1} },
  { id:11, text:"Ska Sverige sänka bensin- och dieselskatten?",                                         cat:"Klimat",       s:{M:1, SD:1, KD:1, L:0, C:0, S:0, V:-1,MP:-1} },
  { id:12, text:"Ska nyproducerade lägenheter få hyressättas fritt på marknaden?",                      cat:"Bostäder",     s:{M:1, SD:-1,KD:0, L:1, C:1, S:-1,V:-1,MP:-1} },
  { id:13, text:"Ska Sverige öka sitt militära stöd till Ukraina?",                                     cat:"Försvar",      s:{M:1, SD:0, KD:1, L:1, C:1, S:1, V:0, MP:1 } },
  { id:14, text:"Ska statsbidragen till kommuner och regioner automatiskt följa inflationen?",          cat:"Ekonomi",      s:{M:-1,SD:0, KD:0, L:0, C:0, S:1, V:1, MP:1 } },
  { id:15, text:"Ska skolan förstatligas och tas bort från kommunalt ansvar?",                          cat:"Skola",        s:{M:0, SD:1, KD:0, L:0, C:-1,S:1, V:1, MP:0 } },
  { id:16, text:"Ska karensavdraget (dag 1 utan ersättning vid sjukdom) tas bort?",                    cat:"Ekonomi",      s:{M:-1,SD:0, KD:-1,L:-1,C:-1,S:1, V:1, MP:1 } },
  { id:17, text:"Ska det bli svårare att ändra Sveriges grundlag?",                                     cat:"Demokrati",    s:{M:0, SD:-1,KD:0, L:0, C:1, S:0, V:0, MP:1 } },
  { id:18, text:"Ska Sverige ta emot fler flyktingar via FN:s kvotflyktingssystem?",                   cat:"Migration",    s:{M:-1,SD:-1,KD:0, L:1, C:1, S:0, V:1, MP:1 } },
  { id:19, text:"Ska bolagsskatten sänkas för att locka fler företag till Sverige?",                    cat:"Ekonomi",      s:{M:1, SD:-1,KD:0, L:1, C:1, S:-1,V:-1,MP:-1} },
  { id:20, text:"Ska Sverige satsa på sol- och vindkraft som den primära energikällan?",               cat:"Klimat",       s:{M:0, SD:-1,KD:-1,L:0, C:1, S:0, V:1, MP:1 } },
];

const FAQ_ITEMS = [
  { q:"Vad är PartiFokus?", a:"PartiFokus är en oberoende politisk nyhetstjänst som samlar all svensk politik på ett ställe. Vi aggregerar nyheter från stora svenska medier neutralt utan politisk vinkling." },
  { q:"Är PartiFokus partipolitiskt bunden?", a:"Nej. PartiFokus är helt partipolitiskt obunden. Alla riksdagspartier behandlas lika. Vi tar inte ställning i politiska frågor." },
  { q:"Varifrån kommer nyheterna?", a:"Vi hämtar nyheter från SVT, Sveriges Radio, DN, Aftonbladet, Expressen, Omni, Google News samt partiernas presskanaler via offentliga RSS-flöden." },
  { q:"Äger PartiFokus artiklarna?", a:"Nej. Alla artiklar tillhör respektive källan. PartiFokus visar rubrik och kort ingress, och länkar alltid till originalkällan." },
  { q:"Hur fungerar valkompassen?", a:"Valkompassen innehåller 20 politiska frågor inom sju ämnesområden. Du svarar Ja, Nej eller Vet ej, och vi jämför dina svar med partiernas ståndpunkter. Tar ungefär 2–3 minuter. Resultatet är ett ungefärligt underlag." },
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
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${SB_POLL_TABLE}?select=party,votes&order=party`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json" }
    });
    if(!r.ok) return {};
    const rows = await r.json();
    if(!Array.isArray(rows)||rows.length===0) return {};
    const obj = {};
    rows.forEach(row => { if(row.party) obj[row.party] = parseInt(row.votes)||0; });
    return obj;
  } catch(e) { console.warn("Poll fetch error:",e); return {}; }
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
  const PP=[{id:"S",label:"Socialdemokraterna"},{id:"SD",label:"Sverigedemokraterna"},{id:"M",label:"Moderaterna"},{id:"V",label:"Vänsterpartiet"},{id:"C",label:"Centerpartiet"},{id:"MP",label:"Miljöpartiet"},{id:"KD",label:"Kristdemokraterna"},{id:"L",label:"Liberalerna"},{id:"ovriga",label:"Övriga"},{id:"vetej",label:"Vet ej"}];
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

  // Visa alltid live-resultat ovanför röstningsformuläret
  const ResultBar = () => (
    <div style={{marginBottom:voted?0:16}}>
      <div style={{fontSize:11,color:GRAY,marginBottom:8,fontWeight:600}}>{total>0?`${total.toLocaleString("sv-SE")} röster totalt · Uppdateras i realtid`:"Inga röster än — bli den första!"}</div>
      {PP.map(({id})=>{const p=gp(id);const pct=total>0?Math.round(((votes[id]||0)/total)*100):0;const isV=voted===id;return(
        <div key={id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
          <div style={{width:compact?28:36,flexShrink:0}}>{p?<span style={{display:"inline-block",padding:"1px 4px",borderRadius:3,fontSize:10,fontWeight:700,background:p.bg,color:p.color}}>{p.short}</span>:<span style={{fontSize:10,color:"#374151",fontWeight:600,whiteSpace:"nowrap"}}>{PP.find(x=>x.id===id)?.label||"–"}</span>}</div>
          <div style={{flex:1,height:compact?12:16,background:"#F3F4F6",borderRadius:3,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:isV?GOLD:(p?.bg||"#9CA3AF"),minWidth:pct>0?2:0,transition:"width .6s"}}/></div>
          <div style={{width:32,fontSize:11,fontWeight:700,textAlign:"right",color:isV?GOLD:"#374151"}}>{pct}%</div>
        </div>
      );})}
    </div>
  );

  if(voted){
    return(
      <div>
        <div style={{fontSize:12,color:"#16A34A",fontWeight:700,marginBottom:10}}>✓ Du röstade: {PP.find(p=>p.id===voted)?.label}</div>
        <ResultBar/>
        {compact&&<div style={{marginTop:6,fontSize:10,color:GRAY}}>Anonym · kan inte spåras</div>}
      </div>
    );
  }

  return(
    <div>
      <ResultBar/>
      <div style={{fontSize:12,color:GRAY,marginBottom:12}}>Din röst är helt anonym</div>
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

// ─── VALKOMPASS COUNTER ──────────────────────────────────────────────────────
function ValkompasCounter({ inline }) {
  const [count,setCount]=useState(null);
  useEffect(()=>{ getValkompasCount().then(n=>{ if(n!==null) setCount(n); }); },[]);
  if(count===null||count===0) return null;
  if(inline) return <div style={{fontSize:12,color:GRAY,fontWeight:600}}>🗳️ {count.toLocaleString("sv-SE")} har gjort testet</div>;
  return <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:8,textAlign:"center"}}>🗳️ {count.toLocaleString("sv-SE")} har gjort valkompassen</div>;
}

// ─── VALKOMPASS ──────────────────────────────────────────────────────────────
function Valkompass() {
  const [answers,setAnswers]=useState({});
  const [result,setResult]=useState(null);
  const [totalCount,setTotalCount]=useState(null);
  const progress=Object.keys(answers).length;
  const currentQ=QUESTIONS.find(q=>answers[q.id]===undefined);

  useEffect(()=>{
    getValkompasCount().then(n=>{ if(n!==null) setTotalCount(n); });
  },[]);

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
  const [showBio, setShowBio] = useState(false);
  const p = gp(member.parti);
  const initials = member.namn.split(" ").map(x=>x[0]).join("").slice(0,2);
  const BIOS = {
    "Ulf Kristersson": "Ulf Kristersson (f. 1963) är statsminister sedan oktober 2022 och partiledare för Moderaterna. Ekonom i grunden och riksdagsledamot sedan 2010. Har tidigare bland annat varit finanspolitisk talesperson.",
    "Jimmie Åkesson": "Jimmie Åkesson (f. 1979) är partiledare för Sverigedemokraterna sedan 2005 — riksdagens längst sittande partiledare. Under hans ledarskap har SD vuxit till ett av riksdagens största partier. Uppväxt i Sölvesborg.",
    "Ebba Busch": "Ebba Busch (f. 1987) är partiledare för Kristdemokraterna sedan 2015 och energiminister i Tidöregeringen. Känd för engagemang i kärnkraft och familjepolitik. Har en bakgrund i juridik.",
    "Simona Mohamsson": "Simona Mohamsson är partiledare för Liberalerna sedan 2025 och efterträdde Johan Pehrson. Engagerad i frågor om utbildning, integration och näringspolitik.",
    "Elisabeth Thand Ringqvist": "Elisabeth Thand Ringqvist är partiledare för Centerpartiet sedan 2025. Stark bakgrund inom näringsliv och företagande. Driver landsbygdsutveckling, avreglering och klimatomställning.",
    "Magdalena Andersson": "Magdalena Andersson (f. 1967) är partiledare för Socialdemokraterna och statsministerkandidat 2026. Var statsminister 2021–2022 och finansminister under lång tid. Ekonom med fokus på ekonomisk politik och välfärd.",
    "Nooshi Dadgostar": "Nooshi Dadgostar (f. 1984) är partiledare för Vänsterpartiet sedan 2020. Juridisk bakgrund, uppväxt i Stockholm. Känd för engagemang mot vinster i välfärden och för starka fackliga rättigheter.",
    "Daniel Helldén": "Daniel Helldén är ett av Miljöpartiets två språkrör sedan 2024. Tidigare trafikborgarråd i Stockholm. Känd för arbete med hållbar stadsutveckling och klimatfrågor.",
    "Amanda Lind": "Amanda Lind (f. 1984) är ett av Miljöpartiets två språkrör sedan 2024. Var kulturminister 2019–2021. Engagerad i klimat, kultur och mänskliga rättigheter.",
  };
  const bio = BIOS[member.namn];

  return (
    <>
    <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:12,overflow:"hidden",transition:"all .2s",cursor:"pointer"}}
      onClick={()=>setShowBio(true)}
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
        <div style={{fontSize:11,color:BLUE,marginTop:8,fontWeight:600}}>Läs biografi →</div>
      </div>
    </div>
    {showBio&&(
      <div style={{position:"fixed",inset:0,background:"rgba(13,27,42,0.8)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setShowBio(false)}>
        <div style={{background:"#fff",borderRadius:20,maxWidth:500,width:"100%",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
          <div style={{height:180,background:`linear-gradient(135deg,${p?.bg||NAVY},${NAVY})`,position:"relative"}}>
            {!imgError&&member.foto&&<img src={member.foto} alt={member.namn} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}} onError={()=>setImgError(true)}/>}
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.6),transparent)"}}/>
            <div style={{position:"absolute",bottom:16,left:20}}><div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#fff"}}>{member.namn}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.7)"}}>{member.roll}</div></div>
            <button onClick={()=>setShowBio(false)} style={{position:"absolute",top:12,right:12,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:"50%",width:32,height:32,color:"#fff",cursor:"pointer",fontSize:18}}>×</button>
          </div>
          <div style={{padding:24}}>
            <p style={{fontSize:14,lineHeight:1.7,color:"#374151",marginBottom:16}}>{bio||"Biografi saknas just nu."}</p>
            <div style={{fontSize:11,color:GRAY,marginBottom:16}}>Foto: Riksdagen / Wikipedia</div>
            <a href={member.wiki} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",background:NAVY,color:"#fff",borderRadius:8,padding:"10px 20px",fontSize:13,fontWeight:700,textDecoration:"none"}}>Läs mer på Wikipedia →</a>
          </div>
        </div>
      </div>
    )}
    </>
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
        <ImgWithFallback src={img} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .3s",transform:h?"scale(1.03)":"scale(1)"}}/>
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
        <ImgWithFallback src={img} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .3s",transform:h?"scale(1.04)":"scale(1)"}}/>
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
        <ImgWithFallback src={img} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .3s",transform:h?"scale(1.04)":"scale(1)"}}/>
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
        <ShareButtons article={article}/>
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
function NewsTab({ articles, loading, lastFetched }) {
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
      {lastFetched&&<div style={{fontSize:11,color:GRAY,marginBottom:12}}>Senast uppdaterad: {lastFetched.toLocaleTimeString("sv-SE",{hour:"2-digit",minute:"2-digit"})}</div>}
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
        <div style={{marginTop:14,fontSize:12,color:GRAY,borderTop:"1px solid #F3F4F6",paddingTop:12}}>Högerblocket: <strong>{(latest.M+latest.SD+latest.KD+latest.L).toFixed(1)}%</strong><span style={{margin:"0 12px"}}>·</span>Vänsterblocket: <strong>{(latest.C+latest.S+latest.V+latest.MP).toFixed(1)}%</strong></div>
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
    id:"basen", titel:"Basen: Vem bestämmer egentligen?", icon:"♟️", color:"#1D4ED8",
    desc:"Riksdag, Regering och kungen. Vi reder ut rollerna direkt.",
    avsnitt:[
      { rubrik:"🍕 Pizzaparlamentet", text:"Sverige styrs som en stor förening med tre huvudspelare. RIKSDAGEN (349 ledamöter) är folkets röst — de bestämmer lagarna och budgeten. Tänk på dem som kunderna på en pizzeria som röstar om menyn. REGERINGEN är kockarna i köket — de vinner valet och ser till att riksdagens beslut blir verklighet. KUNGEN har noll politisk makt. Han är som en maskot för ett fotbollslag — viktig för stämningen och historien, men han får inte byta ut spelarna eller ändra reglerna." },
      { rubrik:"💰 Vart går skatten?", text:"Varje gång du jobbar eller köper en kexchoklad ger du pengar till staten. Statens utgifter fördelar sig ungefär så här: Sjukvård & Omsorg ca 25%, Skola & Utbildning ca 15%, Socialförsäkring (bidrag/pension) ca 40%, Polis & Försvar ca 10%. Ca: Politik handlar till 90% om vem som ska få dessa miljarder och vem som ska betala dem. Det är därför folk bråkar." },
      { rubrik:"🏛️ Tre nivåer av makt", text:"Makten i Sverige är uppdelad på tre nivåer. KOMMUNEN (290 st) ansvarar för det som är nära dig: skolan, soporna, biblioteket och vattenkranen. REGIONEN (21 st) sköter allt som är för stort för en kommun: sjukhusen och kollektivtrafiken. EU stiftar stora lagar om miljö, handel och internet som gäller i hela Europa — oavsett vad svenska politiker tycker." },
    ],
    quiz:[
      { fraga:"Hur många ledamöter finns i riksdagen?", alt:["249","349","449","549"], svar:1 },
      { fraga:"Vilken politisk makt har kungen i Sverige?", alt:["Han kan lägga in veto mot lagar","Han utser statsministern","Han har ingen politisk makt alls","Han leder försvaret"], svar:2 },
      { fraga:"Vad ansvarar kommunerna för?", alt:["Sjukhusen","Försvaret","Skolan och soporna","EU-lagstiftning"], svar:2 },
      { fraga:"Ungefär hur stor andel av statens budget går till socialförsäkring?", alt:["10%","25%","40%","60%"], svar:2 },
    ]
  },
  {
    id:"ideologi", titel:"Ideologierna: Var står du?", icon:"🧭", color:"#059669",
    desc:"Vänster, höger, GAL-TAN. Sluta gissa vad partierna pratar om.",
    avsnitt:[
      { rubrik:"⬅️ Vänster vs Höger ➡️", text:"Den klassiska skalan handlar om ekonomi och statens roll. VÄNSTERN (socialism/socialdemokrati) fokuserar på gemenskap: Staten ska ta in mycket skatt för att skolan, vården och tågen ska vara gratis och lika för alla. Man vill minska klyftorna mellan rik och fattig. HÖGERN (liberalism/konservatism) fokuserar på individen: Du ska få behålla mer av din lön, starta företag och välja din egen skola. Frihet är viktigare än att staten fixar allt. KONSERVATISMEN fokuserar på ordning och tradition: Hårda straff, starkt försvar och skydda landets kultur." },
      { rubrik:"🗺️ GAL-TAN — den andra axeln", text:"Höger-vänster förklarar inte allt. Den andra viktiga axeln är GAL-TAN. GAL (Gröna, Alternativa, Libertära) värnar om miljö, individuell frihet, öppenhet mot invandrare och progressiva värderingar. TAN (Traditionella, Auktoritära, Nationalistiska) värnar om nationell identitet, lag och ordning, traditionella familjevärderingar och begränsad invandring. SD är klassiskt TAN. MP är klassiskt GAL. S och M befinner sig någonstans i mitten på denna axel." },
      { rubrik:"🇸🇪 De svenska partierna placerade", text:"Grovt förenklat: V (vänster-GAL), S (center-vänster), MP (vänster-GAL), C (center, libertär), L (center-höger), KD (höger-TAN), M (höger), SD (höger-TAN). Kom ihåg: Inga partier är renodlade — alla blandar ideologier i praktiken. Det är deras faktiska röstning i riksdagen som avslöjar vad de egentligen tycker, inte vad de säger på valaffischer." },
    ],
    quiz:[
      { fraga:"Vad fokuserar vänstern klassiskt på?", alt:["Individens frihet","Gemenskap och omfördelning","Nationell identitet","Låga skatter"], svar:1 },
      { fraga:"Vad står T i GAL-TAN för?", alt:["Tolerant","Traditionell","Transparent","Transnationell"], svar:1 },
      { fraga:"Vilket parti anses klassiskt mest GAL?", alt:["SD","KD","MP","M"], svar:2 },
      { fraga:"Vad avslöjar egentligen vad ett parti tycker?", alt:["Deras valaffischer","Partiledaren tweets","Deras faktiska röstning i riksdagen","Partiets namn"], svar:2 },
    ]
  },
  {
    id:"maskineriet", titel:"Maskineriet: Hur blir en lag till?", icon:"⚙️", color:"#7C3AED",
    desc:"Från en smart idé till en regel som alla måste följa.",
    avsnitt:[
      { rubrik:"⚙️ Lag-fabriken steg för steg", text:"Steg 1 — FÖRSLAGET: En politiker skriver en motion (förslag från riksdagsledamot) eller en proposition (förslag från regeringen). Propositioner har mycket större chans att gå igenom. Steg 2 — UTREDNINGEN: Experter, myndigheter och organisationer får yttra sig om förslaget fungerar i verkligheten. Det kan ta månader eller år. Steg 3 — UTSKOTTET: En mindre grupp riksdagsledamöter grälar om detaljerna och skriver ett betänkande. Steg 4 — OMRÖSTNING: Hela riksdagen trycker på Ja, Nej eller Avstår. Enkel majoritet (175 av 349) räcker för de flesta lagar." },
      { rubrik:"🔍 Riksdagens kontrollmakt", text:"Riksdagen granskar regeringen på tre sätt. INTERPELLATION är en formell skriftlig fråga till en minister — ministern måste svara i kammaren och det följer en debatt. FRÅGESTUND är kortare och mer direktkonfrontation med statsministern eller ministrar. MISSTROENDEOMRÖSTNING är det ultimata vapnet — om en majoritet röstar mot en minister eller statsministern måste de avgå. Det händer sällan men är ett enormt maktmedel." },
      { rubrik:"📊 Budgetprocessen", text:"Varje höst lämnar regeringen sin budgetproposition till riksdagen — statens stora plan för nästa år med alla inkomster och utgifter. Riksdagen debatterar och röstar. Om oppositionen har majoritet kan de rösta igenom en alternativ budget — vilket faktiskt hände 2014 och ledde till extraval. Budgetpolitik är ofta den viktigaste politiska skiljelinjen eftersom den sätter ramarna för allt annat." },
    ],
    quiz:[
      { fraga:"Vad är skillnaden mellan en motion och en proposition?", alt:["Ingen skillnad","Motion kommer från ledamot, proposition från regeringen","Proposition kommer från ledamot, motion från regeringen","Motion är om ekonomi, proposition om lagar"], svar:1 },
      { fraga:"Hur många röster krävs för att en vanlig lag ska gå igenom?", alt:["Alla 349","Två tredjedelar","Enkel majoritet (175)","Tre fjärdedelar"], svar:2 },
      { fraga:"Vad händer om riksdagen röstar ja i en misstroendeomröstning mot statsministern?", alt:["Ingenting, det är symboliskt","Statsministern måste avgå","Nyval utlyses automatiskt","Kungen tar över"], svar:1 },
      { fraga:"Vad hände 2014 när oppositionen röstade igenom sin egen budget?", alt:["Regeringen ignorerade det","Det ledde till extraval","Kungen lade in veto","Statsministern fick böta"], svar:1 },
    ]
  },
  {
    id:"valet", titel:"Valet: Så fungerar din röst", icon:"🗳️", color:"#DC2626",
    desc:"Hur din röst räknas, vad som händer sen och hur du verkligen påverkar.",
    avsnitt:[
      { rubrik:"🗳️ Hur din röst räknas", text:"Sverige har proportionellt val — partiernas antal platser i riksdagen speglar hur många röster de fick. Om S får 31% av rösterna får de ungefär 31% av mandaten. Spärren: Ett parti måste få minst 4% av rösterna i hela landet ELLER 12% i en enskild valkrets för att komma in i riksdagen. Det finns tre val samma dag: Riksdagsval, Regionval och Kommunval. Du röstar i alla tre med separata valsedlar. Personröst: Du kan skriva in ett namn på valsedeln för att stärka en specifik kandidat inom partiet." },
      { rubrik:"📅 Valdagen 13 september 2026", text:"Valdagen är söndag 13 september 2026. Förtidsröstning börjar 26 augusti. Du behöver legitimation. På valdagskvällen börjar rösterna räknas direkt och resultaten strömmar in under kvällen — det är en av de mest dramatiska kvällarna i svensk politik. Förhandsmandaten (preliminära) presenteras sent på kvällen. Det slutgiltiga resultatet tar några dagar på grund av brevröster och kontrollräkning." },
      { rubrik:"📣 Du påverkar mer än du tror", text:"Röstning är minsta möjliga ansträngning. Det finns 100 andra sätt att påverka. Du kan skriva ett medborgarförslag till din kommun — har det 50 underskrifter MÅSTE kommunen behandla det. Du kan kontakta din riksdagsledamot direkt via riksdagens hemsida. Du kan anmäla dig till ett partis lokalavdelning och faktiskt vara med och bestämma partiets politik. Du kan demonstrera, skriva insändare eller starta en namninsamling. Politiker lyssnar på organiserade grupper — var en av dem." },
    ],
    quiz:[
      { fraga:"Hur många procent krävs nationellt för att komma in i riksdagen?", alt:["2%","3%","4%","5%"], svar:2 },
      { fraga:"När är valdagen 2026?", alt:["13 juni","13 september","13 oktober","13 november"], svar:1 },
      { fraga:"Vad innebär en personröst?", alt:["Du röstar på ett parti utanför riksdagen","Du röstar på en specifik kandidat inom partiet","Du röstar anonymt","Du röstar för en enskild lag"], svar:1 },
      { fraga:"Hur många underskrifter krävs för att kommunen MÅSTE behandla ett medborgarförslag?", alt:["10","50","100","500"], svar:1 },
    ]
  },
  {
    id:"media", titel:"Media & Makt: Vem sätter agendan?", icon:"📺", color:"#D97706",
    desc:"Hur nyheter formas, vem som äger medierna och hur du genomskådar snurr.",
    avsnitt:[
      { rubrik:"📺 Vem äger medierna?", text:"Svenska medier äger till stor del av privata företag och familjer. Bonnier-gruppen äger DN, Expressen och TV4. Schibsted äger Aftonbladet och Svenska Dagbladet. SVT och SR är public service — finansierade via public service-avgiften och ska per lag vara opartiska. Ägarskap påverkar inte alltid den dagliga journalistiken direkt, men kan forma de långsiktiga prioriteringarna. Viktigt att känna till: Alla medier gör val om vad som är en nyhet och hur den presenteras." },
      { rubrik:"🎯 Dagordningsmakten", text:"Den viktigaste makten media har är inte att berätta vad du ska tycka — det är att bestämma VAD du tänker på. Om alla tidningar skriver om invandring i en vecka tänker folk att invandring är landets viktigaste fråga, oavsett om statistiken stödjer det. Politiker vet detta och försöker ständigt påverka mediernas dagordning. När en partiledare läcker en nyhet, håller en presskonferens eller säger något kontroversiellt — det är strategi, inte slump." },
      { rubrik:"🔍 Genomskåda politisk snurr", text:"Fyra frågor att alltid ställa: VEM säger det? (Parti, organisation, lobbyist?) VARFÖR just nu? (Val på gång? Skandal att dölja?) VAD utelämnas? (Vilken sida av historien berättas inte?) VAR kommer siffrorna ifrån? (Vem finansierade undersökningen?). Kom ihåg: Alla har en agenda — även de som säger att de inte har det. Det är inte cynism, det är realism. Källkritik är din superkraft i en värld full av politisk kommunikation." },
    ],
    quiz:[
      { fraga:"Vilket medieföretag äger Aftonbladet?", alt:["Bonnier","Schibsted","SVT","Stampen"], svar:1 },
      { fraga:"Vad är dagordningsmakten?", alt:["Makten att bestämma lagar","Makten att bestämma vad folk tänker på","Makten att censurera nyheter","Makten att utse statsministern"], svar:1 },
      { fraga:"Hur finansieras SVT och SR?", alt:["Reklam","Statliga anslag via skatt","Public service-avgiften","Privata ägare"], svar:2 },
      { fraga:"Vilken är den viktigaste frågan att ställa om en politisk nyhet?", alt:["Hur lång är artikeln?","Vem säger det och varför?","Vilket parti nämns?","Hur många likes fick den?"], svar:1 },
    ]
  },
  {
    id:"din_makt", titel:"Din Makt: Hur förändrar du Sverige?", icon:"✊", color:"#0891B2",
    desc:"Konkreta verktyg för att påverka politiken — från soffa till riksdag.",
    avsnitt:[
      { rubrik:"✊ Din verktygslåda", text:"Rösta är golvet, inte taket. Utöver att rösta vart fjärde år kan du: Skriva medborgarförslag till kommunen (50 underskrifter = obligatorisk behandling). Kontakta din riksdagsledamot direkt — de svarar faktiskt ofta. Gå med i ett partis lokalavdelning och vara med och forma partiets politik inifrån. Delta i remissrundor när nya lagar ska stiftas. Demonstrera och organisera — historien visar att organiserade grupper förändrar mer än enskilda individer. Dela trovärdig information och motverka desinformation i din omgivning." },
      { rubrik:"🗺️ Vägen in i politiken", text:"Vill du verkligen påverka? Så här ser den vanliga vägen ut: 1. Gå med i ett parti och bli aktiv i lokalavdelningen. 2. Ta på dig uppdrag: styrelsepost, nämndplats i kommunen. 3. Kandidera till kommunfullmäktige. 4. Bygg erfarenhet och nätverk. 5. Kandidera till riksdagen. De flesta riksdagsledamöter började i kommunpolitiken. Medelåldern för en förstagångsledamot är runt 40 år — men det finns 25-åringar i riksdagen. Du behöver inte ett gymnasium i statsvetenskap." },
      { rubrik:"⚖️ Dina rättigheter som medborgare", text:"Du har rätt att ta del av alla offentliga handlingar (offentlighetsprincipen) — vilket innebär att du kan begära ut myndigheters mail, dokument och beslut. Det är ett av världens starkaste system för insyn i makten. Du har yttrande- och mötesfrihet. Du har rätt att bilda föreningar. Du har rätt till rättshjälp. Och om en myndighet fattar ett felaktigt beslut om dig har du rätt att överklaga det. Dessa rättigheter existerar — men bara om du känner till dem och använder dem." },
    ],
    quiz:[
      { fraga:"Hur många underskrifter krävs för ett medborgarförslag som kommunen måste behandla?", alt:["10","25","50","100"], svar:2 },
      { fraga:"Vad innebär offentlighetsprincipen?", alt:["Alla måste publicera sina åsikter offentligt","Du kan begära ut myndigheters dokument och mail","Politiker måste hålla öppna möten varje månad","Media måste publicera alla pressmeddelanden"], svar:1 },
      { fraga:"Var börjar de flesta riksdagsledamöter sin politiska karriär?", alt:["Europaparlamentet","Regionfullmäktige","Kommunpolitiken","Partistyrelsen"], svar:2 },
      { fraga:"Vad är golvet för demokratiskt deltagande?", alt:["Att bli riksdagsledamot","Att skriva insändare","Att rösta vart fjärde år","Att betala skatt"], svar:2 },
    ]
  },
];

const FINAL_EXAM_QUESTIONS = [
  { fraga:"Sverige har 349 riksdagsledamöter. Hur utses de?", alt:["Av kungen","Via proportionella val av folket","Av statsministern","Via lottning bland medborgare"], svar:1 },
  { fraga:"Vilken spärr gäller nationellt för att komma in i riksdagen?", alt:["2%","3%","4%","5%"], svar:2 },
  { fraga:"Vad händer om riksdagen röstar igenom en misstroendeomröstning mot statsministern?", alt:["Ingenting","Kungen tar över","Statsministern måste avgå","Automatiskt nyval"], svar:2 },
  { fraga:"Vad är dagordningsmakten?", alt:["Makten att stifta lagar","Makten att bestämma vad folk tänker på","Makten att censurera TV","Makten att utse ministrar"], svar:1 },
  { fraga:"Vad innebär offentlighetsprincipen?", alt:["Alla måste vara offentliga","Du kan begära ut myndigheters dokument","Media måste publicera allt","Politiker får inte ha hemligheter"], svar:1 },
  { fraga:"Vilket medieföretag äger DN och Expressen?", alt:["Schibsted","SVT","Bonnier","Stampen"], svar:2 },
  { fraga:"Vad är en proposition?", alt:["En fråga från en ledamot","Ett lagförslag från regeringen","En omröstning i kammaren","En interpellationsdebatt"], svar:1 },
  { fraga:"GAL-TAN är en politisk axel. Vad står GAL för?", alt:["Global, Auktoritär, Liberal","Grön, Alternativ, Libertär","Grön, Auktoritär, Lokal","Global, Alternativ, Laglig"], svar:1 },
  { fraga:"Hur finansieras SVT och SR?", alt:["Privata ägare","Reklam","Public service-avgiften","EU-bidrag"], svar:2 },
  { fraga:"Vad är det ultimata vapnet riksdagen har mot en regering?", alt:["Budgetomröstning","Interpellation","Misstroendeomröstning","Frågestund"], svar:2 },
];

const RANKS = ["Nybörjare 🌱","Intresserad 👀","Aktivist ✊","Politisk rådgivare 🎯","Partiledare 🏆","Statsminister 🇸🇪","Politiskt geni 🧠"];

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

function QuizModal({ quiz, onClose, onDone }) {
  const [answers,setAnswers]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const score=submitted?quiz.filter((q,i)=>answers[i]===q.svar).length:0;
  const allAnswered=Object.keys(answers).length===quiz.length;
  const perfect=submitted&&score===quiz.length;

  // Förhindra scrollning bakom modal
  useEffect(()=>{
    document.body.style.overflow="hidden";
    return()=>{ document.body.style.overflow=""; };
  },[]);

  function handleSubmit(){
    if(!allAnswered)return;
    setSubmitted(true);
    if(score===quiz.length) onDone(true);
  }

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(13,27,42,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)"}}>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:600,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 32px 80px rgba(0,0,0,0.4)",position:"relative"}}>
        {/* Header */}
        <div style={{background:`linear-gradient(135deg,${NAVY},#1e3a5f)`,borderRadius:"20px 20px 0 0",padding:"24px 28px",position:"sticky",top:0,zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#fff"}}>🧠 Quiz</div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>{Object.keys(answers).length}/{quiz.length} besvarade</div>
              {!submitted&&<button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>Avbryt</button>}
            </div>
          </div>
          {/* Progressbar */}
          <div style={{marginTop:12,height:4,background:"rgba(255,255,255,0.15)",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(Object.keys(answers).length/quiz.length)*100}%`,background:GOLD,borderRadius:2,transition:"width .3s"}}/>
          </div>
          {!submitted&&<div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:6}}>⚠️ Stänger du quizen måste du börja om</div>}
        </div>

        {/* Frågor */}
        <div style={{padding:"24px 28px"}}>
          {!submitted?quiz.map((q,qi)=>(
            <div key={qi} style={{marginBottom:28}}>
              <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:NAVY,fontSize:16,marginBottom:14,lineHeight:1.4}}>{qi+1}. {q.fraga}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {q.alt.map((a,ai)=>{
                  const chosen=answers[qi]===ai;
                  return(
                    <button key={ai} onClick={()=>setAnswers(prev=>({...prev,[qi]:ai}))}
                      style={{background:chosen?"#EFF6FF":"#F9FAFB",border:`2px solid ${chosen?"#1D4ED8":"#E5E7EB"}`,borderRadius:10,padding:"12px 16px",fontSize:14,cursor:"pointer",textAlign:"left",color:NAVY,fontWeight:chosen?700:400,transition:"all .1s"}}>
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          )):(
            <div>
              {quiz.map((q,qi)=>(
                <div key={qi} style={{marginBottom:20}}>
                  <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:NAVY,fontSize:15,marginBottom:10}}>{qi+1}. {q.fraga}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {q.alt.map((a,ai)=>{
                      const correct=ai===q.svar;
                      const chosen=answers[qi]===ai;
                      const wrong=chosen&&!correct;
                      return(
                        <div key={ai} style={{background:correct?"#DCFCE7":wrong?"#FEE2E2":"#F9FAFB",border:`2px solid ${correct?"#16A34A":wrong?"#DC2626":"#E5E7EB"}`,borderRadius:10,padding:"10px 14px",fontSize:13,color:NAVY,fontWeight:correct?700:400}}>
                          {correct&&"✓ "}{wrong&&"✗ "}{a}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div style={{background:perfect?"#DCFCE7":"#FEE2E2",borderRadius:14,padding:20,textAlign:"center",marginTop:8}}>
                <div style={{fontSize:36,marginBottom:8}}>{perfect?"🏆":"💪"}</div>
                <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:NAVY,marginBottom:6}}>{score}/{quiz.length} rätt</div>
                <div style={{fontSize:14,color:GRAY,marginBottom:16}}>{perfect?"Perfekt! Du klarar modulen!":"Inte alla rätt — stäng och läs igenom avsnitten igen."}</div>
                {perfect?(
                  <button onClick={()=>onDone(true)} style={{background:"#16A34A",color:"#fff",border:"none",borderRadius:10,padding:"13px 28px",fontSize:14,fontWeight:700,cursor:"pointer"}}>Avsluta och fortsätt →</button>
                ):(
                  <button onClick={onClose} style={{background:NAVY,color:"#fff",border:"none",borderRadius:10,padding:"13px 28px",fontSize:14,fontWeight:700,cursor:"pointer"}}>Stäng och försök igen</button>
                )}
              </div>
            </div>
          )}

          {!submitted&&(
            <button onClick={handleSubmit} disabled={!allAnswered}
              style={{background:allAnswered?NAVY:"#E5E7EB",color:allAnswered?"#fff":"#9CA3AF",border:"none",borderRadius:10,padding:"14px 28px",fontSize:15,fontWeight:700,cursor:allAnswered?"pointer":"not-allowed",width:"100%",marginTop:8}}>
              {allAnswered?"Lämna in svaren →":"Svara på alla frågor"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PolitikskolaQuiz({ quiz, quizId, onComplete }) {
  const [open,setOpen]=useState(false);
  const [count,setCount]=useState(null);

  useEffect(()=>{ sbGetQuizCount(quizId).then(n=>{ if(n!==null) setCount(n); }); },[quizId]);

  function handleDone(perfect){
    if(perfect){
      sbIncrementQuiz(quizId).then(n=>{ if(n!==null) setCount(n); });
      if(onComplete) onComplete(true);
    }
    setOpen(false);
  }

  return(
    <div style={{marginTop:24}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:NAVY}}>🧠 Dags för quiz!</div>
        {count!==null&&count>0&&<div style={{fontSize:11,color:GRAY}}>{count.toLocaleString("sv-SE")} har klarat detta</div>}
      </div>
      <div style={{background:"#F9FAFB",borderRadius:14,padding:20,border:"1px solid #E5E7EB"}}>
        <div style={{fontSize:13,color:GRAY,marginBottom:16,lineHeight:1.6}}>Quizen öppnas i ett eget fönster. Stänger du det måste du börja om. Får du alla rätt klarar du modulen! 🏆</div>
        <button onClick={()=>setOpen(true)} style={{background:NAVY,color:"#fff",border:"none",borderRadius:10,padding:"13px 28px",fontSize:14,fontWeight:700,cursor:"pointer"}}>Starta quiz →</button>
      </div>
      {open&&<QuizModal quiz={quiz} onClose={()=>setOpen(false)} onDone={handleDone}/>}
    </div>
  );
}

function FinalExam({ onBack }) {
  const [answers,setAnswers]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const score=submitted?FINAL_EXAM_QUESTIONS.filter((q,i)=>answers[i]===q.svar).length:0;
  const allAnswered=Object.keys(answers).length===FINAL_EXAM_QUESTIONS.length;
  const rankIndex=submitted?Math.min(Math.floor((score/FINAL_EXAM_QUESTIONS.length)*RANKS.length),RANKS.length-1):0;

  return(
    <div style={{maxWidth:760,margin:"0 auto"}}>
      <div style={{background:"linear-gradient(135deg,#0F172A 0%,#1e3a5f 100%)",borderRadius:20,padding:"40px",marginBottom:32,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:12}}>🏆</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:"#fff",marginBottom:8}}>Slutprovet</div>
        <div style={{fontSize:15,color:"rgba(255,255,255,0.65)"}}>10 frågor som testar allt du lärt dig. Är du redo att hantera makten?</div>
      </div>
      {FINAL_EXAM_QUESTIONS.map((q,qi)=>(
        <div key={qi} style={{background:"#fff",borderRadius:14,padding:24,marginBottom:16,border:"1px solid #E5E7EB"}}>
          <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:NAVY,fontSize:16,marginBottom:14}}>Fråga {qi+1} av {FINAL_EXAM_QUESTIONS.length}: {q.fraga}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {q.alt.map((a,ai)=>{
              const chosen=answers[qi]===ai;
              const correct=submitted&&ai===q.svar;
              const wrong=submitted&&chosen&&ai!==q.svar;
              return(
                <button key={ai} onClick={()=>!submitted&&setAnswers(prev=>({...prev,[qi]:ai}))}
                  style={{background:correct?"#DCFCE7":wrong?"#FEE2E2":chosen?"#EFF6FF":"#F9FAFB",border:`2px solid ${correct?"#16A34A":wrong?"#DC2626":chosen?"#1D4ED8":"#E5E7EB"}`,borderRadius:10,padding:"12px 16px",fontSize:14,cursor:submitted?"default":"pointer",textAlign:"left",color:NAVY,fontWeight:chosen||correct?700:400}}>
                  {a}
                </button>
              );
            })}
          </div>
          {submitted&&<div style={{fontSize:12,color:answers[qi]===q.svar?"#16A34A":"#DC2626",marginTop:8,fontWeight:600}}>{answers[qi]===q.svar?"✓ Rätt!":"✗ Fel — rätt svar: "+q.alt[q.svar]}</div>}
        </div>
      ))}
      {!submitted?(
        <button onClick={()=>setSubmitted(true)} disabled={!allAnswered}
          style={{background:allAnswered?"#D97706":"#E5E7EB",color:allAnswered?"#fff":"#9CA3AF",border:"none",borderRadius:12,padding:"16px 40px",fontSize:16,fontWeight:700,cursor:allAnswered?"pointer":"not-allowed",width:"100%",marginBottom:16}}>
          {allAnswered?"Lämna in provet →":"Svara på alla frågor först"}
        </button>
      ):(
        <div style={{background:"linear-gradient(135deg,#0F172A,#1e3a5f)",borderRadius:20,padding:32,textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:48,marginBottom:12}}>{score===FINAL_EXAM_QUESTIONS.length?"🧠":score>=7?"🏆":score>=5?"👍":"💪"}</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:32,fontWeight:700,color:"#fff",marginBottom:8}}>{score}/{FINAL_EXAM_QUESTIONS.length} rätt</div>
          <div style={{fontSize:20,color:GOLD,fontWeight:700,marginBottom:16}}>Din rank: {RANKS[rankIndex]}</div>
          <div style={{fontSize:15,color:"rgba(255,255,255,0.7)",maxWidth:400,margin:"0 auto 24px"}}>
            {score===10?"Du är ett politiskt geni. Sverige behöver fler som dig.":score>=7?"Imponerande! Du har koll på hur makten fungerar.":score>=5?"Halvvägs — du vet grunderna men det finns mer att lära.":"Gå tillbaka och läs modulerna igen. Kunskapen är viktig!"}
          </div>
          <button onClick={()=>{setAnswers({});setSubmitted(false);}} style={{background:"rgba(255,255,255,0.1)",color:"#fff",border:"2px solid rgba(255,255,255,0.3)",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer"}}>Försök igen</button>
        </div>
      )}
      <button onClick={onBack} style={{background:"none",border:"none",color:BLUE,fontSize:14,fontWeight:600,cursor:"pointer"}}>← Tillbaka till Politikskolan</button>
    </div>
  );
}

function PolitikskolaTab({ activeKat, setActiveKat }) {
  const [showExam,setShowExam]=useState(false);
  const [completed,setCompleted]=useState(()=>{
    try{ const s=localStorage.getItem("ps_completed"); return s?new Set(JSON.parse(s)):new Set(); }catch{ return new Set(); }
  });
  const allDone=completed.size===POLITIKSKOLA.length;

  function handleComplete(id){
    setCompleted(prev=>{
      const next=new Set([...prev,id]);
      try{ localStorage.setItem("ps_completed",JSON.stringify([...next])); }catch{}
      return next;
    });
  }

  if(showExam) return <FinalExam onBack={()=>setShowExam(false)}/>;

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
        <PolitikskolaQuiz quiz={kat.quiz} quizId={kat.id} onComplete={(perfect)=>handleComplete(kat.id)}/>
        <button onClick={()=>setActiveKat(null)} style={{marginTop:24,background:"none",border:"none",color:BLUE,fontSize:14,fontWeight:600,cursor:"pointer"}}>← Tillbaka till Politikskolan</button>
      </div>
    );
  }

  return(
    <div>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${NAVY} 0%,#1e3a5f 100%)`,borderRadius:20,padding:"40px 48px",marginBottom:40}}>
        <div style={{display:"inline-block",background:"rgba(201,168,76,0.2)",borderRadius:20,padding:"4px 14px",fontSize:11,color:GOLD,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:16}}>🎓 Politikskolan</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:36,fontWeight:700,color:"#fff",marginBottom:12}}>Lär dig allt om makt.</div>
        <div style={{fontSize:16,color:"rgba(255,255,255,0.65)",maxWidth:560,lineHeight:1.7}}>Politik är inte en tråkig skolbok. Det är kampen om hur dina pengar används, hur din frihet ser ut och vem som får bestämma över din framtid. Vi börjar från noll.</div>
        {/* Progress */}
        <div style={{marginTop:24}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:6}}>
            <span>{completed.size}/{POLITIKSKOLA.length} moduler klara</span>
            <span>{Math.round((completed.size/POLITIKSKOLA.length)*100)}%</span>
          </div>
          <div style={{height:8,background:"rgba(255,255,255,0.15)",borderRadius:4,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(completed.size/POLITIKSKOLA.length)*100}%`,background:`linear-gradient(90deg,${GOLD},#f59e0b)`,borderRadius:4,transition:"width .5s"}}/>
          </div>
        </div>
      </div>

      {/* Moduler */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20,marginBottom:40}}>
        {POLITIKSKOLA.map((kat,i)=>{
          const done=completed.has(kat.id);
          return(
            <div key={kat.id} onClick={()=>setActiveKat(kat.id)}
              style={{background:"#fff",borderRadius:16,overflow:"hidden",border:`1px solid ${done?"#16A34A":"#E5E7EB"}`,cursor:"pointer",transition:"all .2s",position:"relative"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.1)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
              <div style={{height:6,background:done?"#16A34A":kat.color}}/>
              <div style={{padding:"24px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div style={{fontSize:28}}>{kat.icon}</div>
                  {done?<span style={{fontSize:11,color:"#16A34A",fontWeight:700,background:"#DCFCE7",padding:"3px 10px",borderRadius:20}}>KLAR ✅</span>:<span style={{fontSize:11,color:GRAY,fontWeight:700}}>Nivå {i+1}</span>}
                </div>
                <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:NAVY,marginBottom:6}}>{kat.titel}</div>
                <div style={{fontSize:13,color:GRAY,lineHeight:1.6,marginBottom:16}}>{kat.desc}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:11,color:GRAY}}>{kat.avsnitt.length} avsnitt · {kat.quiz.length} frågor</span>
                  <button style={{background:NAVY,color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>Utforska →</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slutprov */}
      <div style={{background:allDone?"linear-gradient(135deg,#0F172A,#1e3a5f)":"#F9FAFB",borderRadius:20,padding:"40px",textAlign:"center",border:allDone?"none":"2px dashed #E5E7EB"}}>
        <div style={{fontSize:48,marginBottom:12}}>🏆</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:allDone?"#fff":GRAY,marginBottom:8}}>Slutprovet: Är du ett politiskt geni?</div>
        <div style={{fontSize:14,color:allDone?"rgba(255,255,255,0.65)":GRAY,marginBottom:24,maxWidth:400,margin:"0 auto 24px"}}>
          {allDone?"Du har klarat alla moduler. Dags att bevisa att du kan hantera makten.":"Klara alla 6 moduler för att låsa upp slutprovet."}
        </div>
        <button onClick={()=>allDone&&setShowExam(true)} disabled={!allDone}
          style={{background:allDone?GOLD:"#E5E7EB",color:allDone?NAVY:"#9CA3AF",border:"none",borderRadius:12,padding:"16px 40px",fontSize:16,fontWeight:700,cursor:allDone?"pointer":"not-allowed"}}>
          {allDone?"Starta slutprovet →":"Lås upp genom att klara alla moduler"}
        </button>
      </div>
    </div>
  );
}



// ─── SÖKFUNKTION ─────────────────────────────────────────────────────────────
function SearchBar({ articles, onTabChange }) {
  const [open,setOpen]=useState(false);
  const [q,setQ]=useState("");
  const results = q.length>1 ? articles.filter(a=>(a.title+a.description).toLowerCase().includes(q.toLowerCase())).slice(0,8) : [];
  useEffect(()=>{
    function onKey(e){ if(e.key==="Escape") setOpen(false); }
    document.addEventListener("keydown",onKey);
    return()=>document.removeEventListener("keydown",onKey);
  },[]);
  return(
    <>
      <button onClick={()=>setOpen(true)} style={{background:"none",border:"1px solid #E5E7EB",borderRadius:8,padding:"6px 12px",fontSize:13,color:GRAY,cursor:"pointer"}}>🔍</button>
      {open&&(
        <div style={{position:"fixed",inset:0,background:"rgba(13,27,42,0.7)",zIndex:9998,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:80,padding:"80px 16px 16px"}} onClick={()=>setOpen(false)}>
          <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:580,boxShadow:"0 32px 80px rgba(0,0,0,0.3)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 20px",borderBottom:"1px solid #E5E7EB"}}>
              <span style={{fontSize:18}}>🔍</span>
              <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Sök efter nyheter, partier eller ämnen..." style={{flex:1,border:"none",outline:"none",fontSize:16,color:NAVY}}/>
              <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:GRAY}}>×</button>
            </div>
            {q.length>1&&(
              <div style={{maxHeight:400,overflowY:"auto"}}>
                {results.length===0?<div style={{padding:32,textAlign:"center",color:GRAY,fontSize:14}}>Inga resultat för "{q}"</div>:
                results.map(a=>(
                  <div key={a.id} onClick={()=>{openArticle(a);setOpen(false);setQ("");}} style={{padding:"12px 20px",borderBottom:"1px solid #F3F4F6",cursor:"pointer"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#F9FAFB"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{fontSize:14,fontWeight:600,color:NAVY,marginBottom:4}}>{a.title}</div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:11,color:GRAY}}>{a.source} · {timeAgo(a.pubDate)}</span>
                      {a.parties.slice(0,2).map(p=><Badge key={p} id={p}/>)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {q.length<=1&&<div style={{padding:24,color:GRAY,fontSize:13,textAlign:"center"}}>Skriv minst 2 tecken för att söka</div>}
          </div>
        </div>
      )}
    </>
  );
}

// ─── DELA-KNAPPAR ─────────────────────────────────────────────────────────────
function ShareButtons({ article }) {
  const url = encodeURIComponent(article.link);
  const text = encodeURIComponent(article.title + " – PartiFokus");
  return(
    <div style={{display:"flex",gap:6,marginTop:8}}>
      <a href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`} target="_blank" rel="noopener noreferrer"
        style={{fontSize:11,color:"#1D9BF0",fontWeight:600,textDecoration:"none",padding:"3px 8px",border:"1px solid #1D9BF0",borderRadius:4}}>𝕏</a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank" rel="noopener noreferrer"
        style={{fontSize:11,color:"#1877F2",fontWeight:600,textDecoration:"none",padding:"3px 8px",border:"1px solid #1877F2",borderRadius:4}}>FB</a>
      <a href={`https://wa.me/?text=${text}%20${url}`} target="_blank" rel="noopener noreferrer"
        style={{fontSize:11,color:"#25D366",fontWeight:600,textDecoration:"none",padding:"3px 8px",border:"1px solid #25D366",borderRadius:4}}>WA</a>
    </div>
  );
}

// ─── OM OSS ───────────────────────────────────────────────────────────────────
function OmOssTab() {
  return(
    <div style={{maxWidth:700,margin:"0 auto"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:NAVY,marginBottom:8}}>Om PartiFokus</div>
      <div style={{fontSize:15,color:GRAY,marginBottom:40,lineHeight:1.6}}>Oberoende politisk information inför riksdagsvalet 13 september 2026.</div>
      {[
        {icon:"⚖️",rubrik:"Vad är PartiFokus?",text:"PartiFokus är en oberoende digital plattform som samlar svensk politik på ett ställe. Vi aggregerar nyheter, visar pressmeddelanden, opinionsmätningar och erbjuder verktyg som Valkompass och Politikskola — helt utan politisk agenda."},
        {icon:"🔒",rubrik:"Är PartiFokus partipolitiskt bunden?",text:"Nej. PartiFokus är helt partipolitiskt obunden och drivs ideellt. Alla riksdagspartier behandlas lika."},
        {icon:"📰",rubrik:"Varifrån kommer nyheterna?",text:"Vi hämtar nyheter från SVT, SR, DN, Aftonbladet, Expressen, Omni och partiernas presskanaler via offentliga RSS-flöden. Alla artiklar tillhör respektive källa."},
        {icon:"🛡️",rubrik:"Sparas mina uppgifter?",text:"Folkopinionens röster sparas anonymt utan koppling till dig. Din röst i Valkompassen sparas inte alls. Vi samlar ingen persondata."},
        {icon:"📧",rubrik:"Kontakt",text:"Hör av dig till partifokus@gmail.com med fel, feedback eller frågor."},
      ].map((s,i)=>(
        <div key={i} style={{background:"#fff",borderRadius:16,padding:24,marginBottom:16,border:"1px solid #E5E7EB"}}>
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            <span style={{fontSize:28,flexShrink:0}}>{s.icon}</span>
            <div>
              <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:NAVY,marginBottom:8}}>{s.rubrik}</div>
              <div style={{fontSize:14,color:"#374151",lineHeight:1.7}}>{s.text}</div>
            </div>
          </div>
        </div>
      ))}
      <div style={{background:`linear-gradient(135deg,${NAVY},#1e3a5f)`,borderRadius:16,padding:24,textAlign:"center"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#fff",marginBottom:8}}>Kontakta oss</div>
        <a href="mailto:partifokus@gmail.com" style={{display:"inline-block",background:GOLD,color:NAVY,borderRadius:8,padding:"12px 28px",fontSize:14,fontWeight:700,textDecoration:"none"}}>partifokus@gmail.com</a>
      </div>
    </div>
  );
}

// ─── PARTIERNA JÄMFÖR ────────────────────────────────────────────────────────
const JAMFOR_DATA = {
  "Ekonomi & Skatter": [
    { fraga:"Sänka inkomstskatten",            svar:{M:"✓✓",SD:"~",KD:"~",L:"✓✓",C:"✓✓",S:"~",V:"✗",MP:"✗"} },
    { fraga:"Förbjuda vinster i välfärden",     svar:{M:"✗",SD:"~",KD:"✗",L:"✗",C:"✗",S:"~",V:"✓✓",MP:"✓"} },
    { fraga:"Bankskatt på övervinster",         svar:{M:"✗",SD:"✗",KD:"✗",L:"✗",C:"✗",S:"✓✓",V:"✓",MP:"✓"} },
    { fraga:"Höja försvarsanslaget",            svar:{M:"✓✓",SD:"✓",KD:"✓",L:"✓",C:"✓",S:"✓",V:"✗",MP:"~"} },
    { fraga:"Slopa karensavdraget",             svar:{M:"✗",SD:"~",KD:"✗",L:"✗",C:"✗",S:"✓✓",V:"✓",MP:"✓"} },
    { fraga:"Sänka bolagsskatten",              svar:{M:"✓✓",SD:"✗",KD:"~",L:"✓",C:"✓",S:"✗",V:"✗",MP:"✗"} },
  ],
  "Migration": [
    { fraga:"Kraftigt minska invandringen",     svar:{M:"✓✓",SD:"✓✓",KD:"~",L:"✗",C:"✗",S:"~",V:"✗",MP:"✗"} },
    { fraga:"Politik för återvandring",         svar:{M:"~",SD:"✓✓",KD:"~",L:"✗",C:"✗",S:"✗",V:"✗",MP:"✗"} },
    { fraga:"Krav på språk/arbete för PUT",     svar:{M:"✓✓",SD:"✓✓",KD:"✓",L:"✓",C:"✓",S:"✓",V:"✗",MP:"✗"} },
    { fraga:"Fler kvotflyktingar via UNHCR",    svar:{M:"✗",SD:"✗",KD:"~",L:"✓",C:"✓",S:"~",V:"✓",MP:"✓"} },
  ],
  "Klimat & Energi": [
    { fraga:"Bygga ny kärnkraft",               svar:{M:"✓✓",SD:"✓",KD:"✓✓",L:"✓",C:"~",S:"~",V:"✗",MP:"✗"} },
    { fraga:"Bindande klimatlag",               svar:{M:"✗",SD:"✗",KD:"✗",L:"~",C:"✓",S:"~",V:"✓✓",MP:"✓✓"} },
    { fraga:"Sänka drivmedelsskatten",          svar:{M:"✓✓",SD:"✓✓",KD:"✓",L:"~",C:"~",S:"~",V:"✗",MP:"✗"} },
    { fraga:"Satsa på sol och vindkraft",       svar:{M:"~",SD:"~",KD:"✗",L:"~",C:"✓",S:"~",V:"✓✓",MP:"✓✓"} },
  ],
  "Utrikes & Försvar": [
    { fraga:"Sverige kvar i NATO",              svar:{M:"✓✓",SD:"✓✓",KD:"✓✓",L:"✓✓",C:"✓✓",S:"✓✓",V:"✗",MP:"~"} },
    { fraga:"Ökat EU-samarbete",                svar:{M:"~",SD:"✗",KD:"~",L:"✓✓",C:"✓",S:"~",V:"~",MP:"~"} },
  ],
  "Sjukvård": [
    { fraga:"Kraftigt öka sjukvårdsresurserna", svar:{M:"~",SD:"~",KD:"~",L:"~",C:"~",S:"✓✓",V:"✓✓",MP:"✓"} },
    { fraga:"Tillåta privata aktörer",          svar:{M:"✓✓",SD:"~",KD:"✓",L:"✓",C:"✓",S:"~",V:"✗",MP:"✗"} },
  ],
  "Skola": [
    { fraga:"Förstatliga skolan",               svar:{M:"~",SD:"✓✓",KD:"~",L:"~",C:"✗",S:"✓✓",V:"✓",MP:"~"} },
    { fraga:"Begränsa friskolor",               svar:{M:"✗",SD:"✗",KD:"✗",L:"✗",C:"✗",S:"~",V:"✓✓",MP:"✓"} },
  ],
  "Kriminalitet": [
    { fraga:"Skärpa straffen för gängbrott",    svar:{M:"✓✓",SD:"✓✓",KD:"✓✓",L:"✓",C:"~",S:"✓✓",V:"✗",MP:"✗"} },
    { fraga:"Maffialag mot gängens ekonomi",    svar:{M:"✓",SD:"✓",KD:"✓",L:"~",C:"~",S:"✓✓",V:"~",MP:"~"} },
  ],
  "Bostäder": [
    { fraga:"Marknadshyror i nyproduktion",     svar:{M:"✓✓",SD:"✗",KD:"~",L:"✓✓",C:"✓",S:"✗",V:"✗",MP:"✗"} },
    { fraga:"Subventionera hyresrätter",        svar:{M:"✗",SD:"~",KD:"~",L:"~",C:"~",S:"✓✓",V:"✓✓",MP:"✓"} },
  ],
};

function JamforSymbol({ val }) {
  const map = {"✓✓":{bg:"#DCFCE7",color:"#16A34A",text:"✓✓"},"✓":{bg:"#D1FAE5",color:"#059669",text:"✓"},"✗":{bg:"#FEE2E2",color:"#DC2626",text:"✗"},"~":{bg:"#FEF9C3",color:"#D97706",text:"~"}};
  const s = map[val]||map["~"];
  return <div style={{background:s.bg,color:s.color,fontWeight:700,fontSize:12,borderRadius:6,padding:"4px 0",textAlign:"center",width:"100%"}}>{s.text}</div>;
}

function PartierJamforTab() {
  const [activeKat,setActiveKat]=useState(Object.keys(JAMFOR_DATA)[0]);
  const pids=["M","SD","KD","L","C","S","V","MP"];
  return(
    <div>
      <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:NAVY,marginBottom:8}}>Partierna jämför</div>
      <div style={{fontSize:14,color:GRAY,marginBottom:8}}>✓✓=driver aktivt · ✓=stöder · ✗=emot · ~=delvis</div>
      <div style={{marginBottom:20}}><a href="/partistandpunkter_2026_v7.pdf" download style={{color:BLUE,fontWeight:600,fontSize:13}}>⬇ Ladda ner fullständig valguide (PDF)</a></div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        {Object.keys(JAMFOR_DATA).map(kat=>(
          <button key={kat} onClick={()=>setActiveKat(kat)}
            style={{background:activeKat===kat?NAVY:"#fff",color:activeKat===kat?"#fff":"#374151",border:`1px solid ${activeKat===kat?NAVY:"#E5E7EB"}`,borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>
            {kat}
          </button>
        ))}
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
          <thead>
            <tr>
              <th style={{padding:"10px 12px",textAlign:"left",background:NAVY,color:"#fff",fontSize:13,minWidth:180}}>Fråga</th>
              {pids.map(pid=>{const p=gp(pid);return(<th key={pid} style={{padding:"8px",textAlign:"center",background:p?.bg||NAVY,minWidth:50}}><span style={{fontSize:11,fontWeight:800,color:p?.color||"#fff"}}>{p?.short}</span></th>);})}
            </tr>
          </thead>
          <tbody>
            {JAMFOR_DATA[activeKat].map((row,i)=>(
              <tr key={i} style={{background:i%2===0?"#fff":"#F9FAFB"}}>
                <td style={{padding:"10px 12px",fontSize:13,color:NAVY,borderBottom:"1px solid #E5E7EB"}}>{row.fraga}</td>
                {pids.map(pid=>(<td key={pid} style={{padding:"6px",textAlign:"center",borderBottom:"1px solid #E5E7EB"}}><JamforSymbol val={row.svar[pid]||"~"}/></td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{fontSize:11,color:GRAY,marginTop:12}}>Baserat på partiprogram maj 2026. <a href="/partistandpunkter_2026_v7.pdf" download style={{color:BLUE}}>Fullständig PDF med källhänvisningar</a>.</div>
    </div>
  );
}

// ─── VECKANS QUIZ ─────────────────────────────────────────────────────────────
const SB_WEEKLY_TABLE = "weekly_quiz";
const WEEKLY_QUESTIONS = [
  { q:"Vilket år grundades Socialdemokraterna?", alt:["1881","1889","1904","1921"],svar:1 },
  { q:"Hur många ledamöter finns i riksdagen?", alt:["249","299","349","399"],svar:2 },
  { q:"Vad är en interpellation?", alt:["En omröstning","En formell fråga till en minister","Ett lagförslag","En budgetdebatt"],svar:1 },
  { q:"Vilket år gick Sverige med i NATO?", alt:["2022","2023","2024","2025"],svar:2 },
  { q:"Vilket parti leds av Ebba Busch?", alt:["Moderaterna","Liberalerna","Kristdemokraterna","Centerpartiet"],svar:2 },
  { q:"Vad innebär ett misstroendevotum?", alt:["En ny lag","Riksdagen röstar bort en minister","En budgetomröstning","En valförfalskning"],svar:1 },
  { q:"Hur länge varar ett riksdagsmandat?", alt:["3 år","4 år","5 år","6 år"],svar:1 },
  { q:"Vad är 4-procentsspärren?", alt:["Max skattehöjning","Minsta röstandel för riksdagen","Max antal partier","Min valdeltagande"],svar:1 },
  { q:"Vilket år röstade Sverige om EU-medlemskap?", alt:["1991","1994","1995","2000"],svar:1 },
  { q:"Vad heter statsministerns officiella bostad?", alt:["Rosenbad","Sagerska huset","Drottningholm","Kronohuset"],svar:1 },
  { q:"Vad innebär offentlighetsprincipen?", alt:["Alla måste vara offentliga","Du kan begära ut myndighetsdokument","Media måste publicera allt","Politiker har inga hemligheter"],svar:1 },
  { q:"Vem är statsminister i maj 2026?", alt:["Stefan Löfven","Magdalena Andersson","Ulf Kristersson","Jimmie Åkesson"],svar:2 },
  { q:"Hur många regioner finns i Sverige?", alt:["18","20","21","24"],svar:2 },
  { q:"Vilket parti var störst i valet 2022?", alt:["Moderaterna","Socialdemokraterna","Sverigedemokraterna","Centerpartiet"],svar:1 },
  { q:"Vad är en proposition?", alt:["En ledamots förslag","Ett lagförslag från regeringen","En fråga till talmannen","En budgetdebatt"],svar:1 },
  { q:"Vilken myndighet genomför val i Sverige?", alt:["Riksdagen","SCB","Valmyndigheten","Länsstyrelsen"],svar:2 },
  { q:"Vad är en motion i riksdagen?", alt:["En omröstning","En ledamots eget lagförslag","En debatt","Ett utskottsbeslut"],svar:1 },
  { q:"Vilket parti ingår i Tidöregeringen?", alt:["Centerpartiet","Vänsterpartiet","Kristdemokraterna","Socialdemokraterna"],svar:2 },
  { q:"Vilket år hölls senaste riksdagsvalet?", alt:["2018","2020","2022","2024"],svar:2 },
  { q:"Vad kallas riksdagens ledare?", alt:["Statsminister","Riksdagschef","Talman","Lantråd"],svar:2 },
  { q:"Vilket organ utser statsministern?", alt:["Kungen","Folket direkt","Riksdagens talman","Riksrätten"],svar:2 },
  { q:"Vad styr kärnkraftsfrågan politiskt just nu?", alt:["V och MP är för","M och KD driver aktivt","S driver kärnkraft","C är emot förnybart"],svar:1 },
  { q:"Vad innebär proportionellt valsystem?", alt:["Varje röst väger lika","Platserna speglar röstandelen","Störst parti tar allt","Systemet med valkretsar"],svar:1 },
  { q:"Vilket av dessa är inte ett riksdagsparti 2026?", alt:["Feministiskt initiativ","Moderaterna","Vänsterpartiet","Miljöpartiet"],svar:0 },
  { q:"Vad är riksdagens viktigaste uppgift?", alt:["Utse statsministern","Stifta lagar och besluta om budget","Döma i rättsliga mål","Representera Sverige utomlands"],svar:1 },
  { q:"Vilket år bildades Sverige (traditionell räkning)?", alt:["830","970","1100","1249"],svar:1 },
  { q:"Vad kallar man ett partis ståndpunktsdokument?", alt:["Valkampanj","Partiprogram","Riksdagsmotion","Budgetmotion"],svar:1 },
  { q:"GAL-TAN — vad står GAL för?", alt:["Global, Auktoritär, Liberal","Grön, Alternativ, Libertär","Grön, Auktoritär, Lokal","Global, Alternativ, Laglig"],svar:1 },
  { q:"Vilket medieföretag äger Aftonbladet?", alt:["Bonnier","Schibsted","SVT","Stampen"],svar:1 },
  { q:"Hur finansieras SVT och SR?", alt:["Reklam","Skatt","Public service-avgiften","Privata ägare"],svar:2 },
];

function getWeekNumber() {
  const d=new Date(),onejan=new Date(d.getFullYear(),0,1);
  return Math.ceil((((d-onejan)/86400000)+onejan.getDay()+1)/7);
}
function getWeeklyQuestions() {
  const week=getWeekNumber(),seed=week*7;
  return [...WEEKLY_QUESTIONS].sort((a,b)=>{
    const ha=(seed*(WEEKLY_QUESTIONS.indexOf(a)+1))%97;
    const hb=(seed*(WEEKLY_QUESTIONS.indexOf(b)+1))%97;
    return ha-hb;
  }).slice(0,15);
}
async function sbGetWeeklyLeaderboard() {
  try {
    const week=getWeekNumber();
    const r=await fetch(`${SUPABASE_URL}/rest/v1/${SB_WEEKLY_TABLE}?week=eq.${week}&order=score.desc,time.asc&limit=15`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
    if(!r.ok)return[];return await r.json();
  } catch{return[];}
}
async function sbSubmitScore(initials,score,timeTaken) {
  try {
    const week=getWeekNumber();
    await fetch(`${SUPABASE_URL}/rest/v1/${SB_WEEKLY_TABLE}`,{method:"POST",headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify({week,initials:initials.toUpperCase().slice(0,2),score,time:timeTaken})});
    return true;
  } catch{return false;}
}
async function sbGetWeeklyCount() {
  try {
    const week=getWeekNumber();
    const r=await fetch(`${SUPABASE_URL}/rest/v1/${SB_WEEKLY_TABLE}?week=eq.${week}&select=id`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Prefer":"count=exact"}});
    const count=r.headers.get("content-range");
    return count?parseInt(count.split("/")[1])||0:0;
  } catch{return 0;}
}

function VeckansQuiz({ initialPhase, onResetPhase }) {
  const [phase,setPhase]=useState(initialPhase||"info");
  useEffect(()=>{ if(initialPhase) setPhase(initialPhase); },[initialPhase]);
  const [questions]=useState(()=>getWeeklyQuestions());
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const [timeLeft,setTimeLeft]=useState(20);
  const [startTime]=useState(Date.now);
  const [totalTime,setTotalTime]=useState(0);
  const [score,setScore]=useState(0);
  const [leaderboard,setLeaderboard]=useState([]);
  const [weekCount,setWeekCount]=useState(0);
  const [initials,setInitials]=useState("");
  const [submitted,setSubmitted]=useState(false);
  const PLAYED_KEY=`pf_quiz_week_${getWeekNumber()}`;
  const alreadyPlayed=localStorage.getItem(PLAYED_KEY);

  useEffect(()=>{sbGetWeeklyCount().then(setWeekCount);sbGetWeeklyLeaderboard().then(setLeaderboard);},[]);
  useEffect(()=>{
    if(phase!=="quiz")return;
    if(timeLeft<=0){nextQuestion(null);return;}
    const t=setTimeout(()=>setTimeLeft(t=>t-1),1000);
    return()=>clearTimeout(t);
  },[timeLeft,phase,current]);

  function startQuiz(){setPhase("quiz");setTimeLeft(20);}
  function nextQuestion(answerIdx){
    const na={...answers,[current]:answerIdx};
    setAnswers(na);
    if(current<questions.length-1){
      setCurrent(c=>c+1);
      setTimeLeft(20);
    } else {
      let s=0;
      questions.forEach((q,i)=>{if(na[i]===q.svar)s+=10;});
      const t=Math.round((Date.now()-startTime())/1000);
      setScore(s);
      setTotalTime(t);
      localStorage.setItem(PLAYED_KEY,"1");
      // Liten fördröjning så att state hinner uppdateras
      setTimeout(()=>setPhase("result"), 50);
    }
  }
  async function submitScore(){
    if(initials.length<1)return;
    await sbSubmitScore(initials,score,totalTime);
    const lb=await sbGetWeeklyLeaderboard();
    setLeaderboard(lb);setSubmitted(true);setPhase("leaderboard");
  }

  if(alreadyPlayed&&phase==="info") return(
    <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:20,padding:32,textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:12}}>📅</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:NAVY,marginBottom:8}}>Du har redan gjort veckans quiz!</div>
      <div style={{fontSize:14,color:GRAY,marginBottom:20}}>Nytt quiz nästa vecka.</div>
      <button onClick={()=>setPhase("leaderboard")} style={{background:NAVY,color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:"pointer"}}>Se topplistan →</button>
    </div>
  );

  if(phase==="info") return(
    <div style={{background:`linear-gradient(135deg,${NAVY},#1e3a5f)`,borderRadius:20,padding:32,textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:12}}>🧠</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:"#fff",marginBottom:8}}>Veckans politiska quiz</div>
      {weekCount>0&&<div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:16}}>🎯 {weekCount} har gjort veckans quiz</div>}
      <div style={{background:"rgba(255,255,255,0.1)",borderRadius:12,padding:20,marginBottom:24,textAlign:"left",maxWidth:340,margin:"0 auto 24px"}}>
        {["15 frågor om svensk politik och historia","20 sekunder per fråga — automatisk vidare","Blandat lätt och svårt","Topplista med initialer (max 2 bokstäver)","En gång per vecka"].map((r,i)=>
          <div key={i} style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginBottom:8,display:"flex",gap:8}}><span style={{color:GOLD}}>✓</span>{r}</div>)}
      </div>
      <button onClick={startQuiz} style={{background:GOLD,color:NAVY,border:"none",borderRadius:12,padding:"14px 40px",fontSize:16,fontWeight:700,cursor:"pointer"}}>Börja →</button>
    </div>
  );

  if(phase==="quiz"){
    const q=questions[current];
    const urgentColor=timeLeft<=5?"#DC2626":timeLeft<=10?"#D97706":"#16A34A";
    return(
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{background:"#fff",borderRadius:20,overflow:"hidden",border:"1px solid #E5E7EB"}}>
          <div style={{background:NAVY,padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>Fråga {current+1} av {questions.length}</div>
            <div style={{background:urgentColor,borderRadius:20,padding:"4px 14px",fontSize:18,fontWeight:700,color:"#fff"}}>{timeLeft}</div>
          </div>
          <div style={{height:4,background:"#F3F4F6"}}><div style={{height:"100%",width:`${(timeLeft/20)*100}%`,background:urgentColor,transition:"width 1s linear"}}/></div>
          <div style={{padding:28}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:NAVY,marginBottom:24,lineHeight:1.4}}>{q.q}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {q.alt.map((a,i)=>(
                <button key={i} onClick={()=>nextQuestion(i)}
                  style={{background:"#F9FAFB",border:"2px solid #E5E7EB",borderRadius:12,padding:"14px 16px",fontSize:14,cursor:"pointer",textAlign:"left",color:NAVY}}
                  onMouseEnter={e=>{e.currentTarget.style.background="#EFF6FF";e.currentTarget.style.borderColor=BLUE;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="#F9FAFB";e.currentTarget.style.borderColor="#E5E7EB";}}>
                  <span style={{fontWeight:700,color:GOLD,marginRight:8}}>{["A","B","C","D"][i]}.</span>{a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(phase==="result"){
    const maxScore=questions.length*10,pct=Math.round((score/maxScore)*100);
    const wouldMakeIt=leaderboard.length<15||score>(leaderboard[leaderboard.length-1]?.score||0);
    return(
      <div style={{maxWidth:560,margin:"0 auto"}}>
        <div style={{background:`linear-gradient(135deg,${NAVY},#1e3a5f)`,borderRadius:20,padding:32,textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:48,marginBottom:12}}>{pct>=80?"🏆":pct>=60?"🥈":pct>=40?"🥉":"💪"}</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:32,fontWeight:700,color:"#fff",marginBottom:4}}>{score}/{maxScore} poäng</div>
          <div style={{fontSize:16,color:GOLD,marginBottom:8}}>{pct>=80?"Utmärkt!":pct>=60?"Bra jobbat!":pct>=40?"Okej!":"Fortsätt öva!"}</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>Tid: {Math.floor(totalTime/60)}:{String(totalTime%60).padStart(2,"0")}</div>
        </div>
        {wouldMakeIt?(
          <div style={{background:"#DCFCE7",borderRadius:16,padding:24,marginBottom:20,textAlign:"center",border:"2px solid #16A34A"}}>
            <div style={{fontSize:24,marginBottom:8}}>🎉</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#15803D",marginBottom:12}}>Grattis, du har tagit dig till topplistan!</div>
            <div style={{fontSize:13,color:"#166534",marginBottom:16}}>Skriv in dina initialer (max 2 bokstäver)</div>
            <div style={{display:"flex",gap:8,justifyContent:"center"}}>
              <input value={initials} onChange={e=>setInitials(e.target.value.toUpperCase().slice(0,2))} placeholder="AB" maxLength={2}
                style={{border:"2px solid #16A34A",borderRadius:8,padding:"10px 16px",fontSize:24,fontWeight:700,width:80,textAlign:"center",color:NAVY}}/>
              <button onClick={submitScore} disabled={initials.length<1||submitted}
                style={{background:"#16A34A",color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",fontSize:14,fontWeight:700,cursor:"pointer"}}>Skicka in →</button>
            </div>
          </div>
        ):(
          <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:16,padding:20,marginBottom:20,textAlign:"center"}}>
            <div style={{fontSize:13,color:GRAY,marginBottom:12}}>Du kom inte med på topplistan. Försök igen nästa vecka!</div>
            <button onClick={()=>setPhase("leaderboard")} style={{background:NAVY,color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:"pointer"}}>Se topplistan →</button>
          </div>
        )}
      </div>
    );
  }

  if(phase==="leaderboard") return(
    <div style={{maxWidth:480,margin:"0 auto"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY,marginBottom:4}}>🏆 Topplistan — Vecka {getWeekNumber()}</div>
      <div style={{fontSize:13,color:GRAY,marginBottom:20}}>{weekCount} personer har gjort veckans quiz</div>
      {leaderboard.length===0?<div style={{textAlign:"center",padding:32,color:GRAY}}>Ingen har gjort quizet än!</div>:(
        <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:16,overflow:"hidden"}}>
          {leaderboard.slice(0,15).map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:16,padding:"12px 20px",borderBottom:"1px solid #F3F4F6",background:i===0?"#FFFBEB":i<3?"#F9FAFB":"#fff"}}>
              <div style={{width:28,fontWeight:700,fontSize:14,color:i===0?GOLD:i===1?"#9CA3AF":i===2?"#CD7F32":GRAY}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}</div>
              <div style={{fontWeight:700,fontSize:16,color:NAVY,minWidth:40}}>{r.initials}</div>
              <div style={{flex:1,fontSize:13,color:GRAY}}>{Math.floor(r.time/60)}:{String(r.time%60).padStart(2,"0")} min</div>
              <div style={{fontWeight:700,fontSize:16,color:NAVY}}>{r.score}p</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  return null;
}


// ─── QUIZ PAGE ────────────────────────────────────────────────────────────────
function QuizPage() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:NAVY}}>Veckans politiska quiz</div>
        <button onClick={()=>setShowLeaderboard(true)}
          style={{background:NAVY,color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
          🏆 Topplistan
        </button>
      </div>
      <div style={{fontSize:14,color:GRAY,marginBottom:20}}>Nytt quiz varje vecka — kan du ta dig till topplistan?</div>
      <VeckansQuiz initialPhase={showLeaderboard?"leaderboard":undefined} onResetPhase={()=>setShowLeaderboard(false)}/>
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
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(3,1fr)",gap:20,marginBottom:56}}>
          {[1,2,3,4].map(i=><SkeletonCard key={i}/>)}
        </div>
      ) : top.length > 0 ? (
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(3,1fr)",gap:20,marginBottom:56}}>
          {top.slice(1,5).map(a=><MedCard key={a.id} article={a}/>)}
        </div>
      ) : (
        <EmptyState text="Hämtar nyheter..."/>
      )}

      {/* UTFORSKA – valkompass + poll + politikskola */}
      {/* SENASTE OPINION */}
      <div style={{marginBottom:40}}>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:NAVY}}>Senaste opinionsmätning</div>
          <button onClick={()=>onTabChange("opinion")} style={{background:"none",border:"none",color:BLUE,fontSize:13,fontWeight:600,cursor:"pointer"}}>Visa alla →</button>
        </div>
        <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:16,padding:mobile?"16px":"24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:16}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:NAVY}}>{POLLS_DATA_HOME[0].datum}</div>
            <div style={{fontSize:11,color:GRAY}}>Källa: {POLLS_DATA_HOME[0].källa}</div>
          </div>
          <div style={{display:"flex",alignItems:"flex-end",gap:mobile?4:8,height:120,marginBottom:8}}>
            {["M","SD","KD","L","C","S","V","MP"].map(pid=>{
              const p=gp(pid),pct=POLLS_DATA_HOME[0][pid]||0;
              const maxPct=Math.max(...["M","SD","KD","L","C","S","V","MP"].map(x=>POLLS_DATA_HOME[0][x]||0));
              return(
                <div key={pid} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{fontSize:mobile?9:11,fontWeight:700,color:NAVY}}>{pct}%</div>
                  <div style={{width:"100%",background:p?.bg||"#ccc",borderRadius:"3px 3px 0 0",height:`${(pct/maxPct)*90}px`,minHeight:4}}/>
                  <div style={{display:"inline-block",padding:"1px 3px",borderRadius:3,fontSize:mobile?8:10,fontWeight:700,background:p?.bg,color:p?.color}}>{p?.short}</div>
                </div>
              );
            })}
          </div>
          <div style={{borderTop:"1px solid #E5E7EB",paddingTop:10,display:"flex",gap:16,fontSize:11,color:GRAY,flexWrap:"wrap"}}>
            <span>Högerblocket (M+SD+KD+L): <strong style={{color:NAVY}}>{(POLLS_DATA_HOME[0].M+POLLS_DATA_HOME[0].SD+POLLS_DATA_HOME[0].KD+POLLS_DATA_HOME[0].L).toFixed(1)}%</strong></span>
            <span>Vänsterblocket (C+S+V+MP): <strong style={{color:NAVY}}>{(POLLS_DATA_HOME[0].C+POLLS_DATA_HOME[0].S+POLLS_DATA_HOME[0].V+POLLS_DATA_HOME[0].MP).toFixed(1)}%</strong></span>
          </div>
        </div>
      </div>

      {/* VECKANS QUIZ - kompakt banner */}
      <div onClick={()=>onTabChange("quiz")} style={{background:"linear-gradient(135deg,#991B1B,#DC2626)",borderRadius:14,padding:"16px 24px",marginBottom:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <span style={{fontSize:32}}>🧠</span>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:2}}>Veckans quiz</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700,color:"#fff"}}>Kan du nå topplistan? Nytt quiz varje vecka</div>
          </div>
        </div>
        <button style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"2px solid rgba(255,255,255,0.4)",borderRadius:8,padding:"8px 18px",fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>Spela nu →</button>
      </div>

      <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:NAVY,marginBottom:20}}>Utforska politik på ditt sätt</div>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(3,1fr)",gap:20,marginBottom:56}}>

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
          <ValkompasCounter/>
          <button style={{background:GOLD,color:NAVY,border:"none",borderRadius:8,padding:"10px 16px",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%"}}>Gör testet nu →</button>
        </div>

        {/* Poll */}
        <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:20,padding:24}}>
          <div style={{fontSize:11,color:BLUE,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:6}}>📊 Folkopinionen</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:19,fontWeight:700,color:NAVY,lineHeight:1.3,marginBottom:6}}>Vart lutar din röst<br/>inför valet 2026?</div>
          <div style={{fontSize:12,color:GRAY,marginBottom:14}}>Rösta anonymt – se resultatet direkt.</div>
          <PollWidget compact/>
        </div>

        {/* Veckans quiz */}
        <div style={{background:"linear-gradient(135deg,#DC2626 0%,#991B1B 100%)",borderRadius:20,padding:24,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}} onClick={()=>onTabChange("quiz")}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}>🧠 Veckans Quiz</div>
          <div style={{fontSize:52,marginBottom:10}}>🏆</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#fff",lineHeight:1.3,marginBottom:10}}>Kan du nå topplistan?</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.7,marginBottom:20}}>15 frågor · 20 sek/fråga · Nytt varje vecka</div>
          <button style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"2px solid rgba(255,255,255,0.3)",borderRadius:8,padding:"10px 16px",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%"}}>Starta quiz →</button>
        </div>

        {/* Politikskola – pokal */}
        <div style={{background:"linear-gradient(135deg,#7C3AED 0%,#4F46E5 100%)",borderRadius:20,padding:24,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}} onClick={()=>onTabChange("politikskola")}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}>🎓 Politikskolan</div>
          <div style={{fontSize:64,marginBottom:12,filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.3))"}}>🏆</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#fff",lineHeight:1.3,marginBottom:10}}>Är du ett politiskt geni?</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.7,marginBottom:20}}>Gör alla 6 moduler i Politikskolan och klara slutprovet. Få din rank — från Nybörjare till Statsminister.</div>
          <button style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"2px solid rgba(255,255,255,0.3)",borderRadius:8,padding:"10px 16px",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%"}}>Testa dig själv →</button>
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
  const [lastFetched,setLastFetched]=useState(null);
  const [mobileMenuOpen,setMobileMenuOpen]=useState(false);
  const [modal,setModal]=useState(null);
  const [activeKat,setActiveKat]=useState(null);
  const mobile=useIsMobile();

  useEffect(()=>{
    Promise.allSettled(NEWS_SOURCES.map(fetchRSS)).then(results=>{
      const fetched=results.filter(r=>r.status==="fulfilled").flatMap(r=>r.value).filter(a=>!isHomepageLink(a.link)&&isPolitical(a.title+" "+(a.description||"")));
      const thirtyDays=Date.now()-30*24*60*60*1000;
      const seen=new Set();
      const deduped=fetched.filter(a=>{const k=a.title.slice(0,40).toLowerCase();if(seen.has(k))return false;seen.add(k);return !a.pubDate||new Date(a.pubDate)>thirtyDays;});
      deduped.sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));
      setNews(deduped);
      setLastFetched(new Date());
      setLoading(false);
    });
    Promise.allSettled(PRESS_SOURCES.map(fetchRSS)).then(results=>{
      const fetched=results.filter(r=>r.status==="fulfilled").flatMap(r=>r.value).filter(a=>!isHomepageLink(a.link));
      if(fetched.length>0){const seen=new Set();const deduped=fetched.filter(a=>{const k=a.title.slice(0,40).toLowerCase();if(seen.has(k))return false;seen.add(k);return true;});deduped.sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));setPress(deduped);}
    });
  },[]);

  useEffect(()=>{if(window.gtag)window.gtag("config",GA_ID,{page_path:"/"+tab});},[tab]);

  function changeTab(newTab){setTab(newTab);setParty("all");setActiveKat(null);window.scrollTo({top:0,behavior:"smooth"});}

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
          {mobile&&(
            <button onClick={()=>setMobileMenuOpen(!mobileMenuOpen)} style={{background:"none",border:"1px solid #E5E7EB",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:18,color:NAVY}}>
              {mobileMenuOpen?"✕":"☰"}
            </button>
          )}
        </div>
      </header>

      {mobile&&mobileMenuOpen&&(
        <div style={{position:"fixed",top:64,left:0,right:0,bottom:0,background:"#fff",zIndex:99,overflowY:"auto",borderTop:"1px solid #E5E7EB"}}>
          {[{id:"hem",label:"🏠 Hem"},...TABS].map(t=>(
            <button key={t.id} onClick={()=>{changeTab(t.id);setMobileMenuOpen(false);}}
              style={{display:"block",width:"100%",padding:"16px 24px",background:tab===t.id?"#F0F7FF":"transparent",color:tab===t.id?NAVY:GRAY,border:"none",borderBottom:"1px solid #F3F4F6",fontSize:16,fontWeight:tab===t.id?700:400,textAlign:"left",cursor:"pointer"}}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      <main style={{maxWidth:1200,margin:"0 auto",padding:`${mobile?24:40}px ${mobile?16:32}px`}}>
        {tab==="hem"         &&<HomePage articles={news} onTabChange={changeTab} loading={loading}/>}
        {tab==="nyheter"     &&<NewsTab articles={news} loading={loading} lastFetched={lastFetched}/>}
        {tab==="press"       &&<PressTab items={press} loading={loading}/>}
        {tab==="omrostningar"&&<OmrostningarTab/>}
        {tab==="ledamoter"   &&<LedamoterTab/>}
        {tab==="opinion"     &&<OpinionTab/>}
        {tab==="politikskola"&&<PolitikskolaTab activeKat={activeKat} setActiveKat={setActiveKat}/>}
        {tab==="om"          &&<OmOssTab/>}
        {tab==="jamfor"      &&<PartierJamforTab/>}
        {tab==="quiz"        &&<QuizPage/>}
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
                {icon:"🎯",title:"20 frågor",desc:"Inom sju politiska ämnesområden"},
                {icon:"⚡",title:"Snabbt & enkelt",desc:"Tar ungefär 3–4 minuter att genomföra"},
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

            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,paddingBottom:10,borderBottom:`2px solid ${NAVY}`}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY}}>Hitta ditt parti</div>
              <ValkompasCounter inline/>
            </div>
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
              <div onClick={()=>changeTab("om")} style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:8,cursor:"pointer"}} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.45)"}>Om PartiFokus</div>
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