/**
 * julianDay.js
 * Utilities for Julian Day Number ↔ Gregorian ↔ BS (Bikram Sambat) conversions.
 * 
 * Julian Day format matches PL7 Parashar Light's XML storage (e.g. 2445144.9895833).
 * The integer part is the JDN; the fractional part encodes UTC time (0.0 = noon UTC).
 * 
 * BS month names and day counts follow the official Nepali Patro data.
 */

// ─────────────────────────────────────────────
//  Julian Day ↔ Gregorian (AD)
// ─────────────────────────────────────────────

/**
 * Convert a Julian Day Number (float) to a Gregorian date/time object.
 * JD 0.5 = noon UTC Jan 1, 4713 BCE.
 * The fractional part represents the fraction of a day starting from noon UTC.
 *
 * @param {number} jd - Julian Day Number
 * @returns {{ year, month, day, hour, minute, second }}
 */
export function julianDayToGregorian(jd) {
  // Shift so that fractions represent midnight-based time (add 0.5, then floor)
  const jd_adj = jd + 0.5;
  const Z = Math.floor(jd_adj);
  const F = jd_adj - Z;

  let A;
  if (Z < 2299161) {
    A = Z;
  } else {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = B - D - Math.floor(30.6001 * E);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  // Convert fractional day to hours/minutes/seconds
  const totalSeconds = Math.round(F * 86400);
  const hour = Math.floor(totalSeconds / 3600);
  const minute = Math.floor((totalSeconds % 3600) / 60);
  const second = totalSeconds % 60;

  return { year, month, day, hour, minute, second };
}

/**
 * Convert a Gregorian date/time to a Julian Day Number.
 * Hour/minute/second are UTC. Defaults to noon (12:00:00) for date-only.
 *
 * @param {number} year
 * @param {number} month  1–12
 * @param {number} day    1–31
 * @param {number} hour   0–23  (default 0)
 * @param {number} minute 0–59  (default 0)
 * @param {number} second 0–59  (default 0)
 * @returns {number} Julian Day Number (float)
 */
export function gregorianToJulianDay(year, month, day, hour = 0, minute = 0, second = 0) {
  // Adjust Jan/Feb to be months 13/14 of preceding year
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD_int = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
  const frac = (hour + minute / 60 + second / 3600) / 24.0;
  return JD_int + frac;
}

// ─────────────────────────────────────────────
//  BS (Bikram Sambat) ↔ AD (Gregorian)
//  Using official month-length lookup tables
// ─────────────────────────────────────────────

/**
 * BS year data: each entry is [bsYear, adYear, adMonth, adDay, [12 monthly day-counts]]
 * adYear/adMonth/adDay = the AD date of Baisakh 1 of that BS year.
 * Source: Official Nepal Government Patro
 */
const BS_DATA = [
  [2000, 1943, 4, 14, [30,32,31,32,31,30,30,30,29,30,29,31]],
  [2001, 1944, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2002, 1945, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2003, 1946, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2004, 1947, 4, 14, [30,32,31,32,31,30,30,30,29,30,29,31]],
  [2005, 1948, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2006, 1949, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2007, 1950, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2008, 1951, 4, 14, [31,31,31,32,31,31,29,30,30,29,29,31]],
  [2009, 1952, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2010, 1953, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2011, 1954, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2012, 1955, 4, 14, [31,31,31,32,31,31,29,30,30,29,29,31]],
  [2013, 1956, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2014, 1957, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2015, 1958, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2016, 1959, 4, 14, [31,31,31,32,31,31,29,30,30,29,29,31]],
  [2017, 1960, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2018, 1961, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2019, 1962, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2020, 1963, 4, 14, [31,31,31,32,31,31,29,30,30,29,30,30]],
  [2021, 1964, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2022, 1965, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2023, 1966, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2024, 1967, 4, 14, [31,31,31,32,31,31,29,30,30,29,30,30]],
  [2025, 1968, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2026, 1969, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2027, 1970, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2028, 1971, 4, 14, [31,31,31,32,31,31,29,30,30,29,30,30]],
  [2029, 1972, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2030, 1973, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2031, 1974, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2032, 1975, 4, 14, [31,31,31,32,31,31,29,30,30,29,30,30]],
  [2033, 1976, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2034, 1977, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2035, 1978, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2036, 1979, 4, 14, [31,31,32,31,31,31,29,30,30,29,30,30]],
  [2037, 1980, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2038, 1981, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2039, 1982, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2040, 1983, 4, 14, [31,31,32,31,31,30,30,30,29,30,29,31]],
  [2041, 1984, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2042, 1985, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2043, 1986, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2044, 1987, 4, 14, [31,31,32,31,31,30,30,30,29,30,29,31]],
  [2045, 1988, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2046, 1989, 4, 13, [31,32,31,32,31,30,30,29,30,29,30,30]],
  [2047, 1990, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2048, 1991, 4, 14, [31,31,32,31,31,30,30,30,29,30,29,31]],
  [2049, 1992, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2050, 1993, 4, 13, [31,32,31,32,31,30,30,29,30,29,30,30]],
  [2051, 1994, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2052, 1995, 4, 14, [31,31,32,31,31,30,30,30,29,30,29,31]],
  [2053, 1996, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2054, 1997, 4, 13, [31,32,31,32,31,30,30,29,30,29,30,30]],
  [2055, 1998, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2056, 1999, 4, 14, [31,31,31,32,31,31,30,29,30,29,30,30]],
  [2057, 2000, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2058, 2001, 4, 13, [31,31,32,31,32,30,30,29,30,29,30,30]],
  [2059, 2002, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2060, 2003, 4, 14, [30,32,31,32,31,30,30,30,29,30,29,31]],
  [2061, 2004, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2062, 2005, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2063, 2006, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2064, 2007, 4, 14, [30,32,31,32,31,30,30,30,29,30,29,31]],
  [2065, 2008, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2066, 2009, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2067, 2010, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2068, 2011, 4, 14, [31,31,31,32,31,31,29,30,30,29,30,30]],
  [2069, 2012, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2070, 2013, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2071, 2014, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2072, 2015, 4, 14, [31,31,31,32,31,31,29,30,30,29,30,30]],
  [2073, 2016, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2074, 2017, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2075, 2018, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2076, 2019, 4, 14, [31,31,31,32,31,31,29,30,30,29,30,30]],
  [2077, 2020, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2078, 2021, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2079, 2022, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2080, 2023, 4, 14, [31,31,31,32,31,31,29,30,30,29,30,30]],
  [2081, 2024, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2082, 2025, 4, 14, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2083, 2026, 4, 14, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2084, 2027, 4, 14, [31,31,31,32,31,31,29,30,30,29,30,30]],
  [2085, 2028, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2086, 2029, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
  [2087, 2030, 4, 13, [31,32,31,32,31,30,30,30,29,29,30,31]],
  [2088, 2031, 4, 14, [31,31,31,32,31,31,29,30,30,29,30,30]],
  [2089, 2032, 4, 13, [31,31,32,31,31,31,30,29,30,29,30,30]],
  [2090, 2033, 4, 13, [31,31,32,32,31,30,30,29,30,29,30,30]],
];

const BS_MONTHS_NE = ["बैशाख","जेठ","असार","श्रावण","भाद्र","आश्विन","कार्तिक","मंसिर","पौष","माघ","फाल्गुन","चैत"];
const BS_MONTHS_EN = ["Baisakh","Jestha","Ashadh","Shrawan","Bhadra","Ashwin","Kartik","Mangsir","Poush","Magh","Falgun","Chaitra"];

const NE_DIGITS = ["०","१","२","३","४","५","६","७","८","९"];

/**
 * Convert an Arabic numeral string/number to Nepali digits.
 */
export function toNepaliDigits(num) {
  return String(num).split("").map(d => NE_DIGITS[parseInt(d, 10)] !== undefined ? NE_DIGITS[parseInt(d, 10)] : d).join("");
}

/**
 * Convert AD (Gregorian) date to BS (Bikram Sambat) date.
 * @param {number} adYear
 * @param {number} adMonth  1–12
 * @param {number} adDay    1–31
 * @returns {{ year: number, month: number, day: number } | null}
 */
export function gregorianToBS(adYear, adMonth, adDay) {
  // Find the matching BS year data
  let bsYear = 2000;
  let bsMonth = 1;
  let bsDay = 1;

  // Find the total days from a reference point
  // Reference: BS 2000 Baisakh 1 = AD 1943 April 14
  const REF_AD = new Date(1943, 3, 14); // April = 3 (0-indexed)
  const inputAD = new Date(adYear, adMonth - 1, adDay);
  const diffDays = Math.floor((inputAD - REF_AD) / (1000 * 60 * 60 * 24));

  let totalDays = diffDays;
  let curBsYear = 2000;

  for (const entry of BS_DATA) {
    const [yr, , , , monthDays] = entry;
    const yearDays = monthDays.reduce((a, b) => a + b, 0);
    if (totalDays < yearDays) {
      bsYear = yr;
      let m = 0;
      for (let i = 0; i < 12; i++) {
        if (totalDays < monthDays[i]) {
          bsMonth = i + 1;
          bsDay = totalDays + 1;
          return { year: bsYear, month: bsMonth, day: bsDay };
        }
        totalDays -= monthDays[i];
      }
      break;
    }
    totalDays -= yearDays;
    curBsYear = yr;
  }
  return null; // Out of range
}

/**
 * Convert BS date to AD (Gregorian) date.
 * @param {number} bsYear
 * @param {number} bsMonth  1–12
 * @param {number} bsDay    1–31
 * @returns {{ year: number, month: number, day: number } | null}
 */
export function bsToGregorian(bsYear, bsMonth, bsDay) {
  const entry = BS_DATA.find(e => e[0] === bsYear);
  if (!entry) return null;

  const [, startAdYear, startAdMonth, startAdDay, monthDays] = entry;

  let totalDays = 0;
  for (let m = 0; m < bsMonth - 1; m++) {
    totalDays += monthDays[m];
  }
  totalDays += bsDay - 1;

  const refDate = new Date(startAdYear, startAdMonth - 1, startAdDay);
  refDate.setDate(refDate.getDate() + totalDays);

  return {
    year: refDate.getFullYear(),
    month: refDate.getMonth() + 1,
    day: refDate.getDate()
  };
}

/**
 * Format a BS date as a readable Nepali string.
 * @param {number} bsYear
 * @param {number} bsMonth  1–12
 * @param {number} bsDay
 * @param {"ne"|"en"} lang
 * @returns {string}
 */
export function formatBSDate(bsYear, bsMonth, bsDay, lang = "ne") {
  if (lang === "ne") {
    return `${toNepaliDigits(bsYear)} ${BS_MONTHS_NE[bsMonth - 1]} ${toNepaliDigits(bsDay)}`;
  }
  return `${bsDay} ${BS_MONTHS_EN[bsMonth - 1]} ${bsYear} BS`;
}

/**
 * Parse a date string "YYYY-MM-DD" and convert to BS.
 */
export function adStringToBS(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  return gregorianToBS(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
}

/**
 * Calculate full age from a birth date string "YYYY-MM-DD" to now (Nepal time).
 * @param {string} birthDateStr  e.g. "1988-12-04"
 * @returns {{ years, months, days }}
 */
export function calculateAge(birthDateStr) {
  if (!birthDateStr) return null;
  const parts = birthDateStr.split("-");
  if (parts.length !== 3) return null;

  const bYear = parseInt(parts[0]);
  const bMonth = parseInt(parts[1]);
  const bDay = parseInt(parts[2]);

  // Current time in Nepal (UTC+5:45)
  const now = new Date();
  const nepalOffset = 5 * 60 + 45; // minutes
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const nepalNow = new Date(utc + nepalOffset * 60000);

  const cYear = nepalNow.getFullYear();
  const cMonth = nepalNow.getMonth() + 1;
  const cDay = nepalNow.getDate();

  let years = cYear - bYear;
  let months = cMonth - bMonth;
  let days = cDay - bDay;

  if (days < 0) {
    months -= 1;
    // Days in previous month
    const prevMonth = new Date(cYear, cMonth - 1, 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

/**
 * Parse a "HH:MM" or "HH:MM:SS" time string.
 * @returns {{ hour, minute, second }}
 */
export function parseTimeString(timeStr) {
  if (!timeStr) return { hour: 0, minute: 0, second: 0 };
  const parts = timeStr.split(":").map(Number);
  return {
    hour: parts[0] || 0,
    minute: parts[1] || 0,
    second: parts[2] || 0
  };
}
