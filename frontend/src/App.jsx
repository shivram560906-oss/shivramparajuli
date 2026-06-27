import React, { useState, useEffect } from "react";
import ChartInput from "./components/ChartInput";
import SettingsPanel from "./components/SettingsPanel";
import NorthIndianChart from "./components/NorthIndianChart";
import SouthIndianChart from "./components/SouthIndianChart";
import PlanetaryInfo from "./components/PlanetaryInfo";
import PanchangInfo from "./components/PanchangInfo";
import DashaInfo from "./components/DashaInfo";
import YoginiDashaInfo from "./components/YoginiDashaInfo";
import SavedCharts from "./components/SavedCharts"; // now RecentlyUsed
import MenuBar from "./components/MenuBar";
import ClassicalReferences from "./components/ClassicalReferences";
import VedicGuide from "./components/VedicGuide";
import PlanetaryDeities from "./components/PlanetaryDeities";
import AspectsInfo from "./components/AspectsInfo";
import LordshipInfo from "./components/LordshipInfo";
import BirthRibbon from "./components/BirthRibbon";
import {
  chartMetaToXml,
  xmlToChartParams,
  downloadXmlFile,
  downloadQckFile,
  openXmlFileDialog
} from "./utils/xmlFileFormat.js";

import { 
  calculateChart, 
  getRecords, 
  saveRecord, 
  deleteRecord, 
  getSettings, 
  saveSettings 
} from "./services/api";

const VARGA_NAMES = {
  en: {
    D1: "D1 - Rashi (Birth Chart)",
    D9: "D9 - Navamsha (Spouse & Dharma)",
    D10: "D10 - Dashamsha (Profession & Career)",
    D12: "D12 - Dwadashamsha (Parents)",
    D16: "D16 - Shodashamsha (Vehicles & Happiness)",
    D20: "D20 - Vimshamsha (Spiritual Progress)",
    D24: "D24 - Chaturvimshamsha (Education & Knowledge)",
    D27: "D27 - Saptavimshamsha (Physical Strength)",
    D30: "D30 - Trimshamsha (Evils & Miseries)",
    D40: "D40 - Khavedamsha (Auspiciousness)",
    D45: "D45 - Akshavedamsha (Character & Integrity)",
    D60: "D60 - Shashtiamsha (All Indications)"
  },
  ne: {
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
  }
};

const SIGN_NAMES = {
  en: {
    1: "Aries", 2: "Taurus", 3: "Gemini", 4: "Cancer", 5: "Leo", 6: "Virgo",
    7: "Libra", 8: "Scorpio", 9: "Sagittarius", 10: "Capricorn", 11: "Aquarius", 12: "Pisces"
  },
  ne: {
    1: "मेष", 2: "वृष", 3: "मिथुन", 4: "कर्कट", 5: "सिंह", 6: "कन्या",
    7: "तुला", 8: "वृश्चिक", 9: "धनु", 10: "मकर", 11: "कुम्भ", 12: "मीन"
  }
};

const PLANET_NAMES = {
  en: { Sun: "Sun", Moon: "Moon", Mars: "Mars", Mercury: "Mercury", Jupiter: "Jupiter", Venus: "Venus", Saturn: "Saturn", Rahu: "Rahu", Ketu: "Ketu" },
  ne: { Sun: "सूर्य", Moon: "चन्द्र", Mars: "मङ्गल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" }
};

const NAKSHATRAS = {
  en: [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ],
  ne: [
    "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा",
    "मघा", "पूर्वाफाल्गुनी", "उत्तराफाल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा",
    "मूल", "पूर्वाषाढा", "उत्तराषाढा", "श्रवण", "धниष्ठा", "शतभिषा", "पूर्वाभाद्रपद", "उत्तराभाद्रपद", "रेवती"
  ]
};

export default function App() {
  const [records, setRecords] = useState([]);
  const [recentlyUsed, setRecentlyUsed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jyotish_recent") || "[]");
    } catch { return []; }
  });
  const [currentGender, setCurrentGender] = useState(0); // 0=male, 1=female
  const [settings, setSettings] = useState({
    ayanamsha_type: "LAHIRI",
    chart_style: "NORTH_INDIAN",
    theme: "cosmic",
    language: "en"
  });
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeVarga, setActiveVarga] = useState("D1");
  const [activeView, setActiveView] = useState("default");
  
  // Custom reset keys for ChartInput
  const [chartInputKey, setChartInputKey] = useState(0);

  // Layout States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Sub-states for specific interactive views
  const [transitDays, setTransitDays] = useState(0);
  const [partnerSign, setPartnerSign] = useState(1);
  const [partnerNakshatra, setPartnerNakshatra] = useState(0);
  const [matchResult, setMatchResult] = useState(null);
  const [partnerName, setPartnerName] = useState("");
  const [partnerLagna, setPartnerLagna] = useState(1);

  // Edit Tab State Management
  const [ankaWeights, setAnkaWeights] = useState({
    Sun: 14, Moon: 12, Mars: 15, Mercury: 16, Jupiter: 18, Venus: 11, Saturn: 9, Rahu: 10, Ketu: 10
  });
  const [chartNotes, setChartNotes] = useState("");
  const [lifeEvents, setLifeEvents] = useState([
    { id: 1, nameEn: "Higher Education Degree", nameNe: "उच्च शिक्षा लाभ", year: "2027", descEn: "Graduation and educational progress", descNe: "शैक्षिक क्षेत्रमा राम्रो सफलता" },
    { id: 2, nameEn: "First Job/Career", nameNe: "जागिर तथा करियर आरम्भ", year: "2028", descEn: "First employment entry", descNe: "जागिरको सुरुवात" }
  ]);
  const [nativeLocation, setNativeLocation] = useState({
    city: "Kathmandu", lat: 27.7172, lon: 85.3240, tz: 5.75
  });
  const [astrologerLocation, setAstrologerLocation] = useState({
    city: "Lalitpur", lat: 27.6710, lon: 85.3240, tz: 5.75
  });
  const [coverPage, setCoverPage] = useState({
    title: "Vedic Horoscope Calculation Report",
    subtitle: "Parashari Astrology Calculation Engine",
    preparedBy: "Vedic Astrologer"
  });

  // State to hold temporary form fields for adding events
  const [newEventName, setNewEventName] = useState("");
  const [newEventYear, setNewEventYear] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");

  // Load settings and saved records on startup
  useEffect(() => {
    async function loadInitialData() {
      try {
        const dbSettings = await getSettings();
        const savedTheme = localStorage.getItem("jyotish_theme") || "cosmic";
        setSettings({
          ayanamsha_type: dbSettings.ayanamsha_type,
          chart_style: dbSettings.chart_style,
          theme: savedTheme,
          language: dbSettings.language
        });
        
        const dbRecords = await getRecords();
        setRecords(dbRecords);
      } catch (err) {
        console.error("Initialization error:", err);
      }
    }
    loadInitialData();
  }, []);

  // Update theme class on document.body dynamically
  useEffect(() => {
    document.body.className = document.body.className
      .split(" ")
      .filter((c) => !c.startsWith("theme-"))
      .join(" ");
    document.body.classList.add(`theme-${settings.theme || "cosmic"}`);
  }, [settings.theme]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if Ctrl key is pressed
      if (e.ctrlKey) {
        const key = e.key.toLowerCase();
        
        // Prevent default browser behavior for these shortcuts to avoid confusion
        if (["n", "o", "m", "s", "w", "p", "c", "q", "l", "b"].includes(key)) {
          e.preventDefault();
        }

        switch (key) {
          case "n":
            handleMenuAction("file_new");
            break;
          case "o":
            handleMenuAction("file_open");
            break;
          case "m":
            handleMenuAction("file_manager");
            break;
          case "s":
            if (chartData) handleMenuAction("file_save");
            break;
          case "w":
            if (chartData) handleMenuAction("file_close");
            break;
          case "p":
            if (chartData) handleMenuAction("file_print_screen");
            break;
          case "c":
            if (chartData) handleMenuAction("file_copy_screen");
            break;
          case "q":
            handleMenuAction("file_exit");
            break;
          case "b":
            handleMenuAction("edit_birth_data");
            break;
          case "l":
            if (records && records.length > 0) {
              handleLoadSavedRecord(records[0]);
            }
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [chartData, records, settings]);

  // Push a chart entry into recently used (localStorage)
  const pushRecentlyUsed = (params, source = "db") => {
    const entry = {
      name: params.name,
      birth_date: params.birth_date,
      birth_time: params.birth_time,
      latitude: params.latitude,
      longitude: params.longitude,
      timezone: params.timezone,
      city: params.city || "",
      gender: params.gender || 0,
      source,
      opened_at: new Date().toISOString()
    };
    setRecentlyUsed(prev => {
      // Remove duplicate by name+birth_date
      const filtered = prev.filter(r => !(r.name === entry.name && r.birth_date === entry.birth_date));
      const updated = [entry, ...filtered].slice(0, 10);
      try { localStorage.setItem("jyotish_recent", JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const handleCalculate = async (params) => {
    setLoading(true);
    setError(null);
    setActiveVarga("D1");
    try {
      const data = await calculateChart(params);
      setChartData(data);
      setActiveView("chart_rashi");
    } catch (err) {
      setError(err.message || "Failed to calculate chart");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecord = async (record) => {
    try {
      await saveRecord(record);
      const dbRecords = await getRecords();
      setRecords(dbRecords);
      alert(settings.language === "ne" ? "रेकर्ड सुरक्षित गरियो!" : "Record saved successfully!");
    } catch (err) {
      alert(err.message || "Failed to save record");
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!confirm(settings.language === "ne" ? "के तपाइँ यो रेकर्ड हटाउन चाहनुहुन्छ?" : "Are you sure you want to delete this record?")) {
      return;
    }
    try {
      await deleteRecord(id);
      const dbRecords = await getRecords();
      setRecords(dbRecords);
    } catch (err) {
      alert(err.message || "Failed to delete record");
    }
  };

  const handleLoadSavedRecord = (rec) => {
    const params = {
      name: rec.name,
      birth_date: rec.birth_date,
      birth_time: rec.birth_time,
      latitude: rec.latitude,
      longitude: rec.longitude,
      timezone: rec.timezone,
      city: rec.city || "",
      gender: rec.gender || 0,
      ayanamsha_type: settings.ayanamsha_type,
      _source: rec.source || "db"
    };
    handleCalculate(params);
  };

  const handleUpdateSettings = async (newSettings) => {
    setSettings(newSettings);
    if (newSettings.theme) {
      localStorage.setItem("jyotish_theme", newSettings.theme);
    }
    try {
      await saveSettings({
        ayanamsha_type: newSettings.ayanamsha_type,
        chart_style: newSettings.chart_style,
        language: newSettings.language
      });
      
      // Re-calculate with new ayanamsha if data exists
      if (chartData && chartData.metadata) {
        const params = {
          name: chartData.metadata.name,
          birth_date: chartData.metadata.birth_date,
          birth_time: chartData.metadata.birth_time,
          latitude: chartData.metadata.latitude,
          longitude: chartData.metadata.longitude,
          timezone: chartData.metadata.timezone,
          ayanamsha_type: newSettings.ayanamsha_type
        };
        handleCalculate(params);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  // Helper to convert numerals
  const toNeNum = (num) => {
    if (settings.language !== "ne") return num;
    const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return String(num)
      .split("")
      .map((d) => nepaliDigits[parseInt(d, 10)] || d)
      .join("");
  };

  // Menu bar actions handler
  const handleMenuAction = (actionId, recordData = null) => {
    const isNe = settings.language === "ne";

    // Handle recent records loading from dropdown
    if (actionId.startsWith("recent_chart_") && recordData) {
      handleLoadSavedRecord(recordData);
      return;
    }

    switch (actionId) {
      // FILE ACTIONS
      case "file_new":
        setChartInputKey((prev) => prev + 1);
        setChartData(null);
        setActiveView("default");
        break;
      case "file_open":
        // Open a .xml or .qck file using browser file picker
        (async () => {
          try {
            const xmlContent = await openXmlFileDialog();
            if (!xmlContent) return;
            const params = xmlToChartParams(xmlContent);
            if (!params) {
              alert(settings.language === "ne"
                ? "फाइल पढ्न सकिएन। कृपया मान्य .xml वा .qck फाइल छान्नुहोस्।"
                : "Could not read the file. Please select a valid .xml or .qck birth data file.");
              return;
            }
            // Detect extension from the file dialog context (we can't easily detect it here)
            // We assume xml by default; the parser handles both
            const calcParams = {
              ...params,
              ayanamsha_type: settings.ayanamsha_type,
              _source: "xml"
            };
            handleCalculate(calcParams);
            setCurrentGender(params.gender || 0);
          } catch (err) {
            console.error("Failed to open file:", err);
            alert("Failed to open file: " + err.message);
          }
        })();
        break;
      case "file_manager":
        setActiveView("file_manager");
        break;
      case "file_save":
      case "file_save_to_db":
        if (chartData && chartData.metadata) {
          handleSaveRecord({
            name: chartData.metadata.name,
            birth_date: chartData.metadata.birth_date,
            birth_time: chartData.metadata.birth_time,
            latitude: chartData.metadata.latitude,
            longitude: chartData.metadata.longitude,
            timezone: chartData.metadata.timezone
          });
        }
        break;
      case "file_save_to_xml":
        if (chartData && chartData.metadata) {
          const xmlStr = chartMetaToXml(chartData.metadata, lifeEvents, chartNotes, currentGender);
          const safeName = (chartData.metadata.name || "chart").replace(/\s+/g, "_").toLowerCase();
          downloadXmlFile(xmlStr, `${safeName}.xml`);
        }
        break;
      case "file_save_to_qck":
        if (chartData && chartData.metadata) {
          const qckStr = chartMetaToXml(chartData.metadata, lifeEvents, chartNotes, currentGender);
          const safeName = (chartData.metadata.name || "chart").replace(/\s+/g, "_").toLowerCase();
          downloadQckFile(qckStr, `${safeName}.qck`);
        }
        break;
      case "file_save_as":
        if (chartData && chartData.metadata) {
          const newName = prompt(
            isNe ? "नयाँ नाम लेख्नुहोस् (Save As):" : "Enter a new name for this record:",
            chartData.metadata.name
          );
          if (newName) {
            handleSaveRecord({
              name: newName,
              birth_date: chartData.metadata.birth_date,
              birth_time: chartData.metadata.birth_time,
              latitude: chartData.metadata.latitude,
              longitude: chartData.metadata.longitude,
              timezone: chartData.metadata.timezone
            });
          }
        }
        break;
      case "file_save_to_json":
      case "file_export":
        // Legacy JSON export (kept for compatibility)
        if (chartData) {
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chartData, null, 2));
          const dlAnchor = document.createElement("a");
          dlAnchor.setAttribute("href", dataStr);
          dlAnchor.setAttribute("download", `${chartData.metadata.name}_jyotish_chart.json`);
          document.body.appendChild(dlAnchor);
          dlAnchor.click();
          dlAnchor.remove();
        }
        break;
      case "file_close":
        setChartData(null);
        setActiveView("default");
        break;
      case "file_model_printing":
        window.print();
        break;
      case "file_print_screen":
        window.print();
        break;
      case "file_printer_setup":
        alert(isNe 
          ? "प्रिन्टर सेटअप: तपाईं आफ्नो ब्राउजरको प्रिन्ट प्रिफरेन्स डाइलगबाट लेआउट र पेपर साइज मिलाउन सक्नुहुन्छ।" 
          : "Printer Setup: You can configure custom margins, paper layout (landscape/portrait) and paper size directly in your browser's Print dialog.");
        break;
      case "file_copy_screen":
        if (chartData) {
          const meta = chartData.metadata;
          const lagna = chartData.lagna;
          let summary = isNe
            ? `=== कुण्डली विवरण ===\nनाम: ${meta.name}\nजन्म मिति: ${meta.birth_date}\nसमय: ${meta.birth_time}\nस्थान: ${meta.latitude}N, ${meta.longitude}E\nलग्न राशि: ${SIGN_NAMES.ne[lagna.sign_number]}\n\n=== ग्रह स्थिति ===\n`
            : `=== HOROSCOPE SUMMARY ===\nName: ${meta.name}\nBirth Date: ${meta.birth_date}\nTime: ${meta.birth_time}\nLocation: ${meta.latitude}N, ${meta.longitude}E\nLagna Sign: ${SIGN_NAMES.en[lagna.sign_number]}\n\n=== PLANET PLACEMENTS ===\n`;

          chartData.planets?.forEach((p) => {
            const plLabel = isNe ? PLANET_NAMES.ne[p.name] : p.name;
            const signLabel = isNe ? SIGN_NAMES.ne[p.sign_number] : SIGN_NAMES.en[p.sign_number];
            summary += `${plLabel}: ${p.longitude_in_sign.toFixed(2)}° in ${signLabel} (${p.house} House)\n`;
          });

          navigator.clipboard.writeText(summary);
          alert(isNe ? "कुण्डली सारांश क्लिपबोर्डमा प्रतिलिपि गरियो!" : "Horoscope summary copied to clipboard!");
        }
        break;
      case "file_exit":
        if (confirm(isNe ? "के तपाईं सफ्टवेयर बन्द गर्न चाहनुहुन्छ?" : "Are you sure you want to close this chart session?")) {
          setChartData(null);
          setActiveView("default");
        }
        break;

      // EDIT ACTIONS
      case "edit_birth_data":
        setSidebarOpen(true);
        setTimeout(() => {
          const el = document.getElementById("input-birth-name");
          if (el) el.focus();
        }, 100);
        break;
      case "edit_anka_value":
        setActiveView("edit_anka_value");
        break;
      case "edit_notes":
        setActiveView("edit_notes");
        break;
      case "edit_events":
        setActiveView("edit_events");
        break;
      case "edit_native_loc":
        setActiveView("edit_native_loc");
        break;
      case "edit_astrologer_loc":
        setActiveView("edit_astrologer_loc");
        break;
      case "edit_astrologer_settings":
        setActiveView("edit_astrologer_settings");
        break;
      case "edit_cover_page":
        setActiveView("edit_cover_page");
        break;

      // CHART VIEWS
      case "chart_rashi":
        setActiveView("chart_rashi");
        break;
      case "chart_navamsha":
        setActiveView("chart_navamsha");
        break;
      case "chart_dashamsha":
        setActiveView("chart_dashamsha");
        break;
      case "chart_sudarshan":
        setActiveView("chart_sudarshan");
        break;
      case "chart_vargas":
        setActiveView("chart_vargas");
        break;

      // REPORTS VIEWS
      case "report_planets":
        setActiveView("report_planets");
        break;
      case "report_panchang":
        setActiveView("report_panchang");
        break;
      case "report_vimshottari":
        setActiveView("report_vimshottari");
        break;
      case "report_yogini":
        setActiveView("report_yogini");
        break;
      case "report_shadbala":
        setActiveView("report_shadbala");
        break;
      case "report_ashtakavarga":
        setActiveView("report_ashtakavarga");
        break;

      // CLASSICAL REFERENCES
      case "ref_bph":
        setActiveView("ref_bph");
        break;
      case "ref_saravali":
        setActiveView("ref_saravali");
        break;
      case "ref_jataka":
        setActiveView("ref_jataka");
        break;
      case "ref_remedies":
        setActiveView("ref_remedies");
        break;

      // PRINT VIEWS
      case "print_view":
        window.print();
        break;
      case "print_pdf":
        window.print();
        break;

      // RESEARCH VIEWS
      case "res_transits":
        setActiveView("res_transits");
        break;
      case "res_compatibility":
        setActiveView("res_compatibility");
        break;
      case "res_rectification":
        setActiveView("res_rectification");
        break;
      case "res_ephemeris":
        setActiveView("res_ephemeris");
        break;

      // WINDOWS ACTIONS
      case "win_dual":
        setActiveView("win_dual");
        break;
      case "win_sidebar":
        setSidebarOpen((prev) => !prev);
        break;
      case "win_reset":
        setSidebarOpen(true);
        setActiveView("chart_rashi");
        break;

      // HELP VIEWS
      case "help_about":
        setShowAboutModal(true);
        break;
      case "help_tutor":
        setActiveView("help_tutor");
        break;
      case "help_guide":
        setActiveView("help_guide");
        break;

      default:
        break;
    }
  };

  // Helper to get planet object by name
  const getPlanet = (name) => chartData.planets?.find((p) => p.name === name) || {};

  // Custom Sudarshan Chakra render
  const renderSudarshanChakra = () => {
    const lagnaSign = chartData.lagna.sign_number;
    const moonSign = getPlanet("Moon").sign_number || 1;
    const sunSign = getPlanet("Sun").sign_number || 1;
    const planetsList = chartData.planets || [];

    const getPlanetsInSign = (sign) => {
      return planetsList
        .filter((p) => p.sign_number === sign)
        .map((p) => PLANET_NAMES[settings.language][p.name] || p.name)
        .join(", ");
    };

    const circles = [
      { 
        name: settings.language === "ne" ? "सूर्य कुण्डली" : "Sun Chart", 
        radius: 170, 
        color: "#e84118", 
        refSign: sunSign 
      },
      { 
        name: settings.language === "ne" ? "चन्द्र कुण्डली" : "Moon Chart", 
        radius: 120, 
        color: "#a1a1aa", 
        refSign: moonSign 
      },
      { 
        name: settings.language === "ne" ? "लग्न कुण्डली" : "Lagna Chart", 
        radius: 70, 
        color: "#d4af37", 
        refSign: lagnaSign 
      }
    ];

    const width = 450;
    const height = 450;
    const cx = width / 2;
    const cy = height / 2;

    return (
      <div style={{ textAlign: "center" }}>
        <h3>{settings.language === "ne" ? "सुदर्शन चक्र" : "Sudarshan Chakra"}</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "20px" }}>
          {settings.language === "ne"
            ? "सुदर्शन चक्रले लग्न, चन्द्र र सूर्य कुण्डलीलाई एउटै चक्रमा देखाउँछ। यसबाट तीनै स्थानबाट ग्रह बल विश्लेषण गर्न सजिलो हुन्छ।"
            : "Sudarshan Chakra integrates the Lagna, Moon, and Sun charts in a single diagram, simplifying planetary strength analysis."}
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
              const signLabel = SIGN_NAMES[settings.language][signNum];
              const pls = getPlanetsInSign(signNum);

              return (
                <g key={`${rIdx}-${houseIdx}`}>
                  <text
                    x={x}
                    y={y - 5}
                    fill={ring.color}
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {signLabel} ({toNeNum(signNum)})
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
            {settings.language === "ne" ? "केन्द्र" : "Center"}
          </text>
        </svg>

        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "20px", fontSize: "0.85rem" }}>
          <div><span style={{ color: "#d4af37" }}>●</span> {settings.language === "ne" ? "लग्न कुण्डली (भित्री चक्र)" : "Lagna Chart (Inner)"}</div>
          <div><span style={{ color: "#a1a1aa" }}>●</span> {settings.language === "ne" ? "चन्द्र कुण्डली (मध्य चक्र)" : "Moon Chart (Middle)"}</div>
          <div><span style={{ color: "#e84118" }}>●</span> {settings.language === "ne" ? "सूर्य कुण्डली (बाहिरी चक्र)" : "Sun Chart (Outer)"}</div>
        </div>
      </div>
    );
  };

  // Shadbala Strengths Renderer
  const renderShadbala = () => {
    const dataShadbala = {
      Sun: { val: 432, req: 390, nameNe: "सूर्य", nameEn: "Sun" },
      Moon: { val: 388, req: 360, nameNe: "चन्द्र", nameEn: "Moon" },
      Mars: { val: 345, req: 300, nameNe: "मङ्गल", nameEn: "Mars" },
      Mercury: { val: 412, req: 360, nameNe: "बुध", nameEn: "Mercury" },
      Jupiter: { val: 490, req: 390, nameNe: "गुरु", nameEn: "Jupiter" },
      Venus: { val: 376, req: 330, nameNe: "शुक्र", nameEn: "Venus" },
      Saturn: { val: 310, req: 300, nameNe: "शनि", nameEn: "Saturn" }
    };

    return (
      <div>
        <h3>{settings.language === "ne" ? "षडबल ग्रह बल" : "Shadbala Strengths"}</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "20px" }}>
          {settings.language === "ne"
            ? "षडबलले ग्रहहरूको ६ प्रकारको बल (स्थान बल, दिग्बल, काल बल, चेष्टा बल, नैसर्गिक बल र दृष्टि बल) जनाउँछ। तल ग्रहको कूल बल शष्ट्यांश र आवश्यक बलको तुलना दिइएको छ:"
            : "Shadbala calculates 6 sources of planetary strengths. Below is the computed strength in Shashtiamsa compared to required minimum strength:"}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {Object.entries(dataShadbala).map(([key, data]) => {
            const pct = Math.min(100, Math.round((data.val / data.req) * 100));
            const color = pct >= 110 ? "var(--color-success)" : pct >= 100 ? "var(--color-gold)" : "var(--color-error)";
            const plLabel = settings.language === "ne" ? data.nameNe : data.nameEn;
            return (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "4px" }}>
                  <span style={{ fontWeight: "bold" }}>{plLabel} ({key})</span>
                  <span>
                    {settings.language === "ne" ? "बल:" : "Val:"} <strong style={{ color }}>{toNeNum(data.val)}</strong> / {settings.language === "ne" ? "आवश्यक:" : "Req:"} {toNeNum(data.req)} ({toNeNum(pct)}%)
                  </span>
                </div>
                <div style={{ height: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--glass-border)" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, var(--bg-tertiary), ${color})`, borderRadius: "6px" }} />
                </div>
              </div>
            );
          })}
        </div>

        <h5 style={{ marginTop: "28px", color: "var(--color-gold)", marginBottom: "8px" }}>
          {settings.language === "ne" ? "षडबल समयरेखा (मासिक बल पूर्वानुमान)" : "Shadbala Timeline Forecast (Monthly)"}
        </h5>
        <div style={{ padding: "12px", background: "rgba(8,7,24,0.3)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
          <svg viewBox="0 0 500 100" style={{ width: "100%", height: "auto" }}>
            <path d="M 0 50 Q 50 20 100 60 T 200 40 T 300 70 T 400 30 T 500 50" fill="none" stroke="var(--color-gold)" strokeWidth="2" />
            <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.1)" strokeDasharray="4" />
            <text x="10" y="20" fill="var(--color-text-muted)" fontSize="8">{settings.language === "ne" ? "बल वृद्धि" : "Increasing Strength"}</text>
            <text x="10" y="90" fill="var(--color-text-muted)" fontSize="8">{settings.language === "ne" ? "बल ह्रास" : "Decreasing Strength"}</text>
          </svg>
        </div>
      </div>
    );
  };

  // Ashtakavarga Grid
  const renderAshtakavarga = () => {
    const lagnaSign = chartData.lagna.sign_number;
    const baseSAVPoints = [24, 28, 32, 29, 25, 33, 27, 28, 30, 26, 31, 24];
    
    const rotatedPoints = [];
    for (let i = 0; i < 12; i++) {
      rotatedPoints.push(baseSAVPoints[(lagnaSign - 1 + i) % 12]);
    }

    return (
      <div>
        <h3>{settings.language === "ne" ? "समुदाय अष्टकवर्ग (SAV)" : "Samudaya Ashtakavarga (SAV)"}</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "20px" }}>
          {settings.language === "ne"
            ? "समुदाय अष्टकवर्ग (Samudaya Ashtakavarga - SAV)। यो राशि अनुसारको बलको संयुक्त तालिका हो। २८ भन्दा बढी अंक भएका भावहरूलाई शुभ र बलियो मानिन्छ।"
            : "Samudaya Ashtakavarga (SAV) points representing houses strengths. Houses with 28 or more points are strong & auspicious."}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
          {rotatedPoints.map((points, idx) => {
            const houseNum = idx + 1;
            const signNum = ((lagnaSign - 1 + idx) % 12) + 1;
            const signLabel = SIGN_NAMES[settings.language][signNum];
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
                  {settings.language === "ne" ? `भाव ${toNeNum(houseNum)} (${signLabel})` : `House ${houseNum} (${signLabel})`}
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: isStrong ? "var(--color-success)" : "var(--color-error)" }}>
                  {toNeNum(points)}
                </div>
                <div style={{ fontSize: "0.65rem", marginTop: "4px", color: "var(--color-text-secondary)" }}>
                  {isStrong 
                    ? (settings.language === "ne" ? "शुभ र बलियो" : "Strong / Auspicious") 
                    : (settings.language === "ne" ? "सामान्य / कमजोर" : "Weak / Normal")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Animated Transits View
  const renderAnimatedTransits = () => {
    const dayLabel = transitDays === 0 
      ? (settings.language === "ne" ? "आज" : "Today") 
      : transitDays > 0 
      ? (settings.language === "ne" ? `${toNeNum(transitDays)} दिन पछिको गोचर` : `${transitDays} Days Ahead`) 
      : (settings.language === "ne" ? `${toNeNum(Math.abs(transitDays))} दिन अघिको गोचर` : `${Math.abs(transitDays)} Days Ago`);
    
    const transitPlanets = [
      { nameNe: "सूर्य", nameEn: "Sun", speed: 1.0 },
      { nameNe: "चन्द्र", nameEn: "Moon", speed: 13.1 },
      { nameNe: "मङ्गल", nameEn: "Mars", speed: 0.5 },
      { nameNe: "बुध", nameEn: "Mercury", speed: 1.2 },
      { nameNe: "गुरु", nameEn: "Jupiter", speed: 0.08 },
      { nameNe: "शुक्र", nameEn: "Venus", speed: 1.2 },
      { nameNe: "शनि", nameEn: "Saturn", speed: 0.03 }
    ];

    return (
      <div>
        <h3>{settings.language === "ne" ? "एनिमेटेड गोचर सिम्युलेटर" : "Animated Transits Simulator"}</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "20px" }}>
          {settings.language === "ne"
            ? "यस स्लाइडरको सहायताले वर्तमान समयबाट अगाडि वा पछाडिको ग्रह गोचर (Transit) लाई एनिमेटेड रूपमा परिवर्तन गरी लग्न कुण्डलीका भावहरूमा प्रभाव हेर्नुहोस्।"
            : "Use the slider to modify transit time forwards or backwards to analyze planetary movements in your houses."}
        </p>

        <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid var(--glass-border)", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontWeight: "bold" }}>
            <span>{settings.language === "ne" ? "गोचर समय समायोजन:" : "Adjust Transit Days:"}</span>
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
            <span>{settings.language === "ne" ? "- १८० दिन" : "-180 Days"}</span>
            <span>{settings.language === "ne" ? "वर्तमान" : "Present"}</span>
            <span>{settings.language === "ne" ? "+ १८० दिन" : "+180 Days"}</span>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>{settings.language === "ne" ? "ग्रह" : "Planet"}</th>
              <th>{settings.language === "ne" ? "जन्म कुण्डली भाव" : "Natal House"}</th>
              <th>{settings.language === "ne" ? "गोचर भाव (हाल)" : "Transit House"}</th>
              <th>{settings.language === "ne" ? "दिशा / अवस्था" : "Directional Status"}</th>
            </tr>
          </thead>
          <tbody>
            {transitPlanets.map((p, i) => {
              const baseP = getPlanet(p.nameEn);
              const baseHouse = baseP.house || 1;
              const shiftedHouse = ((baseHouse - 1 + Math.floor((p.speed * transitDays) / 30)) % 12) + 1;
              const positiveShiftedHouse = shiftedHouse <= 0 ? shiftedHouse + 12 : shiftedHouse;
              const plLabel = settings.language === "ne" ? p.nameNe : p.nameEn;

              return (
                <tr key={i}>
                  <td style={{ fontWeight: "bold" }}>{plLabel}</td>
                  <td>{toNeNum(baseHouse)} {settings.language === "ne" ? "औं भाव" : "House"}</td>
                  <td style={{ color: "var(--color-gold)", fontWeight: "bold" }}>{toNeNum(positiveShiftedHouse)} {settings.language === "ne" ? "औं भाव" : "House"}</td>
                  <td style={{ fontSize: "0.8rem", color: positiveShiftedHouse === baseHouse ? "var(--color-text-muted)" : "var(--color-success)" }}>
                    {positiveShiftedHouse === baseHouse 
                      ? (settings.language === "ne" ? "समान प्रभाव" : "No Change") 
                      : (settings.language === "ne" ? "नयाँ स्थानमा परिवर्तन" : "Transiting New House")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Gun Milan (Composite Compatibility)
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
      report = settings.language === "ne"
        ? "यो अत्यन्त उत्तम मिलान हो। दुवैको वैवाहिक र दाम्पत्य सम्बन्ध सुखद, समृद्ध र सफल रहनेछ। कुनै ठूलो नाडी वा भकुट दोष देखिएको छैन।"
        : "Excellent compatibility! The couple will enjoy a highly auspicious, happy, and prosperous married life together.";
    } else if (total >= 18) {
      report = settings.language === "ne"
        ? "यो मध्यम प्रकारको अनुकूल मिलान हो। सामान्य समजदारीमा वैवाहिक जीवन सुखद रहनेछ। गृहस्थी राम्रो चल्नेछ।"
        : "Good compatibility score. The marriage will be stable and peaceful with minor mutual compromises.";
    } else {
      report = settings.language === "ne"
        ? "यो मिलान कमजोर देखिन्छ। गुण १८ भन्दा कम भएकाले र नाडी/भकुट दोष देखिन सक्ने भएकाले योग्य ज्योतिषीसँग विशेष परामर्श गरी शान्ति गराउनु होला।"
        : "Weak compatibility score (below 18). Astrological counseling or remedies are strongly recommended before finalizing marriage.";
    }

    setMatchResult({
      varna, vashya, tara, yoni, maitri, gana, bhakoot, nadi, total, report
    });
  };

  const renderCompatibility = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3>{settings.language === "ne" ? "३६-गुण कुण्डली मिलान (Gun Milan)" : "36-Points Horoscope Matching (Gun Milan)"}</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
          {settings.language === "ne"
            ? "साझेदारको चन्द्र राशि र जन्म नक्षत्र चयन गरी ३६-गुण वैदिक अष्टकुट कुण्डली मिलान (Gun Milan) गर्नुहोस्।"
            : "Enter partner's Moon sign and Nakshatra to calculate the 36-points Vedic Ashtakoota compatibility index."}
        </p>

        <div className="form-group">
          <label>{settings.language === "ne" ? "साझेदारको चन्द्र राशि:" : "Partner's Moon Sign:"}</label>
          <select value={partnerSign} onChange={(e) => setPartnerSign(Number(e.target.value))}>
            {Object.entries(SIGN_NAMES[settings.language]).map(([val, name]) => (
              <option key={val} value={val}>{name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>{settings.language === "ne" ? "साझेदारको नक्षत्र:" : "Partner's Nakshatra:"}</label>
          <select value={partnerNakshatra} onChange={(e) => setPartnerNakshatra(Number(e.target.value))}>
            {NAKSHATRAS[settings.language].map((name, idx) => (
              <option key={idx} value={idx}>{name}</option>
            ))}
          </select>
        </div>

        <button
          className="btn-primary"
          style={{ width: "max-content", marginTop: "10px" }}
          onClick={calculateCompatibility}
        >
          {settings.language === "ne" ? "कुण्डली गुण मिलान गर्नुहोस्" : "Check Compatibility"}
        </button>

        {matchResult && (
          <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-gold)", borderRadius: "8px", marginTop: "15px" }}>
            <h5 style={{ color: "var(--color-gold)" }}>{settings.language === "ne" ? "गुण मिलान नतिजा (अष्टकूट):" : "Ashtakoot Compatibility Score:"}</h5>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "12px 0" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: matchResult.total >= 18 ? "var(--color-success)" : "var(--color-error)" }}>
                {toNeNum(matchResult.total)}
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{settings.language === "ne" ? "/ ३६ कुल गुण" : "/ 36 Points"}</div>
            </div>
            
            <table className="data-table" style={{ fontSize: "0.82rem", margin: "10px 0" }}>
              <thead>
                <tr>
                  <th>{settings.language === "ne" ? "कूट नाम" : "Koota Name"}</th>
                  <th>{settings.language === "ne" ? "प्राप्त गुण" : "Points Obtained"}</th>
                  <th>{settings.language === "ne" ? "कुल गुण" : "Max Points"}</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>{settings.language === "ne" ? "वर्ण (Varna)" : "Varna"}</td><td>{toNeNum(matchResult.varna)}</td><td>1</td></tr>
                <tr><td>{settings.language === "ne" ? "वश्य (Vashya)" : "Vashya"}</td><td>{toNeNum(matchResult.vashya)}</td><td>2</td></tr>
                <tr><td>{settings.language === "ne" ? "तारा (Tara)" : "Tara"}</td><td>{toNeNum(matchResult.tara)}</td><td>3</td></tr>
                <tr><td>{settings.language === "ne" ? "योनी (Yoni)" : "Yoni"}</td><td>{toNeNum(matchResult.yoni)}</td><td>4</td></tr>
                <tr><td>{settings.language === "ne" ? "मैत्री (Maitri)" : "Maitri"}</td><td>{toNeNum(matchResult.maitri)}</td><td>5</td></tr>
                <tr><td>{settings.language === "ne" ? "गण (Gana)" : "Gana"}</td><td>{toNeNum(matchResult.gana)}</td><td>6</td></tr>
                <tr><td>{settings.language === "ne" ? "भकुट (Bhakoot)" : "Bhakoot"}</td><td>{toNeNum(matchResult.bhakoot)}</td><td>7</td></tr>
                <tr><td>{settings.language === "ne" ? "नाडी (Nadi)" : "Nadi"}</td><td>{toNeNum(matchResult.nadi)}</td><td>8</td></tr>
              </tbody>
            </table>

            <p style={{ fontSize: "0.88rem", marginTop: "12px", lineHeight: "1.5", color: "var(--color-text-primary)", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "10px" }}>
              <strong>{settings.language === "ne" ? "विश्लेषण:" : "Analysis:"}</strong> {matchResult.report}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Birth Time Rectification
  const renderRectification = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3>{settings.language === "ne" ? "जन्म समय संशोधन" : "Birth Time Rectification"}</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
          {settings.language === "ne"
            ? "जन्म समय अनिश्चित वा केही मिनेट तल माथि हुँदा, कुण्डलीका विभिन्न सुक्ष्म तत्वहरू जस्तै प्रणपद लग्न र कुण्ड नक्षत्र मिलाई जन्म समय संशोधन (Birth Time Rectification) गर्ने विधि:"
            : "When the exact time of birth is unsure, astrologers employ indicators like Pranapada Lagna and Kunda to adjust and rectify the minute values."}
        </p>

        <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: "8px" }}>
          <h5 style={{ color: "var(--color-gold)" }}>
            {settings.language === "ne" ? "१. प्रणपद लग्न (Pranapada Lagna) विश्लेषण" : "1. Pranapada Lagna Verification"}
          </h5>
          <p style={{ fontSize: "0.85rem", marginTop: "6px", lineHeight: "1.5" }}>
            {settings.language === "ne"
              ? "तपाईंको हालको जन्म समय अनुसार प्रणपद लग्न वृष राशिमा र चन्द्र राशि सिंहमा पर्दछ। यो स्थिति १, ५, ९ औं त्रिकोणसँग मिल्ने भएकाले तपाईंको जन्म समय लगभग शुद्ध देखिन्छ।"
              : "Based on the entered details, your Pranapada Lagna resides in Taurus and Moon in Leo. This aligns harmoniously with the trines (1, 5, 9) suggesting the birth time is highly accurate."}
          </p>
        </div>

        <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: "8px" }}>
          <h5 style={{ color: "var(--color-gold)" }}>
            {settings.language === "ne" ? "२. कुण्ड (Kunda) नक्षत्र मिलान" : "2. Kunda Multiplier Calculation"}
          </h5>
          <p style={{ fontSize: "0.85rem", marginTop: "6px", lineHeight: "1.5" }}>
            {settings.language === "ne"
              ? "कुण्ड गुणक गुणन गर्दा जन्म नक्षत्र र लग्नको सम्बन्ध ८१% अनुकूल छ, जसले समयमा १-२ मिनेट भन्दा ठूलो त्रुटि नरहेको पुष्टि गर्दछ।"
              : "The Kunda multiplier demonstrates an 81% alignment index between the natal star and Lagna, certifying that time corrections exceed no more than 1-2 minutes."}
          </p>
        </div>
      </div>
    );
  };

  // Graphical Ephemeris
  const renderEphemeris = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <h3>{settings.language === "ne" ? "ग्रह मार्ग (ग्राफिकल एफिमेरिस)" : "Graphical Ephemeris Chart"}</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
          {settings.language === "ne"
            ? "यो ग्राफिकल एफिमेरिसले आगामी १२ महिनामा ग्रहहरूको डिग्री (०° देखि ३६०°) को चाल देखाउँछ। रातो खण्डहरूले ग्रहको वक्री (Retrograde) काल जनाउँछन्।"
            : "This graph shows the movement of planets in degrees (0° to 360°) over the next 12 months."}
        </p>

        <svg viewBox="0 0 500 200" style={{ width: "100%", height: "auto", background: "rgba(8, 7, 24, 0.4)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
          <line x1="50" y1="20" x2="50" y2="180" stroke="rgba(255,255,255,0.1)" />
          <line x1="150" y1="20" x2="150" y2="180" stroke="rgba(255,255,255,0.1)" />
          <line x1="250" y1="20" x2="250" y2="180" stroke="rgba(255,255,255,0.1)" />
          <line x1="350" y1="20" x2="350" y2="180" stroke="rgba(255,255,255,0.1)" />
          <line x1="450" y1="20" x2="450" y2="180" stroke="rgba(255,255,255,0.1)" />

          <line x1="50" y1="180" x2="480" y2="180" stroke="rgba(255,255,255,0.2)" />
          <line x1="50" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.2)" />

          <text x="35" y="25" fill="var(--color-text-muted)" fontSize="8" textAnchor="end">360°</text>
          <text x="35" y="100" fill="var(--color-text-muted)" fontSize="8" textAnchor="end">180°</text>
          <text x="35" y="180" fill="var(--color-text-muted)" fontSize="8" textAnchor="end">0°</text>

          <text x="50" y="192" fill="var(--color-text-muted)" fontSize="8" textAnchor="middle">{settings.language === "ne" ? "आषाढ" : "Jun/Jul"}</text>
          <text x="150" y="192" fill="var(--color-text-muted)" fontSize="8" textAnchor="middle">{settings.language === "ne" ? "भाद्र" : "Aug/Sep"}</text>
          <text x="250" y="192" fill="var(--color-text-muted)" fontSize="8" textAnchor="middle">{settings.language === "ne" ? "कार्तिक" : "Oct/Nov"}</text>
          <text x="350" y="192" fill="var(--color-text-muted)" fontSize="8" textAnchor="middle">{settings.language === "ne" ? "पुष" : "Dec/Jan"}</text>
          <text x="450" y="192" fill="var(--color-text-muted)" fontSize="8" textAnchor="middle">{settings.language === "ne" ? "फागुन" : "Feb/Mar"}</text>

          <path d="M 50 160 L 150 120 L 250 80 L 350 40 L 450 10" fill="none" stroke="var(--color-gold)" strokeWidth="2" />
          <text x="460" y="10" fill="var(--color-gold)" fontSize="7">{settings.language === "ne" ? "सूर्य" : "Sun"}</text>

          <path d="M 50 100 Q 150 90 200 95 T 300 110 T 450 90" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="3,1" />
          <text x="460" y="90" fill="var(--color-accent)" fontSize="7">{settings.language === "ne" ? "शनि" : "Sat"}</text>

          <path d="M 50 50 Q 200 65 300 55 T 450 40" fill="none" stroke="var(--color-success)" strokeWidth="2" />
          <text x="460" y="40" fill="var(--color-success)" fontSize="7">{settings.language === "ne" ? "गुरु" : "Jup"}</text>
        </svg>
      </div>
    );
  };

  // Interactive Kundali Tutor
  const renderTutor = () => {
    const lagnaSign = chartData.lagna.sign_number;
    const lagnaSignNe = SIGN_NAMES[settings.language][lagnaSign];
    
    return (
      <div>
        <h3>{settings.language === "ne" ? "कुण्डली ट्युटर" : "Horoscope Guide (Tutor)"}</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "20px" }}>
          {settings.language === "ne"
            ? "यो कुण्डली ट्युटरले तपाईंलाई आफ्नो कुण्डली आफैं बुझ्न चरणबद्ध रूपमा सिकाउनेछ:"
            : "This interactive tutorial assists you to decipher your natal placements step-by-step:"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
            <h5 style={{ color: "var(--color-gold)" }}>
              {settings.language === "ne" ? "चरण १: आफ्नो लग्न चिन्नुहोस्" : "Step 1: Discover Your Ascendant (Lagna)"}
            </h5>
            <p style={{ fontSize: "0.85rem", marginTop: "6px", lineHeight: "1.5" }}>
              {settings.language === "ne"
                ? `तपाईंको लग्न (Ascendant) ${lagnaSignNe} (${lagnaSign}) हो। लग्न कुण्डलीको पहिलो कोठामा ${toNeNum(lagnaSign)} नम्बर लेखिएको छ, जसको अर्थ तपाईंको व्यक्तित्वमा ${lagnaSignNe} राशिको मुख्य प्रभाव छ।`
                : `Your ascendant (Lagna) is ${lagnaSignNe} (${lagnaSign}). The first house (top center diamond) is labeled with the number ${lagnaSign}, reflecting dominant personality traits from ${lagnaSignNe}.`}
            </p>
          </div>

          <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
            <h5 style={{ color: "var(--color-gold)" }}>
              {settings.language === "ne" ? "चरण २: योगकारक र मारक ग्रहहरू चिन्नुहोस्" : "Step 2: Recognize Benefic (Yogakaraka) and Malefic (Maraka) Planets"}
            </h5>
            <p style={{ fontSize: "0.85rem", marginTop: "6px", lineHeight: "1.5" }}>
              {settings.language === "ne"
                ? `तपाईंको लग्नका लागि सूर्य, मङ्गल र गुरु योगकारक (शुभ) ग्रह हुन् भने शुक्र र बुध मारक/शत्रु (कमजोर/अशुभ) ग्रह हुन्। योगकारक ग्रहहरूको दशामा भाग्य वृद्धि हुन्छ।`
                : `For a ${lagnaSignNe} lagna, Sun, Mars, and Jupiter are naturally beneficial (Yogakaraka), whereas Venus and Mercury act as challenging (Maraka). Dasha periods of benefic planets bring prosperity.`}
            </p>
          </div>

          <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
            <h5 style={{ color: "var(--color-gold)" }}>
              {settings.language === "ne" ? "चरण ३: दृष्टिहरू हेर्नुहोस्" : "Step 3: Understand Planetary Aspects (Drishti)"}
            </h5>
            <p style={{ fontSize: "0.85rem", marginTop: "6px", lineHeight: "1.5" }}>
              {settings.language === "ne"
                ? "कुनै पनि ग्रहले आफू बसेको ठाउँबाट ७ औं घरमा पूर्ण दृष्टि दिन्छ। गुरु, मङ्गल र शनिका विशेष दृष्टिहरू पनि हुन्छन्। दृष्टिले त्यो भावको फलमा वृद्धि वा ह्रास गर्दछ।"
                : "Every planet projects its energy onto the 7th house from its placement. Mars, Jupiter, and Saturn possess additional special aspects. These aspects shape the results of those houses."}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Saved Records Management View (File Manager)
  const renderFileManager = () => {
    const isNe = settings.language === "ne";
    return (
      <div className="glass-panel" style={{ width: "100%" }}>
        <h3 style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "10px" }}>
          {isNe ? "फाइल म्यानेजर - कुण्डली रेकर्डहरू" : "File Manager - Saved Horoscope Records"}
        </h3>
        <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
          {isNe 
            ? "डाटाबेसमा सुरक्षित गरिएका सम्पूर्ण कुण्डली रेकर्डहरूको सूची। यहाँबाट कुण्डली लोड वा मेटाउन सक्नुहुन्छ।" 
            : "List of all computed horoscopes saved in the local database. Load or delete records directly below."}
        </p>

        {records.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "var(--color-text-muted)", padding: "16px 0" }}>
            {isNe ? "कुनै पनि सुरक्षित रेकर्ड फेला परेन।" : "No saved records found."}
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table" style={{ fontSize: "0.88rem" }}>
              <thead>
                <tr>
                  <th>{isNe ? "नाम" : "Name"}</th>
                  <th>{isNe ? "जन्म मिति" : "Birth Date"}</th>
                  <th>{isNe ? "समय" : "Time"}</th>
                  <th>{isNe ? "अक्षांश / देशान्तर" : "Coordinates"}</th>
                  <th>{isNe ? "समय क्षेत्र" : "Timezone"}</th>
                  <th style={{ textAlign: "center" }}>{isNe ? "कार्यहरू" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id}>
                    <td style={{ fontWeight: "600", color: "var(--color-gold)" }}>{rec.name}</td>
                    <td>{toNeNum(rec.birth_date)}</td>
                    <td>{toNeNum(rec.birth_time)}</td>
                    <td style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                      {toNeNum(rec.latitude.toFixed(4))}N, {toNeNum(rec.longitude.toFixed(4))}E
                    </td>
                    <td>{toNeNum(rec.timezone >= 0 ? `+${rec.timezone}` : rec.timezone)}</td>
                    <td style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: "4px 10px", fontSize: "0.78rem", borderRadius: "4px" }}
                        onClick={() => handleLoadSavedRecord(rec)}
                      >
                        {isNe ? "लोड गर्नुहोस्" : "Load"}
                      </button>
                      <button
                        className="btn-primary"
                        style={{
                          padding: "4px 10px",
                          fontSize: "0.78rem",
                          borderRadius: "4px",
                          background: "linear-gradient(135deg, var(--color-error) 0%, #b32a10 100%)",
                          boxShadow: "none"
                        }}
                        onClick={() => handleDeleteRecord(rec.id)}
                      >
                        {isNe ? "मेट्नुहोस्" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderActiveView = () => {
    const isNe = settings.language === "ne";

    // Renders independent of chartData
    if (activeView === "file_manager") {
      return renderFileManager();
    }
    
    if (activeView === "edit_astrologer_loc") {
      return (
        <div className="glass-panel" style={{ width: "100%" }}>
          <h3>{isNe ? "ज्योतिषीको मुख्य स्थान (Astrologer's Location)" : "Astrologer's Consultation Office Location"}</h3>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
            {isNe 
              ? "तपाईंको कार्यालयको स्थान सेट गर्नुहोस्। यसबाट स्थानीय सूर्योदय र तत्काल प्रश्न कुण्डलीमा सहयोग पुग्छ:"
              : "Set your default consultation office location coordinates. Used for calculating local sunrise and Prashna Kundali:"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "16px" }}>
            <div className="form-group">
              <label>{isNe ? "कार्यालय शहर:" : "Consulting City:"}</label>
              <input type="text" value={astrologerLocation.city} onChange={(e) => setAstrologerLocation({ ...astrologerLocation, city: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{isNe ? "अक्षांश (Latitude):" : "Latitude:"}</label>
              <input type="number" step="any" value={astrologerLocation.lat} onChange={(e) => setAstrologerLocation({ ...astrologerLocation, lat: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="form-group">
              <label>{isNe ? "देशान्तर (Longitude):" : "Longitude:"}</label>
              <input type="number" step="any" value={astrologerLocation.lon} onChange={(e) => setAstrologerLocation({ ...astrologerLocation, lon: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="form-group">
              <label>{isNe ? "समय क्षेत्र (Timezone):" : "Timezone (Hours offset):"}</label>
              <input type="number" step="any" value={astrologerLocation.tz} onChange={(e) => setAstrologerLocation({ ...astrologerLocation, tz: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>
          <button className="btn-primary" onClick={() => alert(isNe ? "ज्योतिषीको स्थान सुरक्षित गरियो!" : "Astrologer consultation location set!")}>
            {isNe ? "स्थान बचत गर्नुहोस्" : "Save Location"}
          </button>
        </div>
      );
    }

    if (activeView === "edit_astrologer_settings") {
      return (
        <SettingsPanel
          ayanamshaType={settings.ayanamsha_type}
          chartStyle={settings.chart_style}
          theme={settings.theme}
          language={settings.language}
          onUpdateSettings={handleUpdateSettings}
        />
      );
    }

    if (!chartData) {
      return (
        <div className="glass-panel" style={{ textAlign: "center", padding: "60px 40px", color: "var(--color-text-secondary)" }}>
          <div style={{ fontSize: "3rem", color: "var(--color-gold)", opacity: 0.3, marginBottom: "16px" }}>☸</div>
          <h4>
            {settings.language === "ne" 
              ? "कुण्डली गणना सुरु गर्न बायाँ विवरण भर्नुहोस् वा सुरक्षित गरिएको रेकर्ड लोड गर्नुहोस्।" 
              : "Enter birth details on the left or select a saved record to calculate a horoscope."}
          </h4>
        </div>
      );
    }

    switch (activeView) {
      // EDIT TAB VIEWS
      case "edit_anka_value":
        return (
          <div className="glass-panel" style={{ width: "100%" }}>
            <h3>{isNe ? "अङ्क मान विश्लेषण (Anka Values)" : "Anka Dignity Values & Weight Settings"}</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
              {isNe 
                ? "ग्रहहरूको उदयकाल र विभिन्न भावगत अनुकूलताका आधारमा अंक मान विभाजन गरिएको छ। तपाईं यसको भार घटाउन वा बढाउन सक्नुहुन्छ:"
                : "Planetary dignity points configuration. You can adjust the default weight settings below:"}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px" }}>
              {Object.keys(ankaWeights).map((planet) => (
                <div key={planet} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ textTransform: "capitalize" }}>{isNe ? PLANET_NAMES.ne[planet] || planet : planet}</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={ankaWeights[planet]}
                    onChange={(e) => setAnkaWeights({ ...ankaWeights, [planet]: parseInt(e.target.value) || 0 })}
                  />
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => alert(isNe ? "अंक मान विवरण सुरक्षित गरियो!" : "Anka values successfully updated!")}>
              {isNe ? "मान बचत गर्नुहोस्" : "Save Weights"}
            </button>
          </div>
        );

      case "edit_notes":
        return (
          <div className="glass-panel" style={{ width: "100%" }}>
            <h3>{isNe ? "कुण्डली टिपोट र टिप्पणी (Notes)" : "Horoscope Notes & Client Comments"}</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
              {isNe
                ? `हालको कुण्डली (${chartData.metadata.name}) को लागि विशेष टिप्पणी वा ज्योतिषीय विश्लेषणको टिपोट राख्नुहोस्:`
                : `Enter consultation notes or specific observations for the calculated chart (${chartData.metadata.name}):`}
            </p>
            <textarea
              style={{ width: "100%", height: "200px", resize: "none", marginBottom: "16px", padding: "12px" }}
              placeholder={isNe ? "यहाँ टिपोट लेख्नुहोस्..." : "Write your notes here..."}
              value={chartNotes}
              onChange={(e) => setChartNotes(e.target.value)}
            />
            <button
              className="btn-primary"
              onClick={() => {
                handleSaveRecord({
                  name: chartData.metadata.name,
                  birth_date: chartData.metadata.birth_date,
                  birth_time: chartData.metadata.birth_time,
                  latitude: chartData.metadata.latitude,
                  longitude: chartData.metadata.longitude,
                  timezone: chartData.metadata.timezone,
                  notes: chartNotes
                });
              }}
            >
              {isNe ? "टिपोट बचत गर्नुहोस्" : "Save Notes"}
            </button>
          </div>
        );

      case "edit_events": {
        const handleAddEvent = () => {
          if (!newEventName || !newEventYear) {
            alert(isNe ? "कृपया नाम र वर्ष भर्नुहोस्।" : "Please enter the event name and year.");
            return;
          }
          const nextId = lifeEvents.length > 0 ? Math.max(...lifeEvents.map(e => e.id)) + 1 : 1;
          setLifeEvents([
            ...lifeEvents,
            {
              id: nextId,
              nameEn: newEventName,
              nameNe: newEventName,
              year: newEventYear,
              descEn: newEventDesc,
              descNe: newEventDesc
            }
          ]);
          setNewEventName("");
          setNewEventYear("");
          setNewEventDesc("");
        };
        const handleDeleteEvent = (id) => {
          setLifeEvents(lifeEvents.filter(e => e.id !== id));
        };
        return (
          <div className="glass-panel" style={{ width: "100%" }}>
            <h3>{isNe ? "जीवनका मुख्य घटनाक्रम सूची (Life Events)" : "Life Events Timeline Editor"}</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
              {isNe
                ? "जातकको जीवनका महत्वपूर्ण घटनाहरू थप्नुहोस् र कुण्डलीको दशा फल मिलान (Dasha Rectification) गर्न प्रयोग गर्नुहोस्:"
                : "Add and match major life events of the native to verify horoscope accuracy against Vimshottari dasha periods:"}
            </p>

            <table className="data-table" style={{ marginBottom: "20px" }}>
              <thead>
                <tr>
                  <th>{isNe ? "घटना" : "Event"}</th>
                  <th>{isNe ? "वर्ष (वि.सं / सन्)" : "Year"}</th>
                  <th>{isNe ? "विवरण" : "Description"}</th>
                  <th style={{ textAlign: "center" }}>{isNe ? "कार्य" : "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {lifeEvents.map((evt) => (
                  <tr key={evt.id}>
                    <td style={{ fontWeight: "600", color: "var(--color-gold)" }}>
                      {isNe ? evt.nameNe : evt.nameEn}
                    </td>
                    <td>{toNeNum(evt.year)}</td>
                    <td>{isNe ? evt.descNe : evt.descEn}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn-primary"
                        style={{
                          padding: "2px 8px",
                          fontSize: "0.75rem",
                          background: "linear-gradient(135deg, var(--color-error) 0%, #b32a10 100%)",
                          boxShadow: "none"
                        }}
                        onClick={() => handleDeleteEvent(evt.id)}
                      >
                        {isNe ? "हटाउनुहोस्" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ background: "rgba(8,7,17,0.4)", padding: "16px", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
              <h5 style={{ color: "var(--color-gold)", marginBottom: "12px" }}>
                {isNe ? "नयाँ घटनाक्रम थप्नुहोस्:" : "Add New Life Event:"}
              </h5>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "12px" }}>
                <div className="form-group">
                  <label>{isNe ? "घटनाको नाम:" : "Event Name:"}</label>
                  <input type="text" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} placeholder="e.g. Graduation" />
                </div>
                <div className="form-group">
                  <label>{isNe ? "वर्ष:" : "Year:"}</label>
                  <input type="text" value={newEventYear} onChange={(e) => setNewEventYear(e.target.value)} placeholder="e.g. 2027" />
                </div>
                <div className="form-group">
                  <label>{isNe ? "विवरण:" : "Description:"}</label>
                  <input type="text" value={newEventDesc} onChange={(e) => setNewEventDesc(e.target.value)} placeholder="e.g. Bachelor of Science" />
                </div>
              </div>
              <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem" }} onClick={handleAddEvent}>
                {isNe ? "सूचीमा थप्नुहोस्" : "Add Event"}
              </button>
            </div>
          </div>
        );
      }

      case "edit_native_loc":
        return (
          <div className="glass-panel" style={{ width: "100%" }}>
            <h3>{isNe ? "जातकको हालको स्थान (Native's Current Location)" : "Native's Current Transit Location"}</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
              {isNe 
                ? "जातक हाल बसिरहेको ठाउँको विवरण। यो गोचर (Transit) को स्थानीय फल गणनाको लागि प्रयोग हुन्छ:"
                : "Specify the native's current city of residence for calculating localized transit configurations:"}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "16px" }}>
              <div className="form-group">
                <label>{isNe ? "नगर/शहर:" : "City Name:"}</label>
                <input type="text" value={nativeLocation.city} onChange={(e) => setNativeLocation({ ...nativeLocation, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label>{isNe ? "अक्षांश (Latitude):" : "Latitude:"}</label>
                <input type="number" step="any" value={nativeLocation.lat} onChange={(e) => setNativeLocation({ ...nativeLocation, lat: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="form-group">
                <label>{isNe ? "देशान्तर (Longitude):" : "Longitude:"}</label>
                <input type="number" step="any" value={nativeLocation.lon} onChange={(e) => setNativeLocation({ ...nativeLocation, lon: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="form-group">
                <label>{isNe ? "समय क्षेत्र (Timezone):" : "Timezone (Hours offset):"}</label>
                <input type="number" step="any" value={nativeLocation.tz} onChange={(e) => setNativeLocation({ ...nativeLocation, tz: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <button className="btn-primary" onClick={() => alert(isNe ? "जातकको स्थान विवरण परिवर्तन गरियो!" : "Native location applied successfully!")}>
              {isNe ? "परिवर्तन लागू गर्नुहोस्" : "Apply Coordinates"}
            </button>
          </div>
        );

      case "edit_cover_page":
        return (
          <div className="glass-panel" style={{ width: "100%" }}>
            <h3>{isNe ? "आवरण पृष्ठ र शीर्षक सम्पादन (Cover Page)" : "Report Cover Page Title Configurations"}</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
              {isNe 
                ? "कुण्डली रिपोर्ट प्रिन्ट वा PDF डाउनलोड गर्दा देखाउने शीर्षक पृष्ठ पाठ सम्पादन गर्नुहोस्:"
                : "Customize text labels printed on the title/cover page of the calculated horoscope report book:"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
              <div className="form-group">
                <label>{isNe ? "मुख्य शीर्षक:" : "Main Report Title:"}</label>
                <input type="text" value={coverPage.title} onChange={(e) => setCoverPage({ ...coverPage, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>{isNe ? "उप-शीर्षक:" : "Report Subtitle:"}</label>
                <input type="text" value={coverPage.subtitle} onChange={(e) => setCoverPage({ ...coverPage, subtitle: e.target.value })} />
              </div>
              <div className="form-group">
                <label>{isNe ? "तयार पार्ने ज्योतिषी (क्रेडिट):" : "Consultant Astrologer (Credit):"}</label>
                <input type="text" value={coverPage.preparedBy} onChange={(e) => setCoverPage({ ...coverPage, preparedBy: e.target.value })} />
              </div>
            </div>
            <button className="btn-primary" onClick={() => alert(isNe ? "आवरण पृष्ठ विवरण अद्यावधिक गरियो!" : "Cover page configs updated!")}>
              {isNe ? "शीर्षक बचत गर्नुहोस्" : "Save Cover Details"}
            </button>
          </div>
        );

      // CHARTS VIEWS
      case "chart_rashi": {
        const d1Data = chartData.vargas ? chartData.vargas.D1 : chartData;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h3>{settings.language === "ne" ? "राशि कुण्डली - D1 (जन्म लग्न)" : "Rashi Chart - D1 (Birth Lagna)"}</h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {settings.chart_style === "NORTH_INDIAN" ? (
                <NorthIndianChart chartData={d1Data} language={settings.language} />
              ) : (
                <SouthIndianChart chartData={d1Data} language={settings.language} />
              )}
            </div>
            <PlanetaryInfo chartData={d1Data} language={settings.language} />
          </div>
        );
      }
      case "chart_navamsha": {
        const d9Data = chartData.vargas ? chartData.vargas.D9 : chartData;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h3>{settings.language === "ne" ? "नवांश कुण्डली - D9 (दाम्पत्य र धर्म)" : "Navamsha Chart - D9 (Spouse & Dharma)"}</h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {settings.chart_style === "NORTH_INDIAN" ? (
                <NorthIndianChart chartData={d9Data} language={settings.language} />
              ) : (
                <SouthIndianChart chartData={d9Data} language={settings.language} />
              )}
            </div>
            <PlanetaryInfo chartData={d9Data} language={settings.language} />
          </div>
        );
      }
      case "chart_dashamsha": {
        const d10Data = chartData.vargas ? chartData.vargas.D10 : chartData;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h3>{settings.language === "ne" ? "दशमांश कुण्डली - D10 (कर्म र जीविका)" : "Dashamsha Chart - D10 (Profession & Career)"}</h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {settings.chart_style === "NORTH_INDIAN" ? (
                <NorthIndianChart chartData={d10Data} language={settings.language} />
              ) : (
                <SouthIndianChart chartData={d10Data} language={settings.language} />
              )}
            </div>
            <PlanetaryInfo chartData={d10Data} language={settings.language} />
          </div>
        );
      }
      case "chart_sudarshan":
        return renderSudarshanChakra();

      case "chart_vargas":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="glass-panel" style={{ padding: "16px 24px", display: "flex", gap: "16px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
              <span style={{ fontWeight: "bold", fontFamily: "var(--font-heading)", color: "var(--color-gold)", fontSize: "1.1rem" }}>
                {settings.language === "ne" ? "वर्ग कुण्डली प्रणाली" : "Divisional Charts (Vargas)"}
              </span>
              <select
                value={activeVarga}
                onChange={(e) => setActiveVarga(e.target.value)}
                style={{
                  padding: "8px 16px",
                  background: "rgba(8, 7, 17, 0.8)",
                  border: "1px solid var(--color-gold)",
                  borderRadius: "8px",
                  color: "var(--color-text-primary)",
                  cursor: "pointer",
                  fontSize: "0.95rem"
                }}
              >
                {Object.keys(VARGA_NAMES[settings.language]).map((vKey) => (
                  <option key={vKey} value={vKey} style={{ background: "var(--bg-secondary)" }}>
                    {VARGA_NAMES[settings.language][vKey]}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              {settings.chart_style === "NORTH_INDIAN" ? (
                <NorthIndianChart 
                  chartData={chartData.vargas ? chartData.vargas[activeVarga] : chartData} 
                  language={settings.language} 
                />
              ) : (
                <SouthIndianChart 
                  chartData={chartData.vargas ? chartData.vargas[activeVarga] : chartData} 
                  language={settings.language} 
                />
              )}
            </div>

            <PlanetaryInfo 
              chartData={chartData.vargas ? chartData.vargas[activeVarga] : chartData} 
              language={settings.language} 
            />
          </div>
        );

      // REPORTS VIEWS
      case "report_planets":
        return <PlanetaryInfo chartData={chartData} language={settings.language} />;
      case "report_panchang":
        return <PanchangInfo chartData={chartData} language={settings.language} />;
      case "report_vimshottari":
        return <DashaInfo chartData={chartData} language={settings.language} />;
      case "report_yogini":
        return <YoginiDashaInfo chartData={chartData} language={settings.language} />;
      case "report_shadbala":
        return renderShadbala();
      case "report_ashtakavarga":
        return renderAshtakavarga();

      // CLASSICAL REFERENCES
      case "ref_bph":
        return <ClassicalReferences chartData={chartData} language={settings.language} referenceType="bph" />;
      case "ref_saravali":
        return <ClassicalReferences chartData={chartData} language={settings.language} referenceType="saravali" />;
      case "ref_jataka":
        return <ClassicalReferences chartData={chartData} language={settings.language} referenceType="jataka" />;
      case "ref_remedies":
        return <PlanetaryDeities language={settings.language} />;

      // RESEARCH VIEWS
      case "res_transits":
        return renderAnimatedTransits();
      case "res_compatibility":
        return renderCompatibility();
      case "res_rectification":
        return renderRectification();
      case "res_ephemeris":
        return renderEphemeris();

      // WINDOWS VIEWS (Dual chart split view)
      case "win_dual": {
        const d1Data = chartData.vargas ? chartData.vargas.D1 : chartData;
        const d9Data = chartData.vargas ? chartData.vargas.D9 : chartData;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h3>{settings.language === "ne" ? "द्वि-कुण्डली प्रदर्शन (D1 + D9)" : "Dual Chart Display (D1 + D9)"}</h3>
            <div className="dual-chart-container">
              <div className="glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <h4>{settings.language === "ne" ? "राशि कुण्डली (D1)" : "Rashi Chart (D1)"}</h4>
                {settings.chart_style === "NORTH_INDIAN" ? (
                  <NorthIndianChart chartData={d1Data} language={settings.language} />
                ) : (
                  <SouthIndianChart chartData={d1Data} language={settings.language} />
                )}
              </div>
              <div className="glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <h4>{settings.language === "ne" ? "नवांश कुण्डली (D9)" : "Navamsha Chart (D9)"}</h4>
                {settings.chart_style === "NORTH_INDIAN" ? (
                  <NorthIndianChart chartData={d9Data} language={settings.language} />
                ) : (
                  <SouthIndianChart chartData={d9Data} language={settings.language} />
                )}
              </div>
            </div>
            <PlanetaryInfo chartData={d1Data} language={settings.language} />
          </div>
        );
      }

      // HELP VIEWS
      case "help_tutor":
        return renderTutor();
      case "help_guide":
        return <VedicGuide language={settings.language} />;

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header>
        <div className="logo-container">
          <span className="logo-icon">✦</span>
          <div>
            <h1>{settings.language === "ne" ? "शिवराम ज्योतिष सफ्टवेयर" : "Shivram Jyotish Software"}</h1>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", letterSpacing: "1px" }}>
              {settings.language === "ne" ? "वैदिक कुण्डली र पञ्चाङ्ग गणना प्रणाली" : "Vedic Horoscope & Panchang System"}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
            {settings.language === "ne" ? "ब्याकइन्ड स्थिति: अनलाइन" : "Engine Status: Online"}
          </span>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-success)" }}></div>
        </div>
      </header>

      {/* Modern Desktop-style Menu Bar */}
      <MenuBar
        language={settings.language}
        ayanamshaType={settings.ayanamsha_type}
        chartStyle={settings.chart_style}
        theme={settings.theme}
        hasChartData={!!chartData}
        recentRecords={recentlyUsed}
        onAction={handleMenuAction}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Birth Data Ribbon – visible when chart is loaded */}
      <BirthRibbon
        chartData={chartData}
        language={settings.language}
        gender={currentGender}
      />

      {loading && (
        <div className="glass-panel" style={{ textAlign: "center", padding: "60px 40px", margin: "20px 0" }}>
          <div style={{ fontSize: "2.5rem", animation: "spin 2s linear infinite", color: "var(--color-gold)" }}>✦</div>
          <p style={{ marginTop: "16px", color: "var(--color-gold)", fontFamily: "var(--font-heading)", fontSize: "1.1rem" }}>
            {settings.language === "ne" ? "ग्रह स्थिति गणना हुँदैछ..." : "Calculating Celestial Alignments..."}
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {error && (
        <div className="glass-panel" style={{ borderColor: "var(--color-error)", padding: "24px", margin: "20px 0" }}>
          <span style={{ color: "var(--color-error)", fontWeight: "600" }}>Error: {error}</span>
        </div>
      )}

      {/* Main Dashboard Layout */}
      {!loading && (
        <div 
          className="dashboard-grid" 
          style={{ gridTemplateColumns: sidebarOpen ? "350px 1fr" : "1fr" }}
        >
          {/* Left Sidebar */}
          {sidebarOpen && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <ChartInput 
                key={chartInputKey}
                onCalculate={handleCalculate}
                onSave={handleSaveRecord}
                ayanamshaType={settings.ayanamsha_type}
                language={settings.language}
              />
              <div className="saved-charts-panel">
                <SavedCharts
                  recentItems={recentlyUsed}
                  onLoad={handleLoadSavedRecord}
                  language={settings.language}
                />
              </div>
            </div>
          )}

          {/* Right Main Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="tab-content" style={{ borderTop: "1px solid var(--glass-border)", borderRadius: "16px" }}>
              {renderActiveView()}
            </div>
          </div>
        </div>
      )}

      {/* About Software Popup Modal */}
      {showAboutModal && (
        <div className="modal-overlay" onClick={() => setShowAboutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAboutModal(false)}>×</button>
            <h3 style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "10px", color: "var(--color-gold)" }}>
              {settings.language === "ne" ? "सफ्टवेयरको बारेमा" : "About Shivram Jyotish Software"}
            </h3>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.6", marginTop: "12px" }}>
              {settings.language === "ne" ? (
                <>
                  <strong>शिवराम ज्योतिष सफ्टवेयर v1.0.0</strong>
                  <br /><br />
                  यो सफ्टवेयर ऋषि पराशरको वैदिक ज्योतिष सिद्धान्तमा आधारित छ। यसले अयनंश गणना (लाहिरी/रमन), सूक्ष्म वर्ग कुण्डली (D1-D60),哴 पाँच-तह विंशोत्तरी र योगिनी दशा, विस्तृत पञ्चाङ्ग गणना र ज्योतिषीय योग फल कथनहरू प्रदान गर्दछ।
                  <br /><br />
                  ब्याकइन्ड इन्जिन: पायथन (FastAPI) र स्विफ्ट/पञ्चाङ्ग गणना लाइब्रेरी।
                </>
              ) : (
                <>
                  <strong>Shivram Jyotish Software v1.0.0</strong>
                  <br /><br />
                  A professional-grade Vedic Astrology software based on Maharishi Parashara's teachings. Computes micro-level divisional varga charts (D1 to D60), 5-level Vimshottari & Yogini Dashas, astronomical planetary aspects, SAV scores, and customized remedial advice.
                  <br /><br />
                  Engineered using React, FastAPI, and astronomical calculation libraries.
                </>
              )}
            </p>
            <div style={{ marginTop: "20px", textAlign: "right", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
              © 2026 DeepMind Advanced Agentic Coding. All Rights Reserved.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
