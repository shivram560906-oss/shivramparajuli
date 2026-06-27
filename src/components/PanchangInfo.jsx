import React from "react";

export default function PanchangInfo({ chartData, language }) {
  if (!chartData || !chartData.panchang) return null;

  const { panchang } = chartData;

  return (
    <div className="glass-panel" style={{ width: "100%" }}>
      <h3>{language === "ne" ? "पञ्चाङ्ग विवरण" : "Panchang Details"}</h3>
      
      <div className="panchang-grid">
        {/* Vara Card */}
        <div className="panchang-card">
          <div className="panchang-label">{language === "ne" ? "वार (Day)" : "Vara (Day)"}</div>
          <div className="panchang-value">
            {language === "ne" ? panchang.vara.nepali : panchang.vara.name}
          </div>
          <div className="panchang-sub">
            {language === "ne" ? "सप्ताहको दिन" : "Day of the week"}
          </div>
        </div>

        {/* Tithi Card */}
        <div className="panchang-card">
          <div className="panchang-label">{language === "ne" ? "तिथि (Lunar Day)" : "Tithi (Lunar Day)"}</div>
          <div className="panchang-value">
            {language === "ne" ? panchang.tithi.nepali : panchang.tithi.name}
          </div>
          <div className="panchang-sub" style={{ color: "var(--color-gold)", fontWeight: "500" }}>
            {language === "ne" ? panchang.tithi.paksha_nepali : panchang.tithi.paksha}
          </div>
          {/* Progress bar */}
          <div style={{ background: "rgba(255,255,255,0.08)", height: "4px", borderRadius: "2px", marginTop: "8px", overflow: "hidden" }}>
            <div style={{ background: "var(--color-gold)", width: `${panchang.tithi.progress}%`, height: "100%" }}></div>
          </div>
        </div>

        {/* Nakshatra Card */}
        <div className="panchang-card">
          <div className="panchang-label">{language === "ne" ? "नक्षत्र (Constellation)" : "Nakshatra (Constellation)"}</div>
          <div className="panchang-value">
            {language === "ne" ? panchang.nakshatra.nepali : panchang.nakshatra.name}
          </div>
          <div className="panchang-sub">
            {language === "ne" ? `चरण: ${panchang.nakshatra.pada}` : `Pada (Quarter): ${panchang.nakshatra.pada}`}
          </div>
          {/* Progress bar */}
          <div style={{ background: "rgba(255,255,255,0.08)", height: "4px", borderRadius: "2px", marginTop: "8px", overflow: "hidden" }}>
            <div style={{ background: "var(--color-accent)", width: `${panchang.nakshatra.progress}%`, height: "100%" }}></div>
          </div>
        </div>

        {/* Yoga Card */}
        <div className="panchang-card">
          <div className="panchang-label">{language === "ne" ? "योग (Luni-Solar)" : "Yoga (Luni-Solar)"}</div>
          <div className="panchang-value">
            {language === "ne" ? panchang.yoga.nepali : panchang.yoga.name}
          </div>
          <div className="panchang-sub">
            {language === "ne" ? `योग नं: ${panchang.yoga.index}` : `Yoga No: ${panchang.yoga.index}`}
          </div>
          {/* Progress bar */}
          <div style={{ background: "rgba(255,255,255,0.08)", height: "4px", borderRadius: "2px", marginTop: "8px", overflow: "hidden" }}>
            <div style={{ background: "var(--color-success)", width: `${panchang.yoga.progress}%`, height: "100%" }}></div>
          </div>
        </div>

        {/* Karana Card */}
        <div className="panchang-card">
          <div className="panchang-label">{language === "ne" ? "करण (Half-Tithi)" : "Karana (Half-Tithi)"}</div>
          <div className="panchang-value">
            {language === "ne" ? panchang.karana.nepali : panchang.karana.name}
          </div>
          <div className="panchang-sub">
            {language === "ne" ? `करण नं: ${panchang.karana.index}` : `Karana No: ${panchang.karana.index}`}
          </div>
        </div>
      </div>
    </div>
  );
}
