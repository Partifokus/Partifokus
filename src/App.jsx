import { useState, useEffect } from "react";

const GA_ID = "G-DB7QB8N6BE";
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

function getCatImage(cat, seed) {
  const imgs = CAT_IMAGES[cat] || CAT_IMAGES.Ekonomi;
  return imgs[seed % imgs.length];
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
  L:  ["liberalerna","johan pehrson","pehrson"],
  C:  ["centerpartiet","muharrem demirok","demirok"],
  S:  ["socialdemokraterna","magdalena andersson","sossarna"],
  V:  ["vänsterpartiet","nooshi dadgostar","dadgostar"],
  MP: ["miljöpartiet","per bolund","bolund","märta stenevi"],
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

const TABS = [
  { id:"nyheter",      label:"Nyheter" },
  { id:"press",        label:"Pressmeddelanden" },
  { id:"omrostningar", label:"Omröstningar" },
  { id:"ledamoter",    label:"Ledamöter" },
  { id:"opinion",      label:"Opinion" },
  { id:"valkompass",   label:"Valkompass" },
];

const QUESTIONS = [
  { id:1,  text:"Invandringen till Sverige bör minskas kraftigt",                   cat:"Migration",    s:{M:1, SD:1, KD:0, L:-1,C:-1,S:0, V:-1,MP:-1} },
  { id:2,  text:"Sverige ska bygga ny kärnkraft",                                   cat:"Klimat",       s:{M:1, SD:1, KD:1, L:1, C:0, S:0, V:-1,MP:-1} },
  { id:3,  text:"Vinster i skattefinansierad välfärd ska förbjudas",                cat:"Ekonomi",      s:{M:-1,SD:0, KD:-1,L:-1,C:-1,S:1, V:1, MP:1 } },
  { id:4,  text:"Inkomstskatten ska sänkas för de flesta",                          cat:"Ekonomi",      s:{M:1, SD:0, KD:0, L:1, C:1, S:-1,V:-1,MP:-1} },
  { id:5,  text:"Straffen för gängkriminalitet ska skärpas kraftigt",               cat:"Kriminalitet", s:{M:1, SD:1, KD:1, L:0, C:0, S:1, V:-1,MP:-1} },
  { id:6,  text:"Sverige ska ha bindande klimatlagstiftning med hårda mål",         cat:"Klimat",       s:{M:-1,SD:-1,KD:0, L:0, C:1, S:0, V:1, MP:1 } },
  { id:7,  text:"RUT- och ROT-avdraget ska utökas",                                 cat:"Ekonomi",      s:{M:1, SD:0, KD:1, L:1, C:1, S:-1,V:-1,MP:-1} },
  { id:8,  text:"Det ska bli lättare att utvisa kriminella utlänningar",            cat:"Migration",    s:{M:1, SD:1, KD:1, L:0, C:0, S:0, V:-1,MP:-1} },
  { id:9,  text:"Förskolan ska vara avgiftsfri för alla barn",                      cat:"Skola",        s:{M:-1,SD:0, KD:0, L:0, C:0, S:1, V:1, MP:1 } },
  { id:10, text:"Sverige ska öka försvarsbudgeten ytterligare",                     cat:"Ekonomi",      s:{M:1, SD:1, KD:1, L:1, C:1, S:1, V:-1,MP:0 } },
  { id:11, text:"Hyresreglering ska återinföras i storstäderna",                    cat:"Bostäder",     s:{M:-1,SD:0, KD:-1,L:-1,C:-1,S:1, V:1, MP:1 } },
  { id:12, text:"Polisen ska få utökade befogenheter mot organiserad brottslighet", cat:"Kriminalitet", s:{M:1, SD:1, KD:1, L:0, C:0, S:0, V:-1,MP:-1} },
  { id:13, text:"Den offentliga sjukvården ska prioriteras framför privat",         cat:"Sjukvård",     s:{M:-1,SD:0, KD:-1,L:-1,C:-1,S:1, V:1, MP:1 } },
  { id:14, text:"Arbetstiden ska kortas till 6 timmar per dag med bibehållen lön",  cat:"Ekonomi",      s:{M:-1,SD:-1,KD:-1,L:-1,C:-1,S:-1,V:1, MP:0 } },
  { id:15, text:"Sverige ska ta emot fler kvotflyktingar via FN",                   cat:"Migration",    s:{M:-1,SD:-1,KD:0, L:1, C:1, S:0, V:1, MP:1 } },
  { id:16, text:"Pensionerna för de med lägst pension ska höjas kraftigt",          cat:"Ekonomi",      s:{M:0, SD:1, KD:1, L:0, C:0, S:1, V:1, MP:0 } },
  { id:17, text:"Barn till illegalt inresna ska ha rätt till skola och sjukvård",   cat:"Migration",    s:{M:0, SD:-1,KD:0, L:1, C:1, S:1, V:1, MP:1 } },
  { id:18, text:"Företag ska betala mer i skatt för att finansiera välfärden",      cat:"Ekonomi",      s:{M:-1,SD:0, KD:-1,L:-1,C:-1,S:1, V:1, MP:1 } },
  { id:19, text:"Vapenexporten till konfliktländer ska stoppas",                     cat:"Ekonomi",      s:{M:-1,SD:-1,KD:0, L:0, C:0, S:0, V:1, MP:1 } },
  { id:20, text:"Sverige ska ha mer lokalt självstyre",                              cat:"Ekonomi",      s:{M:0, SD:-1,KD:0, L:1, C:1, S:-1,V:-1,MP:0 } },
  { id:21, text:"Det ska bli lättare för arbetsgivare att säga upp anställda",      cat:"Ekonomi",      s:{M:1, SD:0, KD:0, L:1, C:1, S:-1,V:-1,MP:-1} },
  { id:22, text:"Tiggeri ska förbjudas i Sverige",                                   cat:"Kriminalitet", s:{M:0, SD:1, KD:0, L:-1,C:-1,S:-1,V:-1,MP:-1} },
  { id:23, text:"Sverige ska satsa mer på järnväg och kollektivtrafik",              cat:"Klimat",       s:{M:0, SD:0, KD:0, L:1, C:1, S:1, V:1, MP:1 } },
  { id:24, text:"Alla medborgare ska garanteras en grundinkomst",                    cat:"Ekonomi",      s:{M:-1,SD:-1,KD:-1,L:-1,C:-1,S:-1,V:1, MP:0 } },
  { id:25, text:"Skolval och friskolereformen ska begränsas",                        cat:"Skola",        s:{M:-1,SD:-1,KD:-1,L:-1,C:-1,S:0, V:1, MP:1 } },
];

const FAQ_ITEMS = [
  { q:"Vad är PartiFokus?", a:"PartiFokus är en oberoende politisk nyhetstjänst som samlar all svensk politik på ett ställe. Vi aggregerar nyheter från stora svenska medier och presenterar dem neutralt utan politisk vinkling." },
  { q:"Är PartiFokus partipolitiskt bunden?", a:"Nej. PartiFokus är helt partipolitiskt obunden. Alla riksdagspartier behandlas lika och ges samma utrymme. Vi tar inte ställning i politiska frågor." },
  { q:"Varifrån kommer nyheterna?", a:"Vi hämtar nyheter från SVT, Sveriges Radio, Dagens Nyheter, Aftonbladet, Expressen, Omni, Google News samt partiernas egna presskanaler via deras offentliga RSS-flöden." },
  { q:"Äger PartiFokus artiklarna?", a:"Nej. Alla artiklar tillhör respektive ursprungskälla och skyddas av upphovsrätten. PartiFokus visar endast rubrik och kort ingress, och länkar alltid till originalkällan." },
  { q:"Hur fungerar valkompassen?", a:"Valkompassen innehåller 25 politiska frågor inom olika ämnesområden. Du svarar Ja, Nej eller Vet ej på varje fråga, och vi jämför dina svar med partiernas officiella ståndpunkter. Resultatet är ett ungefärligt underlag – inte en exakt politisk analys." },
  { q:"Är pollen anonym?", a:"Ja, helt anonym. Vi sparar inga personuppgifter och det går inte att spåra din röst till dig." },
  { q:"Hur uppdateras nyheterna?", a:"Nyheterna uppdateras automatiskt var 5:e minut dygnet runt." },
  { q:"Kan jag kontakta PartiFokus?", a:"Ja! Skicka ett mail till partifokus@gmail.com så svarar vi så snart vi kan." },
  { q:"Har PartiFokus ett utgivningsbevis?", a:"Utgivningsbevis är sökt hos MPRT (Myndigheten för press, radio och tv). PartiFokus drivs ideellt." },
  { q:"Varför ser jag ibland få nyheter om ett parti?", a:"Det beror på att det helt enkelt inte publicerats många nyheter om det partiet den senaste veckan." },
];

const MOCK_NEWS = [
  { id:"n1",  title:"Kristersson: Regeringen satsar på 2 000 fler poliser",        description:"Statsminister Ulf Kristersson presenterade en satsning på fler poliser i utsatta stadsdelar.", link:"https://svt.se", pubDate:new Date(Date.now()-1000*60*18).toISOString(),  source:"SVT",        parties:["M"],      category:"Kriminalitet", imgSeed:0 },
  { id:"n2",  title:"Åkesson: SD kräver hårdare gränskontroller",                  description:"Sverigedemokraternas partiledare kräver skärpta regler för asylsökande.", link:"https://aftonbladet.se", pubDate:new Date(Date.now()-1000*60*45).toISOString(),  source:"Aftonbladet",parties:["SD"],     category:"Migration",    imgSeed:1 },
  { id:"n3",  title:"Ebba Busch: Familjen måste stå i centrum",                    description:"Kristdemokraternas partiledare presenterade ett nytt familjepolitiskt paket.", link:"https://dn.se", pubDate:new Date(Date.now()-1000*60*90).toISOString(),  source:"DN",         parties:["KD"],     category:"Ekonomi",      imgSeed:2 },
  { id:"n4",  title:"Liberalerna kräver utredning om AI i skolan",                 description:"Johan Pehrson presenterade ett skolpaket med fokus på digital kompetens.", link:"https://sverigesradio.se", pubDate:new Date(Date.now()-1000*60*120).toISOString(), source:"SR",      parties:["L"],      category:"Skola",        imgSeed:0 },
  { id:"n5",  title:"Centerpartiet: Jordbruket kvävs av regelkrångel",             description:"Muharrem Demirok kräver avreglering för att stärka svenska bönder.", link:"https://expressen.se", pubDate:new Date(Date.now()-1000*60*160).toISOString(), source:"Expressen",  parties:["C"],      category:"Ekonomi",      imgSeed:3 },
  { id:"n6",  title:"Socialdemokraterna vill återinföra värnskatten",              description:"Partiet presenterar ekonomiskt alternativ där värnskatten återinförs.", link:"https://svt.se", pubDate:new Date(Date.now()-1000*60*200).toISOString(), source:"SVT",        parties:["S"],      category:"Ekonomi",      imgSeed:1 },
  { id:"n7",  title:"Vänsterpartiet vill stoppa vinstuttag i välfärden",           description:"Nooshi Dadgostar presenterar lagförslag om förbud mot vinstuttag.", link:"https://dn.se", pubDate:new Date(Date.now()-1000*60*240).toISOString(), source:"DN",         parties:["V"],      category:"Sjukvård",     imgSeed:2 },
  { id:"n8",  title:"Miljöpartiet kräver stopp för ny kärnkraft",                  description:"Per Bolund och MP avvisar regeringens planer som för dyra och för långsamma.", link:"https://sverigesradio.se", pubDate:new Date(Date.now()-1000*60*280).toISOString(), source:"SR", parties:["MP"],     category:"Klimat",       imgSeed:3 },
  { id:"n9",  title:"Moderaterna och KD oeniga om friskolornas vinstuttag",        description:"Intern spricka i Tidöalliansen om friskolors vinstuttag.", link:"https://aftonbladet.se", pubDate:new Date(Date.now()-1000*60*320).toISOString(), source:"Aftonbladet",parties:["M","KD"],category:"Skola",        imgSeed:1 },
  { id:"n10", title:"S och V samlar oppositionen kring ny bostadspolitik",         description:"Gemensamt program kräver återinförd hyresreglering.", link:"https://svt.se", pubDate:new Date(Date.now()-1000*60*360).toISOString(), source:"SVT",        parties:["S","V"],  category:"Bostäder",     imgSeed:0 },
  { id:"n11", title:"Ny opinionsundersökning: SD störst",                          description:"Novus mätning visar att Sverigedemokraterna för första gången går om S.", link:"https://dn.se", pubDate:new Date(Date.now()-1000*60*420).toISOString(), source:"DN",      parties:["SD","S"], category:"Ekonomi",      imgSeed:2 },
  { id:"n12", title:"Riksdagen röstar om ny kriminalvårdslagstiftning",            description:"En bred majoritet väntas rösta för skärpta straff för återfallsförbrytare.", link:"https://sverigesradio.se", pubDate:new Date(Date.now()-1000*60*480).toISOString(), source:"SR", parties:["M","SD","KD"], category:"Kriminalitet", imgSeed:3 },
];

const MOCK_PRESS = [
  { id:"p1", title:"Moderaterna presenterar ny jobbpolitik för 2026",        description:"M vill sänka arbetsgivaravgifter och förenkla anställningsregler.", link:"https://moderaterna.se", pubDate:new Date(Date.now()-1000*60*30).toISOString(),  source:"Moderaterna",        party:"M",  imgSeed:0 },
  { id:"p2", title:"Socialdemokraterna: Välfärden ska inte säljas ut",       description:"S presenterar valmanifest med fokus på offentlig välfärd.", link:"https://socialdemokraterna.se", pubDate:new Date(Date.now()-1000*60*60).toISOString(),  source:"Socialdemokraterna", party:"S",  imgSeed:1 },
  { id:"p3", title:"SD: Ge polisen mer befogenheter mot gängkriminalitet",    description:"SD lägger fram trygghetsprogram med utökad polismakt.", link:"https://sd.se", pubDate:new Date(Date.now()-1000*60*100).toISOString(), source:"Sverigedemokraterna",party:"SD", imgSeed:0 },
  { id:"p4", title:"KD kräver stärkt barnpolitik och fler familjecentraler", description:"KD presenterar familjepaket med fokus på tidiga insatser.", link:"https://kristdemokraterna.se", pubDate:new Date(Date.now()-1000*60*140).toISOString(), source:"Kristdemokraterna",  party:"KD", imgSeed:2 },
  { id:"p5", title:"Liberalerna: Skolan ska prioriteras i nästa budget",      description:"L vill öronmärka 5 miljarder extra till skolan.", link:"https://liberalerna.se", pubDate:new Date(Date.now()-1000*60*180).toISOString(), source:"Liberalerna",        party:"L",  imgSeed:1 },
  { id:"p6", title:"Centerpartiet vill förenkla för landsbygdsföretagare",   description:"C presenterar 12-punktsprogram för stärkt företagande.", link:"https://centerpartiet.se", pubDate:new Date(Date.now()-1000*60*220).toISOString(), source:"Centerpartiet",      party:"C",  imgSeed:0 },
  { id:"p7", title:"Vänsterpartiet: Inför sex timmars arbetsdag",             description:"V lyfter frågan om kortare arbetstid med bibehållen lön.", link:"https://vansterpartiet.se", pubDate:new Date(Date.now()-1000*60*260).toISOString(), source:"Vänsterpartiet",     party:"V",  imgSeed:2 },
  { id:"p8", title:"Miljöpartiet kräver klimatlag med bindande mål",          description:"MP presenterar lagförslag som tvingar regeringen att nå klimatmålen.", link:"https://mp.se", pubDate:new Date(Date.now()-1000*60*300).toISOString(), source:"Miljöpartiet",       party:"MP", imgSeed:1 },
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
  { name:"Omni",        url:"https://omni.se/rss" },
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

function gp(id) { return PARTIES.find(p => p.id === id); }
function detectParties(t) { const l=t.toLowerCase(); return Object.keys(PARTY_KEYWORDS).filter(k=>PARTY_KEYWORDS[k].some(kw=>l.includes(kw))); }
function detectCategory(t) { const l=t.toLowerCase(); for(const [c,w] of Object.entries(CATEGORY_KEYWORDS)){if(w.some(x=>l.includes(x)))return c;} return "Ekonomi"; }
function timeAgo(d) { const s=Math.floor((Date.now()-new Date(d))/1000); if(s<60)return"just nu"; if(s<3600)return Math.floor(s/60)+" min sedan"; if(s<86400)return Math.floor(s/3600)+" tim sedan"; return Math.floor(s/86400)+" dagar sedan"; }

async function fetchRSS(src) {
  try {
    const res = await fetch("/api/rss?url="+encodeURIComponent(src.url));
    const text = await res.text();
    const xml = new DOMParser().parseFromString(text,"text/xml");
    return Array.from(xml.querySelectorAll("item")).slice(0,20).map((item,i) => {
      const title = item.querySelector("title")?.textContent||"";
      const desc = (item.querySelector("description")?.textContent||"").replace(/<[^>]+>/g,"").slice(0,130);
      const link = item.querySelector("link")?.textContent||"#";
      return { id:item.querySelector("guid")?.textContent||link, title, description:desc, link, pubDate:item.querySelector("pubDate")?.textContent||"", source:src.name, party:src.party||null, parties:src.party?[src.party]:detectParties(title+" "+desc), category:detectCategory(title+" "+desc), imgSeed:i };
    });
  } catch { return []; }
}

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
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
  if (article.link && article.link !== "#") {
    window.open(article.link, "_blank", "noopener,noreferrer");
  }
}

function BigCard({ article }) {
  const [h,setH]=useState(false);
  const img = getCatImage(article.category, article.imgSeed||0);
  return (
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
  const img = getCatImage(article.category, (article.imgSeed||0)+1);
  return (
    <div onClick={()=>openArticle(article)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:"#fff",borderRadius:12,overflow:"hidden",cursor:"pointer",border:`1px solid ${h?"#D1D5DB":"#E5E7EB"}`,boxShadow:h?"0 8px 24px rgba(0,0,0,0.1)":"0 1px 4px rgba(0,0,0,0.05)",transition:"all .2s"}}>
      <div style={{position:"relative",height:180,overflow:"hidden"}}>
        <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .3s",transform:h?"scale(1.04)":"scale(1)"}}/>
      </div>
      <div style={{padding:"14px 16px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <CatTag cat={article.category}/>
          <span style={{fontSize:10,color:"#9CA3AF",marginLeft:"auto"}}>{timeAgo(article.pubDate)}</span>
        </div>
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
  const img = getCatImage(article.category, (article.imgSeed||0)+2);
  return (
    <div onClick={()=>openArticle(article)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:"#fff",borderRadius:12,overflow:"hidden",cursor:"pointer",border:`1px solid ${h?"#D1D5DB":"#E5E7EB"}`,boxShadow:h?"0 8px 24px rgba(0,0,0,0.1)":"0 1px 4px rgba(0,0,0,0.05)",transition:"all .2s",display:"flex",marginBottom:16}}>
      <div style={{width:160,flexShrink:0,overflow:"hidden"}}>
        <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .3s",transform:h?"scale(1.04)":"scale(1)"}}/>
      </div>
      <div style={{padding:"16px 20px",flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <CatTag cat={article.category}/>
          <span style={{fontSize:10,color:"#9CA3AF",marginLeft:"auto"}}>{timeAgo(article.pubDate)}</span>
        </div>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700,lineHeight:1.4,color:NAVY,marginBottom:6}}>{article.title}</div>
        <div style={{fontSize:13,color:GRAY,lineHeight:1.5,marginBottom:10}}>{article.description}…</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",gap:4}}>{article.parties.map(p=><Badge key={p} id={p}/>)}</div>
          <span style={{fontSize:12,color:BLUE,fontWeight:600}}>Läs mer →</span>
        </div>
      </div>
    </div>
  );
}

function PollWidget({ compact }) {
  const PP=[{id:"S",label:"Socialdemokraterna"},{id:"SD",label:"Sverigedemokraterna"},{id:"M",label:"Moderaterna"},{id:"V",label:"Vänsterpartiet"},{id:"C",label:"Centerpartiet"},{id:"MP",label:"Miljöpartiet"},{id:"KD",label:"Kristdemokraterna"},{id:"L",label:"Liberalerna"},{id:"vetej",label:"Vet ej / Röstar inte"}];
  const [sel,setSel]=useState(null);
  const [voted,setVoted]=useState(()=>localStorage.getItem("pf_v4")||null);
  const [votes,setVotes]=useState(()=>{try{return JSON.parse(localStorage.getItem("pf_vs4"))||{};}catch{return{};}});
  function submit(){if(!sel||voted)return;const nv={...votes,[sel]:(votes[sel]||0)+1};setVotes(nv);setVoted(sel);localStorage.setItem("pf_v4",sel);localStorage.setItem("pf_vs4",JSON.stringify(nv));}
  const total=Object.values(votes).reduce((a,b)=>a+b,0);
  if(compact&&voted){const p=gp(voted);return <div style={{fontSize:13,color:GRAY}}>Du röstade: {p?.name||voted}</div>;}
  return(
    <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:12,padding:compact?"20px":"24px"}}>
      {!compact&&<div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:NAVY,marginBottom:4}}>Var lutar din röst inför valet 2026?</div>}
      <div style={{fontSize:12,color:GRAY,marginBottom:16}}>{total>0?`${total.toLocaleString()} röster`:"Bli den första att rösta"} · Helt anonym</div>
      {!voted?(
        <>
          {PP.map(({id,label})=>{const p=gp(id);const iS=sel===id;return(
            <div key={id} onClick={()=>setSel(id)} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 12px",borderRadius:8,border:iS?`2px solid ${BLUE}`:"1px solid #E5E7EB",background:iS?"#EFF6FF":"#FAFAFA",cursor:"pointer",marginBottom:6,transition:"all .1s"}}>
              <div style={{width:18,height:18,borderRadius:"50%",border:iS?`5px solid ${BLUE}`:"2px solid #D1D5DB",background:"#fff",flexShrink:0}}/>
              {p&&<span style={{display:"inline-block",padding:"2px 7px",borderRadius:4,fontSize:11,fontWeight:700,background:p.bg,color:p.color,flexShrink:0}}>{p.short}</span>}
              <span style={{fontSize:13,color:iS?NAVY:"#374151",fontWeight:iS?600:400}}>{label}</span>
            </div>
          );})}
          <button onClick={submit} disabled={!sel} style={{marginTop:12,background:sel?NAVY:"#E5E7EB",color:sel?"#fff":"#9CA3AF",border:"none",borderRadius:8,padding:"11px 28px",fontSize:14,fontWeight:700,cursor:sel?"pointer":"not-allowed"}}>Rösta</button>
        </>
      ):(
        <>
          <div style={{fontSize:13,color:NAVY,fontWeight:600,marginBottom:14}}>✓ Du röstade på: {PP.find(p=>p.id===voted)?.label}</div>
          {PP.map(({id})=>{const p=gp(id);const pct=total>0?Math.round(((votes[id]||0)/total)*100):0;const isV=voted===id;return(
            <div key={id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:7}}>
              <div style={{width:36,flexShrink:0}}>{p?<span style={{display:"inline-block",padding:"2px 5px",borderRadius:3,fontSize:10,fontWeight:700,background:p.bg,color:p.color}}>{p.short}</span>:<span style={{fontSize:10,color:GRAY}}>–</span>}</div>
              <div style={{flex:1,height:16,background:"#F3F4F6",borderRadius:3,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:isV?GOLD:(p?.bg||"#9CA3AF"),minWidth:2,transition:"width .4s"}}/></div>
              <div style={{width:34,fontSize:12,fontWeight:700,textAlign:"right",color:isV?GOLD:"#374151"}}>{pct}%</div>
            </div>
          );})}
          <div style={{marginTop:8,fontSize:11,color:GRAY}}>Röstning är anonym och kan inte spåras till dig.</div>
        </>
      )}
    </div>
  );
}

function Valkompass() {
  const [answers,setAnswers]=useState({});
  const [result,setResult]=useState(null);
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
    }
  }
  if(result){
    const wp=gp(result[0][0]);
    return(
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{background:`linear-gradient(135deg,${NAVY} 0%,#1e3a5f 100%)`,borderRadius:16,padding:36,marginBottom:28,textAlign:"center",boxShadow:"0 12px 40px rgba(13,27,42,0.3)"}}>
          <div style={{fontSize:11,color:GOLD,letterSpacing:"2px",textTransform:"uppercase",marginBottom:12}}>🎉 Ditt resultat</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:"#fff",marginBottom:20}}>Du passar bäst med<br/>{wp?.name}</div>
          <div style={{width:64,height:64,borderRadius:"50%",background:wp?.bg,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:wp?.color,fontWeight:700,fontSize:24}}>{wp?.short}</span>
          </div>
        </div>
        {result.map(([pid,score],i)=>{const p=gp(pid);return(
          <div key={pid} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
            <div style={{width:24,fontSize:11,color:GRAY,textAlign:"right"}}>{i+1}</div>
            <div style={{width:44}}><Badge id={pid} large/></div>
            <div style={{flex:1,height:22,background:"#F3F4F6",borderRadius:4,overflow:"hidden"}}>
              <div style={{width:`${score}%`,height:"100%",background:i===0?GOLD:(p?.bg||"#E5E7EB"),opacity:i===0?1:0.75}}/>
            </div>
            <div style={{width:40,fontSize:13,fontWeight:700,textAlign:"right",color:i===0?GOLD:"#374151"}}>{score}%</div>
          </div>
        );})}
        <div style={{marginTop:24,textAlign:"center"}}>
          <button onClick={()=>{setAnswers({});setResult(null);}} style={{background:NAVY,color:"#fff",border:"none",borderRadius:8,padding:"12px 28px",fontSize:14,fontWeight:600,cursor:"pointer"}}>Gör om testet</button>
        </div>
        <div style={{marginTop:12,fontSize:11,color:GRAY,textAlign:"center"}}>Resultatet är ett ungefärligt underlag och inte en exakt bild av partiernas politik.</div>
      </div>
    );
  }
  if(!currentQ)return null;
  const catColors={Migration:"#D97706",Klimat:"#059669",Ekonomi:"#4F46E5",Kriminalitet:"#DC2626",Sjukvård:"#2563EB",Skola:"#7C3AED",Bostäder:"#EA580C"};
  return(
    <div style={{maxWidth:600,margin:"0 auto"}}>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:GRAY,marginBottom:8}}>
          <span>Fråga {progress+1} av {QUESTIONS.length}</span>
          <span>{Math.round((progress/QUESTIONS.length)*100)}% klart</span>
        </div>
        <div style={{height:6,background:"#E5E7EB",borderRadius:3,overflow:"hidden"}}>
          <div style={{width:`${(progress/QUESTIONS.length)*100}%`,height:"100%",background:BLUE,transition:"width .3s"}}/>
        </div>
      </div>
      <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:16,padding:32,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <div style={{display:"inline-block",background:catColors[currentQ.cat]||BLUE,color:"#fff",fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",padding:"3px 10px",borderRadius:20,marginBottom:16}}>{currentQ.cat}</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:21,fontWeight:700,color:NAVY,lineHeight:1.4,marginBottom:32}}>{currentQ.text}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {[{label:"Ja ✓",val:1,bg:NAVY,color:"#fff"},{label:"Vet ej",val:0,bg:"#F3F4F6",color:"#374151"},{label:"Nej ✗",val:-1,bg:"#FEE2E2",color:"#DC2626"}].map(o=>(
            <button key={o.val} onClick={()=>answer(currentQ.id,o.val)} style={{background:o.bg,color:o.color,border:"none",borderRadius:10,padding:"16px 8px",fontWeight:700,fontSize:16,cursor:"pointer",transition:"opacity .1s"}}
              onMouseEnter={e=>e.target.style.opacity="0.85"} onMouseLeave={e=>e.target.style.opacity="1"}>{o.label}</button>
          ))}
        </div>
      </div>
      <div style={{fontSize:12,color:GRAY,textAlign:"center",marginTop:12}}>Svara på alla {QUESTIONS.length} frågor för att se ditt resultat</div>
    </div>
  );
}

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
      <div style={{background:NAVY,padding:"28px 32px"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:"#fff"}}>Vanliga frågor</div>
      </div>
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
      <div style={{background:NAVY,padding:"28px 32px"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:"#fff"}}>Integritetspolicy</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:4}}>Senast uppdaterad: April 2026</div>
      </div>
      <div style={{padding:"24px 32px 32px",fontSize:14,color:"#374151",lineHeight:1.8}}>
        {[["1. Personuppgiftsansvarig","PartiFokus (partifokus@gmail.com) är personuppgiftsansvarig."],["2. Vilka uppgifter samlar vi in?","PartiFokus samlar inte in några personuppgifter. Vi använder Google Analytics för anonym besöksstatistik."],["3. Poll och valkompass","Din röst och dina svar lagras endast lokalt i din webbläsare. Vi skickar inte dessa uppgifter till någon server."],["4. Cookies","Vi använder Google Analytics-cookies för anonym statistik. Inga marknadsföringscookies används."],["5. Dina rättigheter","Du har rätt att begära information om vilka uppgifter vi har om dig. Kontakta oss på partifokus@gmail.com."]].map(([h,t])=><div key={h} style={{marginBottom:20}}><div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:NAVY,marginBottom:6}}>{h}</div><div>{t}</div></div>)}
      </div>
    </Modal>
  );
}

function SourcesModal({ onClose }) {
  const sources=[{name:"SVT Nyheter",url:"https://www.svt.se",desc:"Public service TV"},{name:"Sveriges Radio",url:"https://www.sverigesradio.se",desc:"Public service radio"},{name:"Dagens Nyheter",url:"https://www.dn.se",desc:"Oberoende liberal morgontidning"},{name:"Aftonbladet",url:"https://www.aftonbladet.se",desc:"Kvällstidning"},{name:"Expressen",url:"https://www.expressen.se",desc:"Liberal kvällstidning"},{name:"Omni",url:"https://omni.se",desc:"Nyhetsaggregator"},{name:"Google News",url:"https://news.google.com",desc:"Fångar upp artiklar från hundratals svenska medier"},{name:"Moderaterna",url:"https://moderaterna.se",desc:"Partiets officiella presskanal"},{name:"Socialdemokraterna",url:"https://www.socialdemokraterna.se",desc:"Partiets officiella presskanal"},{name:"Sverigedemokraterna",url:"https://sd.se",desc:"Partiets officiella presskanal"},{name:"Kristdemokraterna",url:"https://kristdemokraterna.se",desc:"Partiets officiella presskanal"},{name:"Liberalerna",url:"https://www.liberalerna.se",desc:"Partiets officiella presskanal"},{name:"Centerpartiet",url:"https://www.centerpartiet.se",desc:"Partiets officiella presskanal"},{name:"Vänsterpartiet",url:"https://www.vansterpartiet.se",desc:"Partiets officiella presskanal"},{name:"Miljöpartiet",url:"https://www.mp.se",desc:"Partiets officiella presskanal"},{name:"riksdagen.se",url:"https://www.riksdagen.se",desc:"Riksdagens öppna data"}];
  return(
    <Modal onClose={onClose}>
      <div style={{background:NAVY,padding:"28px 32px"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:"#fff"}}>Källförteckning</div>
      </div>
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
        <div style={{fontSize:14,color:GRAY,lineHeight:1.7,marginBottom:28,maxWidth:400,margin:"0 auto 28px"}}>Har du frågor, synpunkter eller vill samarbeta? Skicka ett mail!</div>
        <a href="mailto:partifokus@gmail.com" style={{display:"inline-block",background:NAVY,color:"#fff",borderRadius:8,padding:"14px 32px",fontSize:15,fontWeight:700,textDecoration:"none"}}>partifokus@gmail.com</a>
      </div>
    </Modal>
  );
}

function NewsTab({ party, articles }) {
  const mobile = useIsMobile();
  const [catFilter,setCatFilter]=useState("Alla");
  const cats=["Alla",...Object.keys(CATEGORY_KEYWORDS)];
  let filtered=party==="all"?articles:articles.filter(a=>a.parties.includes(party));
  if(catFilter!=="Alla")filtered=filtered.filter(a=>a.category===catFilter);
  const [first,...rest]=filtered;
  const [second,third,...remaining]=rest;
  return(
    <div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        {cats.map(cat=><button key={cat} onClick={()=>setCatFilter(cat)} style={{background:catFilter===cat?NAVY:"#fff",color:catFilter===cat?"#fff":"#374151",border:`1px solid ${catFilter===cat?NAVY:"#E5E7EB"}`,borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>{cat}</button>)}
      </div>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY,borderBottom:`2px solid ${NAVY}`,paddingBottom:8,marginBottom:24}}>
        {party==="all"?"Alla nyheter":gp(party)?.name} <span style={{fontFamily:"sans-serif",fontSize:13,fontWeight:400,color:GRAY,marginLeft:8}}>{filtered.length} artiklar</span>
      </div>
      {first&&<BigCard article={first}/>}
      {(second||third)&&<div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:20,marginBottom:24}}>{second&&<MedCard article={second}/>}{third&&<MedCard article={third}/>}</div>}
      {remaining.map(a=><RowCard key={a.id} article={a}/>)}
    </div>
  );
}

function PressTab({ party, items }) {
  const mobile = useIsMobile();
  let filtered=party==="all"?items:items.filter(a=>a.party===party);
  const withCat=filtered.map(a=>({...a,parties:a.party?[a.party]:[],category:"Ekonomi"}));
  const [first,...rest]=withCat;
  const [second,third,...remaining]=rest;
  return(
    <div>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY,borderBottom:`2px solid ${NAVY}`,paddingBottom:8,marginBottom:24}}>Pressmeddelanden <span style={{fontFamily:"sans-serif",fontSize:13,fontWeight:400,color:GRAY,marginLeft:8}}>{filtered.length} st</span></div>
      {first&&<BigCard article={first}/>}
      {(second||third)&&<div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:20,marginBottom:24}}>{second&&<MedCard article={second}/>}{third&&<MedCard article={third}/>}</div>}
      {remaining.map(a=><RowCard key={a.id} article={a}/>)}
    </div>
  );
}

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

function LedamoterTab({ party }) {
  const filtered=party==="all"?MOCK_MEMBERS:MOCK_MEMBERS.filter(m=>m.parti===party);
  const initials=n=>n.split(" ").map(x=>x[0]).join("").slice(0,2);
  return(
    <div>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY,borderBottom:`2px solid ${NAVY}`,paddingBottom:8,marginBottom:24}}>Riksdagsledamöter</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:14}}>
        {filtered.map(m=>{const p=gp(m.parti);return(
          <div key={m.id} style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:12,padding:20,textAlign:"center"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:p?.bg,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:p?.color,fontWeight:700,fontFamily:"Georgia,serif",fontSize:18}}>{initials(m.namn)}</span></div>
            <div style={{fontFamily:"Georgia,serif",fontSize:14,fontWeight:700,marginBottom:6,color:NAVY}}>{m.namn}</div>
            <div style={{marginBottom:6}}><Badge id={m.parti} large/></div>
            <div style={{fontSize:11,color:GRAY}}>{m.valkrets}</div>
          </div>
        );})}
      </div>
    </div>
  );
}

function OpinionTab() {
  const pids=["M","SD","KD","L","C","S","V","MP"],latest=MOCK_POLLS_DATA[0];
  return(
    <div>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY,borderBottom:`2px solid ${NAVY}`,paddingBottom:8,marginBottom:24}}>Opinionsmätningar</div>
      <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:12,padding:24,marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:20}}><div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:NAVY}}>Senaste – {latest.datum}</div><div style={{fontSize:12,color:GRAY}}>{latest.källa}</div></div>
        {pids.map(pid=>{const p=gp(pid),pct=latest[pid];return(<div key={pid} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}><div style={{width:40}}><Badge id={pid} large/></div><div style={{flex:1,height:22,background:"#F3F4F6",borderRadius:2,overflow:"hidden"}}><div style={{width:`${pct*2.8}%`,height:"100%",background:p?.bg,minWidth:4}}/></div><div style={{fontSize:13,fontWeight:700,minWidth:40,textAlign:"right",color:NAVY}}>{pct}%</div></div>);})}
        <div style={{marginTop:14,fontSize:12,color:GRAY,borderTop:"1px solid #F3F4F6",paddingTop:12}}>Högerblocket: <strong>{(latest.M+latest.SD+latest.KD+latest.L+latest.C).toFixed(1)}%</strong><span style={{margin:"0 12px"}}>·</span>Vänsterblocket: <strong>{(latest.S+latest.V+latest.MP).toFixed(1)}%</strong></div>
      </div>
      {MOCK_POLLS_DATA.map(poll=>(
        <div key={poll.id} style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:10,padding:"14px 20px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div style={{fontFamily:"Georgia,serif",fontWeight:700,color:NAVY}}>{poll.datum}</div><div style={{fontSize:11,color:GRAY}}>{poll.källa}</div></div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{pids.map(pid=><span key={pid} style={{display:"flex",alignItems:"center",gap:3}}><Badge id={pid}/><span style={{fontSize:12,fontWeight:700,color:NAVY}}>{poll[pid]}%</span></span>)}</div>
        </div>
      ))}
    </div>
  );
}

function HomePage({ articles, onTabChange }) {
  const mobile = useIsMobile();
  const top = articles.slice(0,5);
  return(
    <div>
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
      </div>

      <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:20}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:NAVY}}>Det händer just nu</div>
        <button onClick={()=>onTabChange("nyheter")} style={{background:"none",border:"none",color:BLUE,fontSize:13,fontWeight:600,cursor:"pointer"}}>Visa alla →</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(4,1fr)",gap:20,marginBottom:56}}>
        {top.slice(1,5).map(a=><MedCard key={a.id} article={a}/>)}
      </div>

      <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:NAVY,marginBottom:20}}>Utforska politik på ditt sätt</div>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:24,marginBottom:56}}>
        <div style={{background:`linear-gradient(135deg,${NAVY} 0%,#1e3a5f 100%)`,borderRadius:16,padding:32,cursor:"pointer",position:"relative",overflow:"hidden"}} onClick={()=>onTabChange("valkompass")}>
          <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
          <div style={{fontSize:11,color:GOLD,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:12}}>🗳️ Valkompass 2026</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:"#fff",lineHeight:1.3,marginBottom:12}}>Osäker på var du står<br/>inför valet 2026?</div>
          <div style={{fontSize:14,color:"rgba(255,255,255,0.7)",lineHeight:1.6,marginBottom:20}}>Svara på 25 frågor och ta reda på vilket parti du stämmer bäst överens med.</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:24}}>{["M","SD","S","V","C","MP","KD","L"].map(pid=><Badge key={pid} id={pid}/>)}</div>
          <button style={{background:GOLD,color:NAVY,border:"none",borderRadius:8,padding:"13px 28px",fontSize:15,fontWeight:700,cursor:"pointer"}}>Gör testet nu →</button>
        </div>
        <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:16,padding:32}}>
          <div style={{fontSize:11,color:BLUE,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:12}}>📊 Folkopinionen</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY,lineHeight:1.3,marginBottom:8}}>Vart lutar din röst<br/>inför valet 2026?</div>
          <div style={{fontSize:13,color:GRAY,marginBottom:20}}>Rösta anonymt och se vad andra tycker – just nu.</div>
          <PollWidget compact/>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab,setTab]=useState("hem");
  const [party,setParty]=useState("all");
  const [news,setNews]=useState(MOCK_NEWS);
  const [press,setPress]=useState(MOCK_PRESS);
  const [modal,setModal]=useState(null);
  const mobile = useIsMobile();

  useEffect(()=>{
    Promise.allSettled(NEWS_SOURCES.map(fetchRSS)).then(results=>{
      const fetched=results.filter(r=>r.status==="fulfilled").flatMap(r=>r.value).filter(a=>a.parties.length>0);
      const sevenDays=Date.now()-7*24*60*60*1000;
      const all=[...MOCK_NEWS,...fetched];
      const seen=new Set();
      const deduped=all.filter(a=>{const k=a.title.slice(0,40).toLowerCase();if(seen.has(k))return false;seen.add(k);return new Date(a.pubDate)>sevenDays;});
      deduped.sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));
      setNews(deduped);
    });
    Promise.allSettled(PRESS_SOURCES.map(fetchRSS)).then(results=>{
      const fetched=results.filter(r=>r.status==="fulfilled").flatMap(r=>r.value);
      if(fetched.length>0){const seen=new Set();const all=[...fetched,...MOCK_PRESS].filter(a=>{const k=a.title.slice(0,40).toLowerCase();if(seen.has(k))return false;seen.add(k);return true;});all.sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));setPress(all);}
    });
  },[]);

  useEffect(()=>{if(window.gtag)window.gtag("config",GA_ID,{page_path:"/"+tab});},[tab]);

  function changeTab(newTab){setTab(newTab);setParty("all");}
  const showPartyFilter=!["hem","valkompass","omrostningar","ledamoter","opinion"].includes(tab);

  return(
    <div style={{fontFamily:"system-ui,sans-serif",background:"#F9FAFB",minHeight:"100vh",color:NAVY}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {modal==="faq"&&<FAQModal onClose={()=>setModal(null)}/>}
      {modal==="privacy"&&<PrivacyModal onClose={()=>setModal(null)}/>}
      {modal==="sources"&&<SourcesModal onClose={()=>setModal(null)}/>}
      {modal==="contact"&&<ContactModal onClose={()=>setModal(null)}/>}

      <header style={{background:"#fff",borderBottom:"1px solid #E5E7EB",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:`0 ${mobile?16:32}px`,height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={()=>changeTab("hem")} style={{background:"none",border:"none",cursor:"pointer",padding:0,textAlign:"left"}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY}}>Parti<span style={{color:BLUE,borderBottom:`2px solid ${BLUE}`,paddingBottom:1}}>Fokus</span></div>
            <div style={{fontSize:10,color:GRAY,letterSpacing:"1px",marginTop:1}}>Politik. Inget annat.</div>
          </button>
          {!mobile&&<nav style={{display:"flex",gap:2}}>{TABS.map(t=><button key={t.id} onClick={()=>changeTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",padding:"8px 14px",fontSize:14,fontWeight:tab===t.id?700:400,color:tab===t.id?NAVY:GRAY,borderBottom:tab===t.id?`2px solid ${NAVY}`:"2px solid transparent",whiteSpace:"nowrap"}}>{t.label}</button>)}</nav>}
          {mobile&&<select value={tab} onChange={e=>changeTab(e.target.value)} style={{border:"1px solid #E5E7EB",borderRadius:8,padding:"6px 10px",fontSize:13,color:NAVY,background:"#fff"}}><option value="hem">Hem</option>{TABS.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</select>}
        </div>
        {showPartyFilter&&(
          <div style={{background:"#F9FAFB",borderTop:"1px solid #E5E7EB",overflowX:"auto",scrollbarWidth:"none"}}>
            <div style={{maxWidth:1200,margin:"0 auto",padding:`0 ${mobile?16:32}px`,display:"flex"}}>
              {PARTIES.map(p=>(
                <button key={p.id} onClick={()=>setParty(p.id)} style={{background:"none",border:"none",cursor:"pointer",padding:"8px 12px",fontSize:11,fontWeight:700,letterSpacing:"0.5px",textTransform:"uppercase",color:party===p.id?NAVY:GRAY,borderBottom:party===p.id?`2px solid ${NAVY}`:"2px solid transparent",whiteSpace:"nowrap"}}>
                  {p.id!=="all"&&<span style={{display:"inline-block",padding:"1px 5px",borderRadius:3,fontSize:9,fontWeight:700,background:p.bg,color:p.color,marginRight:5}}>{p.short}</span>}
                  {mobile?p.short:p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main style={{maxWidth:1200,margin:"0 auto",padding:`${mobile?24:40}px ${mobile?16:32}px`}}>
        {tab==="hem"         &&<HomePage articles={news} onTabChange={changeTab}/>}
        {tab==="nyheter"     &&<NewsTab party={party} articles={news}/>}
        {tab==="press"       &&<PressTab party={party} items={press}/>}
        {tab==="omrostningar"&&<OmrostningarTab/>}
        {tab==="ledamoter"   &&<LedamoterTab party={party}/>}
        {tab==="opinion"     &&<OpinionTab/>}
        {tab==="valkompass"  &&<div><div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:NAVY,borderBottom:`2px solid ${NAVY}`,paddingBottom:8,marginBottom:28}}>Din politiska profil – Valkompass 2026</div><Valkompass/></div>}
      </main>

      <footer style={{background:NAVY,marginTop:64,padding:`48px ${mobile?20:32}px 32px`}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"2fr 1fr 1fr 1fr",gap:mobile?24:40,marginBottom:40}}>
            <div style={{gridColumn:mobile?"span 2":"auto"}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#fff",marginBottom:4}}>Parti<span style={{color:GOLD}}>Fokus</span></div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:12}}>Politik. Inget annat.</div>
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
            <span>Utgivningsbevis sökt hos MPRT · partifokus@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}