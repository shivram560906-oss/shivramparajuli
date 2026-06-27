import React, { useState, useRef, useEffect } from "react";

export default function MenuBar({
  language = "en",
  ayanamshaType = "LAHIRI",
  chartStyle = "NORTH_INDIAN",
  theme = "cosmic",
  hasChartData = false,
  recentRecords = [],
  onAction = () => {},
  onUpdateSettings = () => {}
}) {
  const [openMenu, setOpenMenu] = useState(null); // which menu is open
  const [openSub, setOpenSub] = useState(null);   // which submenu is open
  const menuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
        setOpenSub(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Dynamically compile the file menu items
  const getFileItems = () => {
    const isNe = language === "ne";
    const baseItems = isNe ? [
      { id: "file_new", label: "नयाँ कुण्डली (New)", shortcut: "Ctrl+N" },
      { id: "file_open", label: "खोल्नुहोस्... (Open)", shortcut: "Ctrl+O" },
      { id: "file_manager", label: "फाइल म्यानेजर... (File Manager)", shortcut: "Ctrl+M" },
      { id: "file_save", label: "सुरक्षित गर्नुहोस् (Save)", shortcut: "Ctrl+S", requiresChart: true },
      { id: "file_save_as", label: "अन्य नाममा सुरक्षित... (Save As)", requiresChart: true },
      {
        id: "file_save_to",
        label: "यसमा सुरक्षित गर्नुहोस् (Save To)",
        requiresChart: true,
        subItems: [
          { id: "file_save_to_db", label: "डेटाबेसमा सुरक्षित गर्नुहोस्" },
          { id: "file_save_to_xml", label: ".xml फाइलमा सुरक्षित गर्नुहोस्" },
          { id: "file_save_to_qck", label: ".qck फाइलमा सुरक्षित गर्नुहोस्" }
        ]
      },
      { id: "file_close", label: "बन्द गर्नुहोस् (Close)", shortcut: "Ctrl+W", requiresChart: true },
      { id: "divider1", type: "divider" },
      { id: "file_model_printing", label: "मोडल प्रिन्टिङ (Model Printing)", requiresChart: true },
      { id: "file_print_screen", label: "स्क्रिन प्रिन्ट... (Print screen)", shortcut: "Ctrl+P", requiresChart: true },
      { id: "file_printer_setup", label: "प्रिन्टर सेटअप (Printer Setup)" },
      { id: "file_copy_screen", label: "क्लिपबोर्डमा प्रतिलिपि (Copy screen)", shortcut: "Ctrl+C", requiresChart: true },
      { id: "divider2", type: "divider" },
      {
        id: "file_language",
        label: "भाषा (Language)",
        subItems: [
          { id: "opt_lang_en", label: "English", type: "radio", group: "lang", value: "en" },
          { id: "opt_lang_ne", label: "नेपाली (Nepali)", type: "radio", group: "lang", value: "ne" }
        ]
      },
      { id: "divider3", type: "divider" },
      { id: "file_exit", label: "बाहिर निस्कनुहोस् (Exit)", shortcut: "Ctrl+Q" }
    ] : [
      { id: "file_new", label: "New", shortcut: "Ctrl+N" },
      { id: "file_open", label: "Open...", shortcut: "Ctrl+O" },
      { id: "file_manager", label: "File Manager...", shortcut: "Ctrl+M" },
      { id: "file_save", label: "Save", shortcut: "Ctrl+S", requiresChart: true },
      { id: "file_save_as", label: "Save As...", requiresChart: true },
      {
        id: "file_save_to",
        label: "Save To",
        requiresChart: true,
        subItems: [
          { id: "file_save_to_db", label: "Save to Database" },
          { id: "file_save_to_xml", label: "Save as .xml File" },
          { id: "file_save_to_qck", label: "Save as .qck File" }
        ]
      },
      { id: "file_close", label: "Close", shortcut: "Ctrl+W", requiresChart: true },
      { id: "divider1", type: "divider" },
      { id: "file_model_printing", label: "Model Printing", requiresChart: true },
      { id: "file_print_screen", label: "Print screen...", shortcut: "Ctrl+P", requiresChart: true },
      { id: "file_printer_setup", label: "Printer Setup" },
      { id: "file_copy_screen", label: "Copy screen to Clipboard", shortcut: "Ctrl+C", requiresChart: true },
      { id: "divider2", type: "divider" },
      {
        id: "file_language",
        label: "Language",
        subItems: [
          { id: "opt_lang_en", label: "English", type: "radio", group: "lang", value: "en" },
          { id: "opt_lang_ne", label: "Nepali", type: "radio", group: "lang", value: "ne" }
        ]
      },
      { id: "divider3", type: "divider" },
      { id: "file_exit", label: "Exit", shortcut: "Ctrl+Q" }
    ];

    // Append recent records dynamically
    if (recentRecords && recentRecords.length > 0) {
      baseItems.push({ id: "divider4", type: "divider" });
      recentRecords.slice(0, 7).forEach((rec, idx) => {
        baseItems.push({
          id: `recent_chart_${rec.id || idx}`,
          label: rec.name.toLowerCase(),
          shortcut: idx === 0 ? "Ctrl+L" : "",
          recordData: rec
        });
      });
    }

    return baseItems;
  };

  // Menu configurations for other tabs
  const MENU_DEFS = {
    en: {
      edit: {
        label: "Edit",
        items: [
          { id: "edit_birth_data", label: "Birth data", shortcut: "Ctrl+B" },
          { id: "edit_anka_value", label: "Anka value", requiresChart: true },
          { id: "edit_notes", label: "Notes", requiresChart: true },
          { id: "edit_events", label: "Events", requiresChart: true },
          { id: "edit_native_loc", label: "Native's current location", requiresChart: true },
          { id: "divider1", type: "divider" },
          { id: "edit_astrologer_loc", label: "Astrologer's location" },
          { id: "edit_astrologer_settings", label: "Astrologer specific settings" },
          { id: "divider2", type: "divider" },
          { id: "edit_cover_page", label: "Cover page text", requiresChart: true }
        ]
      },
      charts: {
        label: "Charts",
        requiresChart: true,
        items: [
          { id: "chart_rashi", label: "Rashi Chart (D1)" },
          { id: "chart_navamsha", label: "Navamsha Chart (D9)" },
          { id: "chart_dashamsha", label: "Dashamsha Chart (D10)" },
          { id: "divider1", type: "divider" },
          { id: "chart_sudarshan", label: "Sudarshan Chakra" },
          { id: "chart_vargas", label: "All Divisional Vargas" }
        ]
      },
      reports: {
        label: "Reports",
        requiresChart: true,
        items: [
          { id: "report_planets", label: "Planetary Details" },
          { id: "report_panchang", label: "Panchang Details" },
          { id: "divider1", type: "divider" },
          { id: "report_vimshottari", label: "Vimshottari Dasha" },
          { id: "report_yogini", label: "Yogini Dasha" },
          { id: "divider2", type: "divider" },
          { id: "report_shadbala", label: "Shadbala Strength" },
          { id: "report_ashtakavarga", label: "Ashtakavarga (SAV) Grid" }
        ]
      },
      classical: {
        label: "Classical references",
        requiresChart: true,
        items: [
          { id: "ref_bph", label: "Brihat Parashara Shastra" },
          { id: "ref_saravali", label: "Saravali Predictions" },
          { id: "ref_jataka", label: "Jataka Parijata" },
          { id: "divider1", type: "divider" },
          { id: "ref_remedies", label: "Deities & Remedies" }
        ]
      },
      options: {
        label: "Options",
        items: [
          { id: "opt_aya_lahiri", label: "Ayanamsha: Lahiri", type: "radio", group: "ayanamsha", value: "LAHIRI" },
          { id: "opt_aya_raman", label: "Ayanamsha: Raman", type: "radio", group: "ayanamsha", value: "RAMAN" },
          { id: "divider1", type: "divider" },
          { id: "opt_style_north", label: "Chart: North Indian", type: "radio", group: "style", value: "NORTH_INDIAN" },
          { id: "opt_style_south", label: "Chart: South Indian", type: "radio", group: "style", value: "SOUTH_INDIAN" },
          { id: "divider2", type: "divider" },
          {
            id: "opt_theme",
            label: "Theme Color",
            subItems: [
              { id: "theme_cosmic", label: "Cosmic Dark (Default)", type: "radio", group: "theme", value: "cosmic" },
              { id: "theme_light", label: "Pure Light", type: "radio", group: "theme", value: "light" },
              { id: "theme_oled", label: "OLED Pitch Black", type: "radio", group: "theme", value: "oled" },
              { id: "theme_gold", label: "Vedic Gold (Warm)", type: "radio", group: "theme", value: "gold" },
              { id: "theme_emerald", label: "Emerald Forest", type: "radio", group: "theme", value: "emerald" },
              { id: "theme_ruby", label: "Ruby Crimson", type: "radio", group: "theme", value: "ruby" },
              { id: "theme_sapphire", label: "Sapphire Ocean", type: "radio", group: "theme", value: "sapphire" },
              { id: "theme_amethyst", label: "Amethyst Royal", type: "radio", group: "theme", value: "amethyst" },
              { id: "theme_amber", label: "Amber Hearth", type: "radio", group: "theme", value: "amber" },
              { id: "theme_rose", label: "Rose Quartz", type: "radio", group: "theme", value: "rose" },
              { id: "theme_slate", label: "Slate Cyber", type: "radio", group: "theme", value: "slate" },
              { id: "theme_solar", label: "Solar Sepia", type: "radio", group: "theme", value: "solar" }
            ]
          }
        ]
      },
      print: {
        label: "Print",
        requiresChart: true,
        items: [
          { id: "print_view", label: "Print Current View" },
          { id: "print_pdf", label: "Download PDF Report" }
        ]
      },
      research: {
        label: "Research",
        requiresChart: true,
        items: [
          { id: "res_transits", label: "Animated Transits" },
          { id: "res_compatibility", label: "Partner Compatibility" },
          { id: "divider1", type: "divider" },
          { id: "res_rectification", label: "Birth Time Rectification" },
          { id: "res_ephemeris", label: "Graphical Ephemeris" }
        ]
      },
      windows: {
        label: "Windows",
        items: [
          { id: "win_dual", label: "Dual Chart Split", requiresChart: true },
          { id: "win_sidebar", label: "Toggle Input Sidebar" },
          { id: "win_reset", label: "Reset Layout" }
        ]
      },
      help: {
        label: "Help",
        items: [
          { id: "help_about", label: "About Software" },
          { id: "help_tutor", label: "Kundali Tutor", requiresChart: true },
          { id: "help_guide", label: "Vedic Astrology Guide" }
        ]
      }
    },
    ne: {
      edit: {
        label: "सम्पादन",
        items: [
          { id: "edit_birth_data", label: "जन्म विवरण (Birth data)", shortcut: "Ctrl+B" },
          { id: "edit_anka_value", label: "अंक मान (Anka value)", requiresChart: true },
          { id: "edit_notes", label: "टिपोट (Notes)", requiresChart: true },
          { id: "edit_events", label: "घटनाक्रम (Events)", requiresChart: true },
          { id: "edit_native_loc", label: "जातकको हालको स्थान (Native's location)", requiresChart: true },
          { id: "divider1", type: "divider" },
          { id: "edit_astrologer_loc", label: "ज्योतिषीको स्थान (Astrologer's location)" },
          { id: "edit_astrologer_settings", label: "ज्योतिषी सम्बन्धी सेटिङ (Astrologer settings)" },
          { id: "divider2", type: "divider" },
          { id: "edit_cover_page", label: "आवरण पृष्ठ पाठ (Cover page text)", requiresChart: true }
        ]
      },
      charts: {
        label: "चार्टहरू",
        requiresChart: true,
        items: [
          { id: "chart_rashi", label: "राशि कुण्डली - D1" },
          { id: "chart_navamsha", label: "नवांश कुण्डली - D9" },
          { id: "chart_dashamsha", label: "दशमांश कुण्डली - D10" },
          { id: "divider1", type: "divider" },
          { id: "chart_sudarshan", label: "सुदर्शन चक्र" },
          { id: "chart_vargas", label: "सबै वर्ग कुण्डलीहरू" }
        ]
      },
      reports: {
        label: "रिपोर्टहरू",
        requiresChart: true,
        items: [
          { id: "report_planets", label: "ग्रह स्थिति विवरण" },
          { id: "report_panchang", label: "विस्तृत पञ्चाङ्ग" },
          { id: "divider1", type: "divider" },
          { id: "report_vimshottari", label: "विंशोत्तरी दशा" },
          { id: "report_yogini", label: "योगिनी दशा" },
          { id: "divider2", type: "divider" },
          { id: "report_shadbala", label: "षडबल विश्लेषण" },
          { id: "report_ashtakavarga", label: "अष्टकवर्ग (SAV) तालिका" }
        ]
      },
      classical: {
        label: "शास्त्रीय सन्दर्भहरू",
        requiresChart: true,
        items: [
          { id: "ref_bph", label: "बृहत पराशर होरा शास्त्र" },
          { id: "ref_saravali", label: "सरावली फलकथन" },
          { id: "ref_jataka", label: "जातक पारिजात" },
          { id: "divider1", type: "divider" },
          { id: "ref_remedies", label: "ग्रह देवता र उपाय" }
        ]
      },
      options: {
        label: "विकल्पहरू",
        items: [
          { id: "opt_aya_lahiri", label: "अयनंश: लाहिरी", type: "radio", group: "ayanamsha", value: "LAHIRI" },
          { id: "opt_aya_raman", label: "अयनंश: रमन", type: "radio", group: "ayanamsha", value: "RAMAN" },
          { id: "divider1", type: "divider" },
          { id: "opt_style_north", label: "कुण्डली: उत्तर भारतीय", type: "radio", group: "style", value: "NORTH_INDIAN" },
          { id: "opt_style_south", label: "कुण्डली: दक्षिण भारतीय", type: "radio", group: "style", value: "SOUTH_INDIAN" },
          { id: "divider2", type: "divider" },
          {
            id: "opt_theme",
            label: "कुण्डली थिम (Theme)",
            subItems: [
              { id: "theme_cosmic", label: "ब्रह्माण्डीय अन्धकार (Default)", type: "radio", group: "theme", value: "cosmic" },
              { id: "theme_light", label: "श्वेत थिम (Light)", type: "radio", group: "theme", value: "light" },
              { id: "theme_oled", label: "गाढा कालो (OLED Black)", type: "radio", group: "theme", value: "oled" },
              { id: "theme_gold", label: "स्वर्ण वैदिक (Vedic Gold)", type: "radio", group: "theme", value: "gold" },
              { id: "theme_emerald", label: "हरित मरकत (Emerald)", type: "radio", group: "theme", value: "emerald" },
              { id: "theme_ruby", label: "रक्त माणिक्य (Ruby)", type: "radio", group: "theme", value: "ruby" },
              { id: "theme_sapphire", label: "नीलम सागर (Sapphire)", type: "radio", group: "theme", value: "sapphire" },
              { id: "theme_amethyst", label: "बैजनी नीलम (Amethyst)", type: "radio", group: "theme", value: "amethyst" },
              { id: "theme_amber", label: "तप्त स्वर्ण (Amber)", type: "radio", group: "theme", value: "amber" },
              { id: "theme_rose", label: "गुलाबी हीरक (Rose)", type: "radio", group: "theme", value: "rose" },
              { id: "theme_slate", label: "धूसर साइबर (Slate)", type: "radio", group: "theme", value: "slate" },
              { id: "theme_solar", label: "सौर सेपिया (Solar Sepia)", type: "radio", group: "theme", value: "solar" }
            ]
          }
        ]
      },
      print: {
        label: "प्रिन्ट",
        requiresChart: true,
        items: [
          { id: "print_view", label: "हालको दृश्य प्रिन्ट गर्नुहोस्" },
          { id: "print_pdf", label: "PDF रिपोर्ट डाउनलोड गर्नुहोस्" }
        ]
      },
      research: {
        label: "अनुसन्धान",
        requiresChart: true,
        items: [
          { id: "res_transits", label: "एनिमेटेड गोचर" },
          { id: "res_compatibility", label: "कुण्डली मिलान (३६ गुण)" },
          { id: "divider1", type: "divider" },
          { id: "res_rectification", label: "जन्म समय संशोधन" },
          { id: "res_ephemeris", label: "ग्रह मार्ग (एफिमेरिस)" }
        ]
      },
      windows: {
        label: "विन्डोज",
        items: [
          { id: "win_dual", label: "दुईवटा कुण्डली हेर्नुहोस्", requiresChart: true },
          { id: "win_sidebar", label: "साइडबार देखाउनुहोस्/लुकाउनुहोस्" },
          { id: "win_reset", label: "लेआउट रिसेट गर्नुहोस्" }
        ]
      },
      help: {
        label: "मद्दत",
        items: [
          { id: "help_about", label: "सफ्टवेयरको बारेमा" },
          { id: "help_tutor", label: "कुण्डली ट्युटर", requiresChart: true },
          { id: "help_guide", label: "वैदिक ज्योतिष मार्गदर्शिका" }
        ]
      }
    }
  };

  const handleItemClick = (item) => {
    if (item.requiresChart && !hasChartData) {
      alert(
        language === "ne"
          ? "कृपया पहिले कुण्डली गणना गर्नुहोस्।"
          : "Please calculate a horoscope chart first."
      );
      return;
    }

    if (item.type === "radio") {
      if (item.group === "ayanamsha") {
        onUpdateSettings({ ayanamsha_type: item.value, chart_style: chartStyle, theme, language });
      } else if (item.group === "style") {
        onUpdateSettings({ ayanamsha_type: ayanamshaType, chart_style: item.value, theme, language });
      } else if (item.group === "lang") {
        onUpdateSettings({ ayanamsha_type: ayanamshaType, chart_style: chartStyle, theme, language: item.value });
      } else if (item.group === "theme") {
        onUpdateSettings({ ayanamsha_type: ayanamshaType, chart_style: chartStyle, theme: item.value, language });
      }
    } else {
      if (item.recordData) {
        onAction(item.id, item.recordData);
      } else {
        onAction(item.id);
      }
    }

    // Close menu after action
    setOpenMenu(null);
    setOpenSub(null);
  };

  const getCheckMark = (item) => {
    if (item.group === "ayanamsha" && ayanamshaType === item.value) return "✓";
    if (item.group === "style" && chartStyle === item.value) return "✓";
    if (item.group === "lang" && language === item.value) return "✓";
    if (item.group === "theme" && theme === item.value) return "✓";
    return "";
  };

  // Render a list of items for a menu
  const renderMenuItems = (items, menuKey) => {
    return items.map((item, idx) => {
      if (item.type === "divider") {
        return <div key={`div-${idx}`} className="menu-dropdown-separator" />;
      }

      const itemDisabled = item.requiresChart && !hasChartData;
      const hasSub = item.subItems && item.subItems.length > 0;
      const isSubOpen = openSub === item.id;

      if (hasSub) {
        return (
          <div key={item.id} className="menu-dropdown-item-wrapper"
            onMouseEnter={() => setOpenSub(item.id)}
            onMouseLeave={() => setOpenSub(null)}
          >
            <button
              className="menu-dropdown-btn"
              disabled={itemDisabled}
              style={{ opacity: itemDisabled ? 0.5 : 1, cursor: itemDisabled ? "not-allowed" : "pointer" }}
            >
              <span>{item.label}</span>
              <span style={{ fontSize: "0.6rem", color: "var(--color-text-muted)" }}>▶</span>
            </button>
            {isSubOpen && (
              <div className="menu-sub-dropdown">
                {renderMenuItems(item.subItems, item.id)}
              </div>
            )}
          </div>
        );
      }

      return (
        <button
          key={item.id}
          className="menu-dropdown-btn"
          onClick={() => handleItemClick(item)}
          style={{
            opacity: itemDisabled ? 0.5 : 1,
            cursor: itemDisabled ? "not-allowed" : "pointer"
          }}
          disabled={itemDisabled}
        >
          <span>{item.label}</span>
          {item.shortcut && (
            <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginLeft: "20px" }}>
              {item.shortcut}
            </span>
          )}
          {item.type === "radio" && (
            <span style={{ color: "var(--color-gold)", fontWeight: "bold" }}>
              {getCheckMark(item)}
            </span>
          )}
        </button>
      );
    });
  };

  const categories = MENU_DEFS[language] || MENU_DEFS.en;

  const toggleMenu = (key) => {
    setOpenMenu(prev => prev === key ? null : key);
    setOpenSub(null);
  };

  return (
    <nav className="menu-bar-container" ref={menuRef}>
      <ul className="menu-bar-list">
        {/* Dynamic File Menu */}
        <li className="menu-bar-item">
          <button
            className={`menu-bar-btn${openMenu === "file" ? " menu-bar-btn-active" : ""}`}
            onClick={() => toggleMenu("file")}
          >
            {language === "ne" ? "फाइल" : "File"}
          </button>
          {openMenu === "file" && (
            <div className="menu-dropdown menu-dropdown-open">
              {renderMenuItems(getFileItems(), "file")}
            </div>
          )}
        </li>

        {/* Other Categories */}
        {Object.entries(categories).map(([key, menu]) => {
          const menuDisabled = menu.requiresChart && !hasChartData;
          const isOpen = openMenu === key;

          return (
            <li
              key={key}
              className="menu-bar-item"
              style={{ opacity: menuDisabled ? 0.5 : 1 }}
            >
              <button
                className={`menu-bar-btn${isOpen ? " menu-bar-btn-active" : ""}`}
                disabled={menuDisabled}
                onClick={() => {
                  if (!menuDisabled) toggleMenu(key);
                }}
              >
                {menu.label}
              </button>

              {isOpen && !menuDisabled && (
                <div className="menu-dropdown menu-dropdown-open">
                  {renderMenuItems(menu.items, key)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
