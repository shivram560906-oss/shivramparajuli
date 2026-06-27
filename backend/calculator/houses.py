import math
from typing import Dict, List, Tuple
from .julian import jd_to_julian_centuries
from .planetary_positions import rev, dtor, rtod

def get_obliquity(T: float) -> float:
    """Calculates the obliquity of the ecliptic (in degrees) for Julian Century T."""
    # Obliquity formula (Laskar, 1986)
    return 23.43929111 - (46.8150 * T - 0.00059 * T*T + 0.001813 * T*T*T) / 3600.0

def get_sidereal_time(jd: float, longitude: float) -> float:
    """
    Calculates Local Sidereal Time (LST) in degrees.
    longitude is east positive, west negative.
    """
    T = jd_to_julian_centuries(jd)
    
    # Greenwich Mean Sidereal Time (GMST) in degrees
    # Formula from IAU 1982
    gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T*T - T*T*T / 38710000.0
    gmst = rev(gmst)
    
    # Local Sidereal Time (LST)
    lst = rev(gmst + longitude)
    return lst

def calculate_lagna(jd: float, latitude: float, longitude: float) -> float:
    """
    Calculates the geocentric Tropical Ascendant (Lagna) in degrees.
    latitude: North positive, South negative.
    longitude: East positive, West negative.
    """
    T = jd_to_julian_centuries(jd)
    lst = get_sidereal_time(jd, longitude)
    
    lst_rad = dtor(lst)
    eps_rad = dtor(get_obliquity(T))
    lat_rad = dtor(latitude)
    
    # Ascendant formula:
    # tan(Asc) = cos(LST) / (-sin(LST)*cos(eps) - tan(lat)*sin(eps))
    # Using atan2 to handle quadrants properly:
    # y = cos(LST)
    # x = -sin(LST)*cos(eps) - tan(lat)*sin(eps)
    y = math.cos(lst_rad)
    x = -math.sin(lst_rad) * math.cos(eps_rad) - math.tan(lat_rad) * math.sin(eps_rad)
    
    lagna_rad = math.atan2(y, x)
    lagna = rev(rtod(lagna_rad))
    
    return lagna

def get_zodiac_sign(longitude: float) -> Tuple[int, str]:
    """
    Returns the 1-indexed zodiac sign number (1 = Aries, 12 = Pisces)
    and the name of the sign for a given longitude.
    """
    signs = [
        "Aries (मेष)", "Taurus (वृष)", "Gemini (मिथुन)", "Cancer (कर्क)",
        "Leo (सिंह)", "Virgo (कन्या)", "Libra (तुला)", "Scorpio (वृश्चिक)",
        "Sagittarius (धनु)", "Capricorn (मकर)", "Aquarius (कुम्भ)", "Pisces (मीन)"
    ]
    sign_idx = int(longitude / 30.0) % 12
    return sign_idx + 1, signs[sign_idx]

def get_house_placements(planetary_sidereal_longs: Dict[str, float], lagna_sidereal_long: float) -> Dict[str, int]:
    """
    Determines which house each planet belongs to, using the standard Rashi-Bhava system.
    House 1 is the zodiac sign containing the Lagna.
    House 2 is the next sign, etc.
    """
    lagna_sign_idx = int(lagna_sidereal_long / 30.0) % 12
    placements = {}
    
    for planet, long in planetary_sidereal_longs.items():
        planet_sign_idx = int(long / 30.0) % 12
        # House calculation: (planet_sign - lagna_sign) % 12 + 1
        house = (planet_sign_idx - lagna_sign_idx) % 12 + 1
        placements[planet] = house
        
    return placements
