import React, { useState } from "react";

const GUIDE_DATA = {
  en: {
    title: "Vedic Astrology Reference Manual",
    subtitle: "A quick guide to understanding Houses (Bhavas), Planets (Grahas), and Signs (Rashis).",
    tabs: [
      { id: "houses", label: "12 Houses (Bhavas)" },
      { id: "planets", label: "9 Planets (Grahas)" },
      { id: "signs", label: "12 Signs (Rashis)" }
    ],
    houses: [
      { num: 1, title: "1st House (Lagna / Tanu)", significations: "Self, physical body, appearance, constitution, vitality, head, new beginnings, personality." },
      { num: 2, title: "2nd House (Dhana)", significations: "Wealth, speech, family, right eye, food habits, accumulated assets, early childhood, throat." },
      { num: 3, title: "3rd House (Sahaja)", significations: "Courage, sibling relationship, communication, hobbies, short journeys, writing, arms and hands, self-efforts." },
      { num: 4, title: "4th House (Bandhu / Sukha)", significations: "Mother, home environment, vehicles, mental peace, land and property, heart, chest, domestic happiness." },
      { num: 5, title: "5th House (Putra / Purvapunya)", significations: "Children, intellect, education, creativity, love affairs, past life merits, speculative gains, upper stomach." },
      { num: 6, title: "6th House (Ari / Shatru)", significations: "Enemies, debts, diseases, service, daily work, litigation, maternal uncle, lower abdomen." },
      { num: 7, title: "7th House (Yuvati)", significations: "Spouse, marriage, business partnerships, public relations, foreign travel, lower back." },
      { num: 8, title: "8th House (Randhra / Ayu)", significations: "Longevity, sudden events, unearned wealth, research, occult sciences, secrets, transformations, chronic illness." },
      { num: 9, title: "9th House (Dharma / Bhagya)", significations: "Luck, religion, higher education, father, spiritual teacher (Guru), long journeys, thighs." },
      { num: 10, title: "10th House (Karma)", significations: "Profession, social status, fame, authority, actions in society, government honors, knees." },
      { num: 11, title: "11th House (Labha)", significations: "Gains, desires fulfillment, elder siblings, income sources, networking, friends, calves." },
      { num: 12, title: "12th House (Vyaya / Moksha)", significations: "Expenses, loss, isolation, hospitalizations, foreign lands, sleep, subconscious, liberation (Moksha), feet." }
    ],
    planets: [
      { name: "Sun (Surya)", role: "King / Soul", nature: "Fiery, masculine", significations: "Father, authority, leadership, government, willpower, self-respect, bones, heart." },
      { name: "Moon (Chandra)", role: "Queen / Mind", nature: "Watery, feminine", significations: "Mother, emotions, mental peace, public opinion, fluids in body, intuition, creativity." },
      { name: "Mars (Mangal)", role: "Commander", nature: "Fiery, energetic", significations: "Siblings, courage, physical energy, anger, logic, land, accidents, surgeries, muscles." },
      { name: "Mercury (Budha)", role: "Prince", nature: "Dual, intellectual", significations: "Intellect, business, speech, communication, education, mathematics, writing, nervous system." },
      { name: "Jupiter (Guru)", role: "Teacher / Advisor", nature: "Benign, expansive", significations: "Wisdom, wealth, children, husband (in female charts), luck, spirituality, liver, expansion." },
      { name: "Venus (Shukra)", role: "Minister / Advisor", nature: "Artistic, sensual", significations: "Spouse (in male charts), love, marriage, vehicles, luxury, arts, music, reproductive system." },
      { name: "Saturn (Shani)", role: "Servant / Judge", nature: "Cold, restrictive", significations: "Longevity, discipline, delays, sorrow, hard work, structure, chronic problems, bones, teeth." },
      { name: "Rahu", role: "Shadow Planet", nature: "Illusionary, ambitious", significations: "Foreign travels, technology, sudden gains or losses, obsession, unconventionality." },
      { name: "Ketu", role: "Shadow Planet", nature: "Spiritual, detached", significations: "Spirituality, liberation (Moksha), occult, introversion, sudden transformations, detachment." }
    ],
    signs: [
      { num: 1, name: "Aries", lord: "Mars", element: "Fire", quality: "Movable" },
      { num: 2, name: "Taurus", lord: "Venus", element: "Earth", quality: "Fixed" },
      { num: 3, name: "Gemini", lord: "Mercury", element: "Air", quality: "Dual" },
      { num: 4, name: "Cancer", lord: "Moon", element: "Water", quality: "Movable" },
      { num: 5, name: "Leo", lord: "Sun", element: "Fire", quality: "Fixed" },
      { num: 6, name: "Virgo", lord: "Mercury", element: "Earth", quality: "Dual" },
      { num: 7, name: "Libra", lord: "Venus", element: "Air", quality: "Movable" },
      { num: 8, name: "Scorpio", lord: "Mars", element: "Water", quality: "Fixed" },
      { num: 9, name: "Sagittarius", lord: "Jupiter", element: "Fire", quality: "Dual" },
      { num: 10, name: "Capricorn", lord: "Saturn", element: "Earth", quality: "Movable" },
      { num: 11, name: "Aquarius", lord: "Saturn", element: "Air", quality: "Fixed" },
      { num: 12, name: "Pisces", lord: "Jupiter", element: "Water", quality: "Dual" }
    ]
  },
  ne: {
    title: "वैदिक ज्योतिष मार्गदर्शिका",
    subtitle: "कुण्डलीका १२ भाव (घर), ९ ग्रह र १२ राशिको बारेमा सामान्य जानकारी।",
    tabs: [
      { id: "houses", label: "१२ भाव (Bhavas)" },
      { id: "planets", label: "९ ग्रह (Grahas)" },
      { id: "signs", label: "१२ राशि (Rashis)" }
    ],
    houses: [
      { num: 1, title: "प्रथम भाव (लग्न / तनू)", significations: "स्वभाव, शरीर, शारीरिक रुपरेखा, वर्ण, आरोग्यता, शिर, नयाँ सुरुवात, जीवन शक्ति।" },
      { num: 2, title: "द्वितीय भाव (धन)", significations: "सम्पत्ति, वाणी, परिवार, दायाँ आँखा, खानपानको बानी, कण्ठ, संचित धन।" },
      { num: 3, title: "तृतीय भाव (सहज)", significations: "साहस, पराक्रम, साना दाजुभाइ-दिदीबहिनी, सञ्चार, छोटो यात्रा, लेखन, हात, आफ्नै परिश्रम।" },
      { num: 4, title: "चतुर्थ भाव (बन्धु / सुख)", significations: "माता, गृह वातावरण, वाहन सुख, मानसिक शान्ति, घरजग्गा, छाती, हृदय सुख।" },
      { num: 5, title: "पञ्चम भाव (पुत्र / पूर्वपुण्य)", significations: "सन्तान, बुद्धि, शिक्षा, सृजनात्मकता, प्रेम सम्बन्ध, पूर्वजन्मको फल, आकस्मिक धन लाभ, पेट।" },
      { num: 6, title: "षष्ठ भाव (अरि / शत्रु)", significations: "शत्रु, ऋण, रोग, नोकरी, दैनिक काम, मुद्दा-मामिला, मामावली, तल्लो पेट।" },
      { num: 7, title: "सप्तम भाव (युवती)", significations: "जीवनसाथी, विवाह, व्यापारिक साझेदारी, सार्वजनिक सम्बन्ध, विदेश यात्रा, कम्मर।" },
      { num: 8, title: "अष्टम भाव (रन्ध्र / आयु)", significations: "दीर्घायु, अचानक हुने घटना, पैतृक सम्पत्ति, अनुसन्धान, गुप्त विज्ञान, रहस्य, जीर्ण रोग।" },
      { num: 9, title: "नवम भाव (धर्म / भाग्य)", significations: "भाग्य, धार्मिक कार्य, उच्च शिक्षा, पिता, आध्यात्मिक गुरु, लामो यात्रा, तिघ्रा।" },
      { num: 10, title: "दशम भाव (कर्म)", significations: "पेशा, जागिर, सामाजिक प्रतिष्ठा, मानसम्मान, कीर्ति, सरकारी सम्मान, घुँडा।" },
      { num: 11, title: "एघारौं भाव (लाभ)", significations: "आम्दानी, कामना पूर्ति, ठूला दाजुभाइ, आम्दानीका नयाँ स्रोत, साथीभाइ, पिँडुला।" },
      { num: 12, title: "द्वादश भाव (व्यय / मोक्ष)", significations: "खर्च, हानी, अस्पतालको वास, विदेश बसोबास, निद्रा, अवचेतन मन, मोक्ष, पैताला।" }
    ],
    planets: [
      { name: "सूर्य (Surya)", role: "राजा / आत्मा", nature: "अग्नि, पुरुष", significations: "पिता, सरकार, नेतृत्व क्षमता, आत्मविश्वास, आत्मबल, हड्डी, मुटु।" },
      { name: "चन्द्र (Chandra)", role: "रानी / मन", nature: "जल, स्त्री", significations: "माता, भावना, मानसिक शान्ति, जनसम्पर्क, शरीरको तरल पदार्थ, परोपकार।" },
      { name: "मङ्गल (Mangal)", role: "सेनापति", nature: "अग्नि, ऊर्जावान", significations: "भाइभतिजा, साहस, शारीरिक बल, रिस, तर्क, भूमि, दुर्घटना, मांसपेशी।" },
      { name: "बुध (Budha)", role: "राजकुमार", nature: "द्विस्वभाव, बौद्धिक", significations: "बुद्धि, व्यापार, बोली, सञ्चार, गणित, लेखन, स्नायु प्रणाली।" },
      { name: "बृहस्पति (Guru)", role: "देवगुरु / सल्लाहकार", nature: "सौम्य, विस्तारक", significations: "ज्ञान, धन, सन्तान, स्त्रीको कुण्डलीमा पति, भाग्य, अध्यात्म, कलेजो।" },
      { name: "शुक्र (Shukra)", role: "दैत्यगुरु / सल्लाहकार", nature: "कलात्मक, विलासी", significations: "पुरुषको कुण्डलीमा पत्नी, प्रेम, विवाह, वाहन सुख, कला, विलासिता, गुप्त अंग।" },
      { name: "शनि (Shani)", role: "सेवक / न्यायाधीश", nature: "चिसो, अनुशासित", significations: "आयु, अनुशासन, ढिलाइ, दुःख, कडा परिश्रम, संरचना, हड्डी र दाँत।" },
      { name: "राहु (Rahu)", role: "छाया ग्रह", nature: "भ्रम, महत्वाकांक्षी", significations: "विदेश यात्रा, प्रविधि, अचानक हुने लाभ वा हानी, मोह, आधुनिक आविष्कार।" },
      { name: "केतु (Ketu)", role: "छाया ग्रह", nature: "आध्यात्मिक, वैरागी", significations: "मोक्ष, अध्यात्म, गुप्त विज्ञान, अन्तर्मुखी स्वभाव, अचानक परिवर्तन, वैराग्य।" }
    ],
    signs: [
      { num: 1, name: "मेष", lord: "मङ्गल", element: "अग्नि", quality: "चर" },
      { num: 2, name: "वृष", lord: "शुक्र", element: "पृथ्वी", quality: "स्थिर" },
      { num: 3, name: "मिथुन", lord: "बुध", element: "वायु", quality: "द्विस्वभाव" },
      { num: 4, name: "कर्कट", lord: "चन्द्र", element: "जल", quality: "चर" },
      { num: 5, name: "सिंह", lord: "सूर्य", element: "अग्नि", quality: "स्थिर" },
      { num: 6, name: "कन्या", lord: "बुध", element: "पृथ्वी", quality: "द्विस्वभाव" },
      { num: 7, name: "तुला", lord: "शुक्र", element: "वायु", quality: "चर" },
      { num: 8, name: "वृश्चिक", lord: "मङ्गल", element: "जल", quality: "स्थिर" },
      { num: 9, name: "धनु", lord: "गुरु", element: "अग्नि", quality: "द्विस्वभाव" },
      { num: 10, name: "मकर", lord: "शनि", element: "पृथ्वी", quality: "चर" },
      { num: 11, name: "कुम्भ", lord: "शनि", element: "वायु", quality: "स्थिर" },
      { num: 12, name: "मीन", lord: "गुरु", element: "जल", quality: "द्विस्वभाव" }
    ]
  }
};

export default function VedicGuide({ language = "en" }) {
  const [activeTab, setActiveTab] = useState("houses");
  const data = GUIDE_DATA[language] || GUIDE_DATA.en;

  const toNeNum = (num) => {
    if (language !== "ne") return num;
    const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return String(num)
      .split("")
      .map((d) => nepaliDigits[parseInt(d, 10)] || d)
      .join("");
  };

  return (
    <div className="glass-panel" style={{ width: "100%" }}>
      <h3>{data.title}</h3>
      <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", marginBottom: "20px" }}>
        {data.subtitle}
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid var(--glass-border)", paddingBottom: "12px", marginBottom: "20px" }}>
        {data.tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 16px",
              background: activeTab === tab.id ? "rgba(212, 175, 55, 0.12)" : "transparent",
              border: activeTab === tab.id ? "1px solid var(--color-gold)" : "1px solid transparent",
              borderRadius: "6px",
              color: activeTab === tab.id ? "var(--color-gold)" : "var(--color-text-secondary)",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: activeTab === tab.id ? "bold" : "normal",
              transition: "var(--transition-smooth)"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === "houses" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {data.houses.map((house) => (
              <div
                key={house.num}
                style={{
                  padding: "16px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "10px"
                }}
              >
                <h5 style={{ color: "var(--color-gold)", marginBottom: "8px" }}>
                  {house.title}
                </h5>
                <p style={{ fontSize: "0.85rem", lineHeight: "1.5", color: "var(--color-text-primary)" }}>
                  {house.significations}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "planets" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {data.planets.map((planet, idx) => (
              <div
                key={idx}
                style={{
                  padding: "16px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "10px",
                  display: "grid",
                  gridTemplateColumns: "180px 1fr",
                  gap: "16px"
                }}
              >
                <div>
                  <h5 style={{ color: "var(--color-gold)" }}>{planet.name}</h5>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                    {language === "ne" ? "भूमिका: " : "Role: "} <strong>{planet.role}</strong>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    {language === "ne" ? "प्रकृति: " : "Nature: "} {planet.nature}
                  </div>
                </div>
                <div style={{ fontSize: "0.85rem", lineHeight: "1.5", color: "var(--color-text-primary)", display: "flex", alignItems: "center" }}>
                  {planet.significations}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "signs" && (
          <table className="data-table" style={{ fontSize: "0.9rem" }}>
            <thead>
              <tr>
                <th style={{ width: "80px" }}>{language === "ne" ? "नम्बर" : "No."}</th>
                <th>{language === "ne" ? "राशि" : "Zodiac Sign"}</th>
                <th>{language === "ne" ? "स्वामी ग्रह" : "Ruling Lord"}</th>
                <th>{language === "ne" ? "तत्व" : "Element"}</th>
                <th>{language === "ne" ? "प्रकृति" : "Quality"}</th>
              </tr>
            </thead>
            <tbody>
              {data.signs.map((sign) => (
                <tr key={sign.num}>
                  <td style={{ fontWeight: "bold", color: "var(--color-gold)" }}>
                    {toNeNum(sign.num)}
                  </td>
                  <td style={{ fontWeight: "600" }}>{sign.name}</td>
                  <td>{sign.lord}</td>
                  <td>{sign.element}</td>
                  <td>{sign.quality}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
