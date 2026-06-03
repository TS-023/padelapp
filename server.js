const express = require("express");
const fetch   = require("node-fetch");
const cors    = require("cors");
const path    = require("path");

const app = express();
app.use(cors());
app.use(express.static(__dirname));

// ── CLUBS ────────────────────────────────────────────────────────
const CLUBS = [
  {
    id: "wepadel", name: "WePadel Haarlem", adres: "Reinaldapad 10, Haarlem",
    km: 1.8, banen: 8, kleur: "#1DB954", bg: "#E8F9EE",
    playtomic_id: "dd28050e-35c4-4bd0-ab58-b2f88111846d",
    site: "https://playtomic.io/wepadel-haarlem/dd28050e-35c4-4bd0-ab58-b2f88111846d"
  },
  {
    id: "padel25", name: "Padel25 Haarlem", adres: "A. Hofmanweg 16, Haarlem",
    km: 2.3, banen: 6, kleur: "#0284C7", bg: "#E0F2FE",
    playtomic_id: null, site: "https://padel25.nl/reserveren"
  },
  {
    id: "overhout", name: "Padel Club Overhout", adres: "Tennispad 1, Haarlem",
    km: 3.1, banen: 5, kleur: "#F59E0B", bg: "#FEF3C7",
    playtomic_id: null, site: "https://www.padel-overhout.nl/reserveren"
  },
  {
    id: "pimmulier", name: "TPV Pim Mulier", adres: "Jaap Edenlaan 9, Haarlem",
    km: 2.9, banen: 8, kleur: "#7C3AED", bg: "#EDE9FE",
    playtomic_id: null, site: "https://www.tvpimmulier.nl/padel"
  },
  {
    id: "peakz", name: "Peakz Padel Haarlem", adres: "Haarlemmerstroom, Haarlem",
    km: 4.2, banen: 4, kleur: "#EF4444", bg: "#FEE2E2",
    playtomic_id: null, site: "https://www.peakzpadel.nl/reserveren"
  },
  {
    id: "schoten", name: "Schoten Tennis & Padel", adres: "Schoterbos, Haarlem",
    km: 3.8, banen: 3, kleur: "#DB2777", bg: "#FCE7F3",
    playtomic_id: null, site: "https://www.schotentennis.nl/padel"
  },
];

// ── PLAYTOMIC OPHALEN ────────────────────────────────────────────
async function fetchPlaytomic(tenantId, datum) {
  const url =
    `https://api.playtomic.io/v1/availability` +
    `?sport_id=PADEL` +
    `&start_min=${encodeURIComponent(datum + "T00:00:00")}` +
    `&start_max=${encodeURIComponent(datum + "T23:59:59")}` +
    `&tenant_id=${tenantId}`;

  const resp = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; PadelSpot/1.0)",
    },
    timeout: 8000,
  });

  if (!resp.ok) throw new Error(`Playtomic HTTP ${resp.status}`);
  const data = await resp.json();

  const slots = [];
  if (Array.isArray(data)) {
    data.forEach(baan => {
      // Elke baan heeft een resource_id en een slots array
      if (Array.isArray(baan.slots)) {
        baan.slots.forEach(slot => {
          if (slot.start_time && slot.duration === 60) {
            // Alleen 60-minuten slots (voorkom dubbelen van 90/120 min)
            const tijd = slot.start_time.substring(0, 5); // "14:00:00" -> "14:00"
            const prijsStr = slot.price || "";
            const prijs = parseFloat(prijsStr) || null; // "24 EUR" -> 24
            // Voeg toe per baan zodat je alle beschikbare banen ziet
            slots.push({
              tijd,
              duur: 60,
              vrij: true,
              prijs,
              baan: baan.resource_id ? baan.resource_id.substring(0, 8) : "?"
            });
          }
        });
      }
    });
  }
  // Alle mogelijke tijden van 07:00 tot 22:00 per 30 min
  const alleTijden = [];
  for (let h = 7; h <= 21; h++) {
    alleTijden.push(`${String(h).padStart(2,"0")}:00`);
    alleTijden.push(`${String(h).padStart(2,"0")}:30`);
  }
  alleTijden.push("22:00");

  // Bouw compleet overzicht: vrije slots van Playtomic + bezette tijden
  const compleet = alleTijden.map(tijd => {
    const vrijSlots = slots.filter(s => s.tijd === tijd);
    if (vrijSlots.length > 0) {
      // Minstens één baan vrij op dit tijdstip
      return { tijd, duur: 60, vrij: true, prijs: vrijSlots[0].prijs, aantalVrij: vrijSlots.length };
    } else {
      // Geen baan vrij = bezet
      return { tijd, duur: 60, vrij: false, prijs: null, aantalVrij: 0 };
    }
  });

  return compleet;
}

// ── API: /api/availability?datum=YYYY-MM-DD ───────────────────────
app.get("/api/availability", async (req, res) => {
  const datum = req.query.datum || new Date().toISOString().slice(0, 10);

  const results = await Promise.all(CLUBS.map(async club => {
    const base = {
      id: club.id, name: club.name, adres: club.adres,
      km: club.km, banen: club.banen, kleur: club.kleur,
      bg: club.bg, site: club.site,
    };

    if (club.playtomic_id) {
      try {
        const slots = await fetchPlaytomic(club.playtomic_id, datum);
        return { ...base, bron: "playtomic", slots };
      } catch (e) {
        console.error(`Fout ${club.name}:`, e.message);
        return { ...base, bron: "fout", slots: [] };
      }
    }

    return { ...base, bron: "link", slots: [] };
  }));

  res.json(results);
});

// ── DEBUG: ruwe Playtomic data zien ──────────────────────────────
// Ga naar /api/debug?datum=2026-06-03 om de ruwe response te zien
app.get("/api/debug", async (req, res) => {
  const datum = req.query.datum || new Date().toISOString().slice(0, 10);
  const tenantId = "dd28050e-35c4-4bd0-ab58-b2f88111846d";
  const url =
    `https://api.playtomic.io/v1/availability` +
    `?sport_id=PADEL` +
    `&start_min=${encodeURIComponent(datum + "T00:00:00")}` +
    `&start_max=${encodeURIComponent(datum + "T23:59:59")}` +
    `&tenant_id=${tenantId}`;

  try {
    const resp = await fetch(url, {
      headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" }
    });
    const text = await resp.text();
    res.setHeader("Content-Type", "application/json");
    res.send(text);
  } catch(e) {
    res.json({ fout: e.message });
  }
});

// ── START ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PadelSpot draait op poort ${PORT}`));
