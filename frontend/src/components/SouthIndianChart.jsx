import React, { useState } from "react";

const SIGN_NAMES = {
  en: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
  ne: ["मेष", "वृष", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन"]
};

const PLANET_ABBR = {
  en: { Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke" },
  ne: { Sun: "सू", Moon: "च", Mars: "मं", Mercury: "बु", Jupiter: "गु", Venus: "शु", Saturn: "श", Rahu: "रा", Ketu: "के" }
};

const SPECIAL_ASPECTS = {
  Mars:    [4, 7, 8],
  Saturn:  [3, 7, 10],
  Jupiter: [5, 7, 9],
};

const ASPECT_COLORS = {
  Mars:    "#ff5555",
  Saturn:  "#88aaff",
  Jupiter: "#ffcc44",
};

const BOX_POSITIONS = [
  { signNum: 1,  col: 1, row: 0 },
  { signNum: 2,  col: 2, row: 0 },
  { signNum: 3,  col: 3, row: 0 },
  { signNum: 4,  col: 3, row: 1 },
  { signNum: 5,  col: 3, row: 2 },
  { signNum: 6,  col: 3, row: 3 },
  { signNum: 7,  col: 2, row: 3 },
  { signNum: 8,  col: 1, row: 3 },
  { signNum: 9,  col: 0, row: 3 },
  { signNum: 10, col: 0, row: 2 },
  { signNum: 11, col: 0, row: 1 },
  { signNum: 12, col: 0, row: 0 },
];

const BOX_SIZE = 120;

function signCenter(col, row) {
  return {
    x: col * BOX_SIZE + BOX_SIZE / 2,
    y: row * BOX_SIZE + BOX_SIZE / 2,
  };
}

function getAspectSign(fromSign, offset) {
  return ((fromSign - 1 + offset - 1) % 12) + 1;
}

function arrowPath(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const px = (-dy / len) * 30;
  const py = (dx / len) * 30;
  return `M ${from.x} ${from.y} Q ${mx + px} ${my + py} ${to.x} ${to.y}`;
}

function labelPos(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: mx + (-dy / len) * 35,
    y: my + (dx / len) * 35,
  };
}

export default function SouthIndianChart({ chartData, language }) {
  const [hoveredPlanet, setHoveredPlanet] = useState(null);

  if (!chartData) return null;

  const { lagna, planets, metadata } = chartData;
  const lagnaSign = lagna.sign_number;

  const getPlanetsInSign = (signNum) => planets.filter((p) => p.sign_number === signNum);

  const signPosMap = {};
  BOX_POSITIONS.forEach(({ signNum, col, row }) => {
    signPosMap[signNum] = { col, row, center: signCenter(col, row) };
  });

  const hoveredPlanetData = hoveredPlanet ? planets.find((p) => p.name === hoveredPlanet) : null;
  const hoveredSign = hoveredPlanetData ? hoveredPlanetData.sign_number : null;

  const aspectArrows = [];
  if (hoveredPlanet && hoveredSign && SPECIAL_ASPECTS[hoveredPlanet]) {
    SPECIAL_ASPECTS[hoveredPlanet].forEach((offset) => {
      const targetSign = getAspectSign(hoveredSign, offset);
      const fromPos = signPosMap[hoveredSign];
      const toPos = signPosMap[targetSign];
      if (fromPos && toPos) {
        aspectArrows.push({
          from: fromPos.center,
          to: toPos.center,
          color: ASPECT_COLORS[hoveredPlanet],
          targetSign,
          offset,
        });
      }
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      {/* Aspect banner */}
      <div style={{
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginBottom: "12px"
      }}>
        {hoveredPlanet ? (
          <div style={{
            fontSize: "15px",
            color: ASPECT_COLORS[hoveredPlanet],
            background: "rgba(0,0,0,0.6)",
            border: `2px solid ${ASPECT_COLORS[hoveredPlanet]}`,
            borderRadius: "8px",
            padding: "6px 16px",
            textAlign: "center",
            fontWeight: "bold",
            boxShadow: `0 0 12px ${ASPECT_COLORS[hoveredPlanet]}33`
          }}>
            {language === "ne"
              ? `${PLANET_ABBR.ne[hoveredPlanet]} ग्रहको विशेष दृष्टि: ${SPECIAL_ASPECTS[hoveredPlanet].join(", ")} औं स्थान`
              : `${hoveredPlanet} aspects: ${SPECIAL_ASPECTS[hoveredPlanet].join(", ")} signs from sign ${hoveredSign}`
            }
          </div>
        ) : (
          <div style={{ fontSize: "14px", color: "var(--color-text-muted)", fontStyle: "italic" }}>
            {language === "ne"
              ? "विशेष दृष्टि हेर्न मंगल (मं), शनि (श) वा गुरु (गु) मा माउस लैजानुहोस्"
              : "Hover over Mars (Ma), Saturn (Sa) or Jupiter (Ju) to view aspects"
            }
          </div>
        )}
      </div>

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 480 480"
        style={{
          maxWidth: "480px",
          background: "rgba(8, 7, 17, 0.6)",
          borderRadius: "14px",
          border: "2px solid rgba(212, 175, 55, 0.45)",
          boxShadow: "0 0 30px rgba(212, 175, 55, 0.12)",
        }}
      >
        <defs>
          {Object.entries(ASPECT_COLORS).map(([planet, color]) => (
            <marker
              key={planet}
              id={`arrow-si-${planet}`}
              markerWidth="9"
              markerHeight="9"
              refX="8"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L0,7 L9,3.5 z" fill={color} opacity="0.95" />
            </marker>
          ))}
        </defs>

        {/* Outer border */}
        <rect x="0" y="0" width="480" height="480" fill="none" stroke="#d4af37" strokeWidth="2" opacity="0.8" />

        {/* Grid lines — vertical */}
        {[120, 240, 360].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="480" stroke="#d4af37" strokeWidth="1.2" opacity="0.45" />
        ))}
        {/* Grid lines — horizontal */}
        {[120, 240, 360].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="480" y2={y} stroke="#d4af37" strokeWidth="1.2" opacity="0.45" />
        ))}

        {/* Center 2×2 block background */}
        <rect x="121" y="121" width="238" height="238" fill="rgba(12, 10, 26, 0.85)" />

        {/* Center info text */}
        <text x="240" y="200" fill="#d4af37" fontSize="18" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" fontFamily="'Cinzel', serif">
          {(metadata.name || "Kundali").length > 12 ? (metadata.name || "Kundali").slice(0, 12) + "…" : (metadata.name || "Kundali")}
        </text>
        <text x="240" y="235" fill="#a1a1aa" fontSize="14" textAnchor="middle" dominantBaseline="middle">
          {metadata.birth_date}
        </text>
        <text x="240" y="258" fill="#a1a1aa" fontSize="14" textAnchor="middle" dominantBaseline="middle">
          {metadata.birth_time}
        </text>

        {/* Aspect arrows */}
        {aspectArrows.map(({ from, to, color, offset }, idx) => {
          const lp = labelPos(from, to);
          return (
            <g key={idx}>
              <path
                d={arrowPath(from, to)}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeDasharray="8,4"
                markerEnd={`url(#arrow-si-${hoveredPlanet})`}
                opacity="0.9"
              />
              <circle cx={lp.x} cy={lp.y} r="14" fill="rgba(0,0,0,0.7)" stroke={color} strokeWidth="1.5" />
              <text
                x={lp.x} y={lp.y}
                fill={color}
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {offset}
              </text>
            </g>
          );
        })}

        {/* Highlight aspect target signs */}
        {aspectArrows.map(({ targetSign, color }, idx) => {
          const pos = signPosMap[targetSign];
          if (!pos) return null;
          return (
            <rect
              key={`hl-${idx}`}
              x={pos.col * BOX_SIZE + 2}
              y={pos.row * BOX_SIZE + 2}
              width={BOX_SIZE - 4}
              height={BOX_SIZE - 4}
              fill={color}
              opacity="0.12"
              stroke={color}
              strokeWidth="2"
              strokeDasharray="5,4"
              rx="6"
            />
          );
        })}

        {/* Highlight source sign */}
        {hoveredSign && signPosMap[hoveredSign] && (
          <rect
            x={signPosMap[hoveredSign].col * BOX_SIZE + 2}
            y={signPosMap[hoveredSign].row * BOX_SIZE + 2}
            width={BOX_SIZE - 4}
            height={BOX_SIZE - 4}
            fill={ASPECT_COLORS[hoveredPlanet]}
            opacity="0.15"
            stroke={ASPECT_COLORS[hoveredPlanet]}
            strokeWidth="2.5"
            rx="6"
          />
        )}

        {/* 12 house boxes around the perimeter */}
        {BOX_POSITIONS.map(({ signNum, col, row }) => {
          const bx = col * BOX_SIZE;
          const by = row * BOX_SIZE;
          const cx = bx + BOX_SIZE / 2;
          const cy = by + BOX_SIZE / 2;
          const signName = SIGN_NAMES[language][signNum - 1];
          const isLagna = signNum === lagnaSign;
          const signPlanets = getPlanetsInSign(signNum);

          const lineHeight = 20;
          const totalPlanetLines = signPlanets.length;
          const planetsStartY = cy - ((totalPlanetLines - 1) * lineHeight) / 2;

          return (
            <g key={signNum}>
              {/* Lagna diagonal line marker */}
              {isLagna && (
                <line
                  x1={bx} y1={by}
                  x2={bx + BOX_SIZE} y2={by + BOX_SIZE}
                  stroke="#ffd700"
                  strokeWidth="1"
                  strokeDasharray="5,4"
                  opacity="0.55"
                />
              )}

              {/* Sign name */}
              <text
                x={bx + 8}
                y={by + 8}
                fill={isLagna ? "#ffd700" : "#d4af37"}
                fontSize="14"
                fontWeight="bold"
                textAnchor="start"
                dominantBaseline="hanging"
                opacity="0.95"
              >
                {signName}
              </text>

              {/* Lagna badge */}
              {isLagna && (
                <text
                  x={bx + BOX_SIZE - 8}
                  y={by + 8}
                  fill="#ff6b6b"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="end"
                  dominantBaseline="hanging"
                >
                  {language === "ne" ? "ल" : "ASC"}
                </text>
              )}

              {/* Planet abbreviations */}
              {totalPlanetLines === 0 ? null : signPlanets.map((p, i) => {
                const nameAbbr = PLANET_ABBR[language][p.name] || p.name;
                let suffix = "";
                if (p.is_retrograde && p.is_combust) suffix = language === "ne" ? "(ब,अ)" : "(R,C)";
                else if (p.is_retrograde) suffix = language === "ne" ? "(ब)" : "(R)";
                else if (p.is_combust) suffix = language === "ne" ? "(अ)" : "(C)";
                const label = `${nameAbbr}${suffix}`;
                const isSpecial = !!SPECIAL_ASPECTS[p.name];
                const isHovered = hoveredPlanet === p.name;
                const py = planetsStartY + i * lineHeight;

                let color = "#ffffff";
                if (isSpecial) color = ASPECT_COLORS[p.name];
                else if (p.relationship === "karaka") color = "var(--color-success)";
                else if (p.relationship === "maraka") color = "var(--color-error)";

                return (
                  <g
                    key={i}
                    style={{ cursor: isSpecial ? "pointer" : "default" }}
                    onMouseEnter={() => isSpecial && setHoveredPlanet(p.name)}
                    onMouseLeave={() => setHoveredPlanet(null)}
                  >
                    {isHovered && (
                      <rect
                        x={cx - 30} y={py - 12}
                        width="60" height="24"
                        rx="6"
                        fill={ASPECT_COLORS[p.name]}
                        opacity="0.25"
                      />
                    )}
                    <text
                      x={cx} y={py}
                      fill={color}
                      fontSize="16.5"
                      fontWeight={isSpecial ? "800" : "600"}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        filter: isHovered ? `drop-shadow(0 0 6px ${ASPECT_COLORS[p.name]})` : "none",
                      }}
                    >
                      {label}
                    </text>
                    {isSpecial && (
                      <circle
                        cx={cx + 20} cy={py - 8}
                        r="3.5"
                        fill={ASPECT_COLORS[p.name]}
                        opacity="0.9"
                      />
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{
        marginTop: "16px",
        display: "flex",
        gap: "20px",
        fontSize: "14px",
        flexWrap: "wrap",
        justifyContent: "center",
        opacity: 0.9,
      }}>
        {Object.entries(SPECIAL_ASPECTS).map(([planet, offsets]) => (
          <span key={planet} style={{ color: ASPECT_COLORS[planet], display: "flex", alignItems: "center", gap: "6px", fontWeight: "500" }}>
            <span style={{
              width: "10px", height: "10px",
              borderRadius: "50%",
              background: ASPECT_COLORS[planet],
              display: "inline-block",
              boxShadow: `0 0 6px ${ASPECT_COLORS[planet]}`,
            }} />
            {PLANET_ABBR[language][planet]}
            <span style={{ opacity: 0.8 }}>({language === "ne" ? "दृष्टि" : "aspects"}: {offsets.join(", ")})</span>
          </span>
        ))}
      </div>
    </div>
  );
}
