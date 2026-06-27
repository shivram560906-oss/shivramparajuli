import math
from typing import Dict, Any, List

SIGNS = [
    "Aries (मेष)", "Taurus (वृष)", "Gemini (मिथुन)", "Cancer (कर्क)",
    "Leo (सिंह)", "Virgo (कन्या)", "Libra (तुला)", "Scorpio (वृश्चिक)",
    "Sagittarius (धनु)", "Capricorn (मकर)", "Aquarius (कुम्भ)", "Pisces (मीन)"
]

def get_varga_sign(varga: str, longitude: float) -> int:
    longitude = longitude % 360.0
    sign_number = int(longitude / 30.0) % 12 + 1
    deg = longitude % 30.0

    if varga == "D1":
        return sign_number

    elif varga == "D9":
        part = int(deg / (30.0 / 9.0))
        if sign_number in [1, 5, 9]:    # Fire
            return (0 + part) % 12 + 1
        elif sign_number in [2, 6, 10]: # Earth
            return (9 + part) % 12 + 1
        elif sign_number in [3, 7, 11]: # Air
            return (6 + part) % 12 + 1
        else:                           # Water
            return (3 + part) % 12 + 1

    elif varga == "D10":
        part = int(deg / 3.0)
        if sign_number % 2 != 0:
            return (sign_number - 1 + part) % 12 + 1
        else:
            return (sign_number - 1 + 8 + part) % 12 + 1

    elif varga == "D12":
        part = int(deg / 2.5)
        return (sign_number - 1 + part) % 12 + 1

    elif varga == "D16":
        part = int(deg / 1.875)
        if sign_number in [1, 4, 7, 10]:
            return (0 + part) % 12 + 1
        elif sign_number in [2, 5, 8, 11]:
            return (4 + part) % 12 + 1
        else:
            return (8 + part) % 12 + 1

    elif varga == "D20":
        part = int(deg / 1.5)
        if sign_number in [1, 4, 7, 10]:
            return (0 + part) % 12 + 1
        elif sign_number in [2, 5, 8, 11]:
            return (8 + part) % 12 + 1
        else:
            return (4 + part) % 12 + 1

    elif varga == "D24":
        part = int(deg / 1.25)
        if sign_number % 2 != 0:
            return (4 + part) % 12 + 1
        else:
            return (3 + part) % 12 + 1

    elif varga == "D27":
        part = int(deg / (30.0 / 27.0))
        if sign_number in [1, 5, 9]:
            return (0 + part) % 12 + 1
        elif sign_number in [2, 6, 10]:
            return (3 + part) % 12 + 1
        elif sign_number in [3, 7, 11]:
            return (6 + part) % 12 + 1
        else:
            return (9 + part) % 12 + 1

    elif varga == "D30":
        if sign_number % 2 != 0:
            if deg < 5.0: return 1
            elif deg < 10.0: return 11
            elif deg < 18.0: return 9
            elif deg < 25.0: return 3
            else: return 2
        else:
            if deg < 5.0: return 2
            elif deg < 12.0: return 3
            elif deg < 20.0: return 9
            elif deg < 25.0: return 11
            else: return 1

    elif varga == "D40":
        part = int(deg / 0.75)
        if sign_number % 2 != 0:
            return (0 + part) % 12 + 1
        else:
            return (6 + part) % 12 + 1

    elif varga == "D45":
        part = int(deg / (30.0 / 45.0))
        if sign_number in [1, 4, 7, 10]:
            return (0 + part) % 12 + 1
        elif sign_number in [2, 5, 8, 11]:
            return (4 + part) % 12 + 1
        else:
            return (8 + part) % 12 + 1

    elif varga == "D60":
        part = int(deg / 0.5)
        if sign_number % 2 != 0:
            return (0 + part) % 12 + 1
        else:
            return (6 + part) % 12 + 1

    return sign_number

def get_planet_exaltation_debilitation(planet_name: str, sign_number: int) -> str:
    exaltation_signs = {
        "Sun": 1,
        "Moon": 2,
        "Mars": 10,
        "Mercury": 6,
        "Jupiter": 4,
        "Venus": 12,
        "Saturn": 7,
        "Rahu": 2,
        "Ketu": 8
    }
    debilitation_signs = {
        "Sun": 7,
        "Moon": 8,
        "Mars": 4,
        "Mercury": 12,
        "Jupiter": 10,
        "Venus": 6,
        "Saturn": 1,
        "Rahu": 8,
        "Ketu": 2
    }
    if exaltation_signs.get(planet_name) == sign_number:
        return "exalted"
    elif debilitation_signs.get(planet_name) == sign_number:
        return "debilitated"
    return ""

def calculate_varga_positions(lagna_sidereal: float, planets: List[Dict[str, Any]]) -> Dict[str, Any]:
    vargas = ["D1", "D9", "D10", "D12", "D16", "D20", "D24", "D27", "D30", "D40", "D45", "D60"]
    result = {}
    
    for v in vargas:
        lagna_v_sign = get_varga_sign(v, lagna_sidereal)
        
        varga_planets = []
        for p in planets:
            p_v_sign = get_varga_sign(v, p["sidereal_longitude"])
            v_house = (p_v_sign - lagna_v_sign) % 12 + 1
            exalt = get_planet_exaltation_debilitation(p["name"], p_v_sign)
            
            varga_planets.append({
                "name": p["name"],
                "sidereal_longitude": p["sidereal_longitude"],
                "sign_number": p_v_sign,
                "sign_name": SIGNS[p_v_sign - 1],
                "longitude_in_sign": p["sidereal_longitude"] % 30.0,
                "house": v_house,
                "is_retrograde": p["is_retrograde"],
                "is_combust": p["is_combust"],
                "relationship": p["relationship"],
                "exaltation_state": exalt
            })
            
        result[v] = {
            "lagna": {
                "longitude": lagna_sidereal,
                "sign_number": lagna_v_sign,
                "sign_name": SIGNS[lagna_v_sign - 1],
                "longitude_in_sign": lagna_sidereal % 30.0
            },
            "planets": varga_planets
        }
        
    return result
