import React, { useState } from "react";

const LEVEL_LABELS = {
  en: ["", "Mahadasha (MD)", "Antardasha (AD)", "Pratyantardasha (PD)", "Sookshmadasha (SD)", "Pranadasha (PRD)"],
  ne: ["", "महादशा (MD)", "अन्तर्दशा (AD)", "प्रत्यन्तर्दशा (PD)", "सूक्ष्मदशा (SD)", "प्राणदशा (PRD)"]
};

const toNepaliNumerals = (numStr) => {
  const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return numStr.replace(/[0-9]/g, (w) => nepaliDigits[parseInt(w)]);
};

function DashaTreeNode({ node, language, parentNames = [] }) {
  const [isOpen, setIsOpen] = useState(node.is_active || false);
  const hasChildren = node.children && node.children.length > 0;
  
  const currentNames = [...parentNames, language === "ne" ? node.lord_nepali : node.lord];
  const combinedName = currentNames.join(" - ");
  
  const formatBS = (dateStr) => {
    if (!dateStr) return "";
    return language === "ne" ? toNepaliNumerals(dateStr) : dateStr;
  };
  
  const toggle = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  const levelBadgeStyle = {
    fontSize: "0.7rem",
    padding: "2px 6px",
    borderRadius: "4px",
    background: "rgba(212, 175, 55, 0.1)",
    border: "1px solid rgba(212, 175, 55, 0.2)",
    color: "var(--color-gold)",
    marginRight: "8px",
    fontWeight: "bold"
  };

  const nodeStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "8px 12px",
    borderBottom: "1px solid rgba(212, 175, 55, 0.04)",
    background: node.is_active ? "rgba(212, 175, 55, 0.05)" : "transparent",
    borderRadius: "8px",
    margin: "2px 0",
    transition: "background 0.2s"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <div style={nodeStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          
          {/* Left info: toggle icon + badge + names */}
          <div style={{ display: "flex", alignItems: "center", cursor: hasChildren ? "pointer" : "default" }} onClick={toggle}>
            {hasChildren ? (
              <span style={{ color: "var(--color-gold)", marginRight: "8px", fontSize: "0.85rem", width: "12px", display: "inline-block" }}>
                {isOpen ? "▼" : "▶"}
              </span>
            ) : (
              <span style={{ color: "var(--color-text-muted)", marginRight: "8px", fontSize: "0.85rem", width: "12px", display: "inline-block" }}>
                ✦
              </span>
            )}
            
            <span style={levelBadgeStyle}>
              {LEVEL_LABELS[language][node.level]}
            </span>
            
            <span style={{ 
              fontWeight: node.is_active ? "bold" : "500", 
              color: node.is_active ? "var(--color-gold)" : "var(--color-text-primary)",
              fontSize: "0.95rem"
            }}>
              {combinedName}
              {node.is_partial && (
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginLeft: "6px" }}>
                  ({language === "ne" ? "जन्मदशा" : "Birth Dasha"})
                </span>
              )}
            </span>
            
            {node.is_active && (
              <span style={{ 
                marginLeft: "8px", 
                fontSize: "0.7rem", 
                background: "var(--color-success)", 
                color: "#000", 
                padding: "1px 5px", 
                borderRadius: "3px", 
                fontWeight: "bold" 
              }}>
                {language === "ne" ? "सक्रिय" : "ACTIVE"}
              </span>
            )}
          </div>
          
          {/* Right info: Dates */}
          <div style={{ fontSize: "0.85rem", color: node.is_active ? "var(--color-gold)" : "var(--color-text-secondary)", fontStyle: "normal" }}>
            {formatBS(node.start_bs)} &rarr; {formatBS(node.end_bs)}
          </div>
          
        </div>
      </div>
      
      {/* Children rendering */}
      {hasChildren && isOpen && (
        <div style={{ 
          paddingLeft: "16px", 
          borderLeft: "1px dashed rgba(212, 175, 55, 0.15)", 
          marginLeft: "6px",
          display: "flex",
          flexDirection: "column"
        }}>
          {node.children.map((child, idx) => (
            <DashaTreeNode 
              key={idx} 
              node={child} 
              language={language} 
              parentNames={currentNames} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashaInfo({ chartData, language }) {
  if (!chartData || !chartData.dasha) return null;
  
  return (
    <div className="glass-panel" style={{ width: "100%" }}>
      <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>☸</span>
        <span>{language === "ne" ? "विंशोत्तरी दशा विवरण (विक्रम संवत्)" : "Vimshottari Dasha Tree (Vikram Samvat)"}</span>
      </h3>
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "20px" }}>
        {language === "ne" 
          ? "यो विंशोत्तरी दशाको ५-तहको पूर्ण संरचना हो। हाल सक्रिय दशा स्वतः खुलेको छ, अरू हेर्न क्लिक गर्नुहोस्।" 
          : "This is the complete 5-level Vimshottari Dasha tree. The active period is automatically expanded. Click to explore other sub-periods."}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {chartData.dasha.map((md, idx) => (
          <DashaTreeNode 
            key={idx} 
            node={md} 
            language={language} 
            parentNames={[]} 
          />
        ))}
      </div>
    </div>
  );
}
