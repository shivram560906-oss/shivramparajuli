import React from "react";

export default function SettingsPanel({ 
  ayanamshaType, 
  chartStyle, 
  language, 
  theme = "cosmic",
  onUpdateSettings 
}) {
  
  const handleAyaChange = (e) => {
    onUpdateSettings({
      ayanamsha_type: e.target.value,
      chart_style: chartStyle,
      theme,
      language
    });
  };

  const handleStyleChange = (e) => {
    onUpdateSettings({
      ayanamsha_type: ayanamshaType,
      chart_style: e.target.value,
      theme,
      language
    });
  };

  const handleLangChange = (e) => {
    onUpdateSettings({
      ayanamsha_type: ayanamshaType,
      chart_style: chartStyle,
      theme,
      language: e.target.value
    });
  };

  const handleThemeChange = (e) => {
    onUpdateSettings({
      ayanamsha_type: ayanamshaType,
      chart_style: chartStyle,
      theme: e.target.value,
      language
    });
  };

  return (
    <div className="glass-panel" style={{ width: "100%" }}>
      <h3>{language === "ne" ? "सफ्टवेयर सेटिङहरू" : "Configuration Settings"}</h3>
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "20px", 
          marginTop: "12px" 
        }}
      >
        <div className="form-group">
          <label>{language === "ne" ? "अयनांश प्रणाली (Ayanamsha)" : "Ayanamsha System"}</label>
          <select value={ayanamshaType} onChange={handleAyaChange}>
            <option value="LAHIRI">Lahiri (Chitra Paksha) - {language === "ne" ? "मानक" : "Standard"}</option>
            <option value="RAMAN">Raman</option>
            <option value="KP">KP (Krishnamurti)</option>
            <option value="TROPICAL">Sayana (Tropical) - {language === "ne" ? "पश्चिमी" : "Western"}</option>
          </select>
        </div>

        <div className="form-group">
          <label>{language === "ne" ? "कुण्डली शैली (Chart Style)" : "Chart Style Preference"}</label>
          <select value={chartStyle} onChange={handleStyleChange}>
            <option value="NORTH_INDIAN">{language === "ne" ? "उत्तर भारतीय (डायमण्ड)" : "North Indian (Diamond)"}</option>
            <option value="SOUTH_INDIAN">{language === "ne" ? "दक्षिण भारतीय (ग्रिड)" : "South Indian (Grid)"}</option>
          </select>
        </div>

        <div className="form-group">
          <label>{language === "ne" ? "थिम चयन (Theme)" : "Theme Selection"}</label>
          <select value={theme} onChange={handleThemeChange}>
            <option value="cosmic">{language === "ne" ? "ब्रह्माण्डीय अन्धकार (Cosmic)" : "Cosmic Dark (Default)"}</option>
            <option value="light">{language === "ne" ? "श्वेत थिम (Light)" : "Pure Light"}</option>
            <option value="oled">{language === "ne" ? "गाढा कालो (OLED)" : "OLED Pitch Black"}</option>
            <option value="gold">{language === "ne" ? "स्वर्ण वैदिक (Gold)" : "Vedic Gold (Warm)"}</option>
            <option value="emerald">{language === "ne" ? "हरित मरकत (Emerald)" : "Emerald Forest"}</option>
            <option value="ruby">{language === "ne" ? "रक्त माणिक्य (Ruby)" : "Ruby Crimson"}</option>
            <option value="sapphire">{language === "ne" ? "नीलम सागर (Sapphire)" : "Sapphire Ocean"}</option>
            <option value="amethyst">{language === "ne" ? "बैजनी नीलम (Amethyst)" : "Amethyst Royal"}</option>
            <option value="amber">{language === "ne" ? "तप्त स्वर्ण (Amber)" : "Amber Hearth"}</option>
            <option value="rose">{language === "ne" ? "गुलाबी हीरक (Rose)" : "Rose Quartz"}</option>
            <option value="slate">{language === "ne" ? "धूसर साइबर (Slate)" : "Slate Cyber"}</option>
            <option value="solar">{language === "ne" ? "सौर सेपिया (Solar)" : "Solar Sepia"}</option>
          </select>
        </div>

        <div className="form-group">
          <label>{language === "ne" ? "भाषा (Language)" : "Language Selection"}</label>
          <select value={language} onChange={handleLangChange}>
            <option value="en">English</option>
            <option value="ne">नेपाली (Nepali)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
