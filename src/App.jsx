9+import { useState, useEffect } from "react";

const GA_ID = "G-DB7QB8N6BE";
const GOLD = "#C9A84C";
const NAVY = "#1B2A4A";

const PARTIES = [
  { id:"all", name:"Alla partier",        short:"ALLA", color:"#1a1a1a", bg:"#e0e0e0" },
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
  { id:"hem",        label:"Hem" },
  { id:"nyheter",    label:"Nyheter" },
  { id:"press",      label:"Pressmeddelanden" },
  { id:"riksdagen",  label:"Riksdagen" },
  { id:"ledamoter",  label:"Ledamöter" },
  { id:"opinion",    label:"Opinion" },
  { id:"valkompass", label:"🗳️ Valkompass" },
];

// ─── 25 VALKOMPASS QUESTIONS ─────────────────────────────────────────────────
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

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const MOCK_NEWS = [
  { id:"n1",  title:"Kristersson: Regeringen satsar på 2 000 fler poliser",            description:"Statsminister Ulf Kristersson presenterade en satsning på fler poliser i utsatta stadsdelar.",     link:"#", pubDate:new Date(Date.now()-1000*60*18).toISOString(),  source:"SVT",        parties:["M"],       category:"Kriminalitet" },
  { id:"n2",  title:"Åkesson: SD kräver hårdare gränskontroller",                      description:"Sverigedemokraternas partiledare kräver skärpta regler för asylsökande efter helgens händelser.",   link:"#", pubDate:new Date(Date.now()-1000*60*45).toISOString(),  source:"Aftonbladet", parties:["SD"],      category:"Migration" },
  { id:"n3",  title:"Ebba Busch: Familjen måste stå i centrum för politiken",          description:"Kristdemokraternas partiledare presenterade ett nytt familjepolitiskt paket med fokus på barn.",     link:"#", pubDate:new Date(Date.now()-1000*60*90).toISOString(),  source:"DN",         parties:["KD"],      category:"Ekonomi" },
  { id:"n4",  title:"Liberalerna kräver utredning om AI i skolan",                     description:"Johan Pehrson presenterade ett skolpaket med fokus på digital kompetens och reglering av AI.",      link:"#", pubDate:new Date(Date.now()-1000*60*120).toISOString(), source:"SR",         parties:["L"],       category:"Skola" },
  { id:"n5",  title:"Centerpartiet: Jordbruket kvävs av regelkrångel",                 description:"Muharrem Demirok kräver avreglering för att stärka svenska bönder mot europeisk konkurrens.",       link:"#", pubDate:new Date(Date.now()-1000*60*160).toISOString(), source:"Expressen",  parties:["C"],       category:"Ekonomi" },
  { id:"n6",  title:"Socialdemokraterna vill återinföra värnskatten",                  description:"Partiet presenterar ekonomiskt alternativ där värnskatten återinförs för höginkomsttagare.",         link:"#", pubDate:new Date(Date.now()-1000*60*200).toISOString(), source:"SVT",        parties:["S"],       category:"Ekonomi" },
  { id:"n7",  title:"Vänsterpartiet vill stoppa vinstuttag i välfärden",               description:"Nooshi Dadgostar presenterar lagförslag om förbud mot vinstuttag i skattefinansierad verksamhet.",   link:"#", pubDate:new Date(Date.now()-1000*60*240).toISOString(), source:"DN",         parties:["V"],       category:"Sjukvård" },
  { id:"n8",  title:"Miljöpartiet kräver stopp för ny kärnkraft",                      description:"Per Bolund och MP avvisar regeringens planer som för dyra och för långsamma.",                      link:"#", pubDate:new Date(Date.now()-1000*60*280).toISOString(), source:"SR",         parties:["MP"],      category:"Klimat" },
  { id:"n9",  title:"Moderaterna och KD oeniga om friskolornas vinstuttag",            description:"Intern spricka i Tidöalliansen synliggjordes när de två partierna gick emot varandra offentligt.",  link:"#", pubDate:new Date(Date.now()-1000*60*320).toISOString(), source:"Aftonbladet", parties:["M","KD"], category:"Skola" },
  { id:"n10", title:"S och V samlar oppositionen kring ny bostadspolitik",             description:"Gemensamt program kräver återinförd hyresreglering och kraftigt ökat bostadsbyggande.",             link:"#", pubDate:new Date(Date.now()-1000*60*360).toISOString(), source:"SVT",        parties:["S","V"],   category:"Bostäder" },
  { id:"n11", title:"Ny opinionsundersökning: SD störst – S tappar",                   description:"Novus mätning visar att Sverigedemokraterna för första gången går om Socialdemokraterna.",          link:"#", pubDate:new Date(Date.now()-1000*60*420).toISOString(), source:"DN",         parties:["SD","S"],  category:"Ekonomi" },
  { id:"n12", title:"Riksdagen röstar om ny kriminalvårdslagstiftning",                description:"En bred majoritet väntas rösta för skärpta straff för återfallsförbrytare i veckan.",                link:"#", pubDate:new Date(Date.now()-1000*60*480).toISOString(), source:"SR",         parties:["M","SD","KD"], category:"Kriminalitet" },
];

const MOCK_PRESS = [
  { id:"p1", title:"Moderaterna presenterar ny jobbpolitik för 2026",          description:"M vill sänka arbetsgivaravgifter för småföretag och förenkla anställningsregler.", link:"#", pubDate:new Date(Date.now()-1000*60*30).toISOString(),  source:"Moderaterna",        party:"M"  },
  { id:"p2", title:"Socialdemokraterna: Välfärden ska inte säljas ut",         description:"S presenterar valmanifest med fokus på offentlig välfärd och stärkt sjukförsäkring.", link:"#", pubDate:new Date(Date.now()-1000*60*60).toISOString(),  source:"Socialdemokraterna", party:"S"  },
  { id:"p3", title:"SD: Ge polisen mer befogenheter mot gängkriminalitet",      description:"Sverigedemokraterna lägger fram trygghetsprogram med utökad polismakt.", link:"#", pubDate:new Date(Date.now()-1000*60*100).toISOString(), source:"Sverigedemokraterna",party:"SD" },
  { id:"p4", title:"KD kräver stärkt barnpolitik och fler familjecentraler",   description:"Kristdemokraterna presenterar familjepaket med fokus på tidiga insatser.", link:"#", pubDate:new Date(Date.now()-1000*60*140).toISOString(), source:"Kristdemokraterna",  party:"KD" },
  { id:"p5", title:"Liberalerna: Skolan ska prioriteras i nästa budget",        description:"L vill öronmärka 5 miljarder extra till skolan i 2027 års budget.", link:"#", pubDate:new Date(Date.now()-1000*60*180).toISOString(), source:"Liberalerna",        party:"L"  },
  { id:"p6", title:"Centerpartiet vill förenkla för landsbygdsföretagare",     description:"C presenterar 12-punktsprogram för stärkt företagande utanför storstäderna.", link:"#", pubDate:new Date(Date.now()-1000*60*220).toISOString(), source:"Centerpartiet",      party:"C"  },
  { id:"p7", title:"Vänsterpartiet: Inför sex timmars arbetsdag",               description:"V lyfter återigen frågan om kortare arbetstid med bibehållen lön.", link:"#", pubDate:new Date(Date.now()-1000*60*260).toISOString(), source:"Vänsterpartiet",     party:"V"  },
  { id:"p8", title:"Miljöpartiet kräver klimatlag med bindande mål",            description:"MP presenterar lagförslag som tvingar regeringen att nå klimatmålen.", link:"#", pubDate:new Date(Date.now()-1000*60*300).toISOString(), source:"Miljöpartiet",       party:"MP" },
];

const MOCK_VOTES = [
  { id:"v1", titel:"Sänkt skatt för pensionärer",       datum:"2026-04-24", ja:234, nej:115, beteckning:"2025/26:Sk12", parter:[{p:"M",r:"Ja"},{p:"SD",r:"Ja"},{p:"KD",r:"Ja"},{p:"L",r:"Ja"},{p:"C",r:"Ja"},{p:"S",r:"Nej"},{p:"V",r:"Nej"},{p:"MP",r:"Nej"}] },
  { id:"v2", titel:"Utökat stöd till kommuner för välfärd", datum:"2026-04-23", ja:178, nej:171, beteckning:"2025/26:Fi8", parter:[{p:"M",r:"Nej"},{p:"SD",r:"Nej"},{p:"KD",r:"Nej"},{p:"L",r:"Nej"},{p:"C",r:"Nej"},{p:"S",r:"Ja"},{p:"V",r:"Ja"},{p:"MP",r:"Ja"}] },
  { id:"v3", titel:"Skärpt straff för gängkriminalitet", datum:"2026-04-22", ja:289, nej:60,  beteckning:"2025/26:Ju5", parter:[{p:"M",r:"Ja"},{p:"SD",r:"Ja"},{p:"KD",r:"Ja"},{p:"L",r:"Ja"},{p:"C",r:"Ja"},{p:"S",r:"Ja"},{p:"V",r:"Nej"},{p:"MP",r:"Nej"}] },
  { id:"v4", titel:"Förbud mot vinstuttag i välfärden",  datum:"2026-04-21", ja:115, nej:234, beteckning:"2025/26:So3", parter:[{p:"M",r:"Nej"},{p:"SD",r:"Nej"},{p:"KD",r:"Nej"},{p:"L",r:"Nej"},{p:"C",r:"Nej"},{p:"S",r:"Ja"},{p:"V",r:"Ja"},{p:"MP",r:"Ja"}] },
  { id:"v5", titel:"Ny kärnkraftslag",                   datum:"2026-04-20", ja:221, nej:128, beteckning:"2025/26:N2", parter:[{p:"M",r:"Ja"},{p:"SD",r:"Ja"},{p:"KD",r:"Ja"},{p:"L",r:"Ja"},{p:"C",r:"Ja"},{p:"S",r:"Nej"},{p:"V",r:"Nej"},{p:"MP",r:"Nej"}] },
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

const MOCK_POLLS = [
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
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const items = Array.from(xml.querySelectorAll("item"));
    return items.slice(0, 20).map(item => {
      const title = item.querySelector("title")?.textContent || "";
      const desc = (item.querySelector("description")?.textContent || "").replace(/<[^>]+>/g,"").slice(0,120);
      const link = item.querySelector("link")?.textContent || "#";
      return {
        id: item.querySelector("guid")?.textContent || link,
        title, description: desc, link,
        pubDate: item.querySelector("pubDate")?.textContent || "",
        source: src.name, party: src.party || null,
        parties: src.party ? [src.party] : detectParties(title + " " + desc),
        category: detectCategory(title + " " + desc),
      };
    });
  } catch { return []; }
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
function Badge({ id, large }) {
  const p = gp(id);
  if (!p) return null;
  return <span style={{ display:"inline-block", padding: large ? "3px 10px" : "2px 6px", borderRadius:3, fontSize: large ? 12 : 10, fontWeight:700, background:p.bg, color:p.color }}>{p.short}</span>;
}

function CategoryTag({ cat }) {
  const colors = { Ekonomi:"#6366f1", Migration:"#f59e0b", Klimat:"#10b981", Kriminalitet:"#ef4444", Sjukvård:"#3b82f6", Skola:"#8b5cf6", Bostäder:"#f97316" };
  return <span style={{ fontSize:10, fontWeight:700, color: colors[cat] || "#6b7280", textTransform:"uppercase", letterSpacing:"1px" }}>{cat}</span>;
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:700, color:NAVY, borderBottom:`2px solid ${NAVY}`, paddingBottom:8, marginBottom:24 }}>
      {children}
    </div>
  );
}

function NewsCard({ article, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:"#fff", border: hov ? `1px solid ${NAVY}` : "1px solid #e5e7eb", borderRadius:6, overflow:"hidden", cursor:"pointer", transition:"all .15s", boxShadow: hov ? `3px 3px 0 ${NAVY}` : "0 1px 3px rgba(0,0,0,0.06)", transform: hov ? "translate(-1px,-1px)" : "none" }}>
      <div style={{ height:4, background: article.parties[0] ? gp(article.parties[0])?.bg || NAVY : NAVY }} />
      <div style={{ padding:"16px 16px 14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, flexWrap:"wrap" }}>
          <CategoryTag cat={article.category} />
          <span style={{ fontSize:10, color:"#9ca3af", marginLeft:"auto" }}>{timeAgo(article.pubDate)}</span>
        </div>
        <div style={{ fontFamily:"Georgia,serif", fontSize:15, fontWeight:700, lineHeight:1.4, marginBottom:8, color:"#111" }}>{article.title}</div>
        <div style={{ fontSize:12, color:"#6b7280", lineHeight:1.5, marginBottom:12 }}>{article.description}…</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:4 }}>{article.parties.map(pid => <Badge key={pid} id={pid} />)}</div>
          <span style={{ fontSize:11, color:"#9ca3af" }}>{article.source}</span>
        </div>
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
        .then(r => r.json()).then(data => { setContent(data.text || null); setLoading(false); })
        .catch(() => setLoading(false));
    } else { setLoading(false); }
    return () => { document.body.style.overflow = ""; };
  }, [article]);

  if (!article) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.65)", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"24px 16px", overflowY:"auto" }} onClick={onClose}>
      <div style={{ background:"#fff", maxWidth:740, width:"100%", borderRadius:8, overflow:"hidden" }} onClick={e => e.stopPropagation()}>
        <div style={{ background:NAVY, padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {article.parties.map(pid => <Badge key={pid} id={pid} large />)}
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.5)", alignSelf:"center", marginLeft:8 }}>{article.source}</span>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#fff", fontSize:24, cursor:"pointer" }}>×</button>
        </div>
        <div style={{ padding:"28px 28px 32px" }}>
          <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
            <CategoryTag cat={article.category} />
            <span style={{ fontSize:11, color:"#9ca3af" }}>{timeAgo(article.pubDate)}</span>
          </div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:24, fontWeight:700, lineHeight:1.35, marginBottom:20, color:"#111" }}>{article.title}</h1>
          {loading ? (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <div style={{ width:32, height:32, border:"3px solid #e5e7eb", borderTopColor:GOLD, borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }} />
              <div style={{ fontSize:13, color:"#9ca3af" }}>Hämtar artikel…</div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : content ? (
            <div style={{ fontSize:15, lineHeight:1.8, color:"#374151", fontFamily:"Georgia,serif" }}>
              {content.split("\n\n").map((p, i) => <p key={i} style={{ marginBottom:16 }}>{p}</p>)}
            </div>
          ) : (
            <div style={{ fontSize:15, lineHeight:1.8, color:"#374151", fontFamily:"Georgia,serif" }}>
              <p>{article.description}</p>
              <p style={{ marginTop:16, fontSize:13, color:"#9ca3af" }}>Aktivera AI-omskrivning via Groq för att läsa hela artikeln direkt här.</p>
            </div>
          )}
          <div style={{ marginTop:24, paddingTop:20, borderTop:"1px solid #e5e7eb" }}>
            <div style={{ fontSize:11, color:"#9ca3af", marginBottom:6 }}>Källa</div>
            {article.link && article.link !== "#" ? (
              <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ color:NAVY, fontSize:13, fontWeight:600, textDecoration:"none", borderBottom:`1px solid ${GOLD}` }}>
                Läs originalartikeln på {article.source} →
              </a>
            ) : <span style={{ fontSize:13, color:"#9ca3af" }}>{article.source}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── POLL WIDGET ─────────────────────────────────────────────────────────────
function PollWidget() {
  const [selected, setSelected] = useState(null);
  const [voted, setVoted] = useState(() => localStorage.getItem("pf_voted2") || null);
  const [votes, setVotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pf_votes2")) || {}; } catch { return {}; }
  });

  const POLL_PARTIES = [
    { id:"S",      label:"Socialdemokraterna" },
    { id:"SD",     label:"Sverigedemokraterna" },
    { id:"M",      label:"Moderaterna" },
    { id:"V",      label:"Vänsterpartiet" },
    { id:"C",      label:"Centerpartiet" },
    { id:"MP",     label:"Miljöpartiet" },
    { id:"KD",     label:"Kristdemokraterna" },
    { id:"L",      label:"Liberalerna" },
    { id:"vetej",  label:"Vet ej / Röstar inte" },
  ];

  function submitVote() {
    if (!selected || voted) return;
    const newVotes = { ...votes, [selected]: (votes[selected] || 0) + 1 };
    setVotes(newVotes);
    setVoted(selected);
    localStorage.setItem("pf_voted2", selected);
    localStorage.setItem("pf_votes2", JSON.stringify(newVotes));
  }

  const total = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:"20px 24px", marginBottom:32 }}>
      <div style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:NAVY, marginBottom:4 }}>
        Var lutar din röst inför valet 2026?
      </div>
      <div style={{ fontSize:11, color:"#9ca3af", marginBottom:18 }}>
        {total > 0 ? `${total} röster` : "Bli den första att rösta"} · Helt anonym
      </div>

      {!voted ? (
        <>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
            {POLL_PARTIES.map(({ id, label }) => {
              const p = gp(id);
              const isSelected = selected === id;
              return (
                <div key={id} onClick={() => setSelected(id)}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 12px", borderRadius:6, border: isSelected ? `1px solid ${NAVY}` : "1px solid #e5e7eb", background: isSelected ? "#f0f4ff" : "#fafafa", cursor:"pointer", transition:"all .1s" }}>
                  {/* Radio circle */}
                  <div style={{ width:18, height:18, borderRadius:"50%", border: isSelected ? `5px solid ${NAVY}` : "2px solid #d1d5db", background:"#fff", flexShrink:0, transition:"all .1s" }} />
                  {/* Party badge */}
                  {p && <span style={{ display:"inline-block", padding:"2px 7px", borderRadius:3, fontSize:11, fontWeight:700, background:p.bg, color:p.color, flexShrink:0 }}>{p.short}</span>}
                  {/* Name */}
                  <span style={{ fontSize:13, color:"#374151", fontWeight: isSelected ? 600 : 400 }}>{label}</span>
                </div>
              );
            })}
          </div>
          <button onClick={submitVote} disabled={!selected}
            style={{ background: selected ? NAVY : "#e5e7eb", color: selected ? "#fff" : "#9ca3af", border:"none", borderRadius:6, padding:"10px 28px", fontSize:14, fontWeight:700, cursor: selected ? "pointer" : "not-allowed", transition:"all .15s" }}>
            Rösta
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize:13, color:NAVY, fontWeight:600, marginBottom:14 }}>
            ✓ Du röstade på: {POLL_PARTIES.find(p => p.id === voted)?.label}
          </div>
          {POLL_PARTIES.map(({ id, label }) => {
            const p = gp(id);
            const count = votes[id] || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isVoted = voted === id;
            return (
              <div key={id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
                <div style={{ width:36, flexShrink:0 }}>
                  {p ? <span style={{ display:"inline-block", padding:"2px 5px", borderRadius:2, fontSize:10, fontWeight:700, background:p.bg, color:p.color }}>{p.short}</span>
                     : <span style={{ fontSize:10, color:"#9ca3af" }}>–</span>}
                </div>
                <div style={{ flex:1, height:18, background:"#f3f4f6", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ width:`${pct}%`, height:"100%", background: isVoted ? GOLD : (p?.bg || "#9ca3af"), minWidth:2, transition:"width 0.4s ease" }} />
                </div>
                <div style={{ width:36, fontSize:12, fontWeight:700, textAlign:"right", color: isVoted ? GOLD : "#374151" }}>{pct}%</div>
              </div>
            );
          })}
          <div style={{ marginTop:10, fontSize:11, color:"#9ca3af" }}>Röstning är anonym och kan inte spåras till dig.</div>
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
    const newAnswers = { ...answers, [qid]: val };
    setAnswers(newAnswers);
    if (Object.keys(newAnswers).length === QUESTIONS.length) {
      const scores = {};
      PARTIES.filter(p => p.id !== "all").forEach(p => { scores[p.id] = 0; });
      QUESTIONS.forEach(q => {
        const ua = newAnswers[q.id];
        if (ua === 0) return;
        PARTIES.filter(p => p.id !== "all").forEach(p => { scores[p.id] += ua * (q.s[p.id] || 0); });
      });
      const vals = Object.values(scores);
      const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
      const norm = {};
      Object.entries(scores).forEach(([pid, sc]) => { norm[pid] = Math.round(((sc - min) / range) * 100); });
      setResult(Object.entries(norm).sort((a,b) => b[1]-a[1]));
    }
  }

  function reset() { setAnswers({}); setResult(null); }

  if (result) {
    const winner = result[0];
    const wp = gp(winner[0]);
    return (
      <div style={{ maxWidth:580, margin:"0 auto" }}>
        <div style={{ background:NAVY, borderRadius:8, padding:28, marginBottom:24, textAlign:"center" }}>
          <div style={{ fontSize:11, color:GOLD, letterSpacing:"2px", textTransform:"uppercase", marginBottom:10 }}>Ditt resultat</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:26, fontWeight:700, color:"#fff", marginBottom:16 }}>Du passar bäst med {wp?.name}</div>
          <div style={{ width:56, height:56, borderRadius:"50%", background:wp?.bg, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:wp?.color, fontWeight:700, fontSize:20 }}>{wp?.short}</span>
          </div>
        </div>
        {result.map(([pid, score], i) => {
          const p = gp(pid);
          return (
            <div key={pid} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
              <div style={{ width:20, fontSize:11, color:"#9ca3af", textAlign:"right" }}>{i+1}</div>
              <div style={{ width:42 }}><Badge id={pid} large /></div>
              <div style={{ flex:1, height:22, background:"#f3f4f6", borderRadius:3, overflow:"hidden" }}>
                <div style={{ width:`${score}%`, height:"100%", background: i===0 ? GOLD : (p?.bg || "#e5e7eb"), opacity: i===0 ? 1 : 0.7 }} />
              </div>
              <div style={{ width:40, fontSize:13, fontWeight:700, textAlign:"right", color: i===0 ? GOLD : "#374151" }}>{score}%</div>
            </div>
          );
        })}
        <div style={{ marginTop:24, textAlign:"center" }}>
          <button onClick={reset} style={{ background:NAVY, color:"#fff", border:"none", borderRadius:6, padding:"12px 28px", fontSize:14, fontWeight:600, cursor:"pointer" }}>Gör om testet</button>
        </div>
        <div style={{ marginTop:12, fontSize:11, color:"#9ca3af", textAlign:"center" }}>Resultatet är ett ungefärligt underlag och inte en exakt bild av partiernas politik.</div>
      </div>
    );
  }

  if (!currentQ) return null;
  return (
    <div style={{ maxWidth:580, margin:"0 auto" }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#6b7280", marginBottom:8 }}>
          <span>Fråga {progress+1} av {QUESTIONS.length}</span>
          <span>{Math.round((progress/QUESTIONS.length)*100)}% klart</span>
        </div>
        <div style={{ height:6, background:"#f3f4f6", borderRadius:3, overflow:"hidden" }}>
          <div style={{ width:`${(progress/QUESTIONS.length)*100}%`, height:"100%", background:GOLD, transition:"width 0.3s" }} />
        </div>
      </div>
      <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:28, marginBottom:14 }}>
        <div style={{ fontSize:11, color:GOLD, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", marginBottom:12 }}>{currentQ.cat}</div>
        <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:"#111", lineHeight:1.4, marginBottom:28 }}>{currentQ.text}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {[{label:"Ja",val:1,bg:NAVY,color:"#fff"},{label:"Vet ej",val:0,bg:"#f3f4f6",color:"#374151"},{label:"Nej",val:-1,bg:"#fee2e2",color:"#dc2626"}].map(opt => (
            <button key={opt.val} onClick={() => answer(currentQ.id, opt.val)}
              style={{ background:opt.bg, color:opt.color, border:"none", borderRadius:6, padding:"14px 8px", fontWeight:700, fontSize:15, cursor:"pointer" }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ fontSize:12, color:"#9ca3af", textAlign:"center" }}>Svara på alla {QUESTIONS.length} frågor för att se ditt resultat</div>
    </div>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
function HomePage({ onTabChange }) {
  return (
    <div>
      {/* FEATURES */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:20, marginBottom:40 }}>
        {[
          { icon:"⚖️", title:"Oberoende", desc:"Inga kopplingar. Inga agendor. Alla partier behandlas lika." },
          { icon:"📊", title:"Faktabaserat", desc:"Data, källor och konsekvenser. Vi låter fakta tala." },
          { icon:"🔔", title:"Alltid uppdaterat", desc:"Automatiska nyheter dygnet runt från alla stora medier." },
        ].map(f => (
          <div key={f.title} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:24 }}>
            <div style={{ fontSize:28, marginBottom:10 }}>{f.icon}</div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:16, fontWeight:700, color:NAVY, marginBottom:6 }}>{f.title}</div>
            <div style={{ fontSize:13, color:"#6b7280", lineHeight:1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* POLL */}
      <PollWidget />

      {/* EXPLORE CARDS */}
      <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:NAVY, marginBottom:20 }}>Utforska politik på ditt sätt</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20, marginBottom:40 }}>
        <div onClick={() => onTabChange("nyheter")} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:24, cursor:"pointer", transition:"all .15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor=NAVY; e.currentTarget.style.boxShadow=`3px 3px 0 ${NAVY}`; e.currentTarget.style.transform="translate(-1px,-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor="#e5e7eb"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="none"; }}>
          <div style={{ fontSize:28, marginBottom:10 }}>📰</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:16, fontWeight:700, color:NAVY, marginBottom:6 }}>Senaste nyheterna</div>
          <div style={{ fontSize:13, color:"#6b7280", lineHeight:1.5 }}>Alla politiska nyheter samlade på ett ställe. Filtrera per parti och ämne.</div>
          <div style={{ marginTop:14, fontSize:13, fontWeight:600, color:NAVY }}>Läs nyheter →</div>
        </div>
        <div onClick={() => onTabChange("valkompass")} style={{ background:NAVY, border:`1px solid ${NAVY}`, borderRadius:8, padding:24, cursor:"pointer", transition:"all .15s" }}
          onMouseEnter={e => { e.currentTarget.style.opacity="0.9"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity="1"; }}>
          <div style={{ fontSize:28, marginBottom:10 }}>🗳️</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:16, fontWeight:700, color:"#fff", marginBottom:6 }}>Din politiska profil</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>Svara på 25 frågor och se vilket parti du stämmer bäst överens med.</div>
          <div style={{ marginTop:14, fontSize:13, fontWeight:600, color:GOLD }}>Gör testet →</div>
        </div>
        <div onClick={() => onTabChange("opinion")} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:24, cursor:"pointer", transition:"all .15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor=NAVY; e.currentTarget.style.boxShadow=`3px 3px 0 ${NAVY}`; e.currentTarget.style.transform="translate(-1px,-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor="#e5e7eb"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="none"; }}>
          <div style={{ fontSize:28, marginBottom:10 }}>📈</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:16, fontWeight:700, color:NAVY, marginBottom:6 }}>Opinionsmätningar</div>
          <div style={{ fontSize:13, color:"#6b7280", lineHeight:1.5 }}>Se hur partierna ligger i opinionen just nu. Uppdateras varje månad.</div>
          <div style={{ marginTop:14, fontSize:13, fontWeight:600, color:NAVY }}>Se mätningar →</div>
        </div>
      </div>

      {/* POPULAR TOPICS */}
      <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:NAVY, marginBottom:16 }}>Populära ämnen</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:40 }}>
        {["Ekonomi","Migration","Klimat","Kriminalitet","Sjukvård","Skola","Bostäder"].map(cat => (
          <button key={cat} onClick={() => onTabChange("nyheter")}
            style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:20, padding:"8px 18px", fontSize:13, fontWeight:500, color:"#374151", cursor:"pointer", transition:"all .1s" }}
            onMouseEnter={e => { e.target.style.borderColor=NAVY; e.target.style.color=NAVY; e.target.style.fontWeight="600"; }}
            onMouseLeave={e => { e.target.style.borderColor="#e5e7eb"; e.target.style.color="#374151"; e.target.style.fontWeight="500"; }}>
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── NEWS TABS ────────────────────────────────────────────────────────────────
function NewsTab({ party, onArticleClick }) {
  const [articles, setArticles] = useState(MOCK_NEWS);
  const [catFilter, setCatFilter] = useState("Alla");

  useEffect(() => {
    Promise.allSettled(NEWS_SOURCES.map(fetchRSS)).then(results => {
      const fetched = results.filter(r => r.status === "fulfilled").flatMap(r => r.value).filter(a => a.parties.length > 0);
      const sevenDays = Date.now() - 7*24*60*60*1000;
      const all = [...MOCK_NEWS, ...fetched];
      const seen = new Set();
      const deduped = all.filter(a => { const k = a.title.slice(0,40).toLowerCase(); if(seen.has(k))return false; seen.add(k); return new Date(a.pubDate) > sevenDays; });
      deduped.sort((a,b) => new Date(b.pubDate)-new Date(a.pubDate));
      setArticles(deduped);
    });
  }, []);

  const cats = ["Alla", ...Object.keys(CATEGORY_KEYWORDS)];
  let filtered = party === "all" ? articles : articles.filter(a => a.parties.includes(party));
  if (catFilter !== "Alla") filtered = filtered.filter(a => a.category === catFilter);

  return (
    <div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        {cats.map(cat => (
          <button key={cat} onClick={() => setCatFilter(cat)}
            style={{ background: catFilter===cat ? NAVY : "#f3f4f6", color: catFilter===cat ? "#fff" : "#374151", border:"none", borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>
            {cat}
          </button>
        ))}
      </div>
      <SectionTitle>{party==="all" ? "Alla nyheter" : gp(party)?.name} <span style={{ fontFamily:"sans-serif", fontSize:13, fontWeight:400, color:"#9ca3af", marginLeft:8 }}>{filtered.length} artiklar</span></SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
        {filtered.map(a => <NewsCard key={a.id} article={a} onClick={() => onArticleClick(a)} />)}
      </div>
    </div>
  );
}

function PressTab({ party, onArticleClick }) {
  const [items, setItems] = useState(MOCK_PRESS);
  useEffect(() => {
    Promise.allSettled(PRESS_SOURCES.map(fetchRSS)).then(results => {
      const fetched = results.filter(r => r.status === "fulfilled").flatMap(r => r.value);
      if (fetched.length > 0) {
        const seen = new Set();
        const all = [...fetched,...MOCK_PRESS].filter(a => { const k=a.title.slice(0,40).toLowerCase(); if(seen.has(k))return false; seen.add(k); return true; });
        all.sort((a,b) => new Date(b.pubDate)-new Date(a.pubDate));
        setItems(all);
      }
    });
  }, []);
  const filtered = party==="all" ? items : items.filter(a => a.party===party);
  return (
    <div>
      <SectionTitle>Pressmeddelanden <span style={{ fontFamily:"sans-serif", fontSize:13, fontWeight:400, color:"#9ca3af", marginLeft:8 }}>{filtered.length} st</span></SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
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
        const tot = v.ja+v.nej, jaPct = Math.round(v.ja/tot*100);
        return (
          <div key={v.id} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:20, marginBottom:14 }}>
            <div style={{ fontFamily:"Georgia,serif", fontSize:16, fontWeight:700, marginBottom:10, color:"#111" }}>{v.titel}</div>
            <div style={{ display:"flex", gap:16, fontSize:12, color:"#6b7280", marginBottom:8 }}>
              <span style={{ color:"#10b981", fontWeight:700 }}>✓ Ja: {v.ja}</span>
              <span style={{ color:"#ef4444", fontWeight:700 }}>✗ Nej: {v.nej}</span>
              <span style={{ marginLeft:"auto" }}>{v.datum} · {v.beteckning}</span>
            </div>
            <div style={{ height:8, background:"#f3f4f6", borderRadius:2, overflow:"hidden", display:"flex", marginBottom:14 }}>
              <div style={{ width:`${jaPct}%`, background:"#10b981" }} /><div style={{ width:`${100-jaPct}%`, background:"#ef4444" }} />
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {v.parter.map(({p,r}) => <span key={p} style={{ display:"flex", alignItems:"center", gap:3 }}><Badge id={p} /><span style={{ fontSize:11, color:r==="Ja"?"#10b981":"#ef4444", fontWeight:700 }}>{r}</span></span>)}
            </div>
          </div>
        );
      })}
      <SectionTitle style={{ marginTop:32 }}>Kommande debatter</SectionTitle>
      {MOCK_DEBATES.map(d => (
        <div key={d.id} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:6, padding:"14px 20px", marginBottom:10, display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontFamily:"Georgia,serif", fontWeight:700, color:GOLD, minWidth:56, fontSize:13 }}>{d.datum.slice(5)}</div>
          <div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:15, fontWeight:700, color:"#111" }}>{d.titel}</div>
            <div style={{ fontSize:11, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"1px", marginTop:2 }}>{d.typ} · {d.tid}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LedamoterTab({ party }) {
  const filtered = party==="all" ? MOCK_MEMBERS : MOCK_MEMBERS.filter(m => m.parti===party);
  const initials = n => n.split(" ").map(x=>x[0]).join("").slice(0,2);
  return (
    <div>
      <SectionTitle>Riksdagsledamöter</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:14 }}>
        {filtered.map(m => {
          const p = gp(m.parti);
          return (
            <div key={m.id} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:16, textAlign:"center" }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:p?.bg, margin:"0 auto 10px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:p?.color, fontWeight:700, fontFamily:"Georgia,serif", fontSize:18 }}>{initials(m.namn)}</span>
              </div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:14, fontWeight:700, marginBottom:5 }}>{m.namn}</div>
              <div style={{ marginBottom:5 }}><Badge id={m.parti} large /></div>
              <div style={{ fontSize:11, color:"#9ca3af" }}>{m.valkrets}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OpinionTab() {
  const pids = ["M","SD","KD","L","C","S","V","MP"];
  const latest = MOCK_POLLS[0];
  return (
    <div>
      <SectionTitle>Opinionsmätningar</SectionTitle>
      <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:24, marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:20 }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:700, color:NAVY }}>Senaste – {latest.datum}</div>
          <div style={{ fontSize:12, color:"#9ca3af" }}>{latest.källa}</div>
        </div>
        {pids.map(pid => {
          const p = gp(pid);
          const pct = latest[pid];
          return (
            <div key={pid} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:9 }}>
              <div style={{ width:38 }}><Badge id={pid} large /></div>
              <div style={{ flex:1, height:22, background:"#f3f4f6", borderRadius:2, overflow:"hidden" }}>
                <div style={{ width:`${pct*2.8}%`, height:"100%", background:p?.bg, minWidth:4 }} />
              </div>
              <div style={{ fontSize:13, fontWeight:700, minWidth:40, textAlign:"right" }}>{pct}%</div>
            </div>
          );
        })}
        <div style={{ marginTop:14, fontSize:12, color:"#9ca3af", borderTop:"1px solid #f3f4f6", paddingTop:12 }}>
          Högerblocket: <strong>{(latest.M+latest.SD+latest.KD+latest.L+latest.C).toFixed(1)}%</strong>
          <span style={{ margin:"0 12px" }}>·</span>
          Vänsterblocket: <strong>{(latest.S+latest.V+latest.MP).toFixed(1)}%</strong>
        </div>
      </div>
      <div style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:700, color:NAVY, marginBottom:16 }}>Historik</div>
      {MOCK_POLLS.map(poll => (
        <div key={poll.id} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:6, padding:"14px 20px", marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <div style={{ fontFamily:"Georgia,serif", fontWeight:700 }}>{poll.datum}</div>
            <div style={{ fontSize:11, color:"#9ca3af" }}>{poll.källa}</div>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {pids.map(pid => <span key={pid} style={{ display:"flex", alignItems:"center", gap:3 }}><Badge id={pid} /><span style={{ fontSize:12, fontWeight:700 }}>{poll[pid]}%</span></span>)}
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

  useEffect(() => {
    if (window.gtag) window.gtag("config", GA_ID, { page_path: "/" + tab });
  }, [tab]);

  return (
    <div style={{ fontFamily:"system-ui,sans-serif", background:"#f9fafb", minHeight:"100vh", color:"#111" }}>

      {selectedArticle && <ArticleOverlay article={selectedArticle} onClose={() => setSelectedArticle(null)} />}

      {/* HEADER */}
      <header style={{ background:NAVY, position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
        {/* Logo + nav */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", height:56 }}>
          <div style={{ display:"flex", alignItems:"center", gap:48 }}>
            <button onClick={() => setTab("hem")} style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
              <span style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:900, color:"#fff", letterSpacing:"-0.5px" }}>
                Parti<span style={{ color:GOLD }}>Fokus</span>
              </span>
            </button>
            <nav style={{ display:"flex", gap:4 }}>
              {TABS.filter(t => t.id !== "hem").map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ background:"none", border:"none", cursor:"pointer", padding:"0 12px", height:56, fontSize:13, fontWeight:600, color: tab===t.id ? "#fff" : "rgba(255,255,255,0.55)", borderBottom: tab===t.id ? `3px solid ${GOLD}` : "3px solid transparent", transition:"color .15s", whiteSpace:"nowrap" }}>
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>⚪ Redaktionellt neutral</div>
        </div>

        {/* Party filter - only show on non-home tabs */}
        {tab !== "hem" && tab !== "valkompass" && (
          <div style={{ display:"flex", overflowX:"auto", padding:"0 32px", background:"rgba(0,0,0,0.15)", scrollbarWidth:"none" }}>
            {PARTIES.map(p => (
              <button key={p.id} onClick={() => setParty(p.id)}
                style={{ background:"none", border:"none", cursor:"pointer", padding:"9px 12px", fontSize:10, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color: party===p.id ? "#fff" : "rgba(255,255,255,0.4)", borderBottom: party===p.id ? `2px solid ${GOLD}` : "2px solid transparent", whiteSpace:"nowrap", transition:"color .15s" }}>
                {p.id !== "all" && <span style={{ display:"inline-block", padding:"1px 4px", borderRadius:2, fontSize:9, fontWeight:700, background:p.bg, color:p.color, marginRight:5 }}>{p.short}</span>}
                {p.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO - only on home */}
      {tab === "hem" && (
        <div style={{ background:`linear-gradient(135deg, ${NAVY} 0%, #2d4a7a 100%)`, padding:"52px 32px" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
            <div>
              <div style={{ fontSize:11, color:GOLD, letterSpacing:"2px", textTransform:"uppercase", marginBottom:14 }}>Oberoende politisk analys</div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:42, fontWeight:700, color:"#fff", lineHeight:1.2, marginBottom:16 }}>
                Fakta före vägval.<br/>Fokus före åsikt.
              </div>
              <div style={{ fontSize:16, color:"rgba(255,255,255,0.7)", lineHeight:1.6, marginBottom:28 }}>
                Vi granskar politiken bakom rubrikerna och konsekvenserna du inte ser.
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <button onClick={() => setTab("nyheter")} style={{ background:GOLD, color:NAVY, border:"none", borderRadius:6, padding:"12px 24px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
                  Senaste nyheterna →
                </button>
                <button onClick={() => setTab("valkompass")} style={{ background:"transparent", color:"#fff", border:"2px solid rgba(255,255,255,0.4)", borderRadius:6, padding:"12px 24px", fontSize:14, fontWeight:600, cursor:"pointer" }}>
                  🗳️ Valkompass
                </button>
              </div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:28, backdropFilter:"blur(10px)" }}>
              <div style={{ fontSize:12, color:GOLD, fontWeight:600, marginBottom:16, textTransform:"uppercase", letterSpacing:"1px" }}>Opinionsläget april 2026</div>
              {["S","SD","M","V","C"].map(pid => {
                const p = gp(pid);
                const pct = MOCK_POLLS[0][pid];
                return (
                  <div key={pid} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <div style={{ width:32 }}><Badge id={pid} /></div>
                    <div style={{ flex:1, height:16, background:"rgba(255,255,255,0.1)", borderRadius:2, overflow:"hidden" }}>
                      <div style={{ width:`${pct*2.5}%`, height:"100%", background:p?.bg, minWidth:4 }} />
                    </div>
                    <div style={{ width:38, fontSize:12, fontWeight:700, color:"#fff", textAlign:"right" }}>{pct}%</div>
                  </div>
                );
              })}
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:10 }}>Novus · April 2026</div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN */}
      <main style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
        {tab === "hem"        && <HomePage onTabChange={setTab} />}
        {tab === "nyheter"    && <NewsTab party={party} onArticleClick={setSelectedArticle} />}
        {tab === "press"      && <PressTab party={party} onArticleClick={setSelectedArticle} />}
        {tab === "riksdagen"  && <RiksdagenTab />}
        {tab === "ledamoter"  && <LedamoterTab party={party} />}
        {tab === "opinion"    && <OpinionTab />}
        {tab === "valkompass" && (
          <div>
            <SectionTitle>Din politiska profil – Valkompass 2026</SectionTitle>
            <Valkompass />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ background:NAVY, marginTop:48, padding:"32px 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:24, marginBottom:24 }}>
            <div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:"#fff", marginBottom:8 }}>Parti<span style={{ color:GOLD }}>Fokus</span></div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.6 }}>Oberoende politisk nyhetstjänst. Partipolitiskt neutral. Alla artiklar tillhör respektive källa.</div>
            </div>
            <div>
              <div style={{ fontSize:11, color:GOLD, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", marginBottom:10 }}>Juridiskt</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.6 }}>PartiFokus äger inget redaktionellt innehåll. Alla artiklar länkas till originalkällan. Kontakt: partifokus@gmail.com</div>
            </div>
            <div>
              <div style={{ fontSize:11, color:GOLD, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", marginBottom:10 }}>Källor</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.6 }}>SVT · SR · DN · Aftonbladet · Expressen · Google News · Partiernas presskanaler · riksdagen.se</div>
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:16, fontSize:11, color:"rgba(255,255,255,0.25)", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <span>© {new Date().getFullYear()} PartiFokus. Drivs ideellt.</span>
            <span>Utgivningsbevis sökt hos MPRT · Redaktionellt neutral</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
