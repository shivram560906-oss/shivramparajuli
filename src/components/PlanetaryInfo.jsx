import React from "react";

const PLANET_NAMES = {
  en: { Sun: "Sun", Moon: "Moon", Mars: "Mars", Mercury: "Mercury", Jupiter: "Jupiter", Venus: "Venus", Saturn: "Saturn", Rahu: "Rahu (North Node)", Ketu: "Ketu (South Node)" },
  ne: { Sun: "सूर्य", Moon: "चन्द्र", Mars: "मङ्गल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" }
};

export default function PlanetaryInfo({ chartData, language }) {
  if (!chartData) return null;

  const { planets, lagna } = chartData;

  const formatDMS = (decimalDegrees) => {
    const deg = Math.floor(decimalDegrees);
    const minFloat = (decimalDegrees - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.round((minFloat - min) * 60);
    return `${deg}° ${min}' ${sec}"`;
  };

  const getPlanetDisplayName = (p) => {
    const baseName = PLANET_NAMES[language][p.name] || p.name;
    let suffix = "";
    if (p.is_retrograde && p.is_combust) {
      suffix += language === "ne" ? " (ब, अ)" : " (R, C)";
    } else if (p.is_retrograde) {
      suffix += language === "ne" ? " (ब)" : " (R)";
    } else if (p.is_combust) {
      suffix += language === "ne" ? " (अ)" : " (C)";
    }

    if (p.exaltation_state === "exalted") {
      suffix += language === "ne" ? " (उच्च)" : " (Exalted)";
    } else if (p.exaltation_state === "debilitated") {
      suffix += language === "ne" ? " (नीच)" : " (Debilitated)";
    }
    return `${baseName}${suffix}`;
  };

  const getPlanetStatus = (p) => {
    const statusParts = [];
    if (p.is_retrograde) {
      statusParts.push(
        <span key="retro" style={{ color: "var(--color-error)" }}>
          {language === "ne" ? "वक्री" : "Retrograde"}
        </span>
      );
    } else {
      statusParts.push(
        <span key="direct" style={{ color: "var(--color-success)" }}>
          {language === "ne" ? "मार्गी" : "Direct"}
        </span>
      );
    }

    if (p.is_combust) {
      statusParts.push(
        <span key="combust" style={{ color: "var(--color-error)" }}>
          {language === "ne" ? "अस्त" : "Combust"}
        </span>
      );
    }

    if (p.exaltation_state === "exalted") {
      statusParts.push(
        <span key="exalted" style={{ color: "var(--color-gold)", fontWeight: "bold" }}>
          {language === "ne" ? "उच्च" : "Exalted"}
        </span>
      );
    } else if (p.exaltation_state === "debilitated") {
      statusParts.push(
        <span key="debilitated" style={{ color: "var(--color-error)", fontWeight: "bold" }}>
          {language === "ne" ? "नीच" : "Debilitated"}
        </span>
      );
    }

    const elements = [];
    statusParts.forEach((part, index) => {
      elements.push(part);
      if (index < statusParts.length - 1) {
        elements.push(<span key={`sep-${index}`} style={{ color: "var(--color-text-muted)" }}>, </span>);
      }
    });

    return <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>{elements}</div>;
  };

  return (
    <div className="glass-panel" style={{ width: "100%" }}>
      <h3>{language === "ne" ? "ग्रहहरूको विवरण" : "Planetary Positions"}</h3>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>{language === "ne" ? "ग्रह" : "Planet"}</th>
              <th>{language === "ne" ? "स्पष्ट रेखांश" : "Longitude"}</th>
              <th>{language === "ne" ? "राशि" : "Zodiac Sign"}</th>
              <th>{language === "ne" ? "डिग्री" : "Deg In Sign"}</th>
              <th>{language === "ne" ? "भाव (घर)" : "House"}</th>
              <th>{language === "ne" ? "स्थिति" : "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {/* Lagna Row */}
            <tr style={{ background: "rgba(212, 175, 55, 0.05)", fontWeight: "bold" }}>
              <td>{language === "ne" ? "लग्न (Lagna)" : "Ascendant (Lagna)"}</td>
              <td>{formatDMS(lagna.longitude)}</td>
              <td>{lagna.sign_name}</td>
              <td>{formatDMS(lagna.longitude_in_sign)}</td>
              <td>1</td>
              <td><span style={{ color: "var(--color-gold)" }}>{language === "ne" ? "उदित" : "Rising"}</span></td>
            </tr>
            
            {/* Planets Rows */}
            {planets.map((p, idx) => {
              let color = "var(--color-text-primary)";
              if (p.relationship === "karaka") {
                color = "var(--color-success)";
              } else if (p.relationship === "maraka") {
                color = "var(--color-error)";
              }

              return (
                <tr key={idx} style={{ color: color }}>
                  <td style={{ fontWeight: "500", color: color }}>{getPlanetDisplayName(p)}</td>
                  <td>{formatDMS(p.sidereal_longitude)}</td>
                  <td>{p.sign_name}</td>
                  <td>{formatDMS(p.longitude_in_sign)}</td>
                  <td style={{ fontWeight: "bold", color: "var(--color-gold)" }}>{p.house}</td>
                  <td>{getPlanetStatus(p)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
