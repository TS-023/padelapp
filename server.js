const express = require("express");
const fetch   = require("node-fetch");
const cors    = require("cors");
const path    = require("path");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

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
    data.forEach(item => {
      if (item.start_time) {
        slots.push({
          tijd:  item.start_time.substring(11, 16),
          duur:  item.duration ? Math.round(item.duration / 60) : 60,
          vrij:  true,
          prijs: item.price ? Math.round(item.price / 100) : null,
        });
      }
    });
  }
  return slots;
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

// ── START ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PadelSpot draait op poort ${PORT}`));
