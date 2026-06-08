const express = require("express");
const fetch   = require("node-fetch");
const cors    = require("cors");
const path    = require("path");

const app = express();
app.use(cors());
app.use(express.static(__dirname));

// ── CLUBS (auto-generated, alle clubs binnen 100km van Haarlem) ──
const CLUBS = [
  { id:"overhout", name:"Padel Club Overhout", adres:"Tennispad 1, Haarlem", stad:"Haarlem", km:0.3, banen:5, type:"link", kleur:"#F59E0B", bg:"#F59E0B18", lat:52.3887, lon:4.6292, site:"https://overhout.baanreserveren.nl" },
  { id:"peakz_haarlem", name:"Peakz Padel Haarlem", adres:"Oerkapkade 2, Haarlem", stad:"Haarlem", km:0.5, banen:4, type:"link", kleur:"#EF4444", bg:"#EF444418", lat:52.3812, lon:4.6418, site:"https://www.peakzpadel.nl/reserveren" },
  { id:"wepadel", name:"WePadel Haarlem", adres:"Reinaldapad 10, Haarlem", stad:"Haarlem", km:0.6, banen:8, type:"playtomic", playtomic_id:"dd28050e-35c4-4bd0-ab58-b2f88111846d", kleur:"#1DB954", bg:"#1DB95418", lat:52.3738, lon:4.6248, site:"https://playtomic.io/wepadel-haarlem/dd28050e-35c4-4bd0-ab58-b2f88111846d" },
  { id:"padel25", name:"Padel25 Haarlem", adres:"A. Hofmanweg 16, Haarlem", stad:"Haarlem", km:0.7, banen:6, type:"playtomic", playtomic_id:"68640cb4-c026-4bb1-8184-6e2cfe0f5ccf", kleur:"#0284C7", bg:"#0284C718", lat:52.3942, lon:4.6332, site:"https://playtomic.io/indoor-padel25-haarlem/68640cb4-c026-4bb1-8184-6e2cfe0f5ccf" },
  { id:"schoten", name:"Schoten Tennis & Padel", adres:"Vergierdeweg 265a, Haarlem", stad:"Haarlem", km:2.2, banen:3, type:"link", kleur:"#DB2777", bg:"#DB277718", lat:52.3985, lon:4.6356, site:"https://www.schoten-tennis-padel.nl/padel" },
  { id:"pimmulier", name:"TPV Pim Mulier", adres:"Jaap Edenlaan 9, Haarlem", stad:"Haarlem", km:2.5, banen:8, type:"link", kleur:"#7C3AED", bg:"#7C3AED18", lat:52.3687, lon:4.6576, site:"https://meetandplay.nl/club/29462?sport=padel" },
  { id:"heemstede", name:"Padel Heemstede", adres:"Sportparklaan 8, Heemstede", stad:"Heemstede", km:3.5, banen:3, type:"link", kleur:"#0891B2", bg:"#0891B218", lat:52.3513, lon:4.6236, site:"https://padelheld.nl/padel-heemstede/" },
  { id:"bloemendaal", name:"Padel Bloemendaal", adres:"Tetterodeweg 60, Overveen", stad:"Bloemendaal", km:3.9, banen:5, type:"link", kleur:"#0EA5E9", bg:"#0EA5E918", lat:52.3934, lon:4.5791, site:"https://padelbloemendaal.baanhuur.nl" },
  { id:"velserbroek", name:"Padel Velserbroek", adres:"Broeklanden 5, Velserbroek", stad:"Velserbroek", km:4.3, banen:3, type:"link", kleur:"#7C3AED", bg:"#7C3AED18", lat:52.4323, lon:4.6487, site:"https://padelheld.nl/padel-velserbroek/" },
  { id:"cruquius", name:"Padel Cruquius", adres:"Cruquiusdijk 28, Cruquius", stad:"Cruquius", km:4.5, banen:1, type:"link", kleur:"#C2410C", bg:"#C2410C18", lat:52.3358, lon:4.6592, site:"https://padelheld.nl/padel-cruquius/" },
  { id:"zwaanshoek", name:"Padel Zwaanshoek", adres:"Hanepoel 1, Zwaanshoek", stad:"Zwaanshoek", km:5.5, banen:5, type:"link", kleur:"#A16207", bg:"#A1620718", lat:52.3165, lon:4.6198, site:"https://padelheld.nl/padel-zwaanshoek/" },
  { id:"santpoort", name:"Padel Santpoort-Noord", adres:"Kerkpad 61, Santpoort-Noord", stad:"Santpoort", km:5.6, banen:7, type:"link", kleur:"#B45309", bg:"#B4530918", lat:52.4158, lon:4.6289, site:"https://padelheld.nl/padel-santpoort-noord/" },
  { id:"bennebroek", name:"Padel Bennebroek", adres:"Schoollaan 2, Bennebroek", stad:"Bennebroek", km:6.1, banen:2, type:"link", kleur:"#65A30D", bg:"#65A30D18", lat:52.3226, lon:4.5918, site:"https://padelheld.nl/padel-bennebroek/" },
  { id:"zandvoort", name:"Padel Zandvoort", adres:"Linnaeusstraat 2, Zandvoort", stad:"Zandvoort", km:7.2, banen:3, type:"link", kleur:"#C2410C", bg:"#C2410C18", lat:52.3733, lon:4.5329, site:"https://padelheld.nl/padel-zandvoort/" },
  { id:"padelclubhfd", name:"Padelclub Hoofddorp", adres:"Hoofdweg 680, Hoofddorp", stad:"Hoofddorp", km:8.6, banen:2, type:"playtomic", playtomic_id:"9d921d17-f801-470b-a2e8-cfb7cabb4ccc", kleur:"#D97706", bg:"#D9770618", lat:52.3082, lon:4.6698, site:"https://playtomic.io/padelclub-hoofddorp/9d921d17-f801-470b-a2e8-cfb7cabb4ccc" },
  { id:"ijmuiden", name:"Padel IJmuiden", adres:"Heerenduinweg 12, IJmuiden", stad:"IJmuiden", km:9.2, banen:6, type:"link", kleur:"#1D4ED8", bg:"#1D4ED818", lat:52.4586, lon:4.6192, site:"https://padelheld.nl/padel-ijmuiden/" },
  { id:"padelpoints", name:"Padelpoints Hoofddorp", adres:"Parsonageweg 11, Hoofddorp", stad:"Hoofddorp", km:9.4, banen:12, type:"playtomic", playtomic_id:"8519afe9-dd55-4384-af68-9d6c4f8cfe03", kleur:"#059669", bg:"#05966918", lat:52.3029, lon:4.6712, site:"https://playtomic.io/padelpoints-hoofddorp/8519afe9-dd55-4384-af68-9d6c4f8cfe03" },
  { id:"hillegom", name:"Padel Hillegom", adres:"Sportpark Elsbroek, Hillegom", stad:"Hillegom", km:10.7, banen:10, type:"link", kleur:"#A16207", bg:"#A1620718", lat:52.2922, lon:4.5759, site:"https://padelheld.nl/padel-hillegom/" },
  { id:"badhoevedorp", name:"Padel Badhoevedorp", adres:"Sloterweg 1045, Badhoevedorp", stad:"Badhoevedorp", km:10.7, banen:17, type:"link", kleur:"#BE185D", bg:"#BE185D18", lat:52.3345, lon:4.7798, site:"https://padelheld.nl/padel-badhoevedorp/" },
  { id:"clubhouse", name:"Clubhouse Padel Beverwijk", adres:"Parallelweg 75, Beverwijk", stad:"Beverwijk", km:10.9, banen:4, type:"playtomic", playtomic_id:"824da72e-92e4-4a92-b435-7a73595bd3c7", kleur:"#2563EB", bg:"#2563EB18", lat:52.4789, lon:4.6543, site:"https://playtomic.io/clubhouse-padel-ping-pong/824da72e-92e4-4a92-b435-7a73595bd3c7" },
  { id:"nieuwvennep", name:"Padel Nieuw-Vennep", adres:"Sportlaan 2, Nieuw-Vennep", stad:"Nieuw-Vennep", km:12.2, banen:3, type:"link", kleur:"#15803D", bg:"#15803D18", lat:52.2631, lon:4.6318, site:"https://padelheld.nl/padel-nieuwvennep/" },
  { id:"padeldam", name:"Padeldam Amsterdam", adres:"Joris van den Berghweg 120, Amsterdam", stad:"Amsterdam", km:13.6, banen:13, type:"playtomic", playtomic_id:"91f3391e-6010-11e8-8674-52540049669c", kleur:"#F97316", bg:"#F9731618", lat:52.3642, lon:4.8298, site:"https://playtomic.io/padeldam-amsterdam/91f3391e-6010-11e8-8674-52540049669c" },
  { id:"heemskerk", name:"Padel Heemskerk", adres:"Kerkweg 2, Heemskerk", stad:"Heemskerk", km:13.7, banen:11, type:"link", kleur:"#9333EA", bg:"#9333EA18", lat:52.5068, lon:4.6712, site:"https://padelheld.nl/padel-heemskerk/" },
  { id:"bamsterdam", name:"B. Amsterdam Padel", adres:"Johan Huizingalaan 400, Amsterdam", stad:"Amsterdam", km:14.2, banen:6, type:"playtomic", playtomic_id:"595ccc37-5e64-40df-8ac7-ff34ea83f056", kleur:"#0EA5E9", bg:"#0EA5E918", lat:52.3489, lon:4.8298, site:"https://playtomic.io/b-amsterdam-padel/595ccc37-5e64-40df-8ac7-ff34ea83f056" },
  { id:"rijsenhout", name:"Padel Rijsenhout", adres:"Bennebroekerweg 40, Rijsenhout", stad:"Rijsenhout", km:14.5, banen:2, type:"link", kleur:"#B45309", bg:"#B4530918", lat:52.2598, lon:4.7123, site:"https://padelheld.nl/padel-rijsenhout/" },
  { id:"lisse", name:"Padel Lisse", adres:"Sportpark De Leihoek, Lisse", stad:"Lisse", km:15.0, banen:4, type:"link", kleur:"#BE185D", bg:"#BE185D18", lat:52.2574, lon:4.5543, site:"https://padelheld.nl/padel-lisse/" },
  { id:"krommenie", name:"Padel Krommenie", adres:"Sportpark De Koog, Krommenie", stad:"Krommenie", km:15.2, banen:4, type:"link", kleur:"#7C3AED", bg:"#7C3AED18", lat:52.4912, lon:4.7712, site:"https://padelheld.nl/padel-krommenie/" },
  { id:"zaandam", name:"Padelclub Zaandam", adres:"Sportstraat 4, Koog aan de Zaan", stad:"Zaandam", km:16.0, banen:4, type:"playtomic", playtomic_id:"f36ea70c-5ec3-4ef4-99bb-d1e6156ab095", kleur:"#0891B2", bg:"#0891B218", lat:52.4412, lon:4.8187, site:"https://playtomic.io/padelclub-zaandam/f36ea70c-5ec3-4ef4-99bb-d1e6156ab095" },
  { id:"noordwijkerhout", name:"Padel Noordwijkerhout", adres:"Sportpark Beeklaan, Noordwijkerhout", stad:"Noordwijkerhout", km:16.6, banen:3, type:"link", kleur:"#9333EA", bg:"#9333EA18", lat:52.2587, lon:4.4891, site:"https://padelheld.nl/padel-noordwijkerhout/" },
  { id:"uitgeest", name:"Padel Uitgeest", adres:"Waldijk 2, Uitgeest", stad:"Uitgeest", km:17.3, banen:8, type:"link", kleur:"#A16207", bg:"#A1620718", lat:52.5298, lon:4.7098, site:"https://padelheld.nl/padel-uitgeest/" },
  { id:"ndsm", name:"NDSM Padel Amsterdam", adres:"Ms. van Riemsdijkweg 6, Amsterdam", stad:"Amsterdam", km:17.6, banen:4, type:"playtomic", playtomic_id:"f4b21f7b-6ec3-4e13-a145-b101bd87b35b", kleur:"#6366F1", bg:"#6366F118", lat:52.3998, lon:4.8912, site:"https://playtomic.io/ndsm-padel/f4b21f7b-6ec3-4e13-a145-b101bd87b35b" },
  { id:"wijdewormer", name:"Padel Wijdewormer", adres:"Dorpsstraat 80, Wijdewormer", stad:"Wijdewormer", km:17.8, banen:11, type:"link", kleur:"#DC2626", bg:"#DC262618", lat:52.4798, lon:4.8412, site:"https://padelheld.nl/padel-wijdewormer/" },
  { id:"oostzaan", name:"Padel Oostzaan", adres:"De Haal 30, Oostzaan", stad:"Oostzaan", km:17.8, banen:2, type:"link", kleur:"#6366F1", bg:"#6366F118", lat:52.4398, lon:4.8812, site:"https://padelheld.nl/padel-oostzaan/" },
  { id:"padelmate", name:"Padel Mate Club Amstelveen", adres:"Grutterij 1, Amstelveen", stad:"Amstelveen", km:17.9, banen:10, type:"playtomic", playtomic_id:"fdac3d26-3abd-4dfc-825b-b299a8cdc38e", kleur:"#E11D48", bg:"#E11D4818", lat:52.2978, lon:4.8712, site:"https://playtomic.io/padel-mate-club-amstelveen/fdac3d26-3abd-4dfc-825b-b299a8cdc38e" },
  { id:"xnrgy", name:"XNRGY Amsterdam", adres:"Naritaweg 68, Amsterdam", stad:"Amsterdam", km:18.0, banen:14, type:"playtomic", playtomic_id:"ffc6dd99-5553-420e-9915-93a270b1369c", kleur:"#10B981", bg:"#10B98118", lat:52.3712, lon:4.9087, site:"https://playtomic.io/xnrgy/ffc6dd99-5553-420e-9915-93a270b1369c" },
  { id:"plazapadel", name:"Plaza Padel Amsterdam", adres:"Transformatorweg 6, Amsterdam", stad:"Amsterdam", km:18.2, banen:9, type:"playtomic", playtomic_id:"d0017243-e1a8-42bf-9fa0-aad4f43784d0", kleur:"#8B5CF6", bg:"#8B5CF618", lat:52.3398, lon:4.8923, site:"https://playtomic.io/plaza-padel-amsterdam/d0017243-e1a8-42bf-9fa0-aad4f43784d0" },
  { id:"sassenheim", name:"Padel Sassenheim", adres:"Sportlaan 9, Sassenheim", stad:"Sassenheim", km:18.7, banen:3, type:"link", kleur:"#0F766E", bg:"#0F766E18", lat:52.2266, lon:4.5222, site:"https://padelheld.nl/padel-sassenheim/" },
  { id:"castricum", name:"Padel Castricum", adres:"Beverwijkerstraatweg 205, Castricum", stad:"Castricum", km:19.0, banen:10, type:"link", kleur:"#0F766E", bg:"#0F766E18", lat:52.5456, lon:4.6578, site:"https://padelheld.nl/padel-castricum/" },
  { id:"vinkenveld", name:"Vinkenveld Indoor Tennis & Padel", adres:"Het Laantje 33, Noordwijk", stad:"Noordwijk", km:20.1, banen:4, type:"link", kleur:"#0369A1", bg:"#0369A118", lat:52.2362, lon:4.4378, site:"https://vinkenveld.nl/padel" },
  { id:"degevers", name:"TV De Gevers", adres:"Gooweg 26, Noordwijk", stad:"Noordwijk", km:20.5, banen:3, type:"link", kleur:"#15803D", bg:"#15803D18", lat:52.2218, lon:4.4524, site:"https://www.tvdegevers.nl/padel" },
  { id:"rijpwetering", name:"Padel Rijpwetering", adres:"Kerkstraat 29, Rijpwetering", stad:"Rijpwetering", km:20.8, banen:3, type:"link", kleur:"#15803D", bg:"#15803D18", lat:52.2012, lon:4.5598, site:"https://padelheld.nl/padel-rijpwetering/" },
  { id:"duivendrecht", name:"Padel Duivendrecht", adres:"Sportpark De Toekomst, Duivendrecht", stad:"Duivendrecht", km:21.4, banen:1, type:"link", kleur:"#B45309", bg:"#B4530918", lat:52.3298, lon:4.9398, site:"https://padelheld.nl/padel-duivendrecht/" },
  { id:"uithoorn", name:"Padel Uithoorn", adres:"Sportpark De Randhoorn, Uithoorn", stad:"Uithoorn", km:21.4, banen:6, type:"link", kleur:"#8B5CF6", bg:"#8B5CF618", lat:52.2328, lon:4.8278, site:"https://padelheld.nl/padel-uithoorn/" },
  { id:"dekker", name:"Dekker Warmond Leiden", adres:"Warmonderweg 100, Warmond", stad:"Warmond", km:22.7, banen:6, type:"playtomic", playtomic_id:"8f320800-a386-462c-9eb0-5403a7eb4964", kleur:"#BE185D", bg:"#BE185D18", lat:52.2008, lon:4.5012, site:"https://playtomic.io/dekker-warmond-leiden/8f320800-a386-462c-9eb0-5403a7eb4964" },
  { id:"rijnsburg", name:"Padel Rijnsburg", adres:"Sportpark Middelmors, Rijnsburg", stad:"Rijnsburg", km:24.6, banen:4, type:"link", kleur:"#9333EA", bg:"#9333EA18", lat:52.1907, lon:4.4412, site:"https://padelheld.nl/padel-rijnsburg/" },
  { id:"heiloo", name:"Padel Heiloo", adres:"Vennewatersweg 21, Heiloo", stad:"Heiloo", km:24.9, banen:17, type:"link", kleur:"#0369A1", bg:"#0369A118", lat:52.6012, lon:4.6978, site:"https://padelheld.nl/padel-heiloo/" },
  { id:"derijp", name:"Padel De Rijp", adres:"Zuiddijk 2a, De Rijp", stad:"De Rijp", km:25.1, banen:4, type:"link", kleur:"#15803D", bg:"#15803D18", lat:52.5612, lon:4.8598, site:"https://padelheld.nl/padel-de-rijp/" },
  { id:"purmerend", name:"Padel Purmerend", adres:"Sportlaan 2, Purmerend", stad:"Purmerend", km:25.2, banen:10, type:"link", kleur:"#DC2626", bg:"#DC262618", lat:52.5048, lon:4.9598, site:"https://padelheld.nl/padel-purmerend/" },
  { id:"egmond", name:"Padel Egmond-Binnen", adres:"Egmonderstraatweg 90, Egmond-Binnen", stad:"Egmond-Binnen", km:25.4, banen:2, type:"link", kleur:"#059669", bg:"#05966918", lat:52.6098, lon:4.6345, site:"https://padelheld.nl/padel-egmond-binnen/" },
  { id:"leiderdorp", name:"Padel Leiderdorp", adres:"Sportlaan 1, Leiderdorp", stad:"Leiderdorp", km:25.5, banen:4, type:"link", kleur:"#0891B2", bg:"#0891B218", lat:52.1645, lon:4.5289, site:"https://padelheld.nl/padel-leiderdorp/" },
  { id:"katwijk", name:"Padel Katwijk", adres:"Sportlaan 1, Katwijk", stad:"Katwijk", km:25.6, banen:4, type:"link", kleur:"#C2410C", bg:"#C2410C18", lat:52.2008, lon:4.4087, site:"https://padelheld.nl/padel-katwijk/" },
  { id:"leiden", name:"Padel Leiden", adres:"Kagerplein 7, Leiden", stad:"Leiden", km:26.3, banen:7, type:"link", kleur:"#DC2626", bg:"#DC262618", lat:52.1601, lon:4.493, site:"https://padelheld.nl/padel-leiden/" },
  { id:"middenbeemster", name:"Padel Middenbeemster", adres:"Middenweg 197, Middenbeemster", stad:"Middenbeemster", km:26.5, banen:6, type:"link", kleur:"#0369A1", bg:"#0369A118", lat:52.5512, lon:4.9098, site:"https://padelheld.nl/padel-middenbeemster/" },
  { id:"alphen", name:"Padel Alphen aan den Rijn", adres:"Sportlaan 6, Alphen aan den Rijn", stad:"Alphen a/d Rijn", km:28.0, banen:7, type:"link", kleur:"#15803D", bg:"#15803D18", lat:52.1268, lon:4.6578, site:"https://padelheld.nl/padel-alphen-aan-den-rijn/" },
  { id:"alkmaar", name:"Padel Alkmaar", adres:"Sportlaan 4, Alkmaar", stad:"Alkmaar", km:28.9, banen:13, type:"link", kleur:"#7C3AED", bg:"#7C3AED18", lat:52.6298, lon:4.7498, site:"https://padelheld.nl/padel-alkmaar/" },
  { id:"zoeterwoude", name:"Padel Zoeterwoude", adres:"Sportlaan 4, Zoeterwoude", stad:"Zoeterwoude", km:29.4, banen:2, type:"link", kleur:"#0EA5E9", bg:"#0EA5E918", lat:52.1278, lon:4.4978, site:"https://padelheld.nl/padel-zoeterwoude/" },
  { id:"oudorp", name:"Padel Oudorp", adres:"Schermerweg 95, Alkmaar", stad:"Oudorp", km:29.5, banen:3, type:"link", kleur:"#D97706", bg:"#D9770618", lat:52.6389, lon:4.7198, site:"https://padelheld.nl/padel-oudorp/" },
  { id:"wassenaar", name:"Padel Wassenaar", adres:"Johan de Wittstraat 5, Wassenaar", stad:"Wassenaar", km:30.2, banen:4, type:"link", kleur:"#6366F1", bg:"#6366F118", lat:52.145, lon:4.3982, site:"https://padelheld.nl/padel-wassenaar/" },
  { id:"voorschoten", name:"Padel Voorschoten", adres:"Professor Einsteinlaan 2, Voorschoten", stad:"Voorschoten", km:30.9, banen:4, type:"link", kleur:"#F97316", bg:"#F9731618", lat:52.1278, lon:4.4512, site:"https://padelheld.nl/padel-voorschoten/" },
  { id:"edam", name:"Padelcentrum Bol Edam", adres:"Lingerzijde 1, Edam", stad:"Edam", km:31.6, banen:7, type:"playtomic", playtomic_id:"65549c5d-ee71-4427-b8a6-1befda5ae077", kleur:"#0891B2", bg:"#0891B218", lat:52.5134, lon:5.0478, site:"https://playtomic.io/padelcentrum-bol/65549c5d-ee71-4427-b8a6-1befda5ae077" },
  { id:"volendam", name:"Padel Volendam", adres:"Sportlaan 2, Volendam", stad:"Volendam", km:32.3, banen:6, type:"link", kleur:"#F97316", bg:"#F9731618", lat:52.4948, lon:5.0712, site:"https://padelheld.nl/padel-volendam/" },
  { id:"zuidsch", name:"Padel Zuid-Scharwoude", adres:"Dorpsstraat 108, Zuid-Scharwoude", stad:"Zuid-Scharwoude", km:32.3, banen:3, type:"link", kleur:"#0F766E", bg:"#0F766E18", lat:52.6498, lon:4.8078, site:"https://padelheld.nl/padel-zuid-scharwoude/" },
  { id:"muiderberg", name:"Padel Muiderberg", adres:"Googweg 5, Muiderberg", stad:"Muiderberg", km:33.3, banen:2, type:"link", kleur:"#6366F1", bg:"#6366F118", lat:52.3398, lon:5.1187, site:"https://padelheld.nl/padel-muiderberg/" },
  { id:"boskoop", name:"Padel Boskoop", adres:"Sportlaan 2, Boskoop", stad:"Boskoop", km:33.4, banen:7, type:"link", kleur:"#059669", bg:"#05966918", lat:52.0778, lon:4.6512, site:"https://padelheld.nl/padel-boskoop/" },
  { id:"bodegraven", name:"Padel Bodegraven", adres:"Broekveldselaan 20, Bodegraven", stad:"Bodegraven", km:34.2, banen:2, type:"link", kleur:"#0891B2", bg:"#0891B218", lat:52.0812, lon:4.7498, site:"https://padelheld.nl/padel-bodegraven/" },
  { id:"heerhugowaard", name:"Padel Heerhugowaard", adres:"Sportlaan 2, Heerhugowaard", stad:"Heerhugowaard", km:34.9, banen:8, type:"link", kleur:"#B45309", bg:"#B4530918", lat:52.6712, lon:4.8298, site:"https://padelheld.nl/padel-heerhugowaard/" },
  { id:"warmenhuizen", name:"Padel Warmenhuizen", adres:"Sportlaan 2, Warmenhuizen", stad:"Warmenhuizen", km:34.9, banen:2, type:"link", kleur:"#6366F1", bg:"#6366F118", lat:52.6878, lon:4.7278, site:"https://padelheld.nl/padel-warmenhuizen/" },
  { id:"sgraveland", name:"Padel 's-Graveland", adres:"Leeuwenlaan 2, 's-Graveland", stad:"'s-Graveland", km:35.8, banen:3, type:"link", kleur:"#B45309", bg:"#B4530918", lat:52.2378, lon:5.1078, site:"https://padelheld.nl/padel-s-graveland/" },
  { id:"loosdrecht", name:"Padel Loosdrecht", adres:"Oud-Loosdrechtsedijk 230, Loosdrecht", stad:"Loosdrecht", km:36.8, banen:10, type:"link", kleur:"#F97316", bg:"#F9731618", lat:52.2012, lon:5.0878, site:"https://padelheld.nl/padel-loosdrecht/" },
  { id:"bussum", name:"Padel Bussum", adres:"Amersfoortsestraatweg 42, Bussum", stad:"Bussum", km:37.7, banen:5, type:"link", kleur:"#059669", bg:"#05966918", lat:52.2698, lon:5.1598, site:"https://padelheld.nl/padel-bussum/" },
  { id:"waddinxveen", name:"Padel Waddinxveen", adres:"Sportlaan 1, Waddinxveen", stad:"Waddinxveen", km:37.8, banen:4, type:"link", kleur:"#D97706", bg:"#D9770618", lat:52.0412, lon:4.6498, site:"https://padelheld.nl/padel-waddinxveen/" },
  { id:"zoetermeer", name:"Padel Zoetermeer", adres:"Van der Hagenstraat 11, Zoetermeer", stad:"Zoetermeer", km:38.0, banen:6, type:"link", kleur:"#D97706", bg:"#D9770618", lat:52.06, lon:4.4912, site:"https://padelheld.nl/padel-zoetermeer/" },
  { id:"hilversum", name:"Padel Hilversum", adres:"Soestdijkerstraatweg 172, Hilversum", stad:"Hilversum", km:40.6, banen:5, type:"link", kleur:"#7C3AED", bg:"#7C3AED18", lat:52.2298, lon:5.1712, site:"https://padelheld.nl/padel-hilversum/" },
  { id:"hoorn", name:"Padel Hoorn", adres:"Nieuwe Steen 2, Hoorn", stad:"Hoorn", km:40.8, banen:16, type:"link", kleur:"#15803D", bg:"#15803D18", lat:52.6429, lon:5.0578, site:"https://padelheld.nl/padel-hoorn/" },
  { id:"denhaag", name:"Padel Den Haag", adres:"Laan van Poot 22, Den Haag", stad:"Den Haag", km:41.4, banen:40, type:"link", kleur:"#F97316", bg:"#F9731618", lat:52.0705, lon:4.3007, site:"https://padelheld.nl/padel-den-haag/" },
  { id:"gouda", name:"Padel Gouda", adres:"Groenhovenpark 1, Gouda", stad:"Gouda", km:41.4, banen:10, type:"link", kleur:"#A16207", bg:"#A1620718", lat:52.0168, lon:4.7098, site:"https://padelheld.nl/padel-gouda/" },
  { id:"bleiswijk", name:"Padel Bleiswijk", adres:"Sportweg 8, Bleiswijk", stad:"Bleiswijk", km:41.7, banen:15, type:"link", kleur:"#E11D48", bg:"#E11D4818", lat:52.0098, lon:4.5298, site:"https://padelheld.nl/padel-bleiswijk/" },
  { id:"laren", name:"Padel Club Laren", adres:"Eemnesserweg 20, Laren", stad:"Laren", km:41.9, banen:9, type:"link", kleur:"#15803D", bg:"#15803D18", lat:52.2578, lon:5.2198, site:"https://padelclublaren.nl/banen-boeken/" },
  { id:"huizen", name:"Padel Huizen", adres:"Gooierserf 400, Huizen", stad:"Huizen", km:42.7, banen:8, type:"link", kleur:"#0891B2", bg:"#0891B218", lat:52.2987, lon:5.2398, site:"https://padelheld.nl/padel-huizen/" },
  { id:"wognum", name:"Padel Wognum", adres:"Sportlaan 1, Wognum", stad:"Wognum", km:42.8, banen:4, type:"link", kleur:"#0EA5E9", bg:"#0EA5E918", lat:52.6898, lon:5.0087, site:"https://padelheld.nl/padel-wognum/" },
  { id:"zwaag", name:"Padel Zwaag", adres:"Sportweg 1, Zwaag", stad:"Zwaag", km:42.9, banen:6, type:"link", kleur:"#059669", bg:"#05966918", lat:52.6589, lon:5.0678, site:"https://padelheld.nl/padel-zwaag/" },
  { id:"blaricum", name:"Padel Blaricum", adres:"De Kuil 2, Blaricum", stad:"Blaricum", km:42.9, banen:12, type:"link", kleur:"#DC2626", bg:"#DC262618", lat:52.2698, lon:5.2412, site:"https://padelheld.nl/padel-blaricum/" },
  { id:"rijswijk", name:"Padel Rijswijk", adres:"Lange Kleiweg 2, Rijswijk", stad:"Rijswijk", km:43.4, banen:16, type:"link", kleur:"#E11D48", bg:"#E11D4818", lat:52.0365, lon:4.3245, site:"https://padelheld.nl/padel-rijswijk/" },
  { id:"delft", name:"Padel Delft", adres:"Brasserskade 2, Delft", stad:"Delft", km:45.3, banen:13, type:"link", kleur:"#2563EB", bg:"#2563EB18", lat:52.0116, lon:4.3571, site:"https://padelheld.nl/padel-delft/" },
  { id:"utrecht", name:"Peakz Padel Utrecht", adres:"Mississippidreef 161, Utrecht", stad:"Utrecht", km:45.6, banen:14, type:"link", kleur:"#DC2626", bg:"#DC262618", lat:52.0898, lon:5.0978, site:"https://www.peakzpadel.nl/reserveren" },
  { id:"schagen", name:"Padel Schagen", adres:"Sportlaan 4, Schagen", stad:"Schagen", km:46.9, banen:3, type:"link", kleur:"#B45309", bg:"#B4530918", lat:52.7878, lon:4.7978, site:"https://padelheld.nl/padel-schagen/" },
  { id:"hem", name:"Padel Hem", adres:"Poppendammer Gouw 2, Hem", stad:"Hem", km:48.6, banen:6, type:"link", kleur:"#E11D48", bg:"#E11D4818", lat:52.6912, lon:5.1398, site:"https://padelheld.nl/padel-hem/" },
  { id:"hoogkarspel", name:"Padel Hoogkarspel", adres:"Sportlaan 2, Hoogkarspel", stad:"Hoogkarspel", km:50.0, banen:3, type:"link", kleur:"#A16207", bg:"#A1620718", lat:52.6912, lon:5.1712, site:"https://padelheld.nl/padel-hoogkarspel/" },
  { id:"capelle", name:"Padel Capelle a/d IJssel", adres:"Rivierweg 150, Capelle aan den IJssel", stad:"Capelle a/d IJssel", km:50.3, banen:14, type:"link", kleur:"#8B5CF6", bg:"#8B5CF618", lat:51.9298, lon:4.5798, site:"https://padelheld.nl/padel-capelle-aan-den-ijssel/" },
  { id:"krimpen", name:"Padel Krimpen a/d IJssel", adres:"Sportlaan 2, Krimpen aan den IJssel", stad:"Krimpen a/d IJssel", km:51.3, banen:9, type:"link", kleur:"#0F766E", bg:"#0F766E18", lat:51.9178, lon:4.5978, site:"https://padelheld.nl/padel-krimpen-aan-den-ijssel/" },
  { id:"wervershoof", name:"Padel Wervershoof", adres:"Dorpsstraat 90, Wervershoof", stad:"Wervershoof", km:51.8, banen:6, type:"link", kleur:"#F97316", bg:"#F9731618", lat:52.7198, lon:5.1568, site:"https://padelheld.nl/padel-wervershoof/" },
  { id:"rotterdam", name:"Padel Rotterdam", adres:"Sportlaan 2, Rotterdam", stad:"Rotterdam", km:52.1, banen:30, type:"link", kleur:"#DC2626", bg:"#DC262618", lat:51.9225, lon:4.4792, site:"https://padelheld.nl/padel-rotterdam/" },
  { id:"schiedam", name:"Padel Schiedam", adres:"Sportpark Harga, Schiedam", stad:"Schiedam", km:54.0, banen:8, type:"link", kleur:"#0369A1", bg:"#0369A118", lat:51.9198, lon:4.3898, site:"https://padelheld.nl/padel-schiedam/" },
  { id:"vlaardingen", name:"Padel Vlaardingen", adres:"Sportlaan 4, Vlaardingen", stad:"Vlaardingen", km:56.0, banen:6, type:"link", kleur:"#F97316", bg:"#F9731618", lat:51.9098, lon:4.3398, site:"https://padelheld.nl/padel-vlaardingen/" },
  { id:"enkhuizen", name:"Padel Enkhuizen", adres:"Westeinde 249, Enkhuizen", stad:"Enkhuizen", km:56.8, banen:8, type:"link", kleur:"#DC2626", bg:"#DC262618", lat:52.7078, lon:5.2912, site:"https://padelheld.nl/padel-enkhuizen/" },
];// ── ALLE TIJDEN 07:00 - 22:00 ──────────────────────────────────
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
    const geocoded = clubCoords[club.id] || null;
    const base = {
      id: club.id, name: club.name, adres: club.adres, stad: club.stad,
      km: club.km, banen: club.banen, kleur: club.kleur,
      bg: club.bg, site: club.site,
      lat: geocoded ? geocoded.lat : (club.lat || null),
      lon: geocoded ? geocoded.lon : (club.lon || null),
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

// ── EENMALIG: Alle clubs geocoden ──────────────────────────────
// Bezoek /api/geocode-all ÉÉN KEER, kopieer de output, en plak die in de code
app.get("/api/geocode-all", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const results = {};
  
  for (const club of CLUBS) {
    const query = encodeURIComponent(club.adres + ", Nederland");
    try {
      await new Promise(r => setTimeout(r, 1100));
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=nl`,
        { headers: { "User-Agent": "PadelSpot/1.0 (geocode-all)" } }
      );
      const data = await resp.json();
      if (data && data.length > 0) {
        results[club.id] = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), adres: club.adres };
        console.log(`✓ ${club.id}: ${data[0].lat}, ${data[0].lon}`);
      } else {
        // Fallback: stad
        await new Promise(r => setTimeout(r, 1100));
        const resp2 = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(club.stad + ", Nederland")}&format=json&limit=1&countrycodes=nl`,
          { headers: { "User-Agent": "PadelSpot/1.0" } }
        );
        const data2 = await resp2.json();
        if (data2 && data2.length > 0) {
          results[club.id] = { lat: parseFloat(data2[0].lat), lon: parseFloat(data2[0].lon), adres: club.stad + " (stad)" };
          console.log(`~ ${club.id}: ${data2[0].lat}, ${data2[0].lon} (stad)`);
        } else {
          console.log(`✗ ${club.id}: niet gevonden`);
        }
      }
    } catch(e) {
      console.log(`✗ ${club.id}: ${e.message}`);
    }
  }
  
  console.log(`Klaar: ${Object.keys(results).length}/${CLUBS.length}`);
  res.json(results);
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

// ── GEOCODING ─────────────────────────────────────────────────
// Bij opstarten: haal echte coördinaten op voor alle clubs via Nominatim
const clubCoords = {};

async function geocodeClubs() {
  console.log("Geocoding starten voor " + CLUBS.length + " clubs...");
  let done = 0;
  let errors = 0;
  
  for (let i = 0; i < CLUBS.length; i++) {
    const club = CLUBS[i];
    try {
      await new Promise(r => setTimeout(r, 1200));
      const query = encodeURIComponent(club.adres + ", Nederland");
      const resp = await fetch("https://nominatim.openstreetmap.org/search?q=" + query + "&format=json&limit=1&countrycodes=nl", {
        headers: { "User-Agent": "PadelSpot/1.0 (padel-app-t9z0.onrender.com)" }
      });
      
      if (!resp.ok) {
        console.log("  [" + (i+1) + "/" + CLUBS.length + "] HTTP " + resp.status + " voor " + club.id);
        errors++;
        continue;
      }
      
      const data = await resp.json();
      if (data && data.length > 0) {
        clubCoords[club.id] = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
        done++;
        console.log("  [" + done + "] " + club.id + ": " + data[0].lat + ", " + data[0].lon);
      } else {
        // Fallback: stad
        try {
          await new Promise(r => setTimeout(r, 1200));
          const resp2 = await fetch("https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(club.stad + ", Nederland") + "&format=json&limit=1&countrycodes=nl", {
            headers: { "User-Agent": "PadelSpot/1.0" }
          });
          const data2 = await resp2.json();
          if (data2 && data2.length > 0) {
            clubCoords[club.id] = { lat: parseFloat(data2[0].lat), lon: parseFloat(data2[0].lon) };
            done++;
            console.log("  [" + done + "] " + club.id + ": " + data2[0].lat + ", " + data2[0].lon + " (stad)");
          } else {
            console.log("  SKIP " + club.id + ": niet gevonden");
            errors++;
          }
        } catch(e2) {
          console.log("  SKIP " + club.id + ": " + e2.message);
          errors++;
        }
      }
    } catch(e) {
      console.log("  FOUT " + club.id + ": " + e.message);
      errors++;
      // Wacht extra lang bij een fout (misschien rate limited)
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  console.log("Geocoding klaar: " + done + " OK, " + errors + " fouten, van " + CLUBS.length + " clubs");
}

// Endpoint voor coördinaten (frontend haalt dit op)
app.get("/api/coords", (req, res) => {
  res.json(clubCoords);
});

// ── EENMALIG: Alle clubs geocoden ──────────────────────────────
app.get("/api/geocode-all", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const results = {};
  for (const club of CLUBS) {
    const query = encodeURIComponent(club.adres + ", Nederland");
    try {
      await new Promise(r => setTimeout(r, 1100));
      const resp = await fetch("https://nominatim.openstreetmap.org/search?q=" + query + "&format=json&limit=1&countrycodes=nl", {
        headers: { "User-Agent": "PadelSpot/1.0 (geocode-all)" }
      });
      const data = await resp.json();
      if (data && data.length > 0) {
        results[club.id] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        console.log("v " + club.id + ": " + data[0].lat + ", " + data[0].lon);
      } else {
        await new Promise(r => setTimeout(r, 1100));
        const resp2 = await fetch("https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(club.stad + ", Nederland") + "&format=json&limit=1&countrycodes=nl", {
          headers: { "User-Agent": "PadelSpot/1.0" }
        });
        const data2 = await resp2.json();
        if (data2 && data2.length > 0) {
          results[club.id] = [parseFloat(data2[0].lat), parseFloat(data2[0].lon)];
        }
      }
    } catch(e) { console.log("x " + club.id); }
  }
  res.json(results);
});

// ── START ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PadelSpot draait op poort ${PORT}`);
  geocodeClubs(); // Start geocoding op achtergrond
});
