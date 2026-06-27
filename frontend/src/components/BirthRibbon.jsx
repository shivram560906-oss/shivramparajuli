/**
 * BirthRibbon.jsx
 * 
 * A slim horizontal ribbon displayed below the menu bar (or below the chart tabs)
 * when chart data is available. Shows key birth details at a glance.
 * 
 * Displays: Name | BS Birth Date | Birth Time | Birth Place | Full Age | Gender
 */

import React from "react";
import {
  adStringToBS,
  formatBSDate,
  calculateAge,
  toNepaliDigits
} from "../utils/julianDay.js";

const BS_MONTHS_NE = ["बैशाख","जेठ","असार","श्रावण","भाद्र","आश्विन","कार्तिक","मंसिर","पौष","माघ","फाल्गुन","चैत"];
const BS_MONTHS_EN = ["Baisakh","Jestha","Ashadh","Shrawan","Bhadra","Ashwin","Kartik","Mangsir","Poush","Magh","Falgun","Chaitra"];

export default function BirthRibbon({ chartData, language = "en", gender = 0 }) {
  if (!chartData || !chartData.metadata) return null;

  const meta = chartData.metadata;
  const isNe = language === "ne";

  // ── BS date ──
  const bsDate = adStringToBS(meta.birth_date);
  let bsDateStr = "—";
  let adDateStr = meta.birth_date || "—";

  if (bsDate) {
    if (isNe) {
      bsDateStr = `${toNepaliDigits(bsDate.year)} ${BS_MONTHS_NE[bsDate.month - 1]} ${toNepaliDigits(bsDate.day)}`;
    } else {
      bsDateStr = `${bsDate.day} ${BS_MONTHS_EN[bsDate.month - 1]} ${bsDate.year} BS`;
    }
  }

  // ── Age ──
  const age = calculateAge(meta.birth_date);
  let ageStr = "—";
  if (age) {
    if (isNe) {
      ageStr = `${toNepaliDigits(age.years)} वर्ष ${toNepaliDigits(age.months)} महिना ${toNepaliDigits(age.days)} दिन`;
    } else {
      ageStr = `${age.years}y ${age.months}m ${age.days}d`;
    }
  }

  // ── Gender ──
  // gender: 0 = Male, 1 = Female (from XML), or from chartData
  const genderValue = typeof chartData.metadata.gender !== "undefined" ? chartData.metadata.gender : gender;
  const genderStr = isNe
    ? (genderValue === 1 ? "स्त्री ♀" : "पुरुष ♂")
    : (genderValue === 1 ? "Female ♀" : "Male ♂");

  // ── Birth place ──
  const place = meta.city || `${meta.latitude}N, ${meta.longitude}E`;

  // ── Time ──
  const timeStr = meta.birth_time || "—";

  const fields = [
    {
      icon: "✦",
      label: isNe ? "नाम" : "Name",
      value: meta.name || "—"
    },
    {
      icon: "📅",
      label: isNe ? "जन्म मिति (वि.सं.)" : "Birth Date (BS)",
      value: bsDateStr
    },
    {
      icon: "🕐",
      label: isNe ? "जन्म समय" : "Birth Time",
      value: timeStr
    },
    {
      icon: "📍",
      label: isNe ? "जन्म स्थान" : "Birth Place",
      value: place
    },
    {
      icon: "⏳",
      label: isNe ? "पूर्ण उमेर" : "Full Age",
      value: ageStr
    },
    {
      icon: genderValue === 1 ? "♀" : "♂",
      label: isNe ? "लिङ्ग" : "Gender",
      value: genderStr
    }
  ];

  return (
    <div className="birth-ribbon">
      {fields.map((field, i) => (
        <div key={i} className="birth-ribbon-item">
          <span className="birth-ribbon-label">{field.label}</span>
          <span className="birth-ribbon-value">{field.value}</span>
        </div>
      ))}
    </div>
  );
}
