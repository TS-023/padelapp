const express = require("express");
const fetch   = require("node-fetch");
const cors    = require("cors");
const path    = require("path");

const app = express();
app.use(cors());
app.use(express.static(__dirname));

// ── CLUBS ─────────────────────────────────────────────────────────
const CLUBS = [
  // ── HAARLEM (~0-5km) ─────────────────────────────────────────
  { id:"wepadel",    name:"WePadel Haarlem",            adres:"Reinaldapad 10, Haarlem",        stad:"Haarlem",       km:1.8,  banen:8,  type:"playtomic", playtomic_id:"dd28050e-35c4-4bd0-ab58-b2f88111846d", kleur:"#1DB954", bg:"#E8F9EE", site:"https://playtomic.io/wepadel-haarlem/dd28050e-35c4-4bd0-ab58-b2f88111846d" },
  { id:"padel25",    name:"Padel25 Haarlem",            adres:"A. Hofmanweg 16, Haarlem",       stad:"Haarlem",       km:2.3,  banen:6,  type:"playtomic", playtomic_id:"68640cb4-c026-4bb1-8184-6e2cfe0f5ccf", kleur:"#0284C7", bg:"#E0F2FE", site:"https://playtomic.io/indoor-padel25-haarlem/68640cb4-c026-4bb1-8184-6e2cfe0f5ccf" },
  { id:"pimmulier",  name:"TPV Pim Mulier",             adres:"Jaap Edenlaan 9, Haarlem",       stad:"Haarlem",       km:2.9,  banen:8,  type:"link", kleur:"#7C3AED", bg:"#EDE9FE", site:"https://meetandplay.nl/club/29462?sport=padel" },
  { id:"overhout",   name:"Padel Club Overhout",        adres:"Tennispad 1, Haarlem",           stad:"Haarlem",       km:3.1,  banen:5,  type:"link", kleur:"#F59E0B", bg:"#FEF3C7", site:"https://overhout.baanreserveren.nl" },
  { id:"schoten",    name:"Schoten Tennis & Padel",     adres:"Vergierdeweg 265a, Haarlem",     stad:"Haarlem",       km:3.8,  banen:3,  type:"link", kleur:"#DB2777", bg:"#FCE7F3", site:"https://www.schoten-tennis-padel.nl/padel" },
  { id:"peakz",      name:"Peakz Padel Haarlem",        adres:"Oerkapkade 2, Haarlem",          stad:"Haarlem",       km:4.2,  banen:4,  type:"link", kleur:"#EF4444", bg:"#FEE2E2", site:"https://www.peakzpadel.nl/reserveren/court-booking/reservation?location=Lichtfabriek" },

  // ── OMGEVING HAARLEM (~5-15km) ───────────────────────────────
  { id:"overveen",   name:"Padel Bloemendaal (Tetterode)", adres:"Tetterodeweg 60, Overveen",      stad:"Bloemendaal",   km:5.1,  banen:3,  type:"link", kleur:"#0EA5E9", bg:"#E0F2FE", site:"https://padelbloemendaal.baanhuur.nl" },
  { id:"bennebroek", name:"Padel Bennebroek",           adres:"Bennebroek",                     stad:"Bennebroek",    km:6.4,  banen:2,  type:"link", kleur:"#65A30D", bg:"#ECFCCB", site:"https://www.padelinsider.nl/padel-bennebroek/" },
  { id:"santpoort",  name:"Padel Santpoort-Noord",      adres:"Santpoort-Noord",                stad:"Santpoort",     km:7.2,  banen:3,  type:"link", kleur:"#B45309", bg:"#FEF3C7", site:"https://padelheld.nl/padel-santpoort-noord/" },
  { id:"velserbroek",name:"Padel Velserbroek",          adres:"Velserbroek",                    stad:"Velserbroek",   km:8.1,  banen:4,  type:"link", kleur:"#7C3AED", bg:"#EDE9FE", site:"https://padelheld.nl/padel-velserbroek/" },
  { id:"heemstede",  name:"Padel Heemstede",            adres:"Heemstede",                      stad:"Heemstede",     km:5.3,  banen:3,  type:"link", kleur:"#0891B2", bg:"#CFFAFE", site:"https://padelheld.nl/padel-heemstede/" },
  { id:"cruquius",   name:"Padel Cruquius",             adres:"Cruquius",                       stad:"Cruquius",      km:7.8,  banen:2,  type:"link", kleur:"#C2410C", bg:"#FFEDD5", site:"https://padelheld.nl/padel-cruquius/" },
  { id:"ijmuiden",   name:"Padel IJmuiden",             adres:"IJmuiden",                       stad:"IJmuiden",      km:9.4,  banen:4,  type:"link", kleur:"#1D4ED8", bg:"#DBEAFE", site:"https://padelheld.nl/padel-ijmuiden/" },

  // ── HOOFDDORP / BADHOEVEDORP (~10-15km) ──────────────────────
  { id:"padelpoints",name:"Padelpoints Hoofddorp",      adres:"Hoofddorp",                      stad:"Hoofddorp",     km:11.8, banen:12, type:"playtomic", playtomic_id:"8519afe9-dd55-4384-af68-9d6c4f8cfe03", kleur:"#059669", bg:"#D1FAE5", site:"https://playtomic.io/padelpoints-hoofddorp/8519afe9-dd55-4384-af68-9d6c4f8cfe03" },
  { id:"padelclubhfd",name:"Padelclub Hoofddorp",       adres:"Hoofddorp",                      stad:"Hoofddorp",     km:13.1, banen:2,  type:"playtomic", playtomic_id:"9d921d17-f801-470b-a2e8-cfb7cabb4ccc", kleur:"#D97706", bg:"#FEF3C7", site:"https://playtomic.io/padelclub-hoofddorp/9d921d17-f801-470b-a2e8-cfb7cabb4ccc" },
  { id:"badhoevedorp",name:"Padel Badhoevedorp",        adres:"Badhoevedorp",                   stad:"Badhoevedorp",  km:12.4, banen:14, type:"link", kleur:"#BE185D", bg:"#FCE7F3", site:"https://padelheld.nl/padel-badhoevedorp/" },
  { id:"nieuwvennep", name:"Padel Nieuw-Vennep",        adres:"Nieuw-Vennep",                   stad:"Nieuw-Vennep",  km:13.8, banen:4,  type:"link", kleur:"#15803D", bg:"#DCFCE7", site:"https://padelheld.nl/padel-nieuwvennep/" },

  // ── BEVERWIJK / HEEMSKERK / CASTRICUM (~14-20km) ─────────────
  { id:"clubhouse",  name:"Clubhouse Padel Beverwijk",  adres:"Beverwijk",                      stad:"Beverwijk",     km:14.2, banen:4,  type:"playtomic", playtomic_id:"824da72e-92e4-4a92-b435-7a73595bd3c7", kleur:"#2563EB", bg:"#DBEAFE", site:"https://playtomic.io/clubhouse-padel-ping-pong/824da72e-92e4-4a92-b435-7a73595bd3c7" },
  { id:"heemskerk",  name:"Padel Heemskerk",            adres:"Heemskerk",                      stad:"Heemskerk",     km:15.6, banen:4,  type:"link", kleur:"#9333EA", bg:"#F3E8FF", site:"https://padelheld.nl/padel-heemskerk/" },
  { id:"castricum",  name:"Padel Castricum",            adres:"Castricum",                      stad:"Castricum",     km:18.3, banen:3,  type:"link", kleur:"#0F766E", bg:"#CCFBF1", site:"https://padelheld.nl/padel-castricum/" },
  { id:"uitgeest",   name:"Padel Uitgeest",             adres:"Uitgeest",                       stad:"Uitgeest",      km:16.8, banen:2,  type:"link", kleur:"#A16207", bg:"#FEF9C3", site:"https://padelheld.nl/padel-uitgeest/" },

  // ── ZAANDAM / PURMEREND (~17-30km) ───────────────────────────
  { id:"zaandam",    name:"Padelclub Zaandam",          adres:"Koog aan de Zaan",               stad:"Zaandam",       km:17.6, banen:4,  type:"playtomic", playtomic_id:"f36ea70c-5ec3-4ef4-99bb-d1e6156ab095", kleur:"#0891B2", bg:"#CFFAFE", site:"https://playtomic.io/padelclub-zaandam/f36ea70c-5ec3-4ef4-99bb-d1e6156ab095" },
  { id:"krommenie",  name:"Padel Krommenie",            adres:"Krommenie",                      stad:"Krommenie",     km:19.2, banen:3,  type:"link", kleur:"#7C3AED", bg:"#EDE9FE", site:"https://padelheld.nl/padel-krommenie/" },
  { id:"purmerend",  name:"Padel Purmerend",            adres:"Purmerend",                      stad:"Purmerend",     km:25.4, banen:6,  type:"link", kleur:"#DC2626", bg:"#FEE2E2", site:"https://padelheld.nl/padel-purmerend/" },
  { id:"edam",       name:"Padelcentrum Bol Edam",       adres:"Edam",                           stad:"Edam",          km:28.2, banen:7,  type:"playtomic", playtomic_id:"65549c5d-ee71-4427-b8a6-1befda5ae077", kleur:"#0891B2", bg:"#CFFAFE", site:"https://playtomic.io/padelcentrum-bol/65549c5d-ee71-4427-b8a6-1befda5ae077" },
  { id:"volendam",   name:"Padel Volendam",              adres:"Volendam",                       stad:"Volendam",      km:30.1, banen:10, type:"link", kleur:"#F97316", bg:"#FFEDD5", site:"https://padelheld.nl/padel-volendam/" },
  { id:"uithoorn",   name:"Padel Uithoorn",              adres:"Uithoorn",                       stad:"Uithoorn",      km:32.4, banen:6,  type:"link", kleur:"#8B5CF6", bg:"#EDE9FE", site:"https://padelheld.nl/padel-uithoorn/" },
  { id:"laren",      name:"Padel Club Laren",            adres:"Laren",                          stad:"Laren",         km:43.2, banen:4,  type:"link", kleur:"#15803D", bg:"#DCFCE7", site:"https://padelclublaren.nl/banen-boeken/" },
  { id:"zandvoort",  name:"Padel Zandvoort",             adres:"Zandvoort",                      stad:"Zandvoort",     km:10.2, banen:3,  type:"link", kleur:"#C2410C", bg:"#FFEDD5", site:"https://padelheld.nl/padel-zandvoort/" },
  { id:"edam",       name:"Padelcentrum Bol Edam",       adres:"Edam",                           stad:"Edam",          km:28.2, banen:7,  type:"playtomic", playtomic_id:"65549c5d-ee71-4427-b8a6-1befda5ae077", kleur:"#0891B2", bg:"#CFFAFE", site:"https://playtomic.io/padelcentrum-bol/65549c5d-ee71-4427-b8a6-1befda5ae077" },
  { id:"volendam",   name:"Padel Volendam",              adres:"Volendam",                       stad:"Volendam",      km:30.1, banen:10, type:"link", kleur:"#F97316", bg:"#FFEDD5", site:"https://padelheld.nl/padel-volendam/" },
  { id:"uithoorn",   name:"Padel Uithoorn",              adres:"Uithoorn",                       stad:"Uithoorn",      km:32.4, banen:6,  type:"link", kleur:"#8B5CF6", bg:"#EDE9FE", site:"https://padelheld.nl/padel-uithoorn/" },
  { id:"laren",      name:"Padel Club Laren",            adres:"Laren",                          stad:"Laren",         km:43.2, banen:4,  type:"link", kleur:"#15803D", bg:"#DCFCE7", site:"https://padelclublaren.nl/banen-boeken/" },
  { id:"zandvoort",  name:"Padel Zandvoort",             adres:"Zandvoort",                      stad:"Zandvoort",     km:10.2, banen:3,  type:"link", kleur:"#C2410C", bg:"#FFEDD5", site:"https://padelheld.nl/padel-zandvoort/" },

  // ── AMSTELVEEN / AMSTERDAM (~18-28km) ────────────────────────
  { id:"padelmate",  name:"Padel Mate Club Amstelveen", adres:"Grutterij 1, Amstelveen",        stad:"Amstelveen",    km:18.4, banen:10, type:"playtomic", playtomic_id:"fdac3d26-3abd-4dfc-825b-b299a8cdc38e", kleur:"#E11D48", bg:"#FFE4E6", site:"https://playtomic.io/padel-mate-club-amstelveen/fdac3d26-3abd-4dfc-825b-b299a8cdc38e" },
  { id:"bamsterdam", name:"B. Amsterdam Padel",         adres:"Johan Huizingalaan 400, Amsterdam", stad:"Amsterdam",  km:20.1, banen:6,  type:"playtomic", playtomic_id:"595ccc37-5e64-40df-8ac7-ff34ea83f056", kleur:"#0EA5E9", bg:"#E0F2FE", site:"https://playtomic.io/b-amsterdam-padel/595ccc37-5e64-40df-8ac7-ff34ea83f056" },
  { id:"padeldam",   name:"Padeldam Amsterdam",         adres:"Joris van den Berghweg 120, Amsterdam", stad:"Amsterdam", km:21.3, banen:13, type:"playtomic", playtomic_id:"91f3391e-6010-11e8-8674-52540049669c", kleur:"#F97316", bg:"#FFEDD5", site:"https://playtomic.io/padeldam-amsterdam/91f3391e-6010-11e8-8674-52540049669c" },
  { id:"plazapadel", name:"Plaza Padel Amsterdam",      adres:"Amsterdam",                      stad:"Amsterdam",     km:22.5, banen:9,  type:"playtomic", playtomic_id:"d0017243-e1a8-42bf-9fa0-aad4f43784d0", kleur:"#8B5CF6", bg:"#EDE9FE", site:"https://playtomic.io/plaza-padel-amsterdam/d0017243-e1a8-42bf-9fa0-aad4f43784d0" },
  { id:"xnrgy",      name:"XNRGY Amsterdam",            adres:"Amsterdam",                      stad:"Amsterdam",     km:23.1, banen:14, type:"playtomic", playtomic_id:"ffc6dd99-5553-420e-9915-93a270b1369c", kleur:"#10B981", bg:"#D1FAE5", site:"https://playtomic.io/xnrgy/ffc6dd99-5553-420e-9915-93a270b1369c" },
  { id:"ndsm",       name:"NDSM Padel Amsterdam",       adres:"Ms. van Riemsdijkweg 6, Amsterdam", stad:"Amsterdam",  km:24.8, banen:4,  type:"playtomic", playtomic_id:"f4b21f7b-6ec3-4e13-a145-b101bd87b35b", kleur:"#6366F1", bg:"#EEF2FF", site:"https://playtomic.io/ndsm-padel/f4b21f7b-6ec3-4e13-a145-b101bd87b35b" },

  // ── ALKMAAR / HEILOO / HEERHUGOWAARD (~28-45km) ──────────────
  { id:"alkmaar",    name:"TC Alkmaar Tennis & Padel",  adres:"Alkmaar",                        stad:"Alkmaar",       km:28.6, banen:4,  type:"link", kleur:"#7C3AED", bg:"#EDE9FE", site:"https://padelheld.nl/padel-alkmaar/" },
  { id:"heiloo",     name:"Padel Heiloo",               adres:"Heiloo",                         stad:"Heiloo",        km:30.2, banen:3,  type:"link", kleur:"#0369A1", bg:"#E0F2FE", site:"https://padelheld.nl/padel-heiloo/" },
  { id:"heerhugowaard", name:"Padel Heerhugowaard",     adres:"Heerhugowaard",                  stad:"Heerhugowaard", km:33.8, banen:4,  type:"link", kleur:"#B45309", bg:"#FEF3C7", site:"https://padelheld.nl/padel-heerhugowaard/" },
  { id:"hoorn",      name:"Padel Hoorn",                adres:"Hoorn",                          stad:"Hoorn",         km:44.1, banen:5,  type:"link", kleur:"#15803D", bg:"#DCFCE7", site:"https://padelheld.nl/padel-hoorn/" },

  // ── NOORDWIJK / LEIDEN / KATWIJK (~22-40km) ──────────────────
  { id:"vinkenveld", name:"Vinkenveld Indoor Tennis & Padel", adres:"Het Laantje 33, Noordwijk", stad:"Noordwijk",   km:22.1, banen:4,  type:"link", kleur:"#0369A1", bg:"#E0F2FE", site:"https://vinkenveld.nl/padel" },
  { id:"degevers",   name:"Tennisvereniging De Gevers", adres:"Gooweg 26, Noordwijk",           stad:"Noordwijk",     km:23.4, banen:3,  type:"link", kleur:"#15803D", bg:"#DCFCE7", site:"https://www.tvdegevers.nl/padel" },
  { id:"katwijk",    name:"Padel Katwijk",              adres:"Katwijk",                        stad:"Katwijk",       km:26.3, banen:4,  type:"link", kleur:"#C2410C", bg:"#FFEDD5", site:"https://padelheld.nl/padel-katwijk/" },
  { id:"rijnsburg",  name:"Padel Rijnsburg",            adres:"Rijnsburg",                      stad:"Rijnsburg",     km:27.8, banen:4,  type:"link", kleur:"#9333EA", bg:"#F3E8FF", site:"https://padelheld.nl/padel-rijnsburg/" },
  { id:"lisse",      name:"Padel Lisse",                adres:"Lisse",                          stad:"Lisse",         km:18.4, banen:3,  type:"link", kleur:"#BE185D", bg:"#FCE7F3", site:"https://padelheld.nl/padel-lisse/" },
  { id:"sassenheim", name:"Padel Sassenheim",           adres:"Sassenheim",                     stad:"Sassenheim",    km:19.6, banen:3,  type:"link", kleur:"#0F766E", bg:"#CCFBF1", site:"https://padelheld.nl/padel-sassenheim/" },
  { id:"hillegom",   name:"Padel Hillegom",             adres:"Hillegom",                       stad:"Hillegom",      km:17.2, banen:3,  type:"link", kleur:"#A16207", bg:"#FEF9C3", site:"https://padelheld.nl/padel-hillegom/" },
  { id:"dekker",     name:"Dekker Warmond Leiden",      adres:"Warmonderweg 100, Warmond",      stad:"Leiden",        km:28.4, banen:6,  type:"playtomic", playtomic_id:"8f320800-a386-462c-9eb0-5403a7eb4964", kleur:"#BE185D", bg:"#FCE7F3", site:"https://playtomic.io/dekker-warmond-leiden/8f320800-a386-462c-9eb0-5403a7eb4964" },
  { id:"leiden",     name:"Padel Leiden",               adres:"Leiden",                         stad:"Leiden",        km:29.8, banen:6,  type:"link", kleur:"#DC2626", bg:"#FEE2E2", site:"https://padelheld.nl/padel-leiden/" },
  { id:"wassenaar",  name:"Padel Wassenaar",            adres:"Wassenaar",                      stad:"Wassenaar",     km:38.2, banen:4,  type:"link", kleur:"#6366F1", bg:"#EEF2FF", site:"https://padelheld.nl/padel-wassenaar/" },

  // ── HILVERSUM / AMSTELVEEN OMGEVING (~35-55km) ───────────────
  { id:"hilversum",  name:"Padel Hilversum",            adres:"Hilversum",                      stad:"Hilversum",     km:38.4, banen:6,  type:"link", kleur:"#7C3AED", bg:"#EDE9FE", site:"https://padelheld.nl/padel-hilversum/" },
  { id:"huizen",     name:"Padel Huizen",               adres:"Huizen",                         stad:"Huizen",        km:42.1, banen:3,  type:"link", kleur:"#0891B2", bg:"#CFFAFE", site:"https://padelheld.nl/padel-huizen/" },
  { id:"bussum",     name:"Padel Bussum",               adres:"Bussum",                         stad:"Bussum",        km:40.2, banen:3,  type:"link", kleur:"#059669", bg:"#D1FAE5", site:"https://padelheld.nl/padel-bussum/" },

  // ── DEN HAAG REGIO (~55-75km) ─────────────────────────────────
  { id:"denhaag",    name:"Padel Den Haag",             adres:"Den Haag",                       stad:"Den Haag",      km:56.4, banen:8,  type:"link", kleur:"#F97316", bg:"#FFEDD5", site:"https://padelheld.nl/padel-den-haag/" },
  { id:"rijswijk",   name:"Padel Rijswijk",             adres:"Rijswijk",                       stad:"Rijswijk",      km:52.3, banen:16, type:"link", kleur:"#E11D48", bg:"#FFE4E6", site:"https://padelheld.nl/padel-rijswijk/" },
  { id:"delft",      name:"Padel Delft",                adres:"Delft",                          stad:"Delft",         km:58.2, banen:6,  type:"link", kleur:"#2563EB", bg:"#DBEAFE", site:"https://padelheld.nl/padel-delft/" },
  { id:"zoetermeer", name:"Padel Zoetermeer",           adres:"Zoetermeer",                     stad:"Zoetermeer",    km:62.4, banen:6,  type:"link", kleur:"#D97706", bg:"#FEF3C7", site:"https://padelheld.nl/padel-zoetermeer/" },

  // ── UTRECHT REGIO (~60-75km) ──────────────────────────────────
  { id:"utrecht",    name:"Peakz Padel Utrecht",        adres:"Mississippidreef 161, Utrecht",  stad:"Utrecht",       km:64.8, banen:14, type:"link", kleur:"#DC2626", bg:"#FEE2E2", site:"https://www.peakzpadel.nl/reserveren/court-booking/reservation?location=Vechtsebanen" },
  { id:"alphen",     name:"Padel Alphen aan den Rijn",  adres:"Alphen aan den Rijn",            stad:"Alphen a/d Rijn",km:34.6, banen:4, type:"link", kleur:"#15803D", bg:"#DCFCE7", site:"https://padelheld.nl/padel-alphen-aan-den-rijn/" },
  { id:"gouda",      name:"Padel Gouda",                adres:"Gouda",                          stad:"Gouda",          km:58.8, banen:4, type:"link", kleur:"#A16207", bg:"#FEF9C3", site:"https://padelheld.nl/padel-gouda/" },
];
// ── ALLE TIJDEN 07:00 - 22:00 ──────────────────────────────────
function alleTijden() {
  const tijden = [];
  for (let h = 7; h <= 21; h++) {
    tijden.push(`${String(h).padStart(2,"0")}:00`);
    tijden.push(`${String(h).padStart(2,"0")}:30`);
  }
  tijden.push("22:00");
  return tijden;
}

function maakCompleetRooster(vrijeTijden) {
  return alleTijden().map(tijd => {
    const vrij = vrijeTijden.find(s => s.tijd === tijd);
    if (vrij) return { tijd, vrij: true, prijs: vrij.prijs || null, aantalVrij: vrij.aantalVrij || 1 };
    return { tijd, vrij: false, prijs: null, aantalVrij: 0 };
  });
}

// ── PLAYTOMIC ──────────────────────────────────────────────────
async function fetchPlaytomic(tenantId, datum) {
  const url =
    `https://api.playtomic.io/v1/availability` +
    `?sport_id=PADEL` +
    `&start_min=${encodeURIComponent(datum + "T00:00:00")}` +
    `&start_max=${encodeURIComponent(datum + "T23:59:59")}` +
    `&tenant_id=${tenantId}`;

  const resp = await fetch(url, {
    headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" },
    timeout: 8000,
  });
  if (!resp.ok) throw new Error(`Playtomic HTTP ${resp.status}`);
  const data = await resp.json();

  const vrijMap = {};
  if (Array.isArray(data)) {
    data.forEach(baan => {
      if (Array.isArray(baan.slots)) {
        baan.slots.forEach(slot => {
          if (slot.start_time && slot.duration === 60) {
            const tijd = slot.start_time.substring(0, 5);
            const prijs = slot.price ? parseFloat(slot.price) : null;
            if (!vrijMap[tijd]) vrijMap[tijd] = { tijd, prijs, aantalVrij: 0 };
            vrijMap[tijd].aantalVrij++;
          }
        });
      }
    });
  }
  return maakCompleetRooster(Object.values(vrijMap));
}

// ── BROWSERLESS (Peakz scraper) ───────────────────────────────
async function fetchBrowserless(club, datum) {
  const KEY = process.env.BROWSERLESS_KEY;
  if (!KEY) {
    console.log("Geen BROWSERLESS_KEY ingesteld — Peakz als link");
    return null; // null = toon als link
  }

  // Datum instellen in de URL als query param
  const scrapeUrl = `${club.scrape_url}&date=${datum}`;

  const resp = await fetch(`https://chrome.browserless.io/content?token=${KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: scrapeUrl,
      gotoOptions: { waitUntil: "networkidle2", timeout: 20000 },
      waitForTimeout: 4000, // Geef JS 4 sec om te laden
    }),
    timeout: 30000,
  });

  if (!resp.ok) throw new Error(`Browserless HTTP ${resp.status}`);
  const html = await resp.text();

  console.log(`Peakz HTML ontvangen: ${html.length} bytes`);

  // Debug: log unieke klassen zodat we de juiste selector kunnen vinden
  const klasseMatches = [...html.matchAll(/class="([^"]+)"/g)];
  const uniekeKlassen = [...new Set(klasseMatches.flatMap(m => m[1].split(" ")))];
  console.log("Klassen in HTML:", uniekeKlassen.filter(k => 
    k.includes("slot") || k.includes("time") || k.includes("court") || k.includes("book")
  ).slice(0, 20));

  // Probeer tijden te parsen uit de HTML
  // FOYS zet tijden typisch als tekst of data-attributen
  const vrijeTijden = [];
  
  // Patroon 1: data-time of data-start attributen
  const dataTimeMatches = [...html.matchAll(/data-(?:time|start|start-time)="(\d{2}:\d{2})"/g)];
  
  // Patroon 2: tijden als tekst in button/div elementen met beschikbaarheid info
  const tijdTextMatches = [...html.matchAll(/(\d{2}:\d{2})/g)];
  
  console.log(`Data-time matches: ${dataTimeMatches.length}`);
  console.log(`Tijdtekst matches: ${tijdTextMatches.length}`);

  // Sla de ruwe HTML tijdelijk op voor debug endpoint
  global.peakzDebugHTML = html.substring(0, 5000);
  global.peakzDebugDatum = datum;

  // Als we data-time attributen vonden, gebruik die
  if (dataTimeMatches.length > 0) {
    dataTimeMatches.forEach(m => {
      vrijeTijden.push({ tijd: m[1], prijs: null, aantalVrij: 1 });
    });
    return maakCompleetRooster(vrijeTijden);
  }

  // Anders: geef de ruwe HTML terug voor inspectie via debug endpoint
  return null;
}

// ── API: /api/availability ────────────────────────────────────
app.get("/api/availability", async (req, res) => {
  const datum = req.query.datum || new Date().toISOString().slice(0, 10);

  const results = await Promise.all(CLUBS.map(async club => {
    const base = {
      id: club.id, name: club.name, adres: club.adres,
      km: club.km, banen: club.banen, kleur: club.kleur,
      bg: club.bg, site: club.site,
    };

    if (club.type === "playtomic") {
      try {
        const slots = await fetchPlaytomic(club.playtomic_id, datum);
        return { ...base, bron: "playtomic", slots };
      } catch (e) {
        console.error(`Fout ${club.name}:`, e.message);
        return { ...base, bron: "fout", slots: [] };
      }
    }

    if (club.type === "browserless") {
      try {
        const slots = await fetchBrowserless(club, datum);
        if (slots) return { ...base, bron: "scrape", slots };
        return { ...base, bron: "link", slots: [] };
      } catch (e) {
        console.error(`Peakz scrape fout:`, e.message);
        return { ...base, bron: "link", slots: [] };
      }
    }

    return { ...base, bron: "link", slots: [] };
  }));

  res.json(results);
});

// ── DEBUG: ruwe Playtomic data ────────────────────────────────
app.get("/api/debug", async (req, res) => {
  const datum = req.query.datum || new Date().toISOString().slice(0, 10);
  const tenantId = "dd28050e-35c4-4bd0-ab58-b2f88111846d";
  const url = `https://api.playtomic.io/v1/availability?sport_id=PADEL&start_min=${encodeURIComponent(datum + "T00:00:00")}&start_max=${encodeURIComponent(datum + "T23:59:59")}&tenant_id=${tenantId}`;
  try {
    const resp = await fetch(url, { headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" } });
    const text = await resp.text();
    res.setHeader("Content-Type", "application/json");
    res.send(text);
  } catch(e) {
    res.json({ fout: e.message });
  }
});

// ── DEBUG: Peakz HTML inspectie ───────────────────────────────
app.get("/api/debug-peakz", (req, res) => {
  if (global.peakzDebugHTML) {
    res.setHeader("Content-Type", "text/html");
    res.send(`<pre>${global.peakzDebugHTML.replace(/</g,"&lt;")}</pre>`);
  } else {
    res.json({ info: "Nog geen Peakz HTML gecached. Roep eerst /api/availability aan." });
  }
});

// ── START ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PadelSpot draait op poort ${PORT}`));
