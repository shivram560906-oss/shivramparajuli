import datetime
import nepali_datetime
from typing import List, Dict, Any

# Order of planets in Vimshottari Dasha
DASHA_ORDER = [
    {"name": "Ketu", "nepali": "केतु", "years": 7},
    {"name": "Venus", "nepali": "शुक्र", "years": 20},
    {"name": "Sun", "nepali": "सूर्य", "years": 6},
    {"name": "Moon", "nepali": "चन्द्र", "years": 10},
    {"name": "Mars", "nepali": "मङ्गल", "years": 7},
    {"name": "Rahu", "nepali": "राहु", "years": 18},
    {"name": "Jupiter", "nepali": "गुरु", "years": 16},
    {"name": "Saturn", "nepali": "शनि", "years": 19},
    {"name": "Mercury", "nepali": "बुध", "years": 17}
]

def ad_to_bs_str(ad_date: datetime.date) -> str:
    try:
        bs_date = nepali_datetime.date.from_datetime_date(ad_date)
        return f"{bs_date.year}-{bs_date.month:02d}-{bs_date.day:02d}"
    except Exception:
        year = ad_date.year + 57
        if ad_date.month < 4 or (ad_date.month == 4 and ad_date.day < 13):
            year = ad_date.year + 56
        return f"{year}-{ad_date.month:02d}-{ad_date.day:02d} (approx)"

def calculate_sub_dashas(
    parent_lord_idx: int,
    parent_start: datetime.date,
    parent_end: datetime.date,
    parent_years: float,
    level: int,
    birth_date: datetime.date,
    current_date: datetime.date
) -> List[Dict[str, Any]]:
    sub_periods = []
    current_start = parent_start
    
    for i in range(9):
        lord_idx = (parent_lord_idx + i) % 9
        lord_info = DASHA_ORDER[lord_idx]
        
        parent_duration_days = (parent_end - parent_start).days
        sub_days = int(parent_duration_days * (lord_info["years"] / 120.0))
        
        if i == 8:
            sub_end = parent_end
        else:
            sub_end = current_start + datetime.timedelta(days=sub_days)
            if sub_end > parent_end:
                sub_end = parent_end
                
        if sub_end <= birth_date:
            current_start = sub_end
            continue
            
        display_start = current_start
        is_partial = False
        if current_start < birth_date:
            display_start = birth_date
            is_partial = True
            
        is_active = (display_start <= current_date < sub_end)
        
        node = {
            "lord": lord_info["name"],
            "lord_nepali": lord_info["nepali"],
            "start": display_start.isoformat(),
            "end": sub_end.isoformat(),
            "start_bs": ad_to_bs_str(display_start),
            "end_bs": ad_to_bs_str(sub_end),
            "is_partial": is_partial,
            "is_active": is_active,
            "level": level
        }
        
        if level < 3 or (level < 5 and is_active):
            node["children"] = calculate_sub_dashas(
                lord_idx,
                current_start,
                sub_end,
                lord_info["years"],
                level + 1,
                birth_date,
                current_date
            )
            
        sub_periods.append(node)
        current_start = sub_end
        
    return sub_periods

def calculate_vimshottari_dasha(moon_sidereal_long: float, birth_date_str: str, birth_time_str: str) -> List[Dict[str, Any]]:
    try:
        birth_dt = datetime.datetime.strptime(f"{birth_date_str} {birth_time_str}", "%Y-%m-%d %H:%M:%S")
    except ValueError:
        birth_dt = datetime.datetime.strptime(birth_date_str, "%Y-%m-%d")
        
    birth_date = birth_dt.date()
    current_date = datetime.date.today()
    
    nakshatra_size = 360.0 / 27.0
    nak_idx = int(moon_sidereal_long / nakshatra_size) % 27
    
    start_planet_idx = nak_idx % 9
    
    nak_long = moon_sidereal_long % nakshatra_size
    fraction_elapsed = nak_long / nakshatra_size
    
    first_lord = DASHA_ORDER[start_planet_idx]
    elapsed_years = fraction_elapsed * first_lord["years"]
    elapsed_days = int(elapsed_years * 365.25)
    
    conceptional_start = birth_date - datetime.timedelta(days=elapsed_days)
    
    timeline = []
    current_start_date = conceptional_start
    current_planet_idx = start_planet_idx
    
    for cycle in range(9):
        lord = DASHA_ORDER[current_planet_idx]
        dasha_days = int(lord["years"] * 365.25)
        end_date = current_start_date + datetime.timedelta(days=dasha_days)
        
        if end_date <= birth_date:
            current_start_date = end_date
            current_planet_idx = (current_planet_idx + 1) % 9
            continue
            
        display_start = current_start_date
        is_partial = False
        if current_start_date < birth_date:
            display_start = birth_date
            is_partial = True
            
        is_active = (display_start <= current_date < end_date)
        
        node = {
            "lord": lord["name"],
            "lord_nepali": lord["nepali"],
            "total_years": lord["years"],
            "start": display_start.isoformat(),
            "end": end_date.isoformat(),
            "start_bs": ad_to_bs_str(display_start),
            "end_bs": ad_to_bs_str(end_date),
            "is_partial": is_partial,
            "is_active": is_active,
            "level": 1
        }
        
        # Calculate sub-dashas (Level 2 = Antardasha)
        node["children"] = calculate_sub_dashas(
            current_planet_idx,
            current_start_date,
            end_date,
            lord["years"],
            2,
            birth_date,
            current_date
        )
        
        timeline.append(node)
        current_start_date = end_date
        current_planet_idx = (current_planet_idx + 1) % 9
        
    return timeline
