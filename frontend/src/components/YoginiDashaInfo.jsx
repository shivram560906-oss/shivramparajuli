import React, { useState } from "react";

export default function YoginiDashaInfo({ chartData, language }) {
  if (!chartData || !chartData.yogini_dasha) return null;

  const [expandedMd, setExpandedMd] = useState(null);

  const toggleExpand = (idx) => {
    if (expandedMd === idx) {
      setExpandedMd(null);
    } else {
      setExpandedMd(idx);
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    if (language === "ne") {
      return d.toLocaleDateString("ne-NP", { year: "numeric", month: "long", day: "numeric" });
    }
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="glass-panel" style={{ width: "100%" }}>
      <h3>{language === "ne" ? "योगिनी दशा विवरण" : "Yogini Dasha Timeline"}</h3>
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
        {language === "ne" 
          ? "महादशाको सूचीमा क्लिक गरेर अन्तर्गतका अन्तर्दशाहरू हेर्नुहोस् (३६ वर्षको चक्र, १०८ वर्षसम्म)।" 
          : "Click on any Mahadasha row to view its nested Antardashas (36-year cycle, up to 108 years)."}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {chartData.yogini_dasha.map((md, idx) => {
          const isExpanded = expandedMd === idx;
          return (
            <div 
              key={idx} 
              style={{
                border: "1px solid rgba(212, 175, 55, 0.12)",
                borderRadius: "10px",
                background: isExpanded ? "rgba(25, 22, 50, 0.5)" : "rgba(8, 7, 17, 0.3)",
                overflow: "hidden",
                transition: "all 0.3s ease"
              }}
            >
              {/* Mahadasha Row Header */}
              <div 
                onClick={() => toggleExpand(idx)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 20px",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "1.2rem", color: "var(--color-gold)", fontWeight: "bold" }}>
                    {language === "ne" ? md.nepali : md.name}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                    ({md.total_years} {language === "ne" ? "वर्ष" : "Yrs"})
                    {md.is_partial && ` - ${language === "ne" ? "जन्मदशा" : "Birth Dasha"}`}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    [{language === "ne" ? `स्वामी: ${md.lord}` : `Lord: ${md.lord}`}]
                  </span>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    {formatDate(md.start)} &rarr; {formatDate(md.end)}
                  </span>
                  <span style={{ color: "var(--color-gold)", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    ▼
                  </span>
                </div>
              </div>

              {/* Antardasha Expansion */}
              {isExpanded && (
                <div style={{ padding: "0 20px 16px 20px", borderTop: "1px solid rgba(212, 175, 55, 0.08)", background: "rgba(8, 7, 17, 0.5)" }}>
                  <table className="data-table" style={{ marginTop: "8px", fontSize: "0.85rem" }}>
                    <thead>
                      <tr>
                        <th style={{ padding: "8px 12px" }}>{language === "ne" ? "अन्तर्दशा स्वामी" : "Antardasha Lord"}</th>
                        <th style={{ padding: "8px 12px" }}>{language === "ne" ? "सुरु मिति" : "Start Date"}</th>
                        <th style={{ padding: "8px 12px" }}>{language === "ne" ? "अन्त्य मिति" : "End Date"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {md.antardashas.map((ad, adIdx) => (
                        <tr key={adIdx}>
                          <td style={{ padding: "8px 12px", fontWeight: "600", color: "var(--color-gold)" }}>
                            {language === "ne" ? `${md.nepali} - ${ad.nepali}` : `${md.name} - ${ad.name}`}
                          </td>
                          <td style={{ padding: "8px 12px" }}>{formatDate(ad.start)}</td>
                          <td style={{ padding: "8px 12px" }}>{formatDate(ad.end)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
