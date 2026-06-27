/**
 * RecentlyUsed.jsx (previously SavedCharts.jsx)
 *
 * Displays recently opened/calculated charts stored in localStorage.
 * Replaces the old "Saved Records" panel.
 */

import React from "react";
import { adStringToBS, formatBSDate, toNepaliDigits } from "../utils/julianDay.js";

export default function RecentlyUsed({ recentItems = [], onLoad, language = "en" }) {
  const isNe = language === "ne";

  if (!recentItems || recentItems.length === 0) {
    return (
      <div className="glass-panel">
        <h3 style={{ color: "var(--color-gold)", fontFamily: "var(--font-heading)", fontSize: "1rem", marginBottom: "10px" }}>
          {isNe ? "हालसालका कुण्डलीहरू" : "Recently Used"}
        </h3>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
          {isNe ? "हालसम्म कुनै कुण्डली खोलिएको छैन।" : "No recently opened charts."}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ maxHeight: "360px", overflowY: "auto" }}>
      <h3 style={{ color: "var(--color-gold)", fontFamily: "var(--font-heading)", fontSize: "1rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span>🕐</span>
        {isNe ? "हालसालका कुण्डलीहरू" : "Recently Used"}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {recentItems.map((item, idx) => {
          const bsDate = adStringToBS(item.birth_date);
          const bsStr = bsDate
            ? formatBSDate(bsDate.year, bsDate.month, bsDate.day, isNe ? "ne" : "en")
            : item.birth_date;

          // Format opened_at timestamp
          let openedStr = "";
          if (item.opened_at) {
            const d = new Date(item.opened_at);
            openedStr = d.toLocaleTimeString("ne-NP", { hour: "2-digit", minute: "2-digit" }) 
              + " " + d.toLocaleDateString("ne-NP", { day: "numeric", month: "short" });
          }

          return (
            <div
              key={idx}
              onClick={() => onLoad(item)}
              style={{
                background: "rgba(212, 175, 55, 0.04)",
                border: "1px solid rgba(212, 175, 55, 0.12)",
                borderRadius: "8px",
                padding: "10px 12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                gap: "3px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)";
                e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(212, 175, 55, 0.04)";
                e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.12)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--color-gold)", fontWeight: "600", fontSize: "0.9rem" }}>
                  {idx + 1}. {item.name}
                </span>
                {item.source && (
                  <span style={{
                    fontSize: "0.65rem",
                    padding: "1px 6px",
                    borderRadius: "3px",
                    background: item.source === "xml" ? "rgba(100, 200, 100, 0.15)" : item.source === "qck" ? "rgba(100, 150, 255, 0.15)" : "rgba(212, 175, 55, 0.1)",
                    color: item.source === "xml" ? "#6dca6d" : item.source === "qck" ? "#88aaff" : "var(--color-text-muted)",
                    border: "1px solid",
                    borderColor: item.source === "xml" ? "rgba(100, 200, 100, 0.3)" : item.source === "qck" ? "rgba(100, 150, 255, 0.3)" : "rgba(212,175,55,0.2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    {item.source}
                  </span>
                )}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                📅 {bsStr}  ·  🕐 {item.birth_time || "—"}
              </div>
              {item.city && (
                <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
                  📍 {item.city}
                </div>
              )}
              {openedStr && (
                <div style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", marginTop: "2px", textAlign: "right" }}>
                  {isNe ? "खोलियो:" : "Opened:"} {openedStr}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
