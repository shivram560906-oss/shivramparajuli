import React, { useState } from "react";

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

const HOUSE_CENTROIDS = {
  1:  { x: 250, y: 90  },
  2:  { x: 130, y: 50  },
  3:  { x: 50,  y: 130 },
  4:  { x: 90,  y: 250 },
  5:  { x: 50,  y: 370 },
  6:  { x: 130, y: 450 },
  7:  { x: 250, y: 410 },
  8:  { x: 370, y: 450 },
  9:  { x: 450, y: 370 },
  10: { x: 410, y: 250 },
  11: { x: 450, y: 130 },
  12: { x: 370, y: 50  },
};

function getAspectHouse(fromHouse, offset) {
  return ((fromHouse - 1 + offset - 1) % 12) + 1;
}

function arrowPath(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const px = (-dy / len) * 35;
  const py = (dx / len) * 35;
  return `M ${from.x} ${from.y} Q ${mx + px} ${my + py} ${to.x} ${to.y}`;
}

function labelPos(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: mx + (-dy / len) * 40,
    y: my + (dx / len) * 40,
  };
}

export default function NorthIndianChart({ chartData, language }) {
  const [hoveredPlanet, setHoveredPlanet] = useState(null);

  if (!chartData) return null;

  const { lagna, planets } = chartData;
  const lagnaSign = lagna.sign_number;

  const getPlanetsInHouse = (houseNum) => planets.filter((p) => p.house === houseNum);
  const getSignForHouse = (houseNum) => ((lagnaSign - 1 + houseNum - 1) % 12) + 1;

  const hoveredPlanetData = hoveredPlanet ? planets.find((p) => p.name === hoveredPlanet) : null;
  const hoveredHouse = hoveredPlanetData ? hoveredPlanetData.house : null;

  const aspectArrows = [];
  if (hoveredPlanet && hoveredHouse && SPECIAL_ASPECTS[hoveredPlanet]) {
    SPECIAL_ASPECTS[hoveredPlanet].forEach((offset) => {
      const targetHouse = getAspectHouse(hoveredHouse, offset);
      aspectArrows.push({
        from: HOUSE_CENTROIDS[hoveredHouse],
        to: HOUSE_CENTROIDS[targetHouse],
        color: ASPECT_COLORS[hoveredPlanet],
        targetHouse,
        offset,
      });
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>


      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 500"
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
              id={`arrow-ni-${planet}`}
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

        {/* Outer Border */}
        <rect x="10" y="10" width="480" height="480" fill="none" stroke="#d4af37" strokeWidth="2" opacity="0.8" />

        {/* Two main diagonals */}
        <line x1="10" y1="10" x2="490" y2="490" stroke="#d4af37" strokeWidth="1.2" opacity="0.5" />
        <line x1="10" y1="490" x2="490" y2="10"  stroke="#d4af37" strokeWidth="1.2" opacity="0.5" />

        {/* Inner diamond */}
        <line x1="250" y1="10"  x2="10"  y2="250" stroke="#d4af37" strokeWidth="1.2" opacity="0.5" />
        <line x1="10"  y1="250" x2="250" y2="490" stroke="#d4af37" strokeWidth="1.2" opacity="0.5" />
        <line x1="250" y1="490" x2="490" y2="250" stroke="#d4af37" strokeWidth="1.2" opacity="0.5" />
        <line x1="490" y1="250" x2="250" y2="10"  stroke="#d4af37" strokeWidth="1.2" opacity="0.5" />

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
                markerEnd={`url(#arrow-ni-${hoveredPlanet})`}
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

        {/* Highlight aspect target houses */}
        {aspectArrows.map(({ targetHouse, color }, idx) => {
          const { x, y } = HOUSE_CENTROIDS[targetHouse];
          return (
            <circle
              key={`hl-${idx}`}
              cx={x} cy={y} r="35"
              fill={color} opacity="0.12"
              stroke={color} strokeWidth="2" strokeDasharray="5,4"
            />
          );
        })}

        {/* Highlight source house */}
        {hoveredHouse && (
          <circle
            cx={HOUSE_CENTROIDS[hoveredHouse].x}
            cy={HOUSE_CENTROIDS[hoveredHouse].y}
            r="35"
            fill={ASPECT_COLORS[hoveredPlanet]}
            opacity="0.15"
            stroke={ASPECT_COLORS[hoveredPlanet]}
            strokeWidth="2.5"
          />
        )}

        {/* House labels */}
        {Object.keys(HOUSE_CENTROIDS).map((hKey) => {
          const houseNum = parseInt(hKey);
          const { x, y } = HOUSE_CENTROIDS[houseNum];
          const sign = getSignForHouse(houseNum);
          const housePlanets = getPlanetsInHouse(houseNum);
          const isLagna = houseNum === 1;

          const lineHeight = 20;
          const totalLines = 1 + housePlanets.length;
          const startY = y - ((totalLines - 1) * lineHeight) / 2;

          return (
            <g key={houseNum}>
              <text
                x={x} y={startY}
                fill={isLagna ? "#ffd700" : "#d4af37"}
                fontSize="17"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                opacity="0.9"
              >
                {sign}
              </text>

              {isLagna && (
                <text
                  x={x} y={startY - 18}
                  fill="#ff6b6b"
                  fontSize="13"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  ▲ {language === "ne" ? "ल" : "L"}
                </text>
              )}

              {housePlanets.map((p, i) => {
                const nameAbbr = PLANET_ABBR[language][p.name] || p.name;
                let suffix = "";
                if (p.is_retrograde && p.is_combust) suffix = language === "ne" ? "(ब,अ)" : "(R,C)";
                else if (p.is_retrograde) suffix = language === "ne" ? "(ब)" : "(R)";
                else if (p.is_combust) suffix = language === "ne" ? "(अ)" : "(C)";
                const label = `${nameAbbr}${suffix}`;
                const isSpecial = !!SPECIAL_ASPECTS[p.name];
                const isHovered = hoveredPlanet === p.name;
                const py = startY + (i + 1) * lineHeight;

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
                        x={x - 28} y={py - 12}
                        width="56" height="24"
                        rx="6"
                        fill={ASPECT_COLORS[p.name]}
                        opacity="0.25"
                      />
                    )}
                    <text
                      x={x} y={py}
                      fill={color}
                      fontSize="16"
                      fontWeight={isSpecial ? "800" : "600"}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        filter: isHovered ? `drop-shadow(0 0 6px ${ASPECT_COLORS[p.name]})` : "none",
                      }}
                    >
                      {label}
                    </text>
                    {/* Small glow dot for special planets */}
                    {isSpecial && (
                      <circle
                        cx={x + 18} cy={py - 8}
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
