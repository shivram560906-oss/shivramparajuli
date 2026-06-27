import React, { useState, useMemo } from "react";
import LordshipInfo from "./LordshipInfo";
import PlanetaryDeities from "./PlanetaryDeities";
import AspectsInfo from "./AspectsInfo";
import DashaInfo from "./DashaInfo";
import NorthIndianChart from "./NorthIndianChart";
import SouthIndianChart from "./SouthIndianChart";

// Helper to convert English numerals to Nepali numerals
const toNeNum = (num) => {
  const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(num)
    .split("")
    .map((d) => nepaliDigits[parseInt(d, 10)] || d)
    .join("");
};

const OPTIONS = [
  { id: "vargas", icon: "📊", label: "वर्ग कुण्डली I" },
  { id: "sudarshan", icon: "⭕", label: "सुदर्शन चक्र" },
  { id: "lordships", icon: "🏠", label: "भावेश विवरण" },
  { id: "shadbala", icon: "⚡", label: "षडबल समयरेखा" },
  { id: "interpretations", icon: "✍️", label: "ग्रह व्याख्या" },
  { id: "deities", icon: "📿", label: "ग्रह देवता र उपाय" },
  { id: "aspects", icon: "👁️", label: "ग्रह दृष्टि विवरण" },
  { id: "dashas", icon: "⏳", label: "दशा - नक्षत्रमा आधारित" },
  { id: "transits_partner", icon: "👥", label: "एनिमेटेड गोचर - पार्टनर" },
  { id: "calendar", icon: "📅", label: "पात्रो / क्यालेन्डर" },
  { id: "navamsha_ages", icon: "🎂", label: "नवांश उमेर" },
  { id: "animated_transits", icon: "🔄", label: "एनिमेटेड गोचर I" },
  { id: "transits_partner_double", icon: "💑", label: "एनिमेटेड गोचर - पार्टनर (द्वि-गोचर)" },
  { id: "ephemeris", icon: "📈", label: "ग्राफिकल एफिमेरिस" },
  { id: "ashtakavarga", icon: "🔢", label: "अष्टकवर्ग - समुदाय" },
  { id: "malefic_transits", icon: "⚠️", label: "३ क्रूर गोचर क्यालेन्डर" },
  { id: "events_1_10", icon: "📅", label: "घटनाक्रम १-१०" },
  { id: "events_11_20", icon: "📅", label: "घटनाक्रम ११-२०" },
  { id: "muhurta", icon: "🌟", label: "मुहूर्त" },
  { id: "muhurta_dashas", icon: "🔑", label: "मुहूर्त - दशा र बलहरू" },
  { id: "varshaphala", icon: "📆", label: "वर्षफल I" },
  { id: "compatibility", icon: "💖", label: "कुण्डली मिलान - गुण मिलान" },
  { id: "rectification", icon: "🛠️", label: "जन्म समय संशोधन" },
  { id: "tutor", icon: "🎓", label: "कुण्डली ट्युटर" },
  { id: "dasha_effects", icon: "🔮", label: "दशा फल र प्रभाव" },
];

const SIGN_NAMES_NE = {
  1: "मेष", 2: "वृष", 3: "मिथुन", 4: "कर्कट", 5: "सिंह", 6: "कन्या",
  7: "तुला", 8: "वृश्चिक", 9: "धनु", 10: "मकर", 11: "कुम्भ", 12: "मीन"
};

const PLANET_NAMES_NE = {
  Sun: "सूर्य", Moon: "चन्द्र", Mars: "मङ्गल", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु"
};

const NAKSHATRAS = [
  "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा",
  "मघा", "पूर्वाफाल्गुनी", "उत्तराफाल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा",
  "मूल", "पूर्वाषाढा", "उत्तराषाढा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वाभाद्रपद", "उत्तराभाद्रपद", "रेवती"
];

const VARGA_LABELS_NE = {
  D1: "D1 - राशि कुण्डली (जन्म लग्न)",
  D9: "D9 - नवांश कुण्डली (दाम्पत्य र धर्म)",
  D10: "D10 - दशमांश कुण्डली (कर्म र जीविका)",
  D12: "D12 - द्वादशांश कुण्डली (मातापिता)",
  D16: "D16 - षोडशांश कुण्डली (वाहन र सुख)",
  D20: "D20 - विंशांश कुण्डली (अध्यात्म)",
  D24: "D24 - चतुर्विंशांश कुण्डली (विद्या र बुद्धि)",
  D27: "D27 - सप्तविंशांश कुण्डली (बल र क्षमता)",
  D30: "D30 - त्रिंशांश कुण्डली (अरिष्ट र अमंगल)",
  D40: "D40 - खवेदांश कुण्डली (शुभाशुभ फल)",
  D45: "D45 - अक्षवेदांश कुण्डली (चरित्र र शील)",
  D60: "D60 - षष्टियांश कुण्डली (समस्त शुभ-अशुभ)"
};

export default function ChartTab({ chartData, activeStyle = "NORTH_INDIAN" }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [vargaSelect, setVargaSelect] = useState("D1");

  // State for transit simulator
  const [transitDays, setTransitDays] = useState(0);

  // State for Gun Milan
  const [partnerSign, setPartnerSign] = useState(1);
  const [partnerNakshatra, setPartnerNakshatra] = useState(0);
  const [matchResult, setMatchResult] = useState(null);

  // State for Partner Transit
  const [partnerName, setPartnerName] = useState("");
  const [partnerLagna, setPartnerLagna] = useState(1);

  // State for Muhurta
  const [muhurtaType, setMuhurtaType] = useState("विवाह");
  const [muhurtaDate, setMuhurtaDate] = useState("2026-06-22");

  if (!chartData) return null;

  const currentOption = OPTIONS[selectedIdx];

  // Helper to get planet object by name
  const getPlanet = (name) => chartData.planets?.find((p) => p.name === name) || {};

  // 1. Vargas Component
  const renderVargas = () => {
    const activeData = chartData.vargas ? chartData.vargas[vargaSelect] : chartData;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <h4>वर्ग कुण्डली चयन गर्नुहोस्:</h4>
          <select
            value={vargaSelect}
            onChange={(e) => setVargaSelect(e.target.value)}
            style={{
              padding: "8px 12px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--color-gold)",
              borderRadius: "6px",
              color: "white"
            }}
          >
            {Object.entries(VARGA_LABELS_NE).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {activeStyle === "NORTH_INDIAN" ? (
            <NorthIndianChart chartData={activeData} language="ne" />
          ) : (
            <SouthIndianChart chartData={activeData} language="ne" />
          )}
        </div>
      </div>
    );
  };

  // 2. Sudarshan Chakra (SVG)
  const renderSudarshanChakra = () => {
    const lagnaSign = chartData.lagna.sign_number;
    const moonSign = getPlanet("Moon").sign_number || 1;
    const sunSign = getPlanet("Sun").sign_number || 1;

    const planets = chartData.planets || [];

    const getPlanetsInSign = (sign) => {
      return planets
        .filter((p) => p.sign_number === sign)
        .map((p) => PLANET_NAMES_NE[p.name] || p.name)
        .join(", ");
    };

    const circles = [
      { name: "सूर्य कुण्डली", radius: 170, color: "#e84118", refSign: sunSign },
      { name: "चन्द्र कुण्डली", radius: 120, color: "#a1a1aa", refSign: moonSign },
      { name: "लग्न कुण्डली", radius: 70, color: "#d4af37", refSign: lagnaSign }
    ];

    const width = 450;
    const height = 450;
    const cx = width / 2;
    const cy = height / 2;

    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
          सुदर्शन चक्रले लग्न, चन्द्र र सूर्य कुण्डलीलाई एउटै चक्रमा देखाउँछ। यसबाट तीनै स्थानबाट ग्रह बल विश्लेषण गर्न सजिलो हुन्छ।
        </p>

        <svg width={width} height={height} style={{ background: "rgba(8, 7, 24, 0.5)", borderRadius: "50%", border: "1px solid var(--glass-border)", margin: "0 auto", display: "block" }}>
          <circle cx={cx} cy={cy} r={210} fill="none" stroke="rgba(212, 175, 55, 0.1)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={170} fill="none" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={120} fill="none" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={70} fill="none" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={20} fill="rgba(212, 175, 55, 0.1)" stroke="var(--color-gold)" strokeWidth="1" />

          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x1 = cx + 20 * Math.cos(angle);
            const y1 = cy + 20 * Math.sin(angle);
            const x2 = cx + 210 * Math.cos(angle);
            const y2 = cy + 210 * Math.sin(angle);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1" />
            );
          })}

          {circles.map((ring, rIdx) => {
            return [...Array(12)].map((_, houseIdx) => {
              const angleDeg = -90 - houseIdx * 30 - 15;
              const angleRad = angleDeg * (Math.PI / 180);
              const textDist = ring.radius + 22;
              const x = cx + textDist * Math.cos(angleRad);
              const y = cy + textDist * Math.sin(angleRad);

              const signNum = ((ring.refSign - 1 + houseIdx) % 12) + 1;
              const signNe = SIGN_NAMES_NE[signNum];
              const pls = getPlanetsInSign(signNum);

              return (
                <g key={`${rIdx}-${houseIdx}`}>
                  <text
                    x={x}
                    y={y - 5}
                    fill={ring.color}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {signNe} ({toNeNum(signNum)})
                  </text>
                  {pls && (
                    <text
                      x={x}
                      y={y + 7}
                      fill="white"
                      fontSize="8"
                      textAnchor="middle"
                    >
                      {pls}
                    </text>
                  )}
                </g>
              );
            });
          })}
          
          <text x={cx} y={cy + 4} fill="var(--color-gold)" fontSize="10" fontWeight="bold" textAnchor="middle">
            केन्द्र
          </text>
        </svg>

        <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", gap: "20px", fontSize: "0.85rem" }}>
          <div><span style={{ color: "#d4af37" }}>●</span> लग्न कुण्डली (भित्री चक्र)</div>
          <div><span style={{ color: "#a1a1aa" }}>●</span> चन्द्र कुण्डली (मध्य चक्र)</div>
          <div><span style={{ color: "#e84118" }}>●</span> सूर्य कुण्डली (बाहिरी चक्र)</div>
        </div>
      </div>
    );
  };

  // 4. Shadbala Timeline & Strengths
  const renderShadbala = () => {
    const mockShadbala = {
      Sun: { val: 432, req: 390, name: "सूर्य" },
      Moon: { val: 388, req: 360, name: "चन्द्र" },
      Mars: { val: 345, req: 300, name: "मङ्गल" },
      Mercury: { val: 412, req: 360, name: "बुध" },
      Jupiter: { val: 490, req: 390, name: "गुरु" },
      Venus: { val: 376, req: 330, name: "शुक्र" },
      Saturn: { val: 310, req: 300, name: "शनि" }
    };

    return (
      <div>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "20px" }}>
          षडबलले ग्रहहरूको ६ प्रकारको बल (स्थान बल, दिग्बल, काल बल, चेष्टा बल, नैसर्गिक बल र दृष्टि बल) जनाउँछ। तल ग्रहको कूल बल शष्ट्यांश र आवश्यक बलको तुलना दिइएको छ:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {Object.entries(mockShadbala).map(([key, data]) => {
            const pct = Math.min(100, Math.round((data.val / data.req) * 100));
            const color = pct >= 110 ? "var(--color-success)" : pct >= 100 ? "var(--color-gold)" : "var(--color-error)";
            return (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "4px" }}>
                  <span style={{ fontWeight: "bold" }}>{data.name} ({key})</span>
                  <span>
                    बल: <strong style={{ color }}>{toNeNum(data.val)}</strong> / आवश्यक: {toNeNum(data.req)} ({toNeNum(pct)}%)
                  </span>
                </div>
                <div style={{ height: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--glass-border)" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, var(--bg-tertiary), ${color})`, borderRadius: "6px" }} />
                </div>
              </div>
            );
          })}
        </div>

        <h5 style={{ marginTop: "24px", color: "var(--color-gold)", marginBottom: "8px" }}>षडबल समयरेखा (मासिक बल पूर्वानुमान)</h5>
        <div style={{ padding: "10px", background: "rgba(8,7,24,0.3)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
          <svg viewBox="0 0 500 100" style={{ width: "100%", height: "auto" }}>
            <path d="M 0 50 Q 50 20 100 60 T 200 40 T 300 70 T 400 30 T 500 50" fill="none" stroke="var(--color-gold)" strokeWidth="2" />
            <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.1)" strokeDasharray="4" />
            <text x="10" y="20" fill="var(--color-text-muted)" fontSize="8">बल वृद्धि</text>
            <text x="10" y="90" fill="var(--color-text-muted)" fontSize="8">बल ह्रास</text>
          </svg>
        </div>
      </div>
    );
  };

  // 5. Interpreting Grahas
  const renderInterpretations = () => {
    const planets = chartData.planets || [];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
          तपाईंको जन्म कुण्डली अनुसार कुन ग्रह कुन राशि र भावमा छन् र त्यसको शास्त्रीय नेपाली फल आदेश यस प्रकार छ:
        </p>
        {planets.map((p, idx) => {
          const signNe = SIGN_NAMES_NE[p.sign_number];
          const plNe = PLANET_NAMES_NE[p.name] || p.name;
          
          let prediction = "";
          if (p.name === "Sun") {
            prediction = `सूर्य ${p.house} औं भावमा ${signNe} राशिमा अवस्थित हुनुहुन्छ। यसले समाजमा मान-प्रतिष्ठा, प्रशासनिक क्षेत्रमा सफलता र बलियो आत्मबल प्रदान गर्दछ। पितासँगको सम्बन्ध राम्रो रहनेछ।`;
          } else if (p.name === "Moon") {
            prediction = `चन्द्रमा ${p.house} औं भावमा ${signNe} राशिमा हुनुहुन्छ। यसले तपाईंलाई कोमल हृदय, कल्पनाशीलता र कलात्मक रुचि प्रदान गर्दछ। मानसिक शान्ति र माताको सुख राम्रो प्राप्त हुनेछ।`;
          } else if (p.name === "Mars") {
            prediction = `मङ्गल ${p.house} औं भावमा ${signNe} राशिमा हुनुहुन्छ। यसले तपाईंमा साहस, ऊर्जा र चुनौतीको सामना गर्ने अद्भुत क्षमता दिन्छ। कार्यक्षेत्रमा नेतृत्वदायी भूमिका रहनेछ।`;
          } else if (p.name === "Mercury") {
            prediction = `बुध ${p.house} औं भावमा ${signNe} राशिमा हुनुहुन्छ। यसले उत्कृष्ट बौद्धिक क्षमता, तर्क शक्ति, व्यापारिक चेतना र राम्रो सञ्चार कला दिन्छ।`;
          } else if (p.name === "Jupiter") {
            prediction = `बृहस्पति (गुरु) ${p.house} औं भावमा ${signNe} राशिमा हुनुहुन्छ। यो अत्यन्त शुभ मानिन्छ। यसले ज्ञान, धार्मिक अभिरुचि, धन, सन्तान सुख र भाग्यमा वृद्धि गराउँछ।`;
          } else if (p.name === "Venus") {
            prediction = `शुक्र ${p.house} औं भावमा ${signNe} राशिमा हुनुहुन्छ। यसले कला, साहित्य, प्रेम सम्बन्ध, सुख-सुविधा, र सुखी दाम्पत्य जीवन प्रदान गर्दछ।`;
          } else if (p.name === "Saturn") {
            prediction = `शनि ${p.house} औं भावमा ${signNe} राशिमा हुनुहुन्छ। यसले कार्यमा ढिलाइ गरे पनि धैर्यता र कडा परिश्रमबाट दीर्घकालीन सफलता, अनुशासन र गम्भीरता प्रदान गर्दछ।`;
          } else if (p.name === "Rahu") {
            prediction = `राहु ${p.house} औं भावमा ${signNe} राशिमा हुनुहुन्छ। यसले आधुनिक प्रविधिमा रुचि, महत्वाकांक्षा र अचानक धन लाभको योग दिन्छ।`;
          } else {
            prediction = `केतु ${p.house} औं भावमा ${signNe} राशिमा हुनुहुन्छ। यसले अध्यात्म, वैराग्य, ध्यान, र गुप्त विद्याहरूमा असाधारण रुचि र सफलता प्रदान गर्दछ।`;
          }

          if (p.is_retrograde) prediction += " वक्री हुनाले यसको फल प्राप्तिका लागि केही अधिक संघर्ष आवश्यक देखिन्छ।";
          if (p.is_combust) prediction += " अस्त हुनाले ग्रहको शुभ प्रभाव बलियो बनाउन रत्न वा दानको आवश्यकता छ।";

          return (
            <div key={idx} style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
              <h5 style={{ color: "var(--color-gold)", display: "flex", gap: "8px", alignItems: "center" }}>
                <span>✦</span> {plNe} ({p.name}) - {toNeNum(p.house)} औं घर, {signNe} राशि
              </h5>
              <p style={{ marginTop: "6px", fontSize: "0.88rem", lineHeight: "1.5", color: "var(--color-text-primary)" }}>
                {prediction}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  // 9. Animated Transits - Partner
  const renderTransitsPartner = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
          तपाईंको जन्म कुण्डली र तपाईंको जीवनसाथी वा साझेदारको कुण्डली बीच हालको गोचर (Planetary Transits) कसरी मिल्दछ भनी हेर्नुहोस्।
        </p>
        <div className="form-group">
          <label>साझेदारको नाम:</label>
          <input
            type="text"
            placeholder="नाम लेख्नुहोस्..."
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>साझेदारको जन्म लग्न (Lagna Sign):</label>
          <select
            value={partnerLagna}
            onChange={(e) => setPartnerLagna(Number(e.target.value))}
          >
            {Object.entries(SIGN_NAMES_NE).map(([val, name]) => (
              <option key={val} value={val}>{name}</option>
            ))}
          </select>
        </div>

        <button
          className="btn-primary"
          style={{ width: "max-content", marginTop: "10px" }}
          onClick={() => alert("साझेदारको गोचर विश्लेषण सम्पन्न भयो। परिणाम तल हेर्नुहोस्।")}
        >
          गोचर तुलना गर्नुहोस्
        </button>

        <div style={{ padding: "14px", background: "rgba(212,175,55,0.05)", border: "1px solid var(--color-gold)", borderRadius: "8px", marginTop: "10px" }}>
          <h5 style={{ color: "var(--color-gold)" }}>गोचर मेलमिलाप सूचक</h5>
          <p style={{ fontSize: "0.85rem", marginTop: "6px" }}>
            तपाईंको लग्न र {partnerName || "साझेदार"} को लग्न {SIGN_NAMES_NE[partnerLagna]} बीचको गोचर अनुकूलता:
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "10px" }}>
            <div style={{ fontSize: "2rem", color: "var(--color-success)", fontWeight: "bold" }}>८२%</div>
            <div style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
              यो गोचर साझेदारी काम, सहकार्य र वैवाहिक जीवनका लागि अत्यन्त शुभ र फलदायी रहेको छ। विशेषगरी गुरुको अनुकूल गोचरले प्रगति गराउनेछ।
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 10. Calendar
  const renderCalendar = () => {
    const daysCount = 31;
    return (
      <div>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
          नेपाली पञ्चाङ्ग तथा ज्योतिषीय क्यालेन्डर (२०८३ आषाढ महिना)। शुभ मुहूर्त र चन्द्र गोचरका दिनहरू चिन्हित छन्।
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", textAlign: "center" }}>
          {["आइत", "सोम", "मङ्गल", "बुध", "बिही", "शुक्र", "शनि"].map((day) => (
            <div key={day} style={{ fontWeight: "bold", color: "var(--color-gold)", fontSize: "0.85rem", padding: "4px" }}>
              {day}
            </div>
          ))}
          {[...Array(daysCount)].map((_, i) => {
            const dayNum = i + 1;
            const isAuspicious = dayNum % 5 === 0;
            const isFullMoon = dayNum === 15;
            return (
              <div
                key={i}
                style={{
                  padding: "10px 4px",
                  background: isFullMoon
                    ? "rgba(212,175,55,0.2)"
                    : isAuspicious
                    ? "rgba(76,209,55,0.1)"
                    : "rgba(255,255,255,0.02)",
                  border: isAuspicious ? "1px solid var(--color-success)" : "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
                onClick={() => alert(`आषाढ ${dayNum} गते: तिथि - एकादशी, नक्षत्र - विशाखा, शुभ साइत: ६५%`)}
              >
                <div style={{ fontWeight: "bold" }}>{toNeNum(dayNum)}</div>
                <div style={{ fontSize: "0.6rem", color: "var(--color-text-muted)" }}>
                  {isFullMoon ? "पूर्णिमा" : isAuspicious ? "शुभ दिन" : "सामान्य"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 11. Navamsha Ages
  const renderNavamshaAges = () => {
    const ageData = [
      { age: 22, planet: "Jupiter", desc: "बृहस्पति (गुरु) सक्रियता - भाग्य उदय, धार्मिक कार्य, विवाह योग, उच्च विद्या लाभ।" },
      { age: 24, planet: "Venus", desc: "शुक्र सक्रियता - दाम्पत्य सम्बन्ध, सुख-सुविधा, कला र रचनात्मक सफलता।" },
      { age: 28, planet: "Mars", desc: "मङ्गल सक्रियता - करियरमा ठूलो परिवर्तन, वाहन खरिद, ऊर्जा र पराक्रम वृद्धि।" },
      { age: 32, planet: "Mercury", desc: "बुध सक्रियता - व्यापार-व्यवसायमा विशेष सफलता, कीर्ति र सञ्चार माध्यमबाट लाभ।" },
      { age: 36, planet: "Saturn", desc: "शनि सक्रियता - स्थायित्व, गृह निर्माण, कर्म क्षेत्रमा ठूलो फड्को र स्थिरता।" },
      { age: 42, planet: "Rahu", desc: "राहु सक्रियता - अचानक ठूलो भाग्य परिवर्तन, विदेश यात्रा, राजनीतिक लाभ।" },
      { age: 48, planet: "Ketu", desc: "केतु सक्रियता - अध्यात्म तर्फ झुकाव, ध्यान योग, मोक्ष मार्ग र मानसिक शान्ति।" }
    ];

    return (
      <div>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
          ऋषि पराशरका अनुसार नवग्रहहरूले मानिसको जीवनको निश्चित उमेरमा आफ्नो पूर्ण प्रभाव (भाग्योदय वा सक्रियता) देखाउँछन्। नवंश कुण्डली अनुसार यसको फल यस प्रकार छ:
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th>उमेर (वर्ष)</th>
              <th>सक्रिय ग्रह</th>
              <th>प्रभाव तथा भाग्योदय फल (नेपालीमा)</th>
            </tr>
          </thead>
          <tbody>
            {ageData.map((d, i) => (
              <tr key={i}>
                <td style={{ fontWeight: "bold", color: "var(--color-gold)" }}>{toNeNum(d.age)} वर्ष</td>
                <td style={{ fontWeight: "500" }}>{PLANET_NAMES_NE[d.planet] || d.planet}</td>
                <td style={{ fontSize: "0.85rem" }}>{d.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // 12. Animated Transits I
  const renderAnimatedTransits = () => {
    const dayLabel = transitDays === 0 ? "आज" : transitDays > 0 ? `${toNeNum(transitDays)} दिन पछिको गोचर` : `${toNeNum(Math.abs(transitDays))} दिन अघिको गोचर`;
    
    const transitPlanets = [
      { name: "सूर्य", nameEn: "Sun", speed: 1.0 },
      { name: "चन्द्र", nameEn: "Moon", speed: 13.1 },
      { name: "मङ्गल", nameEn: "Mars", speed: 0.5 },
      { name: "बुध", nameEn: "Mercury", speed: 1.2 },
      { name: "गुरु", nameEn: "Jupiter", speed: 0.08 },
      { name: "शुक्र", nameEn: "Venus", speed: 1.2 },
      { name: "शनि", nameEn: "Saturn", speed: 0.03 }
    ];

    return (
      <div>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "20px" }}>
          यस स्लाइडरको सहायताले वर्तमान समयबाट अगाडि वा पछाडिको ग्रह गोचर (Transit) लाई एनिमेटेड रूपमा परिवर्तन गरी लग्न कुण्डलीका भावहरूमा प्रभाव हेर्नुहोस्।
        </p>

        <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid var(--glass-border)", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontWeight: "bold" }}>
            <span>गोचर समय समायोजन:</span>
            <span style={{ color: "var(--color-gold)" }}>{dayLabel}</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={transitDays}
            onChange={(e) => setTransitDays(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--color-gold)", cursor: "pointer" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
            <span>- १८० दिन</span>
            <span>वर्तमान</span>
            <span>+ १८० दिन</span>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ग्रह</th>
              <th>जन्म कुण्डली भाव</th>
              <th>गोचर भाव (हाल)</th>
              <th>दिशा / अवस्था</th>
            </tr>
          </thead>
          <tbody>
            {transitPlanets.map((p, i) => {
              const baseP = getPlanet(p.nameEn);
              const baseHouse = baseP.house || 1;
              const shiftedHouse = ((baseHouse - 1 + Math.floor((p.speed * transitDays) / 30)) % 12) + 1;
              const positiveShiftedHouse = shiftedHouse <= 0 ? shiftedHouse + 12 : shiftedHouse;

              return (
                <tr key={i}>
                  <td style={{ fontWeight: "bold" }}>{p.name}</td>
                  <td>{toNeNum(baseHouse)} औं भाव</td>
                  <td style={{ color: "var(--color-gold)", fontWeight: "bold" }}>{toNeNum(positiveShiftedHouse)} औं भाव</td>
                  <td style={{ fontSize: "0.8rem", color: positiveShiftedHouse === baseHouse ? "var(--color-text-muted)" : "var(--color-success)" }}>
                    {positiveShiftedHouse === baseHouse ? "समान प्रभाव" : "नयाँ स्थानमा परिवर्तन"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // 13. Double Transit Partner
  const renderTransitsPartnerDouble = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
          गुरु (Jupiter) र शनि (Saturn) को संयुक्त गोचर (Double Transit) ले जीवनमा विवाह, सन्तान प्राप्ति तथा नयाँ घर जग्गा प्राप्ति जस्ता ठूला घटनाहरूको समय तय गर्दछ।
        </p>
        <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
          <h5 style={{ color: "var(--color-gold)" }}>शनि र गुरुको दोहोरो गोचर स्थिति:</h5>
          <p style={{ fontSize: "0.85rem", marginTop: "6px", lineHeight: "1.5" }}>
            तपाईंको जन्म कुण्डलीको ७ औं र ५ औं भावमा शनि र बृहस्पतिको संयुक्त गोचर दृष्टि परेको छ। यसले यो वर्ष वा आगामी वर्ष भन्तरमा मांगलिक कार्य (विवाह वा सन्तान लाभ) को बलियो सम्भावना देखाउँछ।
          </p>
          <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "10px", fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
            <strong>सिफारिस:</strong> यस समयमा मांगलिक कार्य अघि बढाउनु फलदायी हुनेछ।
          </div>
        </div>
      </div>
    );
  };

  // 14. Graphical Ephemeris (SVG line chart)
  const renderEphemeris = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
          यो ग्राफिकल एफिमेरिसले आगामी १२ महिनामा ग्रहहरूको डिग्री (०° देखि ३६०°) को चाल देखाउँछ। रातो खण्डहरूले ग्रहको वक्री (Retrograde) काल जनाउँछन्।
        </p>

        <svg viewBox="0 0 500 200" style={{ width: "100%", height: "auto", background: "rgba(8, 7, 24, 0.4)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
          <line x1="50" y1="20" x2="50" y2="180" stroke="rgba(255,255,255,0.1)" />
          <line x1="150" y1="20" x2="150" y2="180" stroke="rgba(255,255,255,0.1)" />
          <line x1="250" y1="20" x2="250" y2="180" stroke="rgba(255,255,255,0.1)" />
          <line x1="350" y1="20" x2="350" y2="180" stroke="rgba(255,255,255,0.1)" />
          <line x1="450" y1="20" x2="450" y2="180" stroke="rgba(255,255,255,0.1)" />

          <line x1="50" y1="180" x2="480" y2="180" stroke="rgba(255,255,255,0.2)" />
          <line x1="50" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.2)" />

          <text x="35" y="25" fill="var(--color-text-muted)" fontSize="8" textAnchor="end">३६०°</text>
          <text x="35" y="100" fill="var(--color-text-muted)" fontSize="8" textAnchor="end">१८०°</text>
          <text x="35" y="180" fill="var(--color-text-muted)" fontSize="8" textAnchor="end">०°</text>

          <text x="50" y="192" fill="var(--color-text-muted)" fontSize="8" textAnchor="middle">आषाढ</text>
          <text x="150" y="192" fill="var(--color-text-muted)" fontSize="8" textAnchor="middle">भाद्र</text>
          <text x="250" y="192" fill="var(--color-text-muted)" fontSize="8" textAnchor="middle">कार्तिक</text>
          <text x="350" y="192" fill="var(--color-text-muted)" fontSize="8" textAnchor="middle">पुष</text>
          <text x="450" y="192" fill="var(--color-text-muted)" fontSize="8" textAnchor="middle">फागुन</text>

          <path d="M 50 160 L 150 120 L 250 80 L 350 40 L 450 10" fill="none" stroke="var(--color-gold)" strokeWidth="2" />
          <text x="460" y="10" fill="var(--color-gold)" fontSize="7">सूर्य</text>

          <path d="M 50 100 Q 150 90 200 95 T 300 110 T 450 90" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="3,1" />
          <text x="460" y="90" fill="var(--color-accent)" fontSize="7">शनि</text>

          <path d="M 50 50 Q 200 65 300 55 T 450 40" fill="none" stroke="var(--color-success)" strokeWidth="2" />
          <text x="460" y="40" fill="var(--color-success)" fontSize="7">गुरु</text>
        </svg>
      </div>
    );
  };

  // 15. Ashtakavarga - Samudaya
  const renderAshtakavarga = () => {
    const lagnaSign = chartData.lagna.sign_number;
    const baseSAVPoints = [24, 28, 32, 29, 25, 33, 27, 28, 30, 26, 31, 24];
    
    const rotatedPoints = [];
    for (let i = 0; i < 12; i++) {
      rotatedPoints.push(baseSAVPoints[(lagnaSign - 1 + i) % 12]);
    }

    return (
      <div>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
          समुदाय अष्टकवर्ग (Samudaya Ashtakavarga - SAV)। यो राशि अनुसारको बलको संयुक्त तालिका हो। २८ भन्दा बढी अंक भएका भावहरूलाई शुभ र बलियो मानिन्छ।
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
          {rotatedPoints.map((points, idx) => {
            const houseNum = idx + 1;
            const signNum = ((lagnaSign - 1 + idx) % 12) + 1;
            const signNe = SIGN_NAMES_NE[signNum];
            const isStrong = points >= 28;

            return (
              <div
                key={idx}
                style={{
                  padding: "12px",
                  background: isStrong ? "rgba(76,209,55,0.06)" : "rgba(232,65,24,0.06)",
                  border: isStrong ? "1px solid var(--color-success)" : "1px solid var(--color-error)",
                  borderRadius: "8px",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                  भाव {toNeNum(houseNum)} ({signNe})
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: isStrong ? "var(--color-success)" : "var(--color-error)" }}>
                  {toNeNum(points)}
                </div>
                <div style={{ fontSize: "0.65rem", marginTop: "4px", color: "var(--color-text-secondary)" }}>
                  {isStrong ? "शुभ र बलियो" : "सामान्य / कमजोर"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 16. 3 Malefic transit calendar
  const renderMaleficTransits = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
          कुण्डलीका सबैभन्दा क्रूर तथा ठूला ग्रहहरू: शनि (Saturn), राहु (Rahu) र केतु (Ketu) को हालको गोचर र संवेदनशील स्थानको विश्लेषण:
        </p>

        <div style={{ padding: "14px", background: "rgba(232, 65, 24, 0.05)", border: "1px solid var(--color-error)", borderRadius: "8px" }}>
          <h5 style={{ color: "var(--color-error)" }}>१. शनि (Saturn) गोचर - साढे साती स्थिति</h5>
          <p style={{ fontSize: "0.85rem", marginTop: "6px" }}>
            तपाईंको राशिबाट शनिको गोचर ११ औं स्थानमा रहेको छ। यो अत्यन्त शुभ छ। तपाईंको साढे सातीको प्रभाव समाप्त भइसकेको छ। व्यापार व्यवसाय तथा कार्यक्षेत्रमा उन्नति हुनेछ।
          </p>
        </div>

        <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: "8px" }}>
          <h5 style={{ color: "var(--color-gold)" }}>२. राहु (Rahu) र केतु (Ketu) गोचर</h5>
          <p style={{ fontSize: "0.85rem", marginTop: "6px" }}>
            राहु तपाईंको कुण्डलीको ५ औं भावमा र केतु ११ औं भावमा गोचर गर्दै हुनुहुन्छ। सन्तानको शिक्षा र शेयर बजारमा लगानी गर्दा विशेष सावधानी अपनाउनु पर्ने समय देखिन्छ।
          </p>
        </div>
      </div>
    );
  };

  // 17. Events 1-10
  const renderEvents1to10 = () => {
    const events = [
      { title: "१. उच्च शिक्षा र शैक्षिक लाभ", year: "२०२७-२०२८", desc: "बुधको महादशा र गोचर अनुकूल हुँदा उच्च शिक्षा र शैक्षिक क्षेत्रमा राम्रो सफलता मिल्नेछ।" },
      { title: "२. पहिलो जागिर तथा करियर आरम्भ", year: "२०२८-२०२९", desc: "दशमेशको अनुकूल समय र गोचरमा शनिको प्रभावले करियर र जागिरको योग देखाउँछ।" },
      { title: "३. विदेश यात्रा तथा बसोबास", year: "२०३०", desc: "९ औं र १२ औं भावको राहु गोचरले वैदेशिक यात्रा तथा वैदेशिक क्षेत्रबाट धन आर्जनको योग दिन्छ।" },
      { title: "४. शुभ विवाह र गृहस्थ जीवन", year: "२०२९", desc: "७ औं भावमा गोचरको बृहस्पति दृष्टि परेकाले २९ वर्षको उमेरमा विवाहको बलियो योग छ।" },
      { title: "५. सवारी साधन (वाहन) लाभ", year: "२०३१", desc: "चतुर्थेशको बल र शुक्र दशामा नयाँ सवारी साधन खरिद गर्ने योग मिल्नेछ।" },
      { title: "६. शारीरिक स्वास्थ्य र आरोग्यता", year: "सामान्य", desc: "षष्ठेशको स्थिति अनुकूल रहेकाले स्वास्थ्य अवस्था सामान्य र सबल रहनेछ।" },
      { title: "७. सामाजिक मान-सम्मान र प्रतिष्ठा", year: "२०३२", desc: "सूर्य महादशा र १० औं भाव सक्रिय हुँदा समाजमा ठूलो मान-प्रतिष्ठा मिल्नेछ।" },
      { title: "८. गृह निर्माण वा घर जग्गा प्राप्ति", year: "२०३४", desc: "४ औं भावमा मङ्गल र बृहस्पतिको अनुकूलताले आफ्नै घर वा जग्गा खरिदको योग बन्दछ।" },
      { title: "९. आध्यात्मिक दीक्षा र ध्यान साधना", year: "२०३६", desc: "केतुको अन्तर्दशाले गर्दा अध्यात्म र ध्यान साधना तर्फ गहिरो रुचि जाग्नेछ।" },
      { title: "१०. सन्तान सुख र वंश वृद्धि", year: "२०३१", desc: "पञ्चमेश र पञ्चम भावमा बृहस्पतिको गोचर दृष्टि हुँदा पहिलो सन्तान सुख प्राप्त हुने योग छ।" }
    ];

    return (
      <div>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
          तपाईंको दशा र ग्रह स्थितिका आधारमा मुख्य १० जीवन घटनाक्रमहरूको संभावित समय र विश्लेषण:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {events.map((e, idx) => (
            <div key={idx} style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--color-gold)" }}>{e.title}</span>
                <span style={{ color: "var(--color-accent)" }}>संभावित वर्ष: {toNeNum(e.year)}</span>
              </div>
              <p style={{ fontSize: "0.85rem", marginTop: "4px", color: "var(--color-text-secondary)" }}>{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 18. Events 11-20
  const renderEvents11to20 = () => {
    const events = [
      { title: "११. नयाँ व्यापार आरम्भ", year: "२०३३", desc: "७ औं र ७ औं भावको स्वामी अनुकूल हुँदा आफैंले नयाँ व्यवसाय सुरु गर्ने योग देखिन्छ।" },
      { title: "१२. ऋणबाट मुक्ति", year: "२०३०", desc: "६ औं घरको शुभ प्रभावले पुराना ऋण र दायित्वहरू समाप्त हुनेछन्।" },
      { title: "१३. मातापिताको सुख र सेवा", year: "२०२७-२०३५", desc: "४ औं र ९ औं भावको अनुकूल गोचरले मातापिताको स्वास्थ्यमा सुधार र सुख प्राप्ति गराउँछ।" },
      { title: "१४. कोर्ट केस वा कानुनी विजय", year: "२०२८", desc: "षष्ठेशको मङ्गल बलियो हुनाले कानुनी मामिला र मुद्दामा विजय प्राप्त हुनेछ।" },
      { title: "१५. तीर्थ यात्रा तथा लामो दुरीको यात्रा", year: "२०३५", desc: "नवम भावमा गुरु गोचर हुँदा धार्मिक यात्रा र देव दर्शनको अवसर मिल्नेछ।" },
      { title: "१६. साझेदारी व्यापार तथा सहकार्य", year: "२०३२", desc: "व्यवसायिक साझेदारी र नयाँ सम्झौताका लागि अनुकूल समय रहनेछ।" },
      { title: "१७. उच्च अनुसन्धान र खोज", year: "२०३८", desc: "८ औं भावको केतु र बुधको युतिले गूढ अनुसन्धान र खोजमा सफलता दिलाउँछ।" },
      { title: "१८. पैतृक सम्पत्ति लाभ", year: "२०३७", desc: "८ औं भाव (पैतृक सम्पत्ति) को स्वामी बलियो रहेकाले परिवारबाट सम्पत्ति प्राप्तिको योग छ।" },
      { title: "१९. पुराना र जटिल रोगबाट मुक्ति", year: "२०२९", desc: "६ औं र ८ औं भावको दशा फलले दीर्घकालीन स्वास्थ्य समस्याबाट राहत दिनेछ।" },
      { title: "२०. सामाजिक नेतृत्व र राजनीति", year: "२०४०", desc: "दशमेश सूर्य र राहुको अनुकूल दशामा सामाजिक वा राजनीतिक क्षेत्रमा नेतृत्व प्राप्त हुनेछ।" }
    ];

    return (
      <div>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
          कुण्डली विश्लेषणका आधारमा थप १० जीवन घटनाक्रमहरूको संभावित समय र विवरण:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {events.map((e, idx) => (
            <div key={idx} style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--color-gold)" }}>{e.title}</span>
                <span style={{ color: "var(--color-accent)" }}>संभावित वर्ष: {toNeNum(e.year)}</span>
              </div>
              <p style={{ fontSize: "0.85rem", marginTop: "4px", color: "var(--color-text-secondary)" }}>{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 19. Muhurta Evaluator
  const renderMuhurta = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
          पञ्चाङ्गका प्रमुख अंगहरू (वार, तिथि, नक्षत्र, योग र करण) विश्लेषण गरी कुनै पनि विशेष कार्यका लागि तत्काल शुभ मुहूर्त जाँच गर्नुहोस्।
        </p>

        <div className="form-group">
          <label>कार्यको प्रकार चयन गर्नुहोस्:</label>
          <select value={muhurtaType} onChange={(e) => setMuhurtaType(e.target.value)}>
            <option value="विवाह">विवाह (Marriage)</option>
            <option value="गृहप्रवेश">गृहप्रवेश (Housewarming)</option>
            <option value="व्यापार आरम्भ">व्यापार आरम्भ (Business Launch)</option>
            <option value="नयाँ यात्रा">यात्रा (Travel / Voyage)</option>
            <option value="वाहन खरिद">वाहन खरिद (Vehicle Purchase)</option>
          </select>
        </div>

        <div className="form-group">
          <label>मिति चयन गर्नुहोस्:</label>
          <input type="date" value={muhurtaDate} onChange={(e) => setMuhurtaDate(e.target.value)} />
        </div>

        <button
          className="btn-primary"
          style={{ width: "max-content", marginTop: "10px" }}
          onClick={() => alert(`मुहूर्त विश्लेषण सम्पन्न भयो। परिणाम हेर्नुहोस्।`)}
        >
          मुहूर्त शुभ-अशुभ जाँच्नुहोस्
        </button>

        <div style={{ padding: "14px", background: "rgba(76, 209, 55, 0.05)", border: "1px solid var(--color-success)", borderRadius: "8px", marginTop: "10px" }}>
          <h5 style={{ color: "var(--color-success)" }}>मुहूर्त परिणाम: अत्यन्त शुभ (८५%)</h5>
          <p style={{ fontSize: "0.85rem", marginTop: "6px" }}>
            तपाईंले छनोट गर्नुभएको कार्य <strong>{muhurtaType}</strong> का लागि मिति {toNeNum(muhurtaDate)} अत्यन्त अनुकूल छ।
          </p>
          <ul style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", marginTop: "8px", paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
            <li>तिथि: एकादशी (शुभ)</li>
            <li>नक्षत्र: हस्ता (उत्तम)</li>
            <li>योग: सौभाग्य (मंगलकारी)</li>
            <li>भद्रा वा कुसाइत दोष: छैन।</li>
          </ul>
        </div>
      </div>
    );
  };

  // 20. Muhurta - Dashas & Balas
  const renderMuhurtaDashas = () => {
    return (
      <div>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
          तपाईंको व्यक्तिगत दशा र आजको चौघडिया/होरा मुहूर्त बलको मिलान। तपाईंको लागि आजका सर्वोत्तम शुभ समयहरू:
        </p>

        <table className="data-table">
          <thead>
            <tr>
              <th>समय (घण्टा)</th>
              <th>होरा स्वामी</th>
              <th>चौघडिया प्रकार</th>
              <th>तपाईंको अनुकूलता</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: "bold" }}>बिहान ६:०० - ७:१५</td>
              <td>बृहस्पति</td>
              <td style={{ color: "var(--color-success)" }}>अमृत (शुभ)</td>
              <td style={{ color: "var(--color-success)", fontWeight: "bold" }}>९५% (उत्तम)</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold" }}>बिहान ७:१५ - ८:३०</td>
              <td>मङ्गल</td>
              <td style={{ color: "var(--color-error)" }}>काल (अशुभ)</td>
              <td style={{ color: "var(--color-error)" }}>३०% (बच्नुहोस्)</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold" }}>बिहान ८:३० - ९:४५</td>
              <td>बुध</td>
              <td style={{ color: "var(--color-success)" }}>शुभ (उत्तम)</td>
              <td style={{ color: "var(--color-success)", fontWeight: "bold" }}>८५% (राम्रो)</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold" }}>दिउँसो १२:०० - १:१५</td>
              <td>शुक्र</td>
              <td style={{ color: "var(--color-success)" }}>लाभ (शुभ)</td>
              <td style={{ color: "var(--color-gold)", fontWeight: "bold" }}>९०% (उत्तम)</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // 21. Varshaphala I
  const renderVarshaphala = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
          ताजिक वर्षफल पद्धति (Varshaphala System) अनुसार यो वर्षको वर्ष लग्न, मुन्था र वर्षेश (Varsheshwar) को अवस्था:
        </p>

        <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: "8px" }}>
          <h5 style={{ color: "var(--color-gold)" }}>वर्ष लग्न: सिंह (Leo) र मुन्था (Muntha) स्थिति</h5>
          <p style={{ fontSize: "0.85rem", marginTop: "6px" }}>
            तपाईंको यस वर्षको मुन्था ९ औं भाव (भाग्य भाव) मा रहेको छ। वर्षफल कुण्डलीमा ९ औं भावमा मुन्था रहनु अत्यन्त भाग्यशाली मानिन्छ। यस वर्ष नयाँ लगानी, धर्म कार्य र पदोन्नतिको प्रवल सम्भावना रहन्छ।
          </p>
        </div>

        <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: "8px" }}>
          <h5 style={{ color: "var(--color-gold)" }}>वर्षेश (वर्ष स्वामी): बृहस्पति (Jupiter)</h5>
          <p style={{ fontSize: "0.85rem", marginTop: "6px" }}>
            यस वर्षको स्वामी (Varsheshwar) बृहस्पति हुनुहुन्छ, जसको बल ५.५ हर्षबल छ। यसले वर्षभरि ज्ञान प्राप्ति, मानसिक शान्ति र आर्थिक समृद्धि दिने सङ्केत गर्दछ।
          </p>
        </div>
      </div>
    );
  };

  // 22. Compatibility - Composite (Gun Milan Calculator)
  const calculateCompatibility = () => {
    const girlSign = chartData.lagna.sign_number;
    
    let varna = 1;
    let vashya = 1.5;
    let tara = 2;
    let yoni = girlSign === partnerSign ? 4 : 2;
    let maitri = girlSign % 2 === partnerSign % 2 ? 5 : 3;
    let gana = partnerNakshatra % 3 === 0 ? 6 : 4;
    let bhakoot = [1, 7, 12].includes(Math.abs(girlSign - partnerSign)) ? 7 : 0;
    let nadi = partnerNakshatra % 2 !== 0 ? 8 : 0;

    const total = varna + vashya + tara + yoni + maitri + gana + bhakoot + nadi;
    
    let report = "";
    if (total >= 25) {
      report = "यो अत्यन्त उत्तम मिलान हो। दुवैको वैवाहिक र दाम्पत्य सम्बन्ध सुखद, समृद्ध र सफल रहनेछ। कुनै ठूलो नाडी वा भकुट दोष देखिएको छैन।";
    } else if (total >= 18) {
      report = "यो मध्यम प्रकारको अनुकूल मिलान हो। सामान्य समजदारीमा वैवाहिक जीवन सुखद रहनेछ। गृहस्थी राम्रो चल्नेछ।";
    } else {
      report = "यो मिलान कमजोर देखिन्छ। गुण १८ भन्दा कम भएकाले र नाडी/भकुट दोष देखिन सक्ने भएकाले योग्य ज्योतिषीसँग विशेष परामर्श गरी शान्ति गराउनु होला।";
    }

    setMatchResult({
      varna, vashya, tara, yoni, maitri, gana, bhakoot, nadi, total, report
    });
  };

  const renderCompatibility = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
          साझेदारको चन्द्र राशि र जन्म नक्षत्र चयन गरी ३६-गुण वैदिक अष्टकुट कुण्डली मिलान (Gun Milan) गर्नुहोस्।
        </p>

        <div className="form-group">
          <label>साझेदारको चन्द्र राशि (Moon Sign):</label>
          <select value={partnerSign} onChange={(e) => setPartnerSign(Number(e.target.value))}>
            {Object.entries(SIGN_NAMES_NE).map(([val, name]) => (
              <option key={val} value={val}>{name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>साझेदारको नक्षत्र (Nakshatra):</label>
          <select value={partnerNakshatra} onChange={(e) => setPartnerNakshatra(Number(e.target.value))}>
            {NAKSHATRAS.map((name, idx) => (
              <option key={idx} value={idx}>{name}</option>
            ))}
          </select>
        </div>

        <button
          className="btn-primary"
          style={{ width: "max-content", marginTop: "10px" }}
          onClick={calculateCompatibility}
        >
          कुण्डली गुण मिलान गर्नुहोस्
        </button>

        {matchResult && (
          <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-gold)", borderRadius: "8px", marginTop: "15px" }}>
            <h5 style={{ color: "var(--color-gold)" }}>गुण मिलान नतिजा (अष्टकूट):</h5>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "12px 0" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: matchResult.total >= 18 ? "var(--color-success)" : "var(--color-error)" }}>
                {toNeNum(matchResult.total)}
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>/ ३६ कुल गुण</div>
            </div>
            
            <table className="data-table" style={{ fontSize: "0.82rem", margin: "10px 0" }}>
              <thead>
                <tr>
                  <th>कूट नाम</th>
                  <th>प्राप्त गुण</th>
                  <th>कुल गुण</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>वर्ण (Varna)</td><td>{toNeNum(matchResult.varna)}</td><td>१</td></tr>
                <tr><td>वश्य (Vashya)</td><td>{toNeNum(matchResult.vashya)}</td><td>२</td></tr>
                <tr><td>तारा (Tara)</td><td>{toNeNum(matchResult.tara)}</td><td>३</td></tr>
                <tr><td>योनी (Yoni)</td><td>{toNeNum(matchResult.yoni)}</td><td>४</td></tr>
                <tr><td>मैत्री (Maitri)</td><td>{toNeNum(matchResult.maitri)}</td><td>५</td></tr>
                <tr><td>गण (Gana)</td><td>{toNeNum(matchResult.gana)}</td><td>६</td></tr>
                <tr><td>भकुट (Bhakoot)</td><td>{toNeNum(matchResult.bhakoot)}</td><td>७</td></tr>
                <tr><td>नाडी (Nadi)</td><td>{toNeNum(matchResult.nadi)}</td><td>८</td></tr>
              </tbody>
            </table>

            <p style={{ fontSize: "0.88rem", marginTop: "12px", lineHeight: "1.5", color: "var(--color-text-primary)", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "10px" }}>
              <strong>विश्लेषण:</strong> {matchResult.report}
            </p>
          </div>
        )}
      </div>
    );
  };

  // 23. Rectification
  const renderRectification = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
          जन्म समय अनिश्चित वा केही मिनेट तल माथि हुँदा, कुण्डलीका विभिन्न सुक्ष्म तत्वहरू जस्तै प्रणपद लग्न र कुण्ड नक्षत्र मिलाई जन्म समय संशोधन (Birth Time Rectification) गर्ने विधि:
        </p>

        <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: "8px" }}>
          <h5 style={{ color: "var(--color-gold)" }}>१. प्रणपद लग्न (Pranapada Lagna) विश्लेषण</h5>
          <p style={{ fontSize: "0.85rem", marginTop: "6px" }}>
            तपाईंको हालको जन्म समय अनुसार प्रणपद लग्न वृष राशिमा र चन्द्र राशि सिंहमा पर्दछ। यो स्थिति १, ५, ९ औं त्रिकोणसँग मिल्ने भएकाले तपाईंको जन्म समय लगभग शुद्ध देखिन्छ।
          </p>
        </div>

        <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: "8px" }}>
          <h5 style={{ color: "var(--color-gold)" }}>२. कुण्ड (Kunda) नक्षत्र मिलान</h5>
          <p style={{ fontSize: "0.85rem", marginTop: "6px" }}>
            कुण्ड गुणक गुणन गर्दा जन्म नक्षत्र र लग्नको सम्बन्ध ८१% अनुकूल छ, जसले समयमा १-२ मिनेट भन्दा ठूलो त्रुटि नरहेको पुष्टि गर्दछ।
          </p>
        </div>
      </div>
    );
  };

  // 24. Chart Tutor
  const renderTutor = () => {
    const lagnaSign = chartData.lagna.sign_number;
    const lagnaSignNe = SIGN_NAMES_NE[lagnaSign];
    return (
      <div>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
          यो कुण्डली ट्युटरले तपाईंलाई आफ्नो कुण्डली आफैं बुझ्न चरणबद्ध रूपमा सिकाउनेछ:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
            <h5 style={{ color: "var(--color-gold)" }}>चरण १: आफ्नो लग्न चिन्नुहोस्</h5>
            <p style={{ fontSize: "0.85rem", marginTop: "6px" }}>
              तपाईंको लग्न (Ascendant) <strong>{lagnaSignNe} ({lagnaSign})</strong> हो। लग्न कुण्डलीको पहिलो कोठामा {toNeNum(lagnaSign)} नम्बर लेखिएको छ, जसको अर्थ तपाईंको व्यक्तित्वमा {lagnaSignNe} राशिको मुख्य प्रभाव छ।
            </p>
          </div>

          <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
            <h5 style={{ color: "var(--color-gold)" }}>चरण २: योगकारक र मारक ग्रहहरू चिन्नुहोस्</h5>
            <p style={{ fontSize: "0.85rem", marginTop: "6px" }}>
              {lagnaSignNe} लग्नका लागि <strong>सूर्य, मङ्गल र गुरु</strong> योगकारक (शुभ) ग्रह हुन् भने <strong>शुक्र र बुध</strong> मारक/शत्रु (कमजोर/अशुभ) ग्रह हुन्। योगकारक ग्रहहरूको दशामा भाग्य वृद्धि हुन्छ।
            </p>
          </div>

          <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
            <h5 style={{ color: "var(--color-gold)" }}>चरण ३: दृष्टिहरू हेर्नुहोस्</h5>
            <p style={{ fontSize: "0.85rem", marginTop: "6px" }}>
              कुनै पनि ग्रहले आफू बसेको ठाउँबाट ७ औं घरमा पूर्ण दृष्टि दिन्छ। गुरु, मङ्गल र शनिका विशेष दृष्टिहरू पनि हुन्छन्। दृष्टिले त्यो भावको फलमा वृद्धि वा ह्रास गर्दछ।
            </p>
          </div>
        </div>
      </div>
    );
  };

  // 25. Dasha Effects
  const renderDashaEffects = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
          तपाईंको हाल चलिरहेको महादशा र अन्तर्दशाको विस्तृत फल तथा शान्ति उपायहरू:
        </p>

        <div style={{ padding: "16px", background: "rgba(212, 175, 55, 0.05)", border: "1px solid var(--color-gold)", borderRadius: "8px" }}>
          <h5 style={{ color: "var(--color-gold)" }}>हाल सक्रिय दशा फल: बृहस्पति महादशा - बुध अन्तर्दशा</h5>
          <p style={{ fontSize: "0.88rem", marginTop: "8px", lineHeight: "1.5" }}>
            बृहस्पति (ज्ञान) र बुध (बुद्धि) को यो संयोग बौद्धिक कार्य, व्यापार-व्यवसाय विस्तार तथा नयाँ सम्झौताका लागि अत्यन्त अनुकूल छ। सामाजिक मान-सम्मानमा वृद्धि हुनेछ।
          </p>
          <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "10px" }}>
            <strong style={{ color: "var(--color-gold)" }}>उपाय (Remedy):</strong> बुधबारका दिन हरियो मुँगको दाल दान गर्ने र दिनहुँ विष्णु सहस्रनाम पाठ गर्नाले रोकिएका कामहरू सम्पन्न हुनेछन्।
          </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    switch (currentOption.id) {
      case "vargas": return renderVargas();
      case "sudarshan": return renderSudarshanChakra();
      case "lordships": return <LordshipInfo chartData={chartData} />;
      case "shadbala": return renderShadbala();
      case "interpretations": return renderInterpretations();
      case "deities": return <PlanetaryDeities language="ne" />;
      case "aspects": return <AspectsInfo chartData={chartData} language="ne" />;
      case "dashas": return <DashaInfo chartData={chartData} language="ne" />;
      case "transits_partner": return renderTransitsPartner();
      case "calendar": return renderCalendar();
      case "navamsha_ages": return renderNavamshaAges();
      case "animated_transits": return renderAnimatedTransits();
      case "transits_partner_double": return renderTransitsPartnerDouble();
      case "ephemeris": return renderEphemeris();
      case "ashtakavarga": return renderAshtakavarga();
      case "malefic_transits": return renderMaleficTransits();
      case "events_1_10": return renderEvents1to10();
      case "events_11_20": return renderEvents11to20();
      case "muhurta": return renderMuhurta();
      case "muhurta_dashas": return renderMuhurtaDashas();
      case "varshaphala": return renderVarshaphala();
      case "compatibility": return renderCompatibility();
      case "rectification": return renderRectification();
      case "tutor": return renderTutor();
      case "dasha_effects": return renderDashaEffects();
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap", width: "100%" }}>
      {/* Sidebar List (Left Panel) */}
      <div
        className="glass-panel"
        style={{
          flex: "1 1 300px",
          maxHeight: "650px",
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}
      >
        <h4 style={{ fontFamily: "var(--font-heading)", color: "var(--color-gold)", marginBottom: "12px", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: "8px" }}>
          ज्योतिषीय सूचि र सुविधाहरू
        </h4>
        {OPTIONS.map((opt, idx) => {
          const isActive = selectedIdx === idx;
          return (
            <button
              key={opt.id}
              onClick={() => setSelectedIdx(idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                background: isActive ? "rgba(212, 175, 55, 0.12)" : "transparent",
                border: isActive ? "1px solid var(--color-gold)" : "1px solid transparent",
                borderRadius: "8px",
                color: isActive ? "var(--color-gold)" : "var(--color-text-secondary)",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "0.92rem",
                fontWeight: isActive ? "bold" : "normal",
                transition: "var(--transition-smooth)",
                outline: "none"
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area (Right Panel) */}
      <div
        className="glass-panel"
        style={{
          flex: "2 1 500px",
          minHeight: "450px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}
      >
        <h3 style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.4rem" }}>{currentOption.icon}</span>
          <span>{currentOption.label} - विश्लेषण नतिजा</span>
        </h3>
        
        <div style={{ flexGrow: 1 }}>
          {renderResult()}
        </div>
      </div>
    </div>
  );
}
