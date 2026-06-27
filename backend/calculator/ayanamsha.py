def get_ayanamsha(ayanamsha_type: str, T: float) -> float:
    """
    Calculates the Ayanamsha value (in degrees) for a given Julian Century T from J2000.
    Supported types: LAHIRI, RAMAN, KP, TROPICAL
    """
    ayanamsha_type = ayanamsha_type.upper()
    
    if ayanamsha_type == "TROPICAL":
        return 0.0
        
    elif ayanamsha_type == "RAMAN":
        # Raman Ayanamsha: 22.460148 + 1.396042 * T + 0.000308 * T^2
        return 22.460148 + 1.396042 * T + 0.000308 * T * T
        
    elif ayanamsha_type == "KP":
        # KP Ayanamsha: 23.843611 + 1.397361 * T + 0.000308 * T^2
        return 23.84361111 + 1.39736111 * T + 0.000308 * T * T
        
    elif ayanamsha_type == "LAHIRI":
        # Default Lahiri (Chitra Paksha Ayanamsha)
        # 23.853056 + 1.396971 * T + 0.0003086 * T^2
        return 23.85305556 + 1.396971278 * T + 0.0003086 * T * T
        
    else:
        # Default fallback to Lahiri
        return 23.85305556 + 1.396971278 * T + 0.0003086 * T * T

def convert_tropical_to_sidereal(tropical_long: float, ayanamsha: float) -> float:
    """Converts tropical longitude to sidereal longitude by subtracting the ayanamsha."""
    return (tropical_long - ayanamsha) % 360.0
