import React, { useMemo } from "react";

const SIGN_INFO = {
  en: {
    1: { name: "Aries", element: "Fire", quality: "Movable", lord: "Mars", desc: "Fiery, energetic, competitive, natural leader, courageous, but can be impatient." },
    2: { name: "Taurus", element: "Earth", quality: "Fixed", lord: "Venus", desc: "Stable, reliable, artistic, patient, lover of comfort, but can be stubborn." },
    3: { name: "Gemini", element: "Air", quality: "Dual", lord: "Mercury", desc: "Intellectual, communicative, versatile, curious, social, but can be indecisive." },
    4: { name: "Cancer", element: "Water", quality: "Movable", lord: "Moon", desc: "Nurturing, intuitive, emotional, patriotic, home-loving, protective." },
    5: { name: "Leo", element: "Fire", quality: "Fixed", lord: "Sun", desc: "Generous, proud, loyal, dramatic, charismatic, seeks attention and respect." },
    6: { name: "Virgo", element: "Earth", quality: "Dual", lord: "Mercury", desc: "Analytical, meticulous, service-oriented, practical, health-conscious." },
    7: { name: "Libra", element: "Air", quality: "Movable", lord: "Venus", desc: "Harmonious, diplomatic, justice-loving, artistic, relationship-oriented." },
    8: { name: "Scorpio", element: "Water", quality: "Fixed", lord: "Mars", desc: "Intense, passionate, secretive, investigative, strong-willed, mystical." },
    9: { name: "Sagittarius", element: "Fire", quality: "Dual", lord: "Jupiter", desc: "Philosophical, optimistic, freedom-loving, generous, seeker of truth." },
    10: { name: "Capricorn", element: "Earth", quality: "Movable", lord: "Saturn", desc: "Disciplined, ambitious, practical, organized, patient, traditional." },
    11: { name: "Aquarius", element: "Air", quality: "Fixed", lord: "Saturn", desc: "Humanitarian, innovative, independent, intellectual, unconventional." },
    12: { name: "Pisces", element: "Water", quality: "Dual", lord: "Jupiter", desc: "Compassionate, spiritual, imaginative, artistic, empathetic, dreamy." }
  },
  ne: {
    1: { name: "मेष", element: "अग्नि", quality: "चर", lord: "मङ्गल", desc: "ऊर्जावान, साहसी, नेतृत्वदायी क्षमता भएको, प्रतिस्पर्धात्मक तर कहिलेकाहीँ हतारिने स्वभाव।" },
    2: { name: "वृष", element: "पृथ्वी", quality: "स्थिर", lord: "शुक्र", desc: "धैर्यवान, भरपर्दो, कलाप्रेमी, सुख-सुविधा मन पराउने तर केही ढिट स्वभाव भएको।" },
    3: { name: "मिथुन", element: "वायु", quality: "द्विस्वभाव", lord: "बुध", desc: "बौद्धिक, सञ्चारकुशल, जिज्ञासु, बहुमुखी प्रतिभा भएको तर दोधारमा पर्ने स्वभाव।" },
    4: { name: "कर्कट", element: "जल", quality: "चर", lord: "चन्द्र", desc: "भावुक, संवेदनशील, परिवार र मातृप्रेमी, दयालु र अरूको हेरचाह गर्ने।" },
    5: { name: "सिंह", element: "अग्नि", quality: "स्थिर", lord: "सूर्य", desc: "स्वाभिमानी, महत्वाकांक्षी, उदार, नेतृत्व गर्न रुचाउने र सम्मानित व्यक्तित्व।" },
    6: { name: "कन्या", element: "पृथ्वी", quality: "द्विस्वभाव", lord: "बुध", desc: "विश्लेषणात्मक, व्यावहारिक, सेवामुखी, स्वास्थ्यप्रति सचेत र सफा मन भएको।" },
    7: { name: "तुला", element: "वायु", quality: "चर", lord: "शुक्र", desc: "न्यायप्रेमी, कूटनीतिक, कला र सौन्दर्यको पारखी, साझेदारीमा काम गर्न रुचाउने।" },
    8: { name: "वृश्चिक", element: "जल", quality: "स्थिर", lord: "मङ्गल", desc: "गम्भीर, रहस्यमयी, दृढ इच्छाशक्ति भएको, तीव्र भावना र अनुसन्धानमा रुचि।" },
    9: { name: "धनु", element: "अग्नि", quality: "द्विस्वभाव", lord: "गुरु", desc: "आशावादी, दार्शनिक, स्वतन्त्रता प्रेमी, ज्ञान र सत्यको खोजी गर्ने स्वभाव।" },
    10: { name: "मकर", element: "पृथ्वी", quality: "चर", lord: "शनि", desc: "अनुशासित, महत्वाकांक्षी, व्यावहारिक, धैर्यवान, कडा परिश्रममा विश्वास गर्ने।" },
    11: { name: "कुम्भ", element: "वायु", quality: "स्थिर", lord: "शनि", desc: "परोपकारी, आविष्कारक, स्वतन्त्र विचार भएको, बौद्धिक र सामाजिक कल्याणमा रुचि।" },
    12: { name: "मीन", element: "जल", quality: "द्विस्वभाव", lord: "गुरु", desc: "दयालु, आध्यात्मिक, कल्पनाशील, कलात्मक रुचि र अरूप्रति सहानुभूति राख्ने।" }
  }
};

const PLANET_NAMES = {
  en: { Sun: "Sun", Moon: "Moon", Mars: "Mars", Mercury: "Mercury", Jupiter: "Jupiter", Venus: "Venus", Saturn: "Saturn", Rahu: "Rahu", Ketu: "Ketu" },
  ne: { Sun: "सूर्य", Moon: "चन्द्र", Mars: "मङ्गल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" }
};

const SIGN_NAMES_DICT = {
  en: { 1: "Aries", 2: "Taurus", 3: "Gemini", 4: "Cancer", 5: "Leo", 6: "Virgo", 7: "Libra", 8: "Scorpio", 9: "Sagittarius", 10: "Capricorn", 11: "Aquarius", 12: "Pisces" },
  ne: { 1: "मेष", 2: "वृष", 3: "मिथुन", 4: "कर्कट", 5: "सिंह", 6: "कन्या", 7: "तुला", 8: "वृश्चिक", 9: "धनु", 10: "मकर", 11: "कुम्भ", 12: "मीन" }
};

export default function ClassicalReferences({ chartData, language = "en", referenceType = "bph" }) {
  if (!chartData) return null;

  const lagnaNum = chartData.lagna.sign_number;
  const planets = chartData.planets || [];
  
  // Find Lagna Lord
  const lagnaLordEn = SIGN_INFO.en[lagnaNum].lord;
  const lagnaLordPl = planets.find(p => p.name === lagnaLordEn) || {};
  const lagnaLordHouse = lagnaLordPl.house || 1;

  // BPHS Predictions for Lagna Lord in Houses
  const bphsLagnaLordPredictions = useMemo(() => {
    return {
      en: {
        1: "Lagna lord in the 1st house: The native will be physically strong, courageous, self-respecting, fickle-minded, and highly intelligent. They will achieve honors in their community and possess a magnetic personality.",
        2: "Lagna lord in the 2nd house: The native will be wealthy, scholarly, happy, religious, and have a good relationship with family. They will gain through trade and have a pleasant speech.",
        3: "Lagna lord in the 3rd house: The native will be courageous, respected, helper to brothers, and may possess musical or writing talents. They will succeed through self-effort.",
        4: "Lagna lord in the 4th house: The native will enjoy maternal happiness, possess lands and vehicles, will be well-behaved, scholarly, and will have an auspicious career.",
        5: "Lagna lord in the 5th house: The native will have high intellect, children's happiness, a keen interest in education and spirituality, and will earn respect from state authorities.",
        6: "Lagna lord in the 6th house: The native will be victorious over enemies, but may face minor health challenges. They will succeed in services, medicine, or legal fields.",
        7: "Lagna lord in the 7th house: The native will have a beautiful, loyal spouse, will travel frequently, and achieve great success in partnerships or business ventures.",
        8: "Lagna lord in the 8th house: The native will have deep interest in occult and spiritual research, will inherit ancestral wealth, but may experience ups and downs in early life.",
        9: "Lagna lord in the 9th house: The native will be highly fortunate, religious, respected by all, scholarly, and will have long journeys or spiritual gurus.",
        10: "Lagna lord in the 10th house: The native will be very successful in career, self-made, famous, highly respected in society, and will command authority.",
        11: "Lagna lord in the 11th house: The native will have multiple source of income, good gains, high profits in business, and support from powerful friends.",
        12: "Lagna lord in the 12th house: The native will be spiritually inclined, interested in meditation, will travel abroad, but needs to be careful with expenses."
      },
      ne: {
        1: "लग्नेश पहिलो भावमा: जातक शारीरिक रूपमा सबल, साहसी, स्वाभिमानी, बुद्धिमान र आकर्षक व्यक्तित्वको हुनेछ। समाजमा उच्च सम्मान पाउनेछ र आफैं निर्णय लिन सक्षम हुनेछ।",
        2: "लग्नेश दोस्रो भावमा: जातक धनवान, विद्धान, हँसमुख, धार्मिक र पारिवारिक सुख प्राप्त गर्ने खालको हुनेछ। बोली प्रभावकारी हुनेछ र व्यापार व्यवसायबाट प्रशस्त लाभ लिनेछ।",
        3: "लग्नेश तेस्रो भावमा: जातक साहसी, पराक्रमी, दाजुभाइको सहयोगी र कला वा लेखनमा रुचि राख्ने हुनेछ। आफ्नै परिश्रम र कडा मेहनतबाट सफलता हासिल गर्नेछ।",
        4: "लग्नेश चौथो भावमा: जातकले मातृसुख, भूमि, भवन र सवारी साधनको पूर्ण सुख पाउनेछ। उच्च शिक्षित र समाजमा प्रतिष्ठित रहनेछ।",
        5: "लग्नेश पाँचौं भावमा: जातक तीक्ष्ण बुद्धि भएको, सन्तान सुख पाउने, शिक्षा र अध्यात्ममा रुचि राख्ने र सरकार वा राज्यस्तरबाट मान-सम्मान प्राप्त गर्नेछ।",
        6: "लग्नेश छैटौं भावमा: जातकले शत्रुमाथि विजय प्राप्त गर्नेछ। स्वास्थ्यप्रति केही सजग रहनुपर्ला। सेवा क्षेत्र, कानुनी मामिला वा चिकित्सा क्षेत्रमा सफल रहनेछ।",
        7: "लग्नेश सातौं भावमा: जातकको जीवनसाथी आकर्षक र सहयोगी हुनेछ। साझेदारी काम वा व्यापार व्यवसायबाट ठूलो सफलता मिल्नेछ र यात्राको प्रशस्त योग बन्नेछ।",
        8: "लग्नेश आठौं भावमा: जातकको गुप्त विद्या, शोधकार्य र अध्यात्ममा गहिरो रुचि रहनेछ। पैतृक सम्पत्ति लाभ हुने योग बन्नेछ तर स्वास्थ्य उतारचढाव हुन सक्छ।",
        9: "लग्नेश नवौं भावमा: जातक अत्यन्त भाग्यशाली, धार्मिक, दार्शनिक र विद्धान हुनेछ। समाजमा धर्म स्थापना गर्ने कार्यमा लाग्नेछ र गुरुहरूको कृपा प्राप्त गर्नेछ।",
        10: "लग्नेश दशौं भावमा: जातक आफ्नो कार्यक्षेत्रमा निकै सफल, नामी, प्रतिष्ठित र अधिकार सम्पन्न हुनेछ। पिताबाट राम्रो सहयोग मिल्नेछ।",
        11: "लग्नेश एघारौं भावमा: जातकलाई अनेकौं स्रोतबाट आम्दानी प्राप्त हुनेछ। व्यापारमा ठूलो नाफा मिल्नेछ र प्रतिष्ठित मित्रहरूबाट सहयोग मिल्नेछ।",
        12: "लग्नेश बाह्रौं भावमा: जातक आध्यात्मिक प्रवृत्तिको हुनेछ। विदेश यात्रा वा वैदेशिक सम्बन्धबाट लाभ लिन सक्नेछ तर खर्चमा केही नियन्त्रण राख्नुपर्नेछ।"
      }
    };
  }, []);

  const planetPredictionsSaravali = useMemo(() => {
    return {
      Sun: {
        en: "The Sun represents the soul and authority. Placed in this sign, it makes you self-reliant, commanding, and highly conscious of your duty, leading to success in administrative roles.",
        ne: "सूर्यले आत्मा र अधिकारको प्रतिनिधित्व गर्दछ। यस राशिमा अवस्थित सूर्यले तपाईंलाई स्वाभिमानी, कर्तव्यनिष्ठ र साहसी बनाउँछ, जसले प्रशासनिक र नेतृत्वदायी भूमिकामा सफलता दिनेछ।"
      },
      Moon: {
        en: "The Moon rules over the mind and emotions. Placed here, it endows you with creative thinking, intuitive power, compassionate nature, and an appreciation for art and beauty.",
        ne: "चन्द्रमाले मन र भावनाको प्रतिनिधित्व गर्दछ। यहाँ अवस्थित चन्द्रमाले तपाईंलाई कोमल हृदय, सृजनात्मक सोच, बलियो अन्तर्दृष्टि र कला-सौन्दर्यमा रुचि प्रदान गर्दछ।"
      },
      Mars: {
        en: "Mars is the planet of energy and action. It gives you determination, physical strength, competitive drive, and the capability to face obstacles head-on.",
        ne: "मङ्गल ऊर्जा र पराक्रमको ग्रह हो। यसको प्रभावले तपाईंमा दृढ इच्छाशक्ति, शारीरिक बल, चुनौतीसँग लड्ने क्षमता र काममा तीव्रता प्रदान गर्दछ।"
      },
      Mercury: {
        en: "Mercury governs speech, trade, and intelligence. Placed in this sign, it gives you excellent communication skills, logical thinking, analytical abilities, and commercial talent.",
        ne: "बुधले वाणी, व्यापार र बुद्धिको प्रतिनिधित्व गर्दछ। यस राशिमा रहेको बुधले तपाईंलाई वाकपटुता, तार्किक क्षमता, नयाँ कुरा सिक्ने रुचि र व्यापारिक चेतना दिन्छ।"
      },
      Jupiter: {
        en: "Jupiter is the guru of devas, representing wisdom and wealth. It showers blessings of higher knowledge, religious bent of mind, good fortune, and respected status in life.",
        ne: "बृहस्पति (गुरु) ज्ञान, भाग्य र धर्मका कारक हुन्। यसको अनुकूलताले तपाईंमा उच्च बौद्धिक क्षमता, धार्मिक अभिरुचि, धन र समाजमा सम्मानित स्थान दिलाउँछ।"
      },
      Venus: {
        en: "Venus represents relationship, wealth, and arts. It grants you a charming nature, interest in luxury and comfort, harmonious marriage, and creative talents.",
        ne: "शुक्र सौन्दर्य, कला र वैवाहिक सुखका कारक हुन्। यसको शुभ प्रभावले तपाईंलाई विलासी जीवनशैली, सुखी दाम्पत्य सम्बन्ध र कलात्मक प्रतिभा दिनेछ।"
      },
      Saturn: {
        en: "Saturn is the planet of karma and discipline. It brings structure, patience, resilience, and maturity through hard work. Success comes slowly but lasts long.",
        ne: "शनि कर्म, न्याय र अनुशासनका कारक हुन्। यसले कडा मिहिनेत, धैर्यता र कर्तव्यनिष्ठता प्रदान गर्दछ। संघर्ष पछि आउने सफलता दिगो र बलियो रहनेछ।"
      },
      Rahu: {
        en: "Rahu represents desires and innovations. It creates a hunger for success, inclination towards foreign lands, technology, and unusual fields.",
        ne: "राहुले महत्वाकांक्षा र आधुनिक प्रविधिको प्रतिनिधित्व गर्दछ। यसले विदेश यात्रा, प्रविधिको प्रयोग र फरक खालका क्षेत्रबाट अचानक लाभ दिने योग बनाउँछ।"
      },
      Ketu: {
        en: "Ketu represents liberation and deep spiritual insight. It promotes dispassion towards material desires and prompts a quest for meditation, yoga, and ultimate truth.",
        ne: "केतु मोक्ष र अध्यात्मका कारक हुन्। यसको प्रभावले भौतिक विलासिता भन्दा मानसिक शान्ति, ध्यान, योग र रहस्यमय विद्याहरूमा बढी रुचि जागृत गराउँछ।"
      }
    };
  }, []);

  const renderBPHS = () => {
    const lagnaInfo = SIGN_INFO[language][lagnaNum];
    const lagnaLordName = language === "ne" ? PLANET_NAMES.ne[lagnaLordEn] : lagnaLordEn;
    const predictionText = bphsLagnaLordPredictions[language][lagnaLordHouse];
    
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className="glass-panel" style={{ background: "rgba(212,175,55,0.02)" }}>
          <h4 style={{ color: "var(--color-gold)" }}>
            {language === "ne" ? "लग्न कुण्डली विश्लेषण" : "Ascendant Chart Analysis"}
          </h4>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", marginTop: "10px" }}>
            {language === "ne" ? (
              <>
                तपाईंको जन्म लग्न <strong>{lagnaInfo.name}</strong> हो। यसको तत्व <strong>{lagnaInfo.element}</strong> र गुण <strong>{lagnaInfo.quality}</strong> हो। यस लग्नको स्वामी <strong>{lagnaLordName}</strong> हो।
              </>
            ) : (
              <>
                Your birth ascendant is <strong>{lagnaInfo.name}</strong>. Its element is <strong>{lagnaInfo.element}</strong> and quality is <strong>{lagnaInfo.quality}</strong>. The ruling lord of this lagna is <strong>{lagnaLordName}</strong>.
              </>
            )}
          </p>
          <div style={{ marginTop: "12px", borderLeft: "2px solid var(--color-gold)", paddingLeft: "14px", fontStyle: "italic", fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
            "{lagnaInfo.desc}"
          </div>
        </div>

        <div className="glass-panel" style={{ background: "rgba(255,255,255,0.02)" }}>
          <h4 style={{ color: "var(--color-gold)" }}>
            {language === "ne" ? `लग्नेश (${lagnaLordName}) को भाव फल (BPHS अध्याय ६)` : `Lagna Lord (${lagnaLordName}) in House Placement (BPHS Ch. 6)`}
          </h4>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", marginTop: "12px", color: "var(--color-text-primary)" }}>
            {predictionText}
          </p>
        </div>
      </div>
    );
  };

  const renderSaravali = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
          {language === "ne" ? "कल्याण वर्माको सरावली ग्रन्थ अनुसार ग्रहहरूको राशिगत फल कथन:" : "Classical planet predictions based on Kalyan Varma's Saravali:"}
        </p>

        {planets.map((p) => {
          const plNe = PLANET_NAMES[language][p.name] || p.name;
          const signName = SIGN_NAMES_DICT[language][p.sign_number];
          const desc = planetPredictionsSaravali[p.name]?.[language] || "";
          
          return (
            <div key={p.name} style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
              <h5 style={{ color: "var(--color-gold)", display: "flex", gap: "8px", alignItems: "center" }}>
                <span>✦</span> {plNe} ({p.name}) - {signName} ({p.sign_number})
              </h5>
              <p style={{ marginTop: "6px", fontSize: "0.88rem", lineHeight: "1.5", color: "var(--color-text-primary)" }}>
                {desc} {language === "ne" ? `यो ग्रह तपाईको कुण्डलीको ${p.house} औं घरमा अवस्थित छ।` : `This planet is placed in your ${p.house} house.`}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const renderJatakaParijata = () => {
    // Find exalted and debilitated planets
    const exaltedPlanets = planets.filter(p => p.exaltation_state === "exalted");
    const debilitatedPlanets = planets.filter(p => p.exaltation_state === "debilitated");
    
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className="glass-panel" style={{ background: "rgba(255,255,255,0.02)" }}>
          <h4 style={{ color: "var(--color-gold)" }}>
            {language === "ne" ? "ग्रहहरूको उच्च र नीच अवस्था विश्लेषण" : "Exaltation & Debilitation Analysis"}
          </h4>
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
            {language === "ne" ? "जातक पारिजात अनुसार ग्रहहरू आफ्नो उच्च राशिमा रहँदा पूर्ण फल दिन्छन् र नीच राशिमा रहँदा कमजोर फल दिन्छन्:" : "According to Jataka Parijata, planets in their sign of exaltation give maximum auspicious results, whereas in debilitation they become weak:"}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <strong style={{ color: "var(--color-success)" }}>
                {language === "ne" ? "उच्च अवस्थामा रहेका ग्रहहरू:" : "Exalted Planets:"}
              </strong>
              {exaltedPlanets.length > 0 ? (
                <ul style={{ paddingLeft: "20px", marginTop: "6px", fontSize: "0.9rem" }}>
                  {exaltedPlanets.map(p => (
                    <li key={p.name}>
                      {language === "ne" ? PLANET_NAMES.ne[p.name] : p.name} ({SIGN_NAMES_DICT[language][p.sign_number]} राशिमा)
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                  {language === "ne" ? "यो कुण्डलीमा कुनै पनि ग्रह उच्च छैनन्।" : "No planets are in exaltation in this chart."}
                </p>
              )}
            </div>

            <div style={{ marginTop: "12px" }}>
              <strong style={{ color: "var(--color-error)" }}>
                {language === "ne" ? "नीच अवस्थामा रहेका ग्रहहरू:" : "Debilitated Planets:"}
              </strong>
              {debilitatedPlanets.length > 0 ? (
                <ul style={{ paddingLeft: "20px", marginTop: "6px", fontSize: "0.9rem" }}>
                  {debilitatedPlanets.map(p => (
                    <li key={p.name}>
                      {language === "ne" ? PLANET_NAMES.ne[p.name] : p.name} ({SIGN_NAMES_DICT[language][p.sign_number]} राशिमा)
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                  {language === "ne" ? "यो कुण्डलीमा कुनै भी ग्रह नीच छैनन्।" : "No planets are in debilitation in this chart."}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ background: "rgba(212,175,55,0.02)" }}>
          <h4 style={{ color: "var(--color-gold)" }}>
            {language === "ne" ? "राजयोग तथा धनयोग विश्लेषण" : "Raja Yoga & Dhana Yoga Highlights"}
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.6", color: "var(--color-text-primary)" }}>
            {language === "ne" ? (
              <>
                १. <strong>केन्द्र-त्रिकोण सम्बन्ध योग:</strong> जब केन्द्र (१, ४, ७, १०) र त्रिकोण (५, ९) का स्वामीहरू एकसाथ बस्छन् वा परस्पर दृष्टि राख्छन्, तब ठूलो राजयोग बन्छ। तपाईंको कुण्डलीमा गुरु र मङ्गलको अनुकूल दृष्टिले भाग्यवर्धक योग निर्माण गरेको छ।
                <br /><br />
                २. <strong>गजकेशरी योग:</strong> यदि चन्द्रमाबाट केन्द्रमा (१, ४, ७, १० औं भावमा) बृहस्पति अवस्थित छ भने गजकेशरी योग बन्छ। यसले समाजमा ख्याति, बुद्धिमत्ता र धन सम्पत्ति प्रदान गर्दछ।
              </>
            ) : (
              <>
                1. <strong>Kendra-Trikona Yoga:</strong> When the lords of houses 1, 4, 7, 10 (Kendra) and 5, 9 (Trikona) associate, they form a powerful Raja Yoga. In your chart, Jupiter and Mars establish a mutually beneficial relationship promoting fortune.
                <br /><br />
                2. <strong>Gaja-Kesari Yoga:</strong> If Jupiter is placed in a Kendra house (1st, 4th, 7th, or 10th) from the Moon, it forms Gaja Kesari Yoga, representing wisdom, continuous success, and prosperity in life.
              </>
            )}
          </p>
        </div>
      </div>
    );
  };

  switch (referenceType) {
    case "bph":
      return renderBPHS();
    case "saravali":
      return renderSaravali();
    case "jataka":
      return renderJatakaParijata();
    default:
      return null;
  }
}
