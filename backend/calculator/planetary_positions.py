import math
from typing import Dict, Tuple

# Helper mathematical constants and functions
PI_2 = 2.0 * math.pi

def dtor(d: float) -> float:
    return d * math.pi / 180.0

def rtod(r: float) -> float:
    return r * 180.0 / math.pi

def rev(angle: float) -> float:
    """Normalize angle to 0..360 degrees."""
    return angle % 360.0

def solve_kepler(M_rad: float, e: float) -> float:
    """Solves Kepler's Equation E - e*sin(E) = M using iteration."""
    E = M_rad
    for _ in range(15):
        delta = E - e * math.sin(E) - M_rad
        if abs(delta) < 1e-7:
            break
        E = E - delta / (1.0 - e * math.cos(E))
    return E

# Keplerian Orbital Elements at J2000.0
# Elements: (a_0, a_dot, e_0, e_dot, I_0, I_dot, L_0, L_dot, w_0, w_dot, node_0, node_dot)
# Time T is in Julian Centuries from J2000.0
PLANET_ELEMENTS = {
    # Earth (used to get heliocentric Earth vector, equivalent to Sun geocentric)
    "Earth": {
        "a": (1.00000261, -0.00000003),
        "e": (0.01671123, -0.00003842),
        "i": (-0.00001531, -0.01294668),
        "L": (100.46457166, 35999.37244981),
        "w": (102.93768193, 0.32327364),
        "node": (0.0, 0.0)
    },
    "Mercury": {
        "a": (0.38709893, 0.0),
        "e": (0.20563069, 0.00002040),
        "i": (7.00497902, -0.00594749),
        "L": (252.25032350, 149472.67411175),
        "w": (77.45645, 0.15901),
        "node": (48.33076, -0.12534)
    },
    "Venus": {
        "a": (0.72333199, 0.0),
        "e": (0.00677323, -0.00004776),
        "i": (3.39467605, -0.00078890),
        "L": (181.97909950, 58517.81538729),
        "w": (131.53298, 0.00213),
        "node": (76.68069, -0.27769)
    },
    "Mars": {
        "a": (1.52371034, 0.00000184),
        "e": (0.09340510, 0.00009132),
        "i": (1.84969142, -0.00072447),
        "L": (355.44656795, 19140.30268499),
        "w": (336.04084, 0.44388),
        "node": (49.55953, -0.29252)
    },
    "Jupiter": {
        "a": (5.20288700, -0.00011607),
        "e": (0.04838624, -0.00013253),
        "i": (1.30439695, -0.00172324),
        "L": (34.39644051, 3034.74612775),
        "w": (14.72847, 0.19112),
        "node": (100.47392, 0.20469)
    },
    "Saturn": {
        "a": (9.53667594, -0.00125060),
        "e": (0.05415060, -0.00036762),
        "i": (2.48599187, 0.00193609),
        "L": (50.07747140, 1222.11379404),
        "w": (92.43194, -0.41897),
        "node": (113.66242, -0.28867)
    }
}

def get_heliocentric_vector(planet_name: str, T: float) -> Tuple[float, float, float]:
    """Calculates heliocentric rectangular coordinates (x, y, z) for a planet at time T."""
    elems = PLANET_ELEMENTS[planet_name]
    
    # Calculate orbital elements at Julian century T
    a = elems["a"][0] + elems["a"][1] * T
    e = elems["e"][0] + elems["e"][1] * T
    i = dtor(elems["i"][0] + elems["i"][1] * T)
    L = dtor(rev(elems["L"][0] + elems["L"][1] * T))
    w = dtor(rev(elems["w"][0] + elems["w"][1] * T))
    node = dtor(rev(elems["node"][0] + elems["node"][1] * T))
    
    # Mean anomaly M
    M = L - w
    E = solve_kepler(M, e)
    
    # Coordinates in orbital plane
    x_rect = a * (math.cos(E) - e)
    y_rect = a * math.sqrt(1.0 - e * e) * math.sin(E)
    
    # Argument of perihelion w_orb
    w_orb = w - node
    
    # Transform to ecliptic 3D coordinates
    cos_w = math.cos(w_orb)
    sin_w = math.sin(w_orb)
    cos_node = math.cos(node)
    sin_node = math.sin(node)
    cos_i = math.cos(i)
    sin_i = math.sin(i)
    
    x = x_rect * (cos_w * cos_node - sin_w * sin_node * cos_i) - y_rect * (sin_w * cos_node + cos_w * sin_node * cos_i)
    y = x_rect * (cos_w * sin_node + sin_w * cos_node * cos_i) - y_rect * (sin_w * sin_node - cos_w * cos_node * cos_i)
    z = x_rect * (sin_w * sin_i) + y_rect * (cos_w * sin_i)
    
    return x, y, z

def get_geocentric_coordinates(planet_name: str, T: float) -> Tuple[float, float]:
    """
    Returns geocentric Ecliptic Longitude and Latitude (Sayana/Tropical) 
    in degrees for a major planet.
    """
    px, py, pz = get_heliocentric_vector(planet_name, T)
    ex, ey, ez = get_heliocentric_vector("Earth", T)
    
    # Geocentric vector = Planet vector - Earth vector
    gx = px - ex
    gy = py - ey
    gz = pz - ez
    
    # Convert to spherical coordinates
    long_rad = math.atan2(gy, gx)
    lat_rad = math.atan2(gz, math.sqrt(gx*gx + gy*gy))
    
    longitude = rev(rtod(long_rad))
    latitude = rtod(lat_rad)
    
    return longitude, latitude

def get_sun_position(T: float) -> Tuple[float, float]:
    """
    Returns the Sun's geocentric longitude and latitude (tropical).
    Sun's heliocentric position is exactly opposite to Earth's heliocentric position.
    """
    ex, ey, ez = get_heliocentric_vector("Earth", T)
    # Sun geocentric = - Earth heliocentric
    sx = -ex
    sy = -ey
    sz = -ez
    
    long_rad = math.atan2(sy, sx)
    lat_rad = math.atan2(sz, math.sqrt(sx*sx + sy*sy))
    
    return rev(rtod(long_rad)), rtod(lat_rad)

def get_moon_position(T: float) -> Tuple[float, float]:
    """
    Returns Moon's geocentric tropical longitude and latitude.
    Implements major perturbations using standard astronomical algorithms (simplified Meeus).
    """
    # Mean arguments for Moon's orbit (relative to J2000)
    # L0: Mean longitude of the Moon
    L0 = rev(218.3164477 + 481267.88123421 * T)
    # D: Mean elongation of the Moon (from Sun)
    D = rev(297.8501921 + 445267.1114034 * T)
    # M: Sun's mean anomaly
    M = rev(357.5291092 + 35999.0502909 * T)
    # M': Moon's mean anomaly
    M_prime = rev(134.9633964 + 477198.8675055 * T)
    # F: Moon's argument of latitude
    F = rev(93.2720950 + 483202.0175233 * T)
    
    # Convert to radians
    L0_r = dtor(L0)
    D_r = dtor(D)
    M_r = dtor(M)
    Mp_r = dtor(M_prime)
    F_r = dtor(F)
    
    # Longitude perturbations (major terms in arcseconds or directly degrees)
    # Principal term (Center of Equation)
    long_corr = 6.288774 * math.sin(Mp_r)
    # Evection
    long_corr += 1.274027 * math.sin(2.0 * D_r - Mp_r)
    # Variation
    long_corr += 0.658314 * math.sin(2.0 * D_r)
    # Annual Equation
    long_corr -= 0.185116 * math.sin(M_r)
    # Other smaller perturbations
    long_corr += 0.213618 * math.sin(2.0 * Mp_r)
    long_corr -= 0.114332 * math.sin(2.0 * F_r)
    long_corr += 0.058793 * math.sin(2.0 * D_r - 2.0 * Mp_r)
    long_corr += 0.057066 * math.sin(2.0 * D_r - M_r - Mp_r)
    long_corr += 0.053322 * math.sin(2.0 * D_r + Mp_r)
    long_corr += 0.045758 * math.sin(2.0 * D_r - M_r)
    long_corr -= 0.041253 * math.sin(M_r + Mp_r)
    long_corr -= 0.035415 * math.sin(M_r - Mp_r)
    
    moon_long = rev(L0 + long_corr)
    
    # Latitude perturbations (major terms)
    lat_corr = 5.128154 * math.sin(F_r)
    lat_corr += 0.280602 * math.sin(Mp_r + F_r)
    lat_corr += 0.277693 * math.sin(Mp_r - F_r)
    lat_corr += 0.173238 * math.sin(2.0 * D_r - F_r)
    lat_corr += 0.055413 * math.sin(2.0 * D_r - Mp_r + F_r)
    lat_corr += 0.046271 * math.sin(2.0 * D_r - Mp_r - F_r)
    
    moon_lat = lat_corr
    
    return moon_long, moon_lat

def get_rahu_position(T: float) -> float:
    """
    Returns the Mean Node (Rahu) tropical longitude.
    Rahu is the Ascending Node.
    """
    # Rahu mean longitude = 125.0445550 - 1934.1361849 * T
    return rev(125.0445550 - 1934.1361849 * T + 0.0020762 * T*T)

def get_ketu_position(rahu_long: float) -> float:
    """Ketu is always 180 degrees opposite of Rahu."""
    return rev(rahu_long + 180.0)

def get_all_tropical_positions(T: float) -> Dict[str, Tuple[float, float]]:
    """Calculates tropical (Sayana) positions for all 9 celestial bodies."""
    positions = {}
    positions["Sun"] = get_sun_position(T)
    positions["Moon"] = get_moon_position(T)
    
    for planet in ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"]:
        positions[planet] = get_geocentric_coordinates(planet, T)
        
    rahu = get_rahu_position(T)
    positions["Rahu"] = (rahu, 0.0)
    positions["Ketu"] = (get_ketu_position(rahu), 0.0)
    
    return positions
