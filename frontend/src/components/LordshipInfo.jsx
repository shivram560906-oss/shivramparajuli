import React from "react";

// Sign lords: sign_number (1-12) → planet English name
const SIGN_LORDS = {
  1: "Mars",      // मेष / Aries
  2: "Venus",     // वृष / Taurus
  3: "Mercury",   // मिथुन / Gemini
  4: "Moon",      // कर्कट / Cancer
  5: "Sun",       // सिंह / Leo
  6: "Mercury",   // कन्या / Virgo
  7: "Venus",     // तुला / Libra
  8: "Mars",      // वृश्चिक / Scorpio
  9: "Jupiter",   // धनु / Sagittarius
  10: "Saturn",   // मकर / Capricorn
  11: "Saturn",   // कुम्भ / Aquarius
  12: "Jupiter",  // मीन / Pisces
};

const SIGN_NAMES_NE = {
  1: "मेष",
  2: "वृष",
  3: "मिथुन",
  4: "कर्कट",
  5: "सिंह",
  6: "कन्या",
  7: "तुला",
  8: "वृश्चिक",
  9: "धनु",
  10: "मकर",
  11: "कुम्भ",
  12: "मीन",
};

const PLANET_NAMES_NE = {
  Sun: "सूर्य",
  Moon: "चन्द्र",
  Mars: "मङ्गल",
  Mercury: "बुध",
  Jupiter: "गुरु",
  Venus: "शुक्र",
  Saturn: "शनि",
  Rahu: "राहु",
  Ketu: "केतु",
};

// Nepali numerals
const toNepaliNumeral = (num) => {
  const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(num)
    .split("")
    .map((d) => nepaliDigits[parseInt(d, 10)] || d)
    .join("");
};

export default function LordshipInfo({ chartData }) {
  if (!chartData) return null;

  const { planets, lagna } = chartData;
  const lagnaSignNumber = lagna.sign_number;

  // Build a lookup: English planet name → planet data from chartData
  const planetLookup = {};
  if (planets) {
    planets.forEach((p) => {
      planetLookup[p.name] = p;
    });
  }

  // Compute house data for houses 1–12
  const houseData = [];
  for (let houseNum = 1; houseNum <= 12; houseNum++) {
    const signNumber = ((lagnaSignNumber - 1 + (houseNum - 1)) % 12) + 1;
    const signNameNe = SIGN_NAMES_NE[signNumber];
    const lordEnglish = SIGN_LORDS[signNumber];
    const lordNameNe = PLANET_NAMES_NE[lordEnglish] || lordEnglish;
    const lordPlanet = planetLookup[lordEnglish];

    // Lord's current house placement
    const lordHouse = lordPlanet ? lordPlanet.house : "—";

    // Status tags
    const statusTags = [];
    if (lordPlanet) {
      if (lordPlanet.is_retrograde) {
        statusTags.push({ label: "वक्री", color: "#e84118" }); // red
      }
      if (lordPlanet.is_combust) {
        statusTags.push({ label: "अस्त", color: "#e84118" }); // red
      }
      if (lordPlanet.exaltation_state === "exalted") {
        statusTags.push({ label: "उच्च", color: "#d4af37" }); // gold
      } else if (lordPlanet.exaltation_state === "debilitated") {
        statusTags.push({ label: "नीच", color: "#e84118" }); // red
      }
    }

    // Row color based on relationship
    let rowColor = "var(--color-text-primary)"; // white / sama
    if (lordPlanet) {
      if (lordPlanet.relationship === "maraka") {
        rowColor = "var(--color-error)";
      } else if (lordPlanet.relationship === "karaka") {
        rowColor = "var(--color-success)";
      }
    }

    houseData.push({
      houseNum,
      signNumber,
      signNameNe,
      lordEnglish,
      lordNameNe,
      lordHouse,
      statusTags,
      rowColor,
    });
  }

  return (
    <div className="glass-panel" style={{ width: "100%" }}>
      <h3
        style={{
          fontFamily: "'Cinzel', serif",
          color: "var(--color-gold)",
          marginBottom: "4px",
        }}
      >
        भावेश विवरण (गृह स्वामित्व)
      </h3>
      <p
        style={{
          color: "var(--color-text-muted)",
          fontSize: "0.85rem",
          marginTop: 0,
          marginBottom: "16px",
        }}
      >
        कुन भावको स्वामी कुन ग्रह हो र उनको हालको स्थान
      </p>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>भाव</th>
              <th>राशि</th>
              <th>भावेश</th>
              <th>भावेशको स्थान</th>
              <th>अवस्था</th>
            </tr>
          </thead>
          <tbody>
            {houseData.map((h) => {
              // Highlight lagna row
              const isLagna = h.houseNum === 1;
              const rowStyle = {
                color: h.rowColor,
                ...(isLagna && {
                  background: "rgba(212, 175, 55, 0.06)",
                }),
              };

              return (
                <tr key={h.houseNum} style={rowStyle}>
                  {/* भाव — House number */}
                  <td
                    style={{
                      fontWeight: "bold",
                      color: isLagna ? "var(--color-gold)" : h.rowColor,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {toNepaliNumeral(h.houseNum)}
                    {isLagna && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          marginLeft: "6px",
                          color: "var(--color-gold)",
                          opacity: 0.8,
                        }}
                      >
                        लग्न
                      </span>
                    )}
                  </td>

                  {/* राशि — Sign name */}
                  <td style={{ whiteSpace: "nowrap" }}>
                    <span style={{ color: h.rowColor }}>{h.signNameNe}</span>
                    <span
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "0.75rem",
                        marginLeft: "4px",
                      }}
                    >
                      ({toNepaliNumeral(h.signNumber)})
                    </span>
                  </td>

                  {/* भावेश — Lord planet */}
                  <td
                    style={{
                      fontWeight: "500",
                      color: h.rowColor,
                    }}
                  >
                    {h.lordNameNe}
                  </td>

                  {/* भावेशको स्थान — Lord's house */}
                  <td
                    style={{
                      fontWeight: "bold",
                      color: "var(--color-gold)",
                      textAlign: "center",
                    }}
                  >
                    {typeof h.lordHouse === "number"
                      ? toNepaliNumeral(h.lordHouse)
                      : h.lordHouse}
                  </td>

                  {/* अवस्था — Status */}
                  <td>
                    {h.statusTags.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        {h.statusTags.map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              color: tag.color,
                              fontSize: "0.82rem",
                              fontWeight: "600",
                              padding: "1px 8px",
                              borderRadius: "4px",
                              background:
                                tag.color === "#e84118"
                                  ? "rgba(232, 65, 24, 0.1)"
                                  : "rgba(212, 175, 55, 0.1)",
                              border: `1px solid ${tag.color}33`,
                            }}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span
                        style={{
                          color: "var(--color-text-muted)",
                          fontSize: "0.82rem",
                        }}
                      >
                        सामान्य
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
