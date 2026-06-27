import React, { useState, useEffect } from "react";
import { convertBsToAd, convertAdToBs } from "../services/api";

// All 77 Districts of Nepal organized by Province + International cities
const CITY_PRESETS = [
  // --- Province 1 (Koshi) ---
  { name: "Taplejung (ताप्लेजुङ) - P1", lat: 27.3566, lon: 87.6690, tz: 5.75 },
  { name: "Panchthar (पाँचथर) - P1", lat: 27.1333, lon: 87.7833, tz: 5.75 },
  { name: "Ilam (इलाम) - P1", lat: 26.9108, lon: 87.9244, tz: 5.75 },
  { name: "Jhapa (झापा) - P1", lat: 26.5407, lon: 87.8990, tz: 5.75 },
  { name: "Morang (मोरङ) - P1", lat: 26.6534, lon: 87.3248, tz: 5.75 },
  { name: "Sunsari (सुनसरी) - P1", lat: 26.7165, lon: 87.1744, tz: 5.75 },
  { name: "Dhankuta (धनकुटा) - P1", lat: 26.9833, lon: 87.3333, tz: 5.75 },
  { name: "Terhathum (तेह्रथुम) - P1", lat: 27.1000, lon: 87.5500, tz: 5.75 },
  { name: "Sankhuwasabha (सङ्खुवासभा) - P1", lat: 27.5500, lon: 87.1333, tz: 5.75 },
  { name: "Bhojpur (भोजपुर) - P1", lat: 27.1717, lon: 87.0563, tz: 5.75 },
  { name: "Solukhumbu (सोलुखुम्बु) - P1", lat: 27.6644, lon: 86.5837, tz: 5.75 },
  { name: "Okhaldhunga (ओखलढुङ्गा) - P1", lat: 27.3091, lon: 86.5040, tz: 5.75 },
  { name: "Khotang (खोटाङ) - P1", lat: 27.0251, lon: 86.8393, tz: 5.75 },
  { name: "Udayapur (उदयपुर) - P1", lat: 26.8882, lon: 86.5353, tz: 5.75 },

  // --- Province 2 (Madhesh) ---
  { name: "Saptari (सप्तरी) - P2", lat: 26.6009, lon: 86.7074, tz: 5.75 },
  { name: "Siraha (सिरहा) - P2", lat: 26.6543, lon: 86.2066, tz: 5.75 },
  { name: "Dhanusha (धनुषा) - P2", lat: 26.8154, lon: 85.9328, tz: 5.75 },
  { name: "Mahottari (महोत्तरी) - P2", lat: 26.6533, lon: 85.7953, tz: 5.75 },
  { name: "Sarlahi (सर्लाही) - P2", lat: 27.0228, lon: 85.5722, tz: 5.75 },
  { name: "Rautahat (रौतहट) - P2", lat: 27.0107, lon: 85.2825, tz: 5.75 },
  { name: "Bara (बारा) - P2", lat: 27.0160, lon: 85.0165, tz: 5.75 },
  { name: "Parsa (पर्सा) - P2", lat: 27.0833, lon: 84.8667, tz: 5.75 },

  // --- Province 3 (Bagmati) ---
  { name: "Kathmandu (काठमाडौं) - P3", lat: 27.7172, lon: 85.3240, tz: 5.75 },
  { name: "Lalitpur (ललितपुर) - P3", lat: 27.6710, lon: 85.3240, tz: 5.75 },
  { name: "Bhaktapur (भक्तपुर) - P3", lat: 27.6720, lon: 85.4298, tz: 5.75 },
  { name: "Nuwakot (नुवाकोट) - P3", lat: 27.9101, lon: 85.1682, tz: 5.75 },
  { name: "Rasuwa (रसुवा) - P3", lat: 28.1000, lon: 85.4000, tz: 5.75 },
  { name: "Dhading (धादिङ) - P3", lat: 27.8698, lon: 84.9121, tz: 5.75 },
  { name: "Makwanpur (मकवानपुर) - P3", lat: 27.4329, lon: 85.0352, tz: 5.75 },
  { name: "Sindhuli (सिन्धुली) - P3", lat: 27.2496, lon: 85.9706, tz: 5.75 },
  { name: "Ramechhap (रामेछाप) - P3", lat: 27.3281, lon: 86.0852, tz: 5.75 },
  { name: "Dolakha (दोलखा) - P3", lat: 27.6672, lon: 86.0826, tz: 5.75 },
  { name: "Sindhupalchok (सिन्धुपाल्चोक) - P3", lat: 27.9441, lon: 85.6897, tz: 5.75 },
  { name: "Kavrepalanchok (काभ्रेपलाञ्चोक) - P3", lat: 27.5291, lon: 85.6857, tz: 5.75 },
  { name: "Chitwan (चितवन) - P3", lat: 27.5291, lon: 84.3542, tz: 5.75 },

  // --- Province 4 (Gandaki) ---
  { name: "Gorkha (गोरखा) - P4", lat: 28.0000, lon: 84.6333, tz: 5.75 },
  { name: "Lamjung (लमजुङ) - P4", lat: 28.2000, lon: 84.3500, tz: 5.75 },
  { name: "Tanahun (तनहुँ) - P4", lat: 27.9000, lon: 84.3500, tz: 5.75 },
  { name: "Syangja (स्याङ्जा) - P4", lat: 28.0000, lon: 83.8833, tz: 5.75 },
  { name: "Kaski / Pokhara (कास्की) - P4", lat: 28.2096, lon: 83.9856, tz: 5.75 },
  { name: "Manang (मनाङ) - P4", lat: 28.6667, lon: 84.0167, tz: 5.75 },
  { name: "Mustang (मुस्ताङ) - P4", lat: 28.9847, lon: 83.7399, tz: 5.75 },
  { name: "Myagdi (म्याग्दी) - P4", lat: 28.5000, lon: 83.5667, tz: 5.75 },
  { name: "Nawalparasi East (नवलपरासी पूर्व) - P4", lat: 27.6833, lon: 83.9167, tz: 5.75 },
  { name: "Parbat (पर्वत) - P4", lat: 28.2333, lon: 83.6500, tz: 5.75 },
  { name: "Baglung (बागलुङ) - P4", lat: 28.2664, lon: 83.5858, tz: 5.75 },

  // --- Province 5 (Lumbini) ---
  { name: "Gulmi (गुल्मी) - P5", lat: 28.0667, lon: 83.2667, tz: 5.75 },
  { name: "Palpa (पाल्पा) - P5", lat: 27.8667, lon: 83.5500, tz: 5.75 },
  { name: "Nawalparasi West (नवलपरासी पश्चिम) - P5", lat: 27.5611, lon: 83.6928, tz: 5.75 },
  { name: "Rupandehi (रूपन्देही) - P5", lat: 27.5000, lon: 83.3500, tz: 5.75 },
  { name: "Kapilvastu (कपिलवस्तु) - P5", lat: 27.5833, lon: 83.0500, tz: 5.75 },
  { name: "Arghakhanchi (अर्घाखाँची) - P5", lat: 27.9500, lon: 83.1000, tz: 5.75 },
  { name: "Pyuthan (प्युठान) - P5", lat: 28.1011, lon: 82.8629, tz: 5.75 },
  { name: "Rolpa (रोल्पा) - P5", lat: 28.3500, lon: 82.7333, tz: 5.75 },
  { name: "Rukum East (रुकुम पूर्व) - P5", lat: 28.6167, lon: 82.6167, tz: 5.75 },
  { name: "Banke (बाँके) - P5", lat: 28.0667, lon: 81.5667, tz: 5.75 },
  { name: "Bardiya (बर्दिया) - P5", lat: 28.3544, lon: 81.2751, tz: 5.75 },
  { name: "Dang (दाङ) - P5", lat: 27.9833, lon: 82.4000, tz: 5.75 },

  // --- Province 6 (Karnali) ---
  { name: "Dolpa (डोल्पा) - P6", lat: 29.0667, lon: 82.9167, tz: 5.75 },
  { name: "Mugu (मुगु) - P6", lat: 29.5500, lon: 82.1500, tz: 5.75 },
  { name: "Humla (हुम्ला) - P6", lat: 30.0833, lon: 81.8500, tz: 5.75 },
  { name: "Jumla (जुम्ला) - P6", lat: 29.2744, lon: 82.1835, tz: 5.75 },
  { name: "Kalikot (कालिकोट) - P6", lat: 29.1667, lon: 81.7833, tz: 5.75 },
  { name: "Dailekh (दैलेख) - P6", lat: 28.8333, lon: 81.7167, tz: 5.75 },
  { name: "Jajarkot (जाजरकोट) - P6", lat: 28.7014, lon: 82.1928, tz: 5.75 },
  { name: "Rukum West (रुकुम पश्चिम) - P6", lat: 28.6167, lon: 82.3500, tz: 5.75 },
  { name: "Salyan (सल्यान) - P6", lat: 28.3667, lon: 82.1500, tz: 5.75 },
  { name: "Surkhet (सुर्खेत) - P6", lat: 28.6000, lon: 81.6167, tz: 5.75 },

  // --- Province 7 (Sudurpashchim) ---
  { name: "Bajura (बाजुरा) - P7", lat: 29.4167, lon: 81.3500, tz: 5.75 },
  { name: "Bajhang (बझाङ) - P7", lat: 29.6667, lon: 81.2167, tz: 5.75 },
  { name: "Achham (अछाम) - P7", lat: 29.1167, lon: 81.1500, tz: 5.75 },
  { name: "Doti (डोटी) - P7", lat: 29.2667, lon: 80.9667, tz: 5.75 },
  { name: "Kailali (कैलाली) - P7", lat: 28.6333, lon: 80.7167, tz: 5.75 },
  { name: "Kanchanpur (कञ्चनपुर) - P7", lat: 28.8333, lon: 80.1833, tz: 5.75 },
  { name: "Darchula (दार्चुला) - P7", lat: 29.8500, lon: 80.5500, tz: 5.75 },
  { name: "Baitadi (बैतडी) - P7", lat: 29.5333, lon: 80.5500, tz: 5.75 },
  { name: "Dadeldhura (डडेलधुरा) - P7", lat: 29.3000, lon: 80.5333, tz: 5.75 },

  // --- International (अन्तर्राष्ट्रिय) ---
  { name: "New Delhi (दिल्ली) - India", lat: 28.6139, lon: 77.2090, tz: 5.5 },
  { name: "Mumbai (मुम्बई) - India", lat: 19.0760, lon: 72.8777, tz: 5.5 },
  { name: "Kolkata (कोलकाता) - India", lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { name: "London (लण्डन) - UK", lat: 51.5074, lon: -0.1278, tz: 0.0 },
  { name: "New York (न्यूयोर्क) - USA", lat: 40.7128, lon: -74.0060, tz: -5.0 },
  { name: "Dubai (दुबई) - UAE", lat: 25.2048, lon: 55.2708, tz: 4.0 },
  { name: "Tokyo (टोकियो) - Japan", lat: 35.6762, lon: 139.6503, tz: 9.0 },
  { name: "Sydney (सिड्नी) - Australia", lat: -33.8688, lon: 151.2093, tz: 10.0 },
];

const NEPALI_MONTHS = [
  { val: 1, name: "Baisakh", nep: "वैशाख" },
  { val: 2, name: "Jestha", nep: "जेठ" },
  { val: 3, name: "Ashadh", nep: "असार" },
  { val: 4, name: "Shrawan", nep: "साउन" },
  { val: 5, name: "Bhadra", nep: "भदौ" },
  { val: 6, name: "Ashwin", nep: "असोज" },
  { val: 7, name: "Kartik", nep: "कात्तिक" },
  { val: 8, name: "Mangsir", nep: "मंसिर" },
  { val: 9, name: "Poush", nep: "पुस" },
  { val: 10, name: "Magh", nep: "माघ" },
  { val: 11, name: "Falgun", nep: "फागुन" },
  { val: 12, name: "Chaitra", nep: "चैत" }
];

export default function ChartInput({ onCalculate, onSave, ayanamshaType, language }) {
  const [name, setName] = useState("");
  const [calendarMode, setCalendarMode] = useState("AD"); // "AD" or "BS"
  const [birthDate, setBirthDate] = useState(""); // Always stores Gregorian date
  const [birthTime, setBirthTime] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [timezone, setTimezone] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  
  // BS Specific States
  const [bsYear, setBsYear] = useState("2080");
  const [bsMonth, setBsMonth] = useState("1");
  const [bsDay, setBsDay] = useState("1");
  const [convertedBsString, setConvertedBsString] = useState("");
  const [conversionError, setConversionError] = useState("");

  // Trigger conversion when BS input changes
  useEffect(() => {
    if (calendarMode === "BS") {
      const y = parseInt(bsYear);
      const m = parseInt(bsMonth);
      const d = parseInt(bsDay);
      if (y && m && d) {
        setConversionError("");
        convertBsToAd(y, m, d)
          .then((res) => {
            setBirthDate(res.ad_date);
          })
          .catch((err) => {
            setConversionError(language === "ne" ? "अमान्य नेपाली मिति" : "Invalid BS date");
          });
      }
    }
  }, [bsYear, bsMonth, bsDay, calendarMode]);

  // Convert AD to BS when AD date changes
  const handleAdDateChange = (e) => {
    const val = e.target.value;
    setBirthDate(val);
    setConversionError("");
    if (val) {
      convertAdToBs(val)
        .then((res) => {
          setConvertedBsString(res.bs_date);
          // Sync BS state just in case user toggles to BS later
          setBsYear(res.year.toString());
          setBsMonth(res.month.toString());
          setBsDay(res.day.toString());
        })
        .catch(() => {
          setConvertedBsString("");
        });
    } else {
      setConvertedBsString("");
    }
  };

  const handleCityPreset = (e) => {
    const idx = e.target.value;
    if (idx === "") return;
    const city = CITY_PRESETS[idx];
    setLatitude(city.lat.toString());
    setLongitude(city.lon.toString());
    setTimezone(city.tz.toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !birthDate || !birthTime || !latitude || !longitude || !timezone) {
      alert(language === "ne" ? "कृपया सबै विवरणहरू भर्नुहोस्।" : "Please fill out all fields.");
      return;
    }
    if (conversionError) {
      alert(conversionError);
      return;
    }
    const params = {
      name,
      birth_date: birthDate,
      birth_time: birthTime + ":00",
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timezone: parseFloat(timezone),
      ayanamsha_type: ayanamshaType
    };
    onCalculate(params);
  };

  const handleSaveClick = () => {
    if (!name || !birthDate || !birthTime || !latitude || !longitude || !timezone) {
      alert(language === "ne" ? "बचत गर्न पहिले विवरणहरू पूरा गर्नुहोस्।" : "Please complete details first to save.");
      return;
    }
    if (conversionError) {
      alert(conversionError);
      return;
    }
    const record = {
      name,
      birth_date: birthDate,
      birth_time: birthTime + ":00",
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timezone: parseFloat(timezone)
    };
    onSave(record);
  };

  // Generate Year Array (e.g. 2000 to 2090 BS)
  const bsYears = [];
  for (let y = 2000; y <= 2099; y++) {
    bsYears.push(y);
  }

  // Generate Days array (1 to 32)
  const bsDays = [];
  for (let d = 1; d <= 32; d++) {
    bsDays.push(d);
  }

  return (
    <div className="glass-panel">
      <h3>{language === "ne" ? "विवरणहरू प्रविष्ट गर्नुहोस्" : "Enter Birth Details"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{language === "ne" ? "नाम" : "Name"}</label>
          <input
            id="input-birth-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={language === "ne" ? "उदाहरण: राम बहादुर" : "e.g., Ram Bahadur"}
          />
        </div>

        {/* Calendar Mode Toggle */}
        <div className="form-group">
          <label>{language === "ne" ? "पात्रो प्रणाली" : "Calendar System"}</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              className={calendarMode === "AD" ? "btn-primary" : "btn-secondary"}
              style={{ flex: 1, padding: "8px", fontSize: "0.85rem" }}
              onClick={() => setCalendarMode("AD")}
            >
              Gregorian (AD)
            </button>
            <button
              type="button"
              className={calendarMode === "BS" ? "btn-primary" : "btn-secondary"}
              style={{ flex: 1, padding: "8px", fontSize: "0.85rem" }}
              onClick={() => setCalendarMode("BS")}
            >
              Bikram Sambat (BS)
            </button>
          </div>
        </div>

        {/* Date Input - Conditional on Calendar Mode */}
        {calendarMode === "AD" ? (
          <div className="form-group">
            <label>{language === "ne" ? "जन्म मिति (AD)" : "Birth Date (AD)"}</label>
            <input
              type="date"
              value={birthDate}
              onChange={handleAdDateChange}
            />
            {convertedBsString && (
              <span style={{ fontSize: "0.8rem", color: "var(--color-gold)", marginTop: "4px" }}>
                {language === "ne" ? "नेपाली मिति (BS):" : "Nepali Date (BS):"} {convertedBsString}
              </span>
            )}
          </div>
        ) : (
          <div className="form-group">
            <label>{language === "ne" ? "जन्म मिति (BS)" : "Birth Date (BS)"}</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {/* BS Year */}
              <select 
                style={{ flex: 1.2, minWidth: 0 }} 
                value={bsYear} 
                onChange={(e) => setBsYear(e.target.value)}
              >
                {bsYears.map((y) => (
                  <option key={y} value={y}>{y} BS</option>
                ))}
              </select>
              
              {/* BS Month */}
              <select 
                style={{ flex: 1.5, minWidth: 0 }} 
                value={bsMonth} 
                onChange={(e) => setBsMonth(e.target.value)}
              >
                {NEPALI_MONTHS.map((m) => (
                  <option key={m.val} value={m.val}>
                    {language === "ne" ? m.nep : m.name} ({m.val})
                  </option>
                ))}
              </select>
              
              {/* BS Day */}
              <select 
                style={{ flex: 1, minWidth: 0 }} 
                value={bsDay} 
                onChange={(e) => setBsDay(e.target.value)}
              >
                {bsDays.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            
            {birthDate && !conversionError && (
              <span style={{ fontSize: "0.8rem", color: "var(--color-gold)", marginTop: "4px" }}>
                {language === "ne" ? "अंग्रेजी मिति (AD):" : "Equivalent AD Date:"} {birthDate}
              </span>
            )}
            
            {conversionError && (
              <span style={{ fontSize: "0.8rem", color: "var(--color-error)", marginTop: "4px" }}>
                {conversionError}
              </span>
            )}
          </div>
        )}

        <div className="form-group">
          <label>{language === "ne" ? "जन्म समय" : "Birth Time"}</label>
          <input
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>{language === "ne" ? "स्थान खोज्नुहोस् / छान्नुहोस्" : "Search & Select Location"}</label>
          <input
            type="text"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            placeholder={language === "ne" ? "जिल्ला वा सहर खोज्नुहोस्..." : "Type district or city name..."}
            style={{ marginBottom: "6px" }}
          />
          <select onChange={handleCityPreset} defaultValue="">
            <option value="">{language === "ne" ? "-- सहर/जिल्ला छान्नुहोस् --" : "-- Select a District / City --"}</option>
            {/* Province 1 */}
            {CITY_PRESETS.filter(c => c.name.includes("P1")).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).length > 0 && (
              <optgroup label={language === "ne" ? "प्रदेश १ (कोशी)" : "Province 1 (Koshi)"}>
                {CITY_PRESETS.filter(c => c.name.includes("P1")).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).map((city, idx) => (
                  <option key={city.name} value={CITY_PRESETS.indexOf(city)}>{city.name.replace(" - P1", "")}</option>
                ))}
              </optgroup>
            )}
            {/* Province 2 */}
            {CITY_PRESETS.filter(c => c.name.includes("P2")).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).length > 0 && (
              <optgroup label={language === "ne" ? "प्रदेश २ (मधेश)" : "Province 2 (Madhesh)"}>
                {CITY_PRESETS.filter(c => c.name.includes("P2")).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).map((city) => (
                  <option key={city.name} value={CITY_PRESETS.indexOf(city)}>{city.name.replace(" - P2", "")}</option>
                ))}
              </optgroup>
            )}
            {/* Province 3 */}
            {CITY_PRESETS.filter(c => c.name.includes("P3")).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).length > 0 && (
              <optgroup label={language === "ne" ? "प्रदेश ३ (बागमती)" : "Province 3 (Bagmati)"}>
                {CITY_PRESETS.filter(c => c.name.includes("P3")).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).map((city) => (
                  <option key={city.name} value={CITY_PRESETS.indexOf(city)}>{city.name.replace(" - P3", "")}</option>
                ))}
              </optgroup>
            )}
            {/* Province 4 */}
            {CITY_PRESETS.filter(c => c.name.includes("P4")).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).length > 0 && (
              <optgroup label={language === "ne" ? "प्रदेश ४ (गण्डकी)" : "Province 4 (Gandaki)"}>
                {CITY_PRESETS.filter(c => c.name.includes("P4")).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).map((city) => (
                  <option key={city.name} value={CITY_PRESETS.indexOf(city)}>{city.name.replace(" - P4", "")}</option>
                ))}
              </optgroup>
            )}
            {/* Province 5 */}
            {CITY_PRESETS.filter(c => c.name.includes("P5")).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).length > 0 && (
              <optgroup label={language === "ne" ? "प्रदेश ५ (लुम्बिनी)" : "Province 5 (Lumbini)"}>
                {CITY_PRESETS.filter(c => c.name.includes("P5")).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).map((city) => (
                  <option key={city.name} value={CITY_PRESETS.indexOf(city)}>{city.name.replace(" - P5", "")}</option>
                ))}
              </optgroup>
            )}
            {/* Province 6 */}
            {CITY_PRESETS.filter(c => c.name.includes("P6")).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).length > 0 && (
              <optgroup label={language === "ne" ? "प्रदेश ६ (कर्णाली)" : "Province 6 (Karnali)"}>
                {CITY_PRESETS.filter(c => c.name.includes("P6")).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).map((city) => (
                  <option key={city.name} value={CITY_PRESETS.indexOf(city)}>{city.name.replace(" - P6", "")}</option>
                ))}
              </optgroup>
            )}
            {/* Province 7 */}
            {CITY_PRESETS.filter(c => c.name.includes("P7")).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).length > 0 && (
              <optgroup label={language === "ne" ? "प्रदेश ७ (सुदूरपश्चिम)" : "Province 7 (Sudurpashchim)"}>
                {CITY_PRESETS.filter(c => c.name.includes("P7")).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).map((city) => (
                  <option key={city.name} value={CITY_PRESETS.indexOf(city)}>{city.name.replace(" - P7", "")}</option>
                ))}
              </optgroup>
            )}
            {/* International */}
            {CITY_PRESETS.filter(c => !["P1","P2","P3","P4","P5","P6","P7"].some(p => c.name.includes(p))).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).length > 0 && (
              <optgroup label={language === "ne" ? "अन्तर्राष्ट्रिय" : "International"}>
                {CITY_PRESETS.filter(c => !["P1","P2","P3","P4","P5","P6","P7"].some(p => c.name.includes(p))).filter(c => !locationSearch || c.name.toLowerCase().includes(locationSearch.toLowerCase())).map((city) => (
                  <option key={city.name} value={CITY_PRESETS.indexOf(city)}>{city.name}</option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <div className="form-group">
          <label>{language === "ne" ? "अक्षांश (Latitude)" : "Latitude (Decimal)"}</label>
          <input
            type="number"
            step="0.0001"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="e.g. 27.7172"
          />
        </div>

        <div className="form-group">
          <label>{language === "ne" ? "देशान्तर (Longitude)" : "Longitude (Decimal)"}</label>
          <input
            type="number"
            step="0.0001"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="e.g. 85.3240"
          />
        </div>

        <div className="form-group">
          <label>{language === "ne" ? "समय क्षेत्र (Timezone Offset)" : "Timezone (Hours offset)"}</label>
          <input
            type="number"
            step="0.01"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="e.g. 5.75 for Nepal, 5.5 for India"
          />
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
          <button type="submit" className="btn-primary" style={{ flex: 1 }}>
            {language === "ne" ? "गणना गर" : "Calculate"}
          </button>
          <button type="button" onClick={handleSaveClick} className="btn-secondary">
            {language === "ne" ? "बचत गर" : "Save Record"}
          </button>
        </div>
      </form>
    </div>
  );
}
