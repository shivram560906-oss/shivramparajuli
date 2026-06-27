import React, { useMemo } from 'react';

const PLANET_NAME_MAP = {
  Sun: 'सूर्य',
  Moon: 'चन्द्र',
  Mars: 'मङ्गल',
  Mercury: 'बुध',
  Jupiter: 'गुरु',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
};

const SPECIAL_ASPECTS = {
  Mars: [4, 8],
  Jupiter: [5, 9],
  Saturn: [3, 10],
  Rahu: [5, 9],
  Ketu: [5, 9],
};

function calcAspectedHouses(planetName, house) {
  const offsets = [7];
  const special = SPECIAL_ASPECTS[planetName];
  if (special) {
    special.forEach((o) => {
      if (!offsets.includes(o)) offsets.push(o);
    });
  }
  return offsets
    .map((offset) => ((house - 1 + offset) % 12) + 1)
    .sort((a, b) => a - b);
}

function getRelationshipColor(relationship) {
  if (!relationship) return 'var(--color-text-primary)';
  const r = relationship.toLowerCase();
  if (r === 'karaka') return 'var(--color-success)';
  if (r === 'maraka') return 'var(--color-error)';
  return 'var(--color-text-primary)';
}

function toNepaliName(engName) {
  return PLANET_NAME_MAP[engName] || engName;
}

const styles = {
  wrapper: {
    padding: '1.5rem',
  },
  title: {
    fontFamily: "'Cinzel', serif",
    fontSize: '1.25rem',
    color: 'var(--color-gold)',
    marginBottom: '1.25rem',
    textAlign: 'center',
    letterSpacing: '0.04em',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  headerCell: {
    fontFamily: "'Cinzel', serif",
    color: 'var(--color-gold)',
    textAlign: 'left',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid var(--glass-border)',
    whiteSpace: 'nowrap',
    fontSize: '0.85rem',
    letterSpacing: '0.03em',
  },
  cell: {
    fontFamily: "'Outfit', sans-serif",
    padding: '0.65rem 1rem',
    borderBottom: '1px solid rgba(212, 175, 55, 0.08)',
    fontSize: '0.9rem',
    verticalAlign: 'top',
  },
  planetCell: {
    fontWeight: 600,
  },
  aspectedPlanetTag: {
    display: 'inline-block',
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    marginRight: '0.35rem',
    marginBottom: '0.25rem',
    background: 'rgba(212, 175, 55, 0.08)',
    border: '1px solid rgba(212, 175, 55, 0.12)',
  },
  emptyState: {
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    fontFamily: "'Outfit', sans-serif",
    padding: '2rem 1rem',
    fontSize: '0.9rem',
  },
};

export default function AspectsInfo({ chartData, language }) {
  const aspectsData = useMemo(() => {
    if (!chartData?.planets?.length) return [];

    const houseOccupants = {};
    chartData.planets.forEach((p) => {
      const h = Number(p.house);
      if (!houseOccupants[h]) houseOccupants[h] = [];
      houseOccupants[h].push(p);
    });

    return chartData.planets.map((planet) => {
      const house = Number(planet.house);
      const aspectedHouses = calcAspectedHouses(planet.name, house);

      const aspectedPlanets = [];
      aspectedHouses.forEach((ah) => {
        if (houseOccupants[ah]) {
          houseOccupants[ah].forEach((op) => {
            if (op.name !== planet.name) {
              aspectedPlanets.push(op);
            }
          });
        }
      });

      return {
        planet,
        house,
        aspectedHouses,
        aspectedPlanets,
      };
    });
  }, [chartData]);

  if (!chartData) return null;

  return (
    <div className="glass-panel" style={styles.wrapper}>
      <h2 style={styles.title}>ग्रह दृष्टि विवरण</h2>

      {aspectsData.length === 0 ? (
        <p style={styles.emptyState}>ग्रह डेटा उपलब्ध छैन।</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={styles.headerCell}>ग्रह</th>
                <th style={styles.headerCell}>स्थान</th>
                <th style={styles.headerCell}>दृष्टि भावहरू</th>
                <th style={styles.headerCell}>दृष्टि गरिएका ग्रहहरू</th>
              </tr>
            </thead>
            <tbody>
              {aspectsData.map(({ planet, house, aspectedHouses, aspectedPlanets }) => {
                const planetColor = getRelationshipColor(planet.relationship);
                return (
                  <tr key={planet.name}>
                    <td style={{ ...styles.cell, ...styles.planetCell, color: planetColor }}>
                      {toNepaliName(planet.name)}
                    </td>
                    <td style={{ ...styles.cell, color: 'var(--color-text-secondary)' }}>
                      {house}
                    </td>
                    <td style={{ ...styles.cell, color: 'var(--color-text-secondary)' }}>
                      {aspectedHouses.join(', ')}
                    </td>
                    <td style={styles.cell}>
                      {aspectedPlanets.length === 0 ? (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                          —
                        </span>
                      ) : (
                        aspectedPlanets.map((ap) => (
                          <span
                            key={ap.name}
                            style={{
                              ...styles.aspectedPlanetTag,
                              color: getRelationshipColor(ap.relationship),
                            }}
                          >
                            {toNepaliName(ap.name)}
                          </span>
                        ))
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
