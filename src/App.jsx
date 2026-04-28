import { useState, useEffect } from "react";

const GA_ID = "G-DB7QB8N6BE";
const NAVY = "#0D1B2A";
const BLUE = "#1D4ED8";
const GOLD = "#C9A84C";
const GRAY = "#6B7280";
const LIGHT = "#F9FAFB";

// Category images from Unsplash (free)
const CAT_IMAGES = {
  "Ekonomi":      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=70",
  "Migration":    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=70",
  "Klimat":       "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=70",
  "Kriminalitet": "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=600&q=70",
  "Sjukvård":     "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=70",
  "Skola":        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=70",
  "Bostäder":     "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=70",
};

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
  L:  ["liberalerna","johan pehrson","pehrson"],
  C:  ["centerpartiet","muharrem demirok","demirok"],
  S:  ["socialdemokraterna","magdalena andersson","sossarna"],
  V:  ["vänsterpartiet","nooshi dadgostar","dadgostar"],
  MP: ["miljöpartiet","per bolund","bolund","märta stenevi"],
};

const CATEGORY_KEYWORDS = {
  "Ekonomi":      ["skatt","budget","ekonomi","tillväxt","inflation","kronor","miljarder","jobb","lön","arbete"],
  "Migration":    ["migration","invandring","asyl","flyktingar","utvisning","gräns","uppehållstillstånd"],
  "Klimat":       ["klimat","miljö","utsläpp","koldioxid","förnybar","solenergi","kärnkraft","fossil"],
  "Kriminalitet": ["brott","polis","gäng","skjutning","straff","kriminalitet","trygghet","fängelse"],
  "Sjukvård":     ["sjukvård","vård","sjukhus","sjuksköterska","läkare","hälsa","patient","region"],
  "Skola":        ["skola","utbildning","elev","lärare","betyg","gymnasium","förskola"],
  "Bostäder":     ["bostad","hyra","bostadspris","byggande","hyresrätt","bostadsrätt"],
};

const TABS = [
  { id:"nyheter",    label:"Nyheter" },
  { id:"press",      label:"Pressmeddelanden" },
  { id:"riksdagen",  label:"Riksdagen" },
  { id:"ledamoter",  label:"Ledamöter" },
  { id:"opinion",    label:"Opinion" },
  { id:"valkompass", label:"Valkompass" },
];

const QUESTIONS = [
  { id:1,  text:"Invandringen till Sverige bör minskas kraftigt",                        cat:"Migration",    s:{M:1, SD:1, KD:0, L:-1,C:-1,S:0, V:-1,MP:-1} },
  { id:2,  text:"Sverige ska bygga ny kärnkraft",                                        cat:"Klimat",       s:{M:1, SD:1, KD:1, L:1, C:0, S:0, V:-1,MP:-1} },
  { id:3,  text:"Vinster i skattefinansierad välfärd ska förbjudas",                     cat:"Ekonomi",      s:{M:-1,SD:0, KD:-1,L:-1,C:-1,S:1, V:1, MP:1 } },
  { id:4,  text:"Inkomstskatten ska sänkas för de flesta",                               cat:"Ekonomi",      s:{M:1, SD:0, KD:0, L:1, C:1, S:-1,V:-1,MP:-1} },
  { id:5,  text:"Straffen för gängkriminalitet ska skärpas kraftigt",                    cat:"Kriminalitet", s:{M:1, SD:1, KD:1, L:0, C:0, S:1, V:-1,MP:-1} },
  { id:6,  text:"Sverige ska ha bindande klimatlagstiftning med hårda mål",              cat:"Klimat",       s:{M:-1,SD:-1,KD:0, L:0, C:1, S:0, V:1, MP:1 } },
  { id:7,  text:"RUT- och ROT-avdraget ska utökas",                                      cat:"Ekonomi",      s:{M:1, SD:0, KD:1, L:1, C:1, S:-1,V:-1,MP:-1} },
  { id:8,  text:"Det ska bli lättare att utvisa kriminella utlänningar",                 cat:"Migration",    s:{M:1, SD:1, KD:1, L:0, C:0, S:0, V:-1,MP:-1} },
  { id:9,  text:"Förskolan ska vara avgiftsfri för alla barn",                           cat:"Skola",        s:{M:-1,SD:0, KD:0, L:0, C:0, S:1, V:1, MP:1 } },
  { id:10, text:"Sverige ska öka försvarsbudgeten ytterligare",                          cat:"Ekonomi",      s:{M:1, SD:1, KD:1, L:1, C:1, S:1, V:-1,MP:0 } },
  { id:11, text:"Hyresreglering ska återinföras i storstäderna",                         cat:"Bostäder",     s:{M:-1,SD:0, KD:-1,L:-1,C:-1,S:1, V:1, MP:1 } },
  { id:12, text:"Polisen ska få utökade befogenheter mot organiserad brottslighet",      cat:"Kriminalitet", s:{M:1, SD:1, KD:1, L:0, C:0, S:0, V:-1,MP:-1} },
  { id:13, text:"Den offentliga sjukvården ska prioriteras framför privat",              cat:"Sjukvård",     s:{M:-1,SD:0, KD:-1,L:-1,C:-1,S:1, V:1, MP:1 } },
  { id:14, text:"Arbetstiden ska kortas till 6 timmar per dag med bibehållen lön",       cat:"Ekonomi",      s:{M:-1,SD:-1,KD:-1,L:-1,C:-1,S:-1,V:1, MP:0 } },
  { id:15, text:"Sverige ska ta emot fler kvotflyktingar via FN",                        cat:"Migration",    s:{M:-1,SD:-1,KD:0, L:1, C:1, S:0, V:1, MP:1 } },
  { id:16, text:"Pensionerna för de med lägst pension ska höjas kraftigt",               cat:"Ekonomi",      s:{M:0, SD:1, KD:1, L:0, C:0, S:1, V:1, MP:0 } },
  { id:17, text:"Barn till illegalt inresna ska ha rätt till skola och sjukvård",        cat:"Migration",    s:{M:0, SD:-1,KD:0, L:1, C:1, S:1, V:1, MP:1 } },
  { id:18, text:"Företag ska betala mer i skatt för att finansiera välfärden",           cat:"Ekonomi",      s:{M:-1,SD:0, KD:-1,L:-1,C:-1,S:1, V:1, MP:1 } },
  { id:19, text:"Vapenexporten till konfliktländer ska stoppas",                         cat:"Ekonomi",      s:{M:-1,SD:-1,KD:0, L:0, C:0, S:0, V:1, MP:1 } },
  { id:20, text:"Sverige ska ha mer lokalt självstyre och mindre central styrning",      cat:"Ekonomi",      s:{M:0, SD:-1,KD:0, L:1, C:1, S:-1,V:-1,MP:0 } },
  { id:21, text:"Det ska bli lättare för arbetsgivare att säga upp anställda",           cat:"Ekonomi",      s:{M:1, SD:0, KD:0, L:1, C:1, S:-1,V:-1,MP:-1} },
  { id:22, text:"Tiggeri ska förbjudas i Sverige",                                       cat:"Kriminalitet", s:{M:0, SD:1, KD:0, L:-1,C:-1,S:-1,V:-1,MP:-1} },
  { id:23, text:"Sverige ska satsa mer på järnväg och kollektivtrafik",                  cat:"Klimat",       s:{M:0, SD:0, KD:0, L:1, C:1, S:1, V:1, MP:1 } },
  { id:24, text:"Alla medborgare ska garanteras en grundinkomst",                        cat:"Ekonomi",      s:{M:-1,SD:-1,KD:-1,L:-1,C:-1,S:-1,V:1, MP:0 } },
  { id:25, text:"Skolval och friskolereformen ska begränsas",                            cat:"Skola",        s:{M:-1,SD:-1,KD:-1,L:-1,C:-1,S:0, V:1, MP:1 } },
];

const MOCK_NEWS = [
  { id:"n1",  title:"Kristersson: Regeringen satsar på 2 000 fler poliser",         description:"Statsminister Ulf Kristersson presenterade en satsning på fler poliser i utsatta stadsdelar.", link:"#", pubDate:new Date(Date.now()-1000*60*18).toISOString(),  source:"SVT",        parties:["M"],     category:"Kriminalitet" },
  { id:"n2",  title:"Åkesson: SD kräver hårdare gränskontroller",                   description:"Sverigedemokraternas partiledare kräver skärpta regler för asylsökande efter helgens händelser.", link:"#", pubDate:new Date(Date.now()-1000*60*45).toISOString(),  source:"Aftonbladet",parties:["SD"],    category:"Migration" },
  { id:"n3",  title:"Ebba Busch: Familjen måste stå i centrum för politiken",       description:"Kristdemokraternas partiledare presenterade ett nytt familjepolitiskt paket med fokus på barn.", link:"#", pubDate:new Date(Date.now()-1000*60*90).toISOString(),  source:"DN",         parties:["KD"],    category:"Ekonomi" },
  { id:"n4",  title:"Liberalerna kräver utredning om AI i skolan",                  description:"Johan Pehrson presenterade ett skolpaket med fokus på digital kompetens och reglering av AI.", link:"#", pubDate:new Date(Date.now()-1000*60*120).toISOString(), source:"SR",         parties:["L"],     category:"Skola" },
  { id:"n5",  title:"Centerpartiet: Jordbruket kvävs av regelkrångel",              description:"Muharrem Demirok kräver avreglering för att stärka svenska bönder mot europeisk konkurrens.", link:"#", pubDate:new Date(Date.now()-1000*60*160).toISOString(), source:"Expressen",  parties:["C"],     category:"Ekonomi" },
  { id:"n6",  title:"Socialdemokraterna vill återinföra värnskatten",               description:"Partiet presenterar ekonomiskt alternativ där värnskatten återinförs för höginkomsttagare.", link:"#", pubDate:new Date(Date.now()-1000*60*200).toISOString(), source:"SVT",        parties:["S"],     category:"Ekonomi" },
  { id:"n7",  title:"Vänsterpartiet vill stoppa vinstuttag i välfärden",            description:"Nooshi Dadgostar presenterar lagförslag om förbud mot vinstuttag i skattefinansierad verksamhet.", link:"#", pubDate:new Date(Date.now()-1000*60*240).toISOString(), source:"DN",      parties:["V"],     category:"Sjukvård" },
  { id:"n8",  title:"Miljöpartiet kräver stopp för ny kärnkraft",                   description:"Per Bolund och MP avvisar regeringens planer som för dyra och för långsamma.", link:"#", pubDate:new Date(Date.now()-1000*60*280).toISOString(), source:"SR",         parties:["MP"],    category:"Klimat" },
  { id:"n9",  title:"Moderaterna och KD oeniga om friskolornas vinstuttag",         description:"Intern spricka i Tidöalliansen synliggjordes när de två partierna gick emot varandra offentligt.", link:"#", pubDate:new Date(Date.now()-1000*60*320).toISOString(), source:"Aftonbladet",parties:["M","KD"],category:"Skola" },
  { id:"n10", title:"S och V samlar oppositionen kring ny bostadspolitik",          description:"Gemensamt program kräver återinförd hyresreglering och kraftigt ökat bostadsbyggande.", link:"#", pubDate:new Date(Date.now()-1000*60*360).toISOString(), source:"SVT",        parties:["S","V"], category:"Bostäder" },
];

const MOCK_PRESS = [
  { id:"p1", title:"Moderaterna presenterar ny jobbpolitik för 2026",        description:"M vill sänka arbetsgivaravgifter för småföretag och förenkla anställningsregler.", link:"#", pubDate:new Date(Date.now()-1000*60*30).toISOString(),  source:"Moderaterna",        party:"M"  },
  { id:"p2", title:"Socialdemokraterna: Välfärden ska inte säljas ut",       description:"S presenterar valmanifest med fokus på offentlig välfärd och stärkt sjukförsäkring.", link:"#", pubDate:new Date(Date.now()-1000*60*60).toISOString(),  source:"Socialdemokraterna", party:"S"  },
  { id:"p3", title:"SD: Ge polisen mer befogenheter mot gängkriminalitet",    description:"Sverigedemokraterna lägger fram trygghetsprogram med utökad polismakt.", link:"#", pubDate:new Date(Date.now()-1000*60*100).toISOString(), source:"Sverigedemokraterna",party:"SD" },
  { id:"p4", title:"KD kräver stärkt barnpolitik och fler familjecentraler", description:"Kristdemokraterna presenterar familjepaket med fokus på tidiga insatser.", link:"#", pubDate:new Date(Date.now()-1000*60*140).toISOString(), source:"Kristdemokraterna",  party:"KD" },
  { id:"p5", title:"Liberalerna: Skolan ska prioriteras i nästa budget",      description:"L vill öronmärka 5 miljarder extra till skolan i 2027 års budget.", link:"#", pubDate:new Date(Date.now()-1000*60*180).toISOString(), source:"Liberalerna",        party:"L"  },
  { id:"p6", title:"Centerpartiet vill förenkla för landsbygdsföretagare",   description:"C presenterar 12-punktsprogram för stärkt företagande utanför storstäderna.", link:"#", pubDate:new Date(Date.now()-1000*60*220).toISOString(), source:"Centerpartiet",      party:"C"  },
  { id:"p7", title:"Vänsterpartiet: Inför sex timmars arbetsdag",             description:"V lyfter återigen frågan om kortare arbetstid med bibehållen lön.", link:"#", pubDate:new Date(Date.now()-1000*60*260).toISOString(), source:"Vänsterpartiet",     party:"V"  },
  { id:"p8", title:"Miljöpartiet kräver klimatlag med bindande mål",          description:"MP presenterar lagförslag som tvingar regeringen att nå klimatmålen.", link:"#", pubDate:new Date(Date.now()-1000*60*300).toISOString(), source:"Miljöpartiet",       party:"MP" },
];

const MOCK_VOTES = [
  { id:"v1", titel:"Sänkt skatt för pensionärer",           datum:"2026-04-24", ja:234, nej:115, beteckning:"2025/26:Sk12", parter:[{p:"M",r:"Ja"},{p:"SD",r:"Ja"},{p:"KD",r:"Ja"},{p:"L",r:"Ja"},{p:"C",r:"Ja"},{p:"S",r:"Nej"},{p:"V",r:"Nej"},{p:"MP",r:"Nej"}] },
  { id:"v2", titel:"Utökat stöd till kommuner för välfärd", datum:"2026-04-23", ja:178, nej:171, beteckning:"2025/26:Fi8",  parter:[{p:"M",r:"Nej"},{p:"SD",r:"Nej"},{p:"KD",r:"Nej"},{p:"L",r:"Nej"},{p:"C",r:"Nej"},{p:"S",r:"Ja"},{p:"V",r:"Ja"},{p:"MP",r:"Ja"}] },
  { id:"v3", titel:"Skärpt straff för gängkriminalitet",    datum:"2026-04-22", ja:289, nej:60,  beteckning:"2025/26:Ju5",  parter:[{p:"M",r:"Ja"},{p:"SD",r:"Ja"},{p:"KD",r:"Ja"},{p:"L",r:"Ja"},{p:"C",r:"Ja"},{p:"S",r:"Ja"},{p:"V",r:"Nej"},{p:"MP",r:"Nej"}] },
  { id:"v4", titel:"Förbud mot vinstuttag i välfärden",     datum:"2026-04-21", ja:115, nej:234, beteckning:"2025/26:So3",  parter:[{p:"M",r:"Nej"},{p:"SD",r:"Nej"},{p:"KD",r:"Nej"},{p:"L",r:"Nej"},{p:"C",r:"Nej"},{p:"S",r:"Ja"},{p:"V",r:"Ja"},{p:"MP",r:"Ja"}] },
  { id:"v5", titel:"Ny kärnkraftslag",                      datum:"2026-04-20", ja:221, nej:128, beteckning:"2025/26:N2",   parter:[{p:"M",r:"Ja"},{p:"SD",r:"Ja"},{p:"KD",r:"Ja"},{p:"L",r:"Ja"},{p:"C",r:"Ja"},{p:"S",r:"Nej"},{p:"V",r:"Nej"},{p:"MP",r:"Nej"}] },
];

const MOCK_DEBATES = [
  { id:"d1", titel:"Frågestund med statsministern",            datum:"2026-04-29", tid:"14:00", typ:"Frågestund" },
  { id:"d2", titel:"Debatt om budgetpropositionen 2027",       datum:"2026-04-30", tid:"09:00", typ:"Debatt" },
  { id:"d3", titel:"Interpellationsdebatt om klimatpolitiken", datum:"2026-05-05", tid:"13:00", typ:"Interpellation" },
  { id:"d4", titel:"Debatt om migrationslagen",                datum:"2026-05-07", tid:"11:00", typ:"Debatt" },
];

const MOCK_MEMBERS = [
  { id:"m1", namn:"Ulf Kristersson",     parti:"M",  valkrets:"Stockholms län" },
  { id:"m2", namn:"Jimmie Åkesson",      parti:"SD", valkrets:"Jönköpings län" },
  { id:"m3", namn:"Ebba Busch",          parti:"KD", valkrets:"Uppsala län" },
  { id:"m4", namn:"Johan Pehrson",       parti:"L",  valkrets:"Örebro län" },
  { id:"m5", namn:"Muharrem Demirok",    parti:"C",  valkrets:"Östergötlands län" },
  { id:"m6", namn:"Magdalena Andersson", parti:"S",  valkrets:"Skåne läns västra" },
  { id:"m7", namn:"Nooshi Dadgostar",    parti:"V",  valkrets:"Stockholms kommun" },
  { id:"m8", namn:"Märta Stenevi",       parti:"MP", valkrets:"Skåne läns södra" },
  { id:"m9", namn:"Elisabeth Svantesson",parti:"M",  valkrets:"Örebro län" },
  { id:"m10",namn:"Anders Ygeman",       parti:"S",  valkrets:"Stockholms kommun" },
  { id:"m11",namn:"Per Bolund",          parti:"MP", valkrets:"Stockholms kommun" },
  { id:"m12",namn:"Anna Kinberg Batra",  parti:"M",  valkrets:"Stockholms kommun" },
];

const MOCK_POLLS_DATA = [
  { id:"o1", datum:"April 2026", källa:"Novus", M:19.2, SD:20.1, KD:5.8, L:4.9, C:6.2, S:31.4, V:7.1, MP:5.3 },
  { id:"o2", datum:"Mars 2026",  källa:"Sifo",  M:18.8, SD:19.6, KD:5.5, L:5.1, C:6.5, S:32.1, V:6.9, MP:5.5 },
  { id:"o3", datum:"Feb 2026",   källa:"Novus", M:20.1, SD:18.9, KD:5.6, L:4.8, C:6.8, S:31.0, V:7.3, MP:5.5 },
];

const NEWS_SOURCES = [
  { name:"SVT",         url:"https://www.svt.se/nyheter/rss.xml" },
  { name:"SR",          url:"https://api.sr.se/api/rss/program/83" },
  { name:"DN",          url:"https://www.dn.se/rss/" },
  { name:"Aftonbladet", url:"https://rss.aftonbladet.se/rss2/small/pages/sections/senastenytt/" },
  { name:"Expressen",   url:"https://feeds.expressen.se/nyheter/" },
  { name:"Google News", url:"https://news.google.com/rss/search?q=moderaterna+OR+socialdemokraterna+OR+sverigedemokraterna&hl=sv&gl=SE&ceid=SE:sv" },
  { name:"Google News", url:"https://news.google.com/rss/search?q=centerpartiet+OR+vänsterpartiet+OR+miljöpartiet+OR+kristdemokraterna&hl=sv&gl=SE&ceid=SE:sv" },
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

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function gp(id) { return PARTIES.find(p => p.id === id); }
function detectParties(text) {
  const l = text.toLowerCase();
  return Object.keys(PARTY_KEYWORDS).filter(k => PARTY_KEYWORDS[k].some(kw => l.includes(kw)));
}
function detectCategory(text) {
  const l = text.toLowerCase();
  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    if (words.some(w => l.includes(w))) return cat;
  }
  return "Ekonomi";
}
function timeAgo(d) {
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 60) return "just nu";
  if (diff < 3600) return Math.floor(diff/60) + " min sedan";
  if (diff < 86400) return Math.floor(diff/3600) + " tim sedan";
  return Math.floor(diff/86400) + " dagar sedan";
}
async function fetchRSS(src) {
  try {
    const res = await fetch("/api/rss?url=" + encodeURIComponent(src.url));
    const text = await res.text();
    const xml = new DOMParser().parseFromString(text, "text/xml");
    return Array.from(xml.querySelectorAll("item")).slice(0, 20).map(item => {
      const title = item.querySelector("title")?.textContent || "";
      const desc = (item.querySelector("description")?.textContent || "").replace(/<[^>]+>/g,"").slice(0,130);
      const link = item.querySelector("link")?.textContent || "#";
      return { id: item.querySelector("guid")?.textContent || link, title, description: desc, link, pubDate: item.querySelector("pubDate")?.textContent || "", source: src.name, party: src.party || null, parties: src.party ? [src.party] : detectParties(title+" "+desc), category: detectCategory(title+" "+desc) };
    });
  } catch { return []; }
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function Badge({ id, large }) {
  const p = gp(id); if (!p) return null;
  return <span style={{ display:"inline-block", padding: large?"3px 10px":"2px 7px", borderRadius:4, fontSize: large?12:10, fontWeight:700, background:p.bg, color:p.color }}>{p.short}</span>;
}

function CategoryTag({ cat, dark }) {
  const colors = { Ekonomi:"#4F46E5", Migration:"#D97706", Klimat:"#059669", Kriminalitet:"#DC2626", Sjukvård:"#2563EB", Skola:"#7C3AED", Bostäder:"#EA580C" };
  return <span style={{ fontSize:11, fontWeight:700, color: dark ? "#fff" : (colors[cat]||"#6B7280"), textTransform:"uppercase", letterSpacing:"1px" }}>{cat}</span>;
}

// News card with image - matches mockup
function NewsCard({ article, onClick, featured }) {
  const [hov, setHov] = useState(false);
  const img = CAT_IMAGES[article.category] || CAT_IMAGES["Ekonomi"];
  if (featured) {
    return (
      <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ background:"#fff", borderRadius:12, overflow:"hidden", cursor:"pointer", border:`1px solid ${hov?"#D1D5DB":"#E5E7EB"}`, boxShadow: hov?"0 8px 24px rgba(0,0,0,0.1)":"0 1px 4px rgba(0,0,0,0.05)", transition:"all .2s", gridColumn:"span 2" }}>
        <div style={{ position:"relative", height:220, overflow:"hidden" }}>
          <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .3s", transform: hov?"scale(1.03)":"scale(1)" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
          <div style={{ position:"absolute", bottom:16, left:16, right:16 }}>
            <CategoryTag cat={article.category} dark />
            <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:"#fff", lineHeight:1.3, marginTop:6 }}>{article.title}</div>
          </div>
        </div>
        <div style={{ padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:4 }}>{article.parties.map(pid => <Badge key={pid} id={pid} />)}</div>
          <span style={{ fontSize:11, color:GRAY }}>{article.source} · {timeAgo(article.pubDate)}</span>
        </div>
      </div>
    );
  }
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:"#fff", borderRadius:12, overflow:"hidden", cursor:"pointer", border:`1px solid ${hov?"#D1D5DB":"#E5E7EB"}`, boxShadow: hov?"0 8px 24px rgba(0,0,0,0.1)":"0 1px 4px rgba(0,0,0,0.05)", transition:"all .2s" }}>
      <div style={{ position:"relative", height:160, overflow:"hidden" }}>
        <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .3s", transform: hov?"scale(1.04)":"scale(1)" }} />
      </div>
      <div style={{ padding:"14px 16px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
          <CategoryTag cat={article.category} />
          <span style={{ fontSize:10, color:"#9CA3AF", marginLeft:"auto" }}>{timeAgo(article.pubDate)}</span>
        </div>
        <div style={{ fontFamily:"Georgia,serif", fontSize:15, fontWeight:700, lineHeight:1.4, color:NAVY, marginBottom:8 }}>{article.title}</div>
        <div style={{ fontSize:12, color:GRAY, lineHeight:1.5, marginBottom:12 }}>{article.description}…</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:4 }}>{article.parties.map(pid => <Badge key={pid} id={pid} />)}</div>
          <span style={{ fontSize:11, color:"#9CA3AF" }}>{article.source}</span>
        </div>
        <div style={{ marginTop:10, fontSize:12, fontWeight:600, color:BLUE }}>Läs mer →</div>
      </div>
    </div>
  );
}

// ─── ARTICLE OVERLAY ─────────────────────────────────────────────────────────
function ArticleOverlay({ article, onClose }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!article) return;
    document.body.style.overflow = "hidden";
    if (article.link && article.link !== "#") {
      fetch(`/api/rewrite?url=${encodeURIComponent(article.link)}&title=${encodeURIComponent(article.title)}`)
        .then(r => r.json()).then(d => { setContent(d.text||null); setLoading(false); })
        .catch(() => setLoading(false));
    } else setLoading(false);
    return () => { document.body.style.overflow = ""; };
  }, [article]);
  if (!article) return null;
  const img = CAT_IMAGES[article.category] || CAT_IMAGES["Ekonomi"];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"32px 16px", overflowY:"auto" }} onClick={onClose}>
      <div style={{ background:"#fff", maxWidth:740, width:"100%", borderRadius:16, overflow:"hidden" }} onClick={e => e.stopPropagation()}>
        <div style={{ position:"relative", height:220 }}>
          <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)" }} />
          <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"rgba(255,255,255,0.9)", border:"none", borderRadius:"50%", width:36, height:36, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
          <div style={{ position:"absolute", bottom:16, left:20, display:"flex", gap:6 }}>{article.parties.map(pid => <Badge key={pid} id={pid} large />)}</div>
        </div>
        <div style={{ padding:"24px 28px 32px" }}>
          <div style={{ display:"flex", gap:10, marginBottom:12 }}>
            <CategoryTag cat={article.category} />
            <span style={{ fontSize:11, color:GRAY }}>· {article.source} · {timeAgo(article.pubDate)}</span>
          </div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:24, fontWeight:700, lineHeight:1.35, marginBottom:20, color:NAVY }}>{article.title}</h1>
          {loading ? (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <div style={{ width:32, height:32, border:"3px solid #E5E7EB", borderTopColor:BLUE, borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 12px" }} />
              <div style={{ fontSize:13, color:GRAY }}>Hämtar artikel…</div>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : content ? (
            <div style={{ fontSize:15, lineHeight:1.8, color:"#374151", fontFamily:"Georgia,serif" }}>
              {content.split("\n\n").map((p,i) => <p key={i} style={{ marginBottom:16 }}>{p}</p>)}
            </div>
          ) : (
            <div>
              <p style={{ fontSize:15, lineHeight:1.8, color:"#374151", fontFamily:"Georgia,serif" }}>{article.description}</p>
              <p style={{ marginTop:16, fontSize:13, color:GRAY }}>AI-omskrivning aktiveras när Groq API-nyckel läggs till.</p>
            </div>
          )}
          <div style={{ marginTop:24, paddingTop:20, borderTop:"1px solid #F3F4F6" }}>
            {article.link && article.link !== "#"
              ? <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ color:BLUE, fontSize:14, fontWeight:600, textDecoration:"none" }}>Läs originalartikeln på {article.source} →</a>
              : <span style={{ fontSize:13, color:GRAY }}>{article.source}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── POLL WIDGET ─────────────────────────────────────────────────────────────
function PollWidget() {
  const POLL_PARTIES = [
    { id:"S",     label:"Socialdemokraterna" },
    { id:"SD",    label:"Sverigedemokraterna" },
    { id:"M",     label:"Moderaterna" },
    { id:"V",     label:"Vänsterpartiet" },
    { id:"C",     label:"Centerpartiet" },
    { id:"MP",    label:"Miljöpartiet" },
    { id:"KD",    label:"Kristdemokraterna" },
    { id:"L",     label:"Liberalerna" },
    { id:"vetej", label:"Vet ej / Röstar inte" },
  ];
  const [sel, setSel] = useState(null);
  const [voted, setVoted] = useState(() => localStorage.getItem("pf_v3") || null);
  const [votes, setVotes] = useState(() => { try { return JSON.parse(localStorage.getItem("pf_vs3")) || {}; } catch { return {}; } });

  function submit() {
    if (!sel || voted) return;
    const nv = { ...votes, [sel]: (votes[sel]||0)+1 };
    setVotes(nv); setVoted(sel);
    localStorage.setItem("pf_v3", sel);
    localStorage.setItem("pf_vs3", JSON.stringify(nv));
  }

  const total = Object.values(votes).reduce((a,b)=>a+b,0);

  return (
    <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:"24px 24px 20px" }}>
      <div style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:700, color:NAVY, marginBottom:4 }}>Var lutar din röst inför valet 2026?</div>
      <div style={{ fontSize:12, color:GRAY, marginBottom:18 }}>{total > 0 ? `${total.toLocaleString()} röster` : "Bli den första att rösta"} · Helt anonym</div>
      {!voted ? (
        <>
          {POLL_PARTIES.map(({ id, label }) => {
            const p = gp(id); const isSel = sel === id;
            return (
              <div key={id} onClick={() => setSel(id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 12px", borderRadius:8, border: isSel?`2px solid ${BLUE}`:"1px solid #E5E7EB", background: isSel?"#EFF6FF":"#FAFAFA", cursor:"pointer", marginBottom:6, transition:"all .1s" }}>
                <div style={{ width:18, height:18, borderRadius:"50%", border: isSel?`5px solid ${BLUE}`:"2px solid #D1D5DB", background:"#fff", flexShrink:0 }} />
                {p && <span style={{ display:"inline-block", padding:"2px 7px", borderRadius:4, fontSize:11, fontWeight:700, background:p.bg, color:p.color, flexShrink:0 }}>{p.short}</span>}
                <span style={{ fontSize:13, color: isSel?NAVY:"#374151", fontWeight: isSel?600:400 }}>{label}</span>
              </div>
            );
          })}
          <button onClick={submit} disabled={!sel} style={{ marginTop:12, background: sel?NAVY:"#E5E7EB", color: sel?"#fff":"#9CA3AF", border:"none", borderRadius:8, padding:"11px 28px", fontSize:14, fontWeight:700, cursor: sel?"pointer":"not-allowed", transition:"all .15s" }}>Rösta</button>
        </>
      ) : (
        <>
          <div style={{ fontSize:13, color:NAVY, fontWeight:600, marginBottom:14 }}>✓ Du röstade på: {POLL_PARTIES.find(p=>p.id===voted)?.label}</div>
          {POLL_PARTIES.map(({ id, label }) => {
            const p = gp(id); const pct = total>0?Math.round(((votes[id]||0)/total)*100):0; const isV = voted===id;
            return (
              <div key={id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
                <div style={{ width:36, flexShrink:0 }}>{p?<span style={{ display:"inline-block", padding:"2px 5px", borderRadius:3, fontSize:10, fontWeight:700, background:p.bg, color:p.color }}>{p.short}</span>:<span style={{ fontSize:10, color:GRAY }}>–</span>}</div>
                <div style={{ flex:1, height:16, background:"#F3F4F6", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ width:`${pct}%`, height:"100%", background: isV?GOLD:(p?.bg||"#9CA3AF"), minWidth:2, transition:"width .4s" }} />
                </div>
                <div style={{ width:34, fontSize:12, fontWeight:700, textAlign:"right", color: isV?GOLD:"#374151" }}>{pct}%</div>
              </div>
            );
          })}
          <div style={{ marginTop:8, fontSize:11, color:GRAY }}>Röstning är anonym och kan inte spåras till dig.</div>
        </>
      )}
    </div>
  );
}

// ─── VALKOMPASS ──────────────────────────────────────────────────────────────
function Valkompass() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const progress = Object.keys(answers).length;
  const currentQ = QUESTIONS.find(q => answers[q.id] === undefined);

  function answer(qid, val) {
    const na = { ...answers, [qid]: val };
    setAnswers(na);
    if (Object.keys(na).length === QUESTIONS.length) {
      const scores = {};
      PARTIES.filter(p=>p.id!=="all").forEach(p => { scores[p.id]=0; });
      QUESTIONS.forEach(q => {
        const ua = na[q.id]; if (ua===0) return;
        PARTIES.filter(p=>p.id!=="all").forEach(p => { scores[p.id] += ua*(q.s[p.id]||0); });
      });
      const vals = Object.values(scores), mn=Math.min(...vals), mx=Math.max(...vals), rng=mx-mn||1;
      const norm = {};
      Object.entries(scores).forEach(([pid,sc]) => { norm[pid]=Math.round(((sc-mn)/rng)*100); });
      setResult(Object.entries(norm).sort((a,b)=>b[1]-a[1]));
    }
  }

  if (result) {
    const wp = gp(result[0][0]);
    return (
      <div style={{ maxWidth:580, margin:"0 auto" }}>
        <div style={{ background:NAVY, borderRadius:12, padding:32, marginBottom:24, textAlign:"center" }}>
          <div style={{ fontSize:11, color:GOLD, letterSpacing:"2px", textTransform:"uppercase", marginBottom:10 }}>Ditt resultat</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:26, fontWeight:700, color:"#fff", marginBottom:16 }}>Du passar bäst med {wp?.name}</div>
          <div style={{ width:60, height:60, borderRadius:"50%", background:wp?.bg, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:wp?.color, fontWeight:700, fontSize:22 }}>{wp?.short}</span>
          </div>
        </div>
        {result.map(([pid,score],i) => {
          const p=gp(pid);
          return (
            <div key={pid} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
              <div style={{ width:24, fontSize:11, color:GRAY, textAlign:"right" }}>{i+1}</div>
              <div style={{ width:44 }}><Badge id={pid} large /></div>
              <div style={{ flex:1, height:22, background:"#F3F4F6", borderRadius:4, overflow:"hidden" }}>
                <div style={{ width:`${score}%`, height:"100%", background:i===0?GOLD:(p?.bg||"#E5E7EB"), opacity:i===0?1:0.75 }} />
              </div>
              <div style={{ width:40, fontSize:13, fontWeight:700, textAlign:"right", color:i===0?GOLD:"#374151" }}>{score}%</div>
            </div>
          );
        })}
        <div style={{ marginTop:24, textAlign:"center" }}>
          <button onClick={() => { setAnswers({}); setResult(null); }} style={{ background:NAVY, color:"#fff", border:"none", borderRadius:8, padding:"12px 28px", fontSize:14, fontWeight:600, cursor:"pointer" }}>Gör om testet</button>
        </div>
        <div style={{ marginTop:12, fontSize:11, color:GRAY, textAlign:"center" }}>Resultatet är ett ungefärligt underlag och inte en exakt bild av partiernas politik.</div>
      </div>
    );
  }
  if (!currentQ) return null;
  return (
    <div style={{ maxWidth:580, margin:"0 auto" }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:GRAY, marginBottom:8 }}>
          <span>Fråga {progress+1} av {QUESTIONS.length}</span>
          <span>{Math.round((progress/QUESTIONS.length)*100)}% klart</span>
        </div>
        <div style={{ height:6, background:"#E5E7EB", borderRadius:3, overflow:"hidden" }}>
          <div style={{ width:`${(progress/QUESTIONS.length)*100}%`, height:"100%", background:BLUE, transition:"width .3s" }} />
        </div>
      </div>
      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:28, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize:11, color:BLUE, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", marginBottom:12 }}>{currentQ.cat}</div>
        <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:NAVY, lineHeight:1.4, marginBottom:28 }}>{currentQ.text}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {[{label:"Ja",val:1,bg:NAVY,color:"#fff"},{label:"Vet ej",val:0,bg:"#F3F4F6",color:"#374151"},{label:"Nej",val:-1,bg:"#FEE2E2",color:"#DC2626"}].map(o => (
            <button key={o.val} onClick={() => answer(currentQ.id, o.val)} style={{ background:o.bg, color:o.color, border:"none", borderRadius:8, padding:"14px 8px", fontWeight:700, fontSize:15, cursor:"pointer", transition:"opacity .1s" }}
              onMouseEnter={e=>e.target.style.opacity="0.85"} onMouseLeave={e=>e.target.style.opacity="1"}>
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ fontSize:12, color:GRAY, textAlign:"center", marginTop:12 }}>Svara på alla {QUESTIONS.length} frågor för att se ditt resultat</div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ articles, onArticleClick, onTabChange }) {
  const top4 = articles.slice(0, 4);
  return (
    <div>
      {/* HERO */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center", marginBottom:64 }}>
        <div>
          <div style={{ fontSize:12, color:BLUE, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", marginBottom:16 }}>Oberoende politisk analys</div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:48, fontWeight:700, color:NAVY, lineHeight:1.15, marginBottom:16 }}>
            Fakta före vägval.<br/>Fokus före åsikt.
          </h1>
          <p style={{ fontSize:17, color:GRAY, lineHeight:1.6, marginBottom:24 }}>
            Vi granskar politiken bakom rubrikerna – och konsekvenserna du inte ser.
          </p>
          <div style={{ display:"flex", gap:16, marginBottom:32 }}>
            {[{icon:"⚖️",t:"Oberoende",d:"Inga kopplingar. Inga agendor."},{icon:"📊",t:"Faktabaserat",d:"Data, källor och konsekvenser."},{icon:"🔔",t:"För alla",d:"Komplext blir förståeligt."}].map(f=>(
              <div key={f.t}>
                <div style={{ fontSize:20, marginBottom:4 }}>{f.icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color:NAVY, marginBottom:2 }}>{f.t}</div>
                <div style={{ fontSize:12, color:GRAY, lineHeight:1.4 }}>{f.d}</div>
              </div>
            ))}
          </div>
          <button onClick={() => onTabChange("nyheter")} style={{ background:NAVY, color:"#fff", border:"none", borderRadius:8, padding:"14px 28px", fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
            Senaste nyheterna →
          </button>
        </div>

        {/* Hero image card */}
        <div style={{ position:"relative", borderRadius:16, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
          <img src={HERO_IMAGE} alt="Stockholm" style={{ width:"100%", height:420, objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(13,27,42,0.85) 0%, transparent 50%)" }} />
          {top4[0] && (
            <div onClick={() => onArticleClick(top4[0])} style={{ position:"absolute", bottom:0, left:0, right:0, padding:24, cursor:"pointer" }}>
              <div style={{ fontSize:10, color:GOLD, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", marginBottom:8 }}>NY ANALYS</div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:"#fff", lineHeight:1.3, marginBottom:8 }}>{top4[0].title}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", marginBottom:12 }}>{top4[0].description}</div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>⏱ {timeAgo(top4[0].pubDate)}</span>
                <span style={{ fontSize:13, color:GOLD, fontWeight:600, cursor:"pointer" }}>Läs analysen →</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DET HÄNDER JUST NU */}
      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:20 }}>
        <div style={{ fontFamily:"Georgia,serif", fontSize:26, fontWeight:700, color:NAVY }}>Det händer just nu</div>
        <button onClick={() => onTabChange("nyheter")} style={{ background:"none", border:"none", color:BLUE, fontSize:13, fontWeight:600, cursor:"pointer" }}>Visa alla →</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20, marginBottom:64 }}>
        {top4.slice(1,5).map(a => <NewsCard key={a.id} article={a} onClick={() => onArticleClick(a)} />)}
      </div>

      {/* UTFORSKA */}
      <div style={{ fontFamily:"Georgia,serif", fontSize:26, fontWeight:700, color:NAVY, marginBottom:20 }}>Utforska politik på ditt sätt</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:40 }}>
        <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:24, cursor:"pointer" }} onClick={() => onTabChange("valkompass")}>
          <div style={{ fontSize:32, marginBottom:12 }}>🗳️</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:NAVY, marginBottom:8 }}>Din politiska profil</div>
          <div style={{ fontSize:13, color:GRAY, lineHeight:1.5, marginBottom:16 }}>Svara på 25 frågor och se vilket parti du stämmer bäst överens med.</div>
          <span style={{ fontSize:13, fontWeight:600, color:BLUE }}>Gör testet →</span>
        </div>
        <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:24 }}>
          <div style={{ fontSize:32, marginBottom:12 }}>📊</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:NAVY, marginBottom:8 }}>Så tycker väljarna</div>
          <div style={{ fontSize:13, color:GRAY, lineHeight:1.5, marginBottom:16 }}>Se vad väljarna tycker i viktiga frågor – just nu.</div>
          <PollMini />
        </div>
        <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:24, cursor:"pointer" }} onClick={() => onTabChange("opinion")}>
          <div style={{ fontSize:32, marginBottom:12 }}>📈</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:NAVY, marginBottom:8 }}>Jämför partier</div>
          <div style={{ fontSize:13, color:GRAY, lineHeight:1.5, marginBottom:16 }}>Opinionsmätningar och partiernas ställning i opinionen.</div>
          {["S","SD","M","V"].map(pid => {
            const p=gp(pid); const pct=MOCK_POLLS_DATA[0][pid];
            return (
              <div key={pid} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <Badge id={pid} />
                <div style={{ flex:1, height:10, background:"#F3F4F6", borderRadius:2, overflow:"hidden" }}>
                  <div style={{ width:`${pct*2.5}%`, height:"100%", background:p?.bg }} />
                </div>
                <span style={{ fontSize:11, fontWeight:700, width:36, textAlign:"right" }}>{pct}%</span>
              </div>
            );
          })}
          <span style={{ fontSize:13, fontWeight:600, color:BLUE, marginTop:10, display:"block" }}>Se resultat →</span>
        </div>
      </div>

      {/* POPULÄRA ÄMNEN */}
      <div style={{ fontFamily:"Georgia,serif", fontSize:26, fontWeight:700, color:NAVY, marginBottom:20 }}>Populära ämnen</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:48 }}>
        {[{cat:"Ekonomi",icon:"💰"},{cat:"Skola",icon:"📚"},{cat:"Klimat",icon:"🌿"},{cat:"Sjukvård",icon:"🏥"},{cat:"Migration",icon:"🌍"},{cat:"Kriminalitet",icon:"🔒"},{cat:"Bostäder",icon:"🏠"}].map(({cat,icon}) => (
          <button key={cat} onClick={() => onTabChange("nyheter")} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:24, padding:"9px 18px", fontSize:13, fontWeight:500, color:"#374151", cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all .1s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=NAVY;e.currentTarget.style.background=NAVY;e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#E5E7EB";e.currentTarget.style.background="#fff";e.currentTarget.style.color="#374151";}}>
            {icon} {cat}
          </button>
        ))}
      </div>

      {/* NEWSLETTER */}
      <div style={{ background:NAVY, borderRadius:16, padding:40, marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", gap:32 }}>
        <div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:700, color:"#fff", marginBottom:8 }}>Håll dig uppdaterad</div>
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.6)" }}>Få de viktigaste analyserna och insikterna direkt i din inkorg varje vecka.</div>
        </div>
        <div style={{ display:"flex", gap:10, flexShrink:0 }}>
          <input placeholder="Din e-postadress" style={{ padding:"12px 16px", borderRadius:8, border:"none", fontSize:14, width:240, outline:"none" }} />
          <button style={{ background:GOLD, color:NAVY, border:"none", borderRadius:8, padding:"12px 20px", fontSize:14, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>Prenumerera</button>
        </div>
      </div>
    </div>
  );
}

function PollMini() {
  const voted = localStorage.getItem("pf_v3");
  if (!voted) return <span style={{ fontSize:13, fontWeight:600, color:BLUE, display:"block" }}>Rösta nu →</span>;
  const p = gp(voted);
  return <div style={{ fontSize:13, color:GRAY }}>Du röstade på {p?.name || voted}</div>;
}

// ─── OTHER TABS ───────────────────────────────────────────────────────────────
function SectionTitle({ children }) {
  return <div style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:700, color:NAVY, borderBottom:`2px solid ${NAVY}`, paddingBottom:8, marginBottom:24 }}>{children}</div>;
}

function NewsTab({ party, onArticleClick, articles, loading }) {
  const [catFilter, setCatFilter] = useState("Alla");
  const cats = ["Alla", ...Object.keys(CATEGORY_KEYWORDS)];
  let filtered = party==="all" ? articles : articles.filter(a => a.parties.includes(party));
  if (catFilter!=="Alla") filtered = filtered.filter(a => a.category===catFilter);
  return (
    <div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        {cats.map(cat => (
          <button key={cat} onClick={() => setCatFilter(cat)} style={{ background:catFilter===cat?NAVY:"#fff", color:catFilter===cat?"#fff":"#374151", border:`1px solid ${catFilter===cat?NAVY:"#E5E7EB"}`, borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>
            {cat}
          </button>
        ))}
      </div>
      <SectionTitle>{party==="all"?"Alla nyheter":gp(party)?.name} <span style={{ fontFamily:"sans-serif", fontSize:13, fontWeight:400, color:GRAY, marginLeft:8 }}>{filtered.length} artiklar</span></SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
        {filtered.map(a => <NewsCard key={a.id} article={a} onClick={() => onArticleClick(a)} />)}
      </div>
    </div>
  );
}

function PressTab({ party, onArticleClick, items }) {
  const filtered = party==="all" ? items : items.filter(a => a.party===party);
  return (
    <div>
      <SectionTitle>Pressmeddelanden <span style={{ fontFamily:"sans-serif", fontSize:13, fontWeight:400, color:GRAY, marginLeft:8 }}>{filtered.length} st</span></SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
        {filtered.map(a => <NewsCard key={a.id} article={{...a, parties:a.party?[a.party]:[], category:"Ekonomi"}} onClick={() => onArticleClick(a)} />)}
      </div>
    </div>
  );
}

function RiksdagenTab() {
  return (
    <div>
      <SectionTitle>Senaste omröstningar</SectionTitle>
      {MOCK_VOTES.map(v => {
        const tot=v.ja+v.nej, jaPct=Math.round(v.ja/tot*100);
        return (
          <div key={v.id} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:20, marginBottom:14 }}>
            <div style={{ fontFamily:"Georgia,serif", fontSize:16, fontWeight:700, marginBottom:10, color:NAVY }}>{v.titel}</div>
            <div style={{ display:"flex", gap:16, fontSize:12, color:GRAY, marginBottom:8 }}>
              <span style={{ color:"#059669", fontWeight:700 }}>✓ Ja: {v.ja}</span>
              <span style={{ color:"#DC2626", fontWeight:700 }}>✗ Nej: {v.nej}</span>
              <span style={{ marginLeft:"auto" }}>{v.datum} · {v.beteckning}</span>
            </div>
            <div style={{ height:8, background:"#F3F4F6", borderRadius:2, overflow:"hidden", display:"flex", marginBottom:14 }}>
              <div style={{ width:`${jaPct}%`, background:"#059669" }} />
              <div style={{ width:`${100-jaPct}%`, background:"#DC2626" }} />
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {v.parter.map(({p,r}) => <span key={p} style={{ display:"flex", alignItems:"center", gap:3 }}><Badge id={p} /><span style={{ fontSize:11, color:r==="Ja"?"#059669":"#DC2626", fontWeight:700 }}>{r}</span></span>)}
            </div>
          </div>
        );
      })}
      <SectionTitle style={{ marginTop:32 }}>Kommande debatter</SectionTitle>
      {MOCK_DEBATES.map(d => (
        <div key={d.id} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:10, padding:"14px 20px", marginBottom:10, display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontFamily:"Georgia,serif", fontWeight:700, color:GOLD, minWidth:60, fontSize:13 }}>{d.datum.slice(5)}</div>
          <div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:15, fontWeight:700, color:NAVY }}>{d.titel}</div>
            <div style={{ fontSize:11, color:GRAY, textTransform:"uppercase", letterSpacing:"1px", marginTop:2 }}>{d.typ} · {d.tid}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LedamoterTab({ party }) {
  const filtered = party==="all"?MOCK_MEMBERS:MOCK_MEMBERS.filter(m=>m.parti===party);
  const initials = n => n.split(" ").map(x=>x[0]).join("").slice(0,2);
  return (
    <div>
      <SectionTitle>Riksdagsledamöter</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:14 }}>
        {filtered.map(m => {
          const p=gp(m.parti);
          return (
            <div key={m.id} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:20, textAlign:"center" }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:p?.bg, margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:p?.color, fontWeight:700, fontFamily:"Georgia,serif", fontSize:18 }}>{initials(m.namn)}</span>
              </div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:14, fontWeight:700, marginBottom:6, color:NAVY }}>{m.namn}</div>
              <div style={{ marginBottom:6 }}><Badge id={m.parti} large /></div>
              <div style={{ fontSize:11, color:GRAY }}>{m.valkrets}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OpinionTab() {
  const pids=["M","SD","KD","L","C","S","V","MP"], latest=MOCK_POLLS_DATA[0];
  return (
    <div>
      <SectionTitle>Opinionsmätningar</SectionTitle>
      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:24, marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:20 }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:700, color:NAVY }}>Senaste – {latest.datum}</div>
          <div style={{ fontSize:12, color:GRAY }}>{latest.källa}</div>
        </div>
        {pids.map(pid => {
          const p=gp(pid), pct=latest[pid];
          return (
            <div key={pid} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:9 }}>
              <div style={{ width:40 }}><Badge id={pid} large /></div>
              <div style={{ flex:1, height:22, background:"#F3F4F6", borderRadius:3, overflow:"hidden" }}>
                <div style={{ width:`${pct*2.8}%`, height:"100%", background:p?.bg, minWidth:4 }} />
              </div>
              <div style={{ fontSize:13, fontWeight:700, minWidth:40, textAlign:"right", color:NAVY }}>{pct}%</div>
            </div>
          );
        })}
        <div style={{ marginTop:14, fontSize:12, color:GRAY, borderTop:"1px solid #F3F4F6", paddingTop:12 }}>
          Högerblocket: <strong>{(latest.M+latest.SD+latest.KD+latest.L+latest.C).toFixed(1)}%</strong>
          <span style={{ margin:"0 12px" }}>·</span>
          Vänsterblocket: <strong>{(latest.S+latest.V+latest.MP).toFixed(1)}%</strong>
        </div>
      </div>
      {MOCK_POLLS_DATA.map(poll => (
        <div key={poll.id} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:10, padding:"14px 20px", marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <div style={{ fontFamily:"Georgia,serif", fontWeight:700, color:NAVY }}>{poll.datum}</div>
            <div style={{ fontSize:11, color:GRAY }}>{poll.källa}</div>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {pids.map(pid => <span key={pid} style={{ display:"flex", alignItems:"center", gap:3 }}><Badge id={pid} /><span style={{ fontSize:12, fontWeight:700, color:NAVY }}>{poll[pid]}%</span></span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("hem");
  const [party, setParty] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [news, setNews] = useState(MOCK_NEWS);
  const [press, setPress] = useState(MOCK_PRESS);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    Promise.allSettled(NEWS_SOURCES.map(fetchRSS)).then(results => {
      const fetched = results.filter(r=>r.status==="fulfilled").flatMap(r=>r.value).filter(a=>a.parties.length>0);
      const sevenDays = Date.now()-7*24*60*60*1000;
      const all = [...MOCK_NEWS,...fetched];
      const seen=new Set();
      const deduped = all.filter(a=>{const k=a.title.slice(0,40).toLowerCase();if(seen.has(k))return false;seen.add(k);return new Date(a.pubDate)>sevenDays;});
      deduped.sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));
      setNews(deduped);
    });
    Promise.allSettled(PRESS_SOURCES.map(fetchRSS)).then(results => {
      const fetched = results.filter(r=>r.status==="fulfilled").flatMap(r=>r.value);
      if (fetched.length>0) {
        const seen=new Set();
        const all=[...fetched,...MOCK_PRESS].filter(a=>{const k=a.title.slice(0,40).toLowerCase();if(seen.has(k))return false;seen.add(k);return true;});
        all.sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));
        setPress(all);
      }
    });
  }, []);

  useEffect(() => {
    if (window.gtag) window.gtag("config", GA_ID, { page_path:"/"+tab });
  }, [tab]);

  const showPartyFilter = !["hem","valkompass"].includes(tab);

  return (
    <div style={{ fontFamily:"system-ui,sans-serif", background:LIGHT, minHeight:"100vh", color:NAVY }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {selectedArticle && <ArticleOverlay article={selectedArticle} onClose={() => setSelectedArticle(null)} />}

      {/* HEADER */}
      <header style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 32px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          {/* Logo */}
          <button onClick={() => setTab("hem")} style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
            <span style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:700, color:NAVY }}>
              Parti<span style={{ color:BLUE, borderBottom:`2px solid ${BLUE}`, paddingBottom:1 }}>Fokus</span>
            </span>
          </button>

          {/* Nav */}
          <nav style={{ display:"flex", gap:4 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"8px 14px", fontSize:14, fontWeight: tab===t.id?700:400, color: tab===t.id?NAVY:GRAY, borderBottom: tab===t.id?`2px solid ${NAVY}`:"2px solid transparent", whiteSpace:"nowrap" }}>
                {t.label}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:GRAY }}>🔍</button>
            <button onClick={() => setTab("nyheter")} style={{ background:NAVY, color:"#fff", border:"none", borderRadius:8, padding:"9px 20px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              Nyheter
            </button>
          </div>
        </div>

        {/* Party filter */}
        {showPartyFilter && (
          <div style={{ background:"#F9FAFB", borderTop:"1px solid #E5E7EB", overflowX:"auto", scrollbarWidth:"none" }}>
            <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 32px", display:"flex" }}>
              {PARTIES.map(p => (
                <button key={p.id} onClick={() => setParty(p.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"8px 12px", fontSize:11, fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase", color: party===p.id?NAVY:GRAY, borderBottom: party===p.id?`2px solid ${NAVY}`:"2px solid transparent", whiteSpace:"nowrap" }}>
                  {p.id!=="all" && <span style={{ display:"inline-block", padding:"1px 5px", borderRadius:3, fontSize:9, fontWeight:700, background:p.bg, color:p.color, marginRight:5 }}>{p.short}</span>}
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main style={{ maxWidth:1200, margin:"0 auto", padding:"40px 32px" }}>
        {tab==="hem"        && <HomePage articles={news} onArticleClick={setSelectedArticle} onTabChange={setTab} />}
        {tab==="nyheter"    && <NewsTab party={party} onArticleClick={setSelectedArticle} articles={news} />}
        {tab==="press"      && <PressTab party={party} onArticleClick={setSelectedArticle} items={press} />}
        {tab==="riksdagen"  && <RiksdagenTab />}
        {tab==="ledamoter"  && <LedamoterTab party={party} />}
        {tab==="opinion"    && <OpinionTab />}
        {tab==="valkompass" && <div><SectionTitle>Din politiska profil – Valkompass 2026</SectionTitle><Valkompass /></div>}
      </main>

      {/* FOOTER */}
      <footer style={{ background:NAVY, marginTop:64, padding:"48px 32px 32px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:40 }}>
            <div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:"#fff", marginBottom:12 }}>
                Parti<span style={{ color:GOLD }}>Fokus</span>
              </div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.7, marginBottom:16 }}>Oberoende politisk nyhetstjänst. Partipolitiskt neutral. Alla artiklar tillhör respektive källa.</div>
            </div>
            {[
              { title:"Utforska", links:["Nyheter","Pressmeddelanden","Riksdagen","Ledamöter","Opinion"] },
              { title:"Om oss",   links:["Vår metod","Team","Källor","Integritet"] },
              { title:"Mer",      links:["Valkompass","Kontakt","Vanliga frågor"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize:11, color:GOLD, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", marginBottom:12 }}>{col.title}</div>
                {col.links.map(l => <div key={l} style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginBottom:8, cursor:"pointer" }}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:20, display:"flex", justifyContent:"space-between", fontSize:12, color:"rgba(255,255,255,0.25)", flexWrap:"wrap", gap:8 }}>
            <span>© {new Date().getFullYear()} PartiFokus. Drivs ideellt.</span>
            <span>Utgivningsbevis sökt hos MPRT · Redaktionellt neutral · partifokus@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}