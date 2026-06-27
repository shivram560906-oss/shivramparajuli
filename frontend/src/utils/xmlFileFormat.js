/**
 * xmlFileFormat.js
 * 
 * Handles conversion between the app's chart data format and 
 * PL7 Parashar Light's XML / QCK birth data file format.
 * 
 * The XML uses Julian Day Numbers for all dates.
 * The <Gender> tag: 0 = Male, 1 = Female.
 * 
 * PL7 uses UTF-16 encoding in the XML declaration, but browsers handle
 * UTF-8 natively, so we write UTF-8 (functionally compatible for ASCII content).
 */

import {
  gregorianToJulianDay,
  julianDayToGregorian
} from "./julianDay.js";

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────

/**
 * Parse a "YYYY-MM-DD" date string + "HH:MM" time string into UTC Julian Day.
 * We interpret the time as local time using the given timezone offset (hours).
 * @param {string} dateStr   e.g. "1988-12-04"
 * @param {string} timeStr   e.g. "05:45" 
 * @param {number} tz        timezone offset in hours e.g. 5.75 for NPT
 * @returns {number} Julian Day Number
 */
function dateTimeToJD(dateStr, timeStr, tz) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = (timeStr || "00:00").split(":").map(Number);
  const second = 0;

  // Convert local time to UTC
  const localFrac = (hour + minute / 60 + second / 3600) / 24;
  const tzFrac = tz / 24;
  const utcFrac = localFrac - tzFrac;

  // Get JD at noon on that date (base JD) then add fractional offset
  const jd_base = gregorianToJulianDay(year, month, day, 0, 0, 0); // midnight UTC
  return jd_base + utcFrac;
}

/**
 * Convert Julian Day Number to "YYYY-MM-DD" AD string + "HH:MM" local time string.
 * @param {number} jd    Julian Day Number  
 * @param {number} tz    timezone offset in hours (e.g. 5.75 for NPT)
 * @returns {{ dateStr: string, timeStr: string }}
 */
function jdToDateTime(jd, tz) {
  // Shift JD to local time
  const localJD = jd + (tz / 24);
  const { year, month, day, hour, minute } = julianDayToGregorian(localJD);
  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  return { dateStr, timeStr };
}

/**
 * Get today's Julian Day Number (UTC noon).
 */
function todayJD() {
  const now = new Date();
  return gregorianToJulianDay(
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );
}

// ─────────────────────────────────────────────
//  XML Generation (App → PL7 XML)
// ─────────────────────────────────────────────

/**
 * Generate a PL7-compatible XML string from the app's chart metadata.
 * @param {object} metadata  chartData.metadata object with name, birth_date, birth_time, 
 *                           latitude, longitude, timezone, city, gender, notes
 * @param {Array}  events    Life events array [{nameEn, year, descEn}]
 * @returns {string} XML string
 */
export function chartMetaToXml(metadata, events = [], notes = "", gender = 0) {
  const tz = parseFloat(metadata.timezone) || 5.75;
  const lat = parseFloat(metadata.latitude) || 27.7;
  const lon = parseFloat(metadata.longitude) || 85.3;
  const city = metadata.city || "Kathmandu";

  const birthJD = dateTimeToJD(metadata.birth_date, metadata.birth_time, tz);
  const todayJd = todayJD();

  // Format longitude for PL7: stored as negative (PL7 uses East = negative internally for some regions)
  // Actually PL7 stores as negative for East Longitude in some versions. 
  // We'll store as negative of our value to match the sample format.
  const lonForXml = -Math.abs(lon);
  const latForXml = lat;

  // Build events XML
  let eventsXml = "";
  // Always include Today and Muhurta as first two events (as PL7 does)
  eventsXml += `  <Event Id="1" ><Name>Today</Name>
   <Description></Description>
   <Date>${todayJd.toFixed(7)}</Date>
   <Longitude>${lonForXml.toFixed(7)}</Longitude>
   <Latitude>${latForXml.toFixed(7)}</Latitude>
   <TimeZone>-${tz.toFixed(7)}</TimeZone>
   <DST>0.0000000</DST>
   <City>${escapeXml(city)}</City>
   <State></State>
   <Country>Nepal</Country>
   <EventLookUpMode>A</EventLookUpMode>
   <EventClassification></EventClassification>
   <EventNotes></EventNotes>
   <EventRodden>0</EventRodden>
   <IsUsed>0</IsUsed>
  </Event>
  <Event Id="2" ><Name>Muhurta</Name>
   <Description></Description>
   <Date>${todayJd.toFixed(7)}</Date>
   <Longitude>${lonForXml.toFixed(7)}</Longitude>
   <Latitude>${latForXml.toFixed(7)}</Latitude>
   <TimeZone>-5.5000000</TimeZone>
   <DST>0.0000000</DST>
   <City>${escapeXml(city)}</City>
   <State></State>
   <Country>Nepal</Country>
   <EventLookUpMode>D</EventLookUpMode>
   <EventClassification></EventClassification>
   <EventNotes></EventNotes>
   <EventRodden>0</EventRodden>
   <IsUsed>0</IsUsed>
  </Event>`;

  // Add life events
  let evtId = 3;
  for (const evt of events) {
    if (!evt.year) continue;
    // Convert year to a rough JD (use April 14 of that year as proxy)
    const yr = parseInt(evt.year) || 2000;
    const evtJD = gregorianToJulianDay(yr, 4, 14, 6, 0, 0);
    eventsXml += `
  <Event Id="${evtId}" ><Name>${escapeXml(evt.nameEn || "")}</Name>
   <Description>${escapeXml(evt.descEn || "")}</Description>
   <Date>${evtJD.toFixed(7)}</Date>
   <Longitude>${lonForXml.toFixed(7)}</Longitude>
   <Latitude>${latForXml.toFixed(7)}</Latitude>
   <TimeZone>-${tz.toFixed(7)}</TimeZone>
   <DST>0.0000000</DST>
   <City>${escapeXml(city)}</City>
   <State></State>
   <Country>Nepal</Country>
   <EventLookUpMode>A</EventLookUpMode>
   <EventClassification></EventClassification>
   <EventNotes></EventNotes>
   <EventRodden>0</EventRodden>
   <IsUsed>0</IsUsed>
  </Event>`;
    evtId++;
  }

  // Name split (first / last)
  const nameParts = (metadata.name || "").trim().split(" ");
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : nameParts[0];

  const xml = `<?xml version="1.0" encoding="UTF-16"?><!DOCTYPE BirthData>
<BirthData>
 <BirthInfo><FirstName>${escapeXml(firstName)}</FirstName>
  <LastName>${escapeXml(lastName)}</LastName>
  <Anka>0</Anka>
  <Gender>${gender}</Gender>
  <BirthDate>${birthJD.toFixed(7)}</BirthDate>
  <Longitude>${lonForXml.toFixed(7)}</Longitude>
  <Latitude>${latForXml.toFixed(7)}</Latitude>
  <TimeZone>-${tz.toFixed(7)}</TimeZone>
  <DST>0.0000000</DST>
  <City>${escapeXml(city)}</City>
  <State></State>
  <Country>Nepal</Country>
  <BDLoopUpMode>M</BDLoopUpMode>
  <RoddenRating>0</RoddenRating>
 </BirthInfo>
 <Events>${eventsXml}
 </Events>
 <DetailedNotes>${escapeXml(notes)}</DetailedNotes>
 <BirthdataPicklist></BirthdataPicklist>
 <AnimatedPicklist></AnimatedPicklist>
 <MuhurtaPicklist></MuhurtaPicklist>
 <FamilyInfo><GrandFather></GrandFather>
  <Father></Father>
  <Mother></Mother>
  <Caste></Caste>
  <Gotra></Gotra>
  <Address1></Address1>
  <Address2></Address2>
  <Address3></Address3>
  <Email></Email>
  <Phone></Phone>
  <Tags></Tags>
  <Unused1></Unused1>
  <Unused2></Unused2>
  <Unused3></Unused3>
 </FamilyInfo>
</BirthData>`;

  return xml;
}

// ─────────────────────────────────────────────
//  XML Parsing (PL7 XML → App params)
// ─────────────────────────────────────────────

/**
 * Parse a PL7-compatible XML string and extract birth data params
 * that can be passed directly to `calculateChart(params)`.
 * 
 * @param {string} xmlString
 * @returns {{ name, birth_date, birth_time, latitude, longitude, timezone, city, gender, notes } | null}
 */
export function xmlToChartParams(xmlString) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "text/xml");

    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      console.error("XML parse error:", parseError.textContent);
      return null;
    }

    const getText = (tag) => {
      const el = doc.querySelector(tag);
      return el ? el.textContent.trim() : "";
    };

    const firstName = getText("FirstName");
    const lastName = getText("LastName");
    const name = [firstName, lastName].filter(Boolean).join(" ") || "Unknown";

    const birthJD = parseFloat(getText("BirthDate"));
    const tzRaw = parseFloat(getText("TimeZone")); // stored as negative in PL7
    const tz = Math.abs(tzRaw); // convert back to positive
    const lat = parseFloat(getText("Latitude")) || 27.7;
    const lonRaw = parseFloat(getText("Longitude")); // stored as negative in PL7
    const lon = Math.abs(lonRaw); // convert back to positive

    if (isNaN(birthJD)) return null;

    const { dateStr, timeStr } = jdToDateTime(birthJD, tz);

    const city = getText("City") || "Kathmandu";
    const gender = parseInt(getText("Gender")) || 0;
    const notes = getText("DetailedNotes") || "";

    return {
      name,
      birth_date: dateStr,
      birth_time: timeStr,
      latitude: lat,
      longitude: lon,
      timezone: tz,
      city,
      gender,
      notes
    };
  } catch (err) {
    console.error("Failed to parse XML:", err);
    return null;
  }
}

// ─────────────────────────────────────────────
//  File Download Helpers
// ─────────────────────────────────────────────

/**
 * Trigger a browser download of the XML file.
 * @param {string} xmlString
 * @param {string} filename   e.g. "shivram_parajuli.xml"
 */
export function downloadXmlFile(xmlString, filename) {
  const blob = new Blob([xmlString], { type: "application/xml;charset=utf-16" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Trigger a browser download of the QCK file (same XML content, .qck extension).
 * @param {string} xmlString
 * @param {string} filename   e.g. "shivram_parajuli.qck"
 */
export function downloadQckFile(xmlString, filename) {
  const blob = new Blob([xmlString], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Open a file picker dialog and read the selected .xml or .qck file.
 * @returns {Promise<string | null>} file contents as string, or null if cancelled
 */
export function openXmlFileDialog() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xml,.qck";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) { resolve(null); return; }
      const reader = new FileReader();
      reader.onload = (evt) => resolve(evt.target.result);
      reader.onerror = () => resolve(null);
      // Try UTF-16 first (PL7 native), fallback to UTF-8
      reader.readAsText(file, "UTF-16");
    };
    input.oncancel = () => resolve(null);
    input.click();
  });
}

// ─────────────────────────────────────────────
//  Utils
// ─────────────────────────────────────────────

function escapeXml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
