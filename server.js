const express = require("express");
const fetch   = require("node-fetch");
const cors    = require("cors");
const path    = require("path");

const app = express();
app.use(cors());
app.use(express.static(__dirname));

// ── CLUBS ─────────────────────────────────────────────────────────
const CLUBS = [
  // ── HAARLEM ──────────────────────────────────────────────────
  {
    id: "wepadel", name: "WePadel Haarlem", adres: "Reinaldapad 10, Haarlem",
    stad: "Haarlem", km: 1.8, banen: 8, kleur: "#1DB954", bg: "#E8F9EE",
    type: "playtomic",
    playtomic_id: "dd28050e-35c4-4bd0-ab58-b2f88111846d",
    site: "https://playtomic.io/wepadel-haarlem/dd28050e-35c4-4bd0-ab58-b2f88111846d"
  },
  {
    id: "padel25", name: "Padel25 Haarlem", adres: "A. Hofmanweg 16, Haarlem",
    stad: "Haarlem", km: 2.3, banen: 6, kleur: "#0284C7", bg: "#E0F2FE",
    type: "playtomic",
    playtomic_id: "68640cb4-c026-4bb1-8184-6e2cfe0f5ccf",
    site: "https://playtomic.io/indoor-padel25-haarlem/68640cb4-c026-4bb1-8184-6e2cfe0f5ccf"
  },
  {
    id: "pimmulier", name: "TPV Pim Mulier", adres: "Jaap Edenlaan 9, Haarlem",
    stad: "Haarlem", km: 2.9, banen: 8, kleur: "#7C3AED", bg: "#EDE9FE",
    type: "link",
    site: "https://meetandplay.nl/club/29462?sport=padel"
  },
  {
    id: "overhout", name: "Padel Club Overhout", adres: "Tennispad 1, Haarlem",
    stad: "Haarlem", km: 3.1, banen: 5, kleur: "#F59E0B", bg: "#FEF3C7",
    type: "link",
    site: "https://overhout.baanreserveren.nl"
  },
  {
    id: "schoten", name: "Schoten Tennis & Padel", adres: "Vergierdeweg 265a, Haarlem",
    stad: "Haarlem", km: 3.8, banen: 3, kleur: "#DB2777", bg: "#FCE7F3",
    type: "link",
    site: "https://www.schoten-tennis-padel.nl/padel"
  },
  {
    id: "peakz", name: "Peakz Padel Haarlem", adres: "Oerkapkade 2, Haarlem",
    stad: "Haarlem", km: 4.2, banen: 4, kleur: "#EF4444", bg: "#FEE2E2",
    type: "link",
    site: "https://www.peakzpadel.nl/reserveren/court-booking/reservation?location=Lichtfabriek"
  },

  // ── HOOFDDORP ─────────────────────────────────────────────────
  {
    id: "padelpoints", name: "Padelpoints Hoofddorp", adres: "Hoofddorp",
    stad: "Hoofddorp", km: 11.8, banen: 12, kleur: "#059669", bg: "#D1FAE5",
    type: "playtomic",
    playtomic_id: "8519afe9-dd55-4384-af68-9d6c4f8cfe03",
    site: "https://playtomic.io/padelpoints-hoofddorp/8519afe9-dd55-4384-af68-9d6c4f8cfe03"
  },
  {
    id: "padelclubhfd", name: "Padelclub Hoofddorp", adres: "Hoofddorp",
    stad: "Hoofddorp", km: 13.1, banen: 2, kleur: "#D97706", bg: "#FEF3C7",
    type: "playtomic",
    playtomic_id: "9d921d17-f801-470b-a2e8-cfb7cabb4ccc",
    site: "https://playtomic.io/padelclub-hoofddorp/9d921d17-f801-470b-a2e8-cfb7cabb4ccc"
  },

  // ── BEVERWIJK ─────────────────────────────────────────────────
  {
    id: "clubhouse", name: "Clubhouse Padel Beverwijk", adres: "Beverwijk",
    stad: "Beverwijk", km: 14.2, banen: 4, kleur: "#2563EB", bg: "#DBEAFE",
    type: "playtomic",
    playtomic_id: "824da72e-92e4-4a92-b435-7a73595bd3c7",
    site: "https://playtomic.io/clubhouse-padel-ping-pong/824da72e-92e4-4a92-b435-7a73595bd3c7"
  },
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
