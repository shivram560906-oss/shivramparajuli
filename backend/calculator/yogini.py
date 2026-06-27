import datetime
from typing import List, Dict, Any

# Order of Yoginis in Yogini Dasha
YOGINI_ORDER = [
    {"index": 1, "name": "Mangala", "nepali": "मङ्गला", "years": 1, "lord": "Moon"},
    {"index": 2, "name": "Pingala", "nepali": "पिङ्गला", "years": 2, "lord": "Sun"},
    {"index": 3, "name": "Dhanya", "nepali": "धान्या", "years": 3, "lord": "Jupiter"},
    {"index": 4, "name": "Bhramari", "nepali": "भ्रामरी", "years": 4, "lord": "Mars"},
    {"index": 5, "name": "Bhadrika", "nepali": "भद्रिका", "years": 5, "lord": "Mercury"},
    {"index": 6, "name": "Ulka", "nepali": "उल्का", "years": 6, "lord": "Saturn"},
    {"index": 7, "name": "Siddha", "nepali": "सिद्धा", "years": 7, "lord": "Venus"},
    {"index": 8, "name": "Sankata", "nepali": "संकटा", "years": 8, "lord": "Rahu/Ketu"}
]

def add_years(start_date: datetime.date, years: float) -> datetime.date:
    """Adds a decimal number of years to a date."""
    days_to_add = int(years * 365.25)
    return start_date + datetime.timedelta(days=days_to_add)

def calculate_yogini_dasha(moon_sidereal_long: float, birth_date_str: str, birth_time_str: str) -> List[Dict[str, Any]]:
    """
    Calculates the Yogini Dasha timeline for a 108-year span (3 cycles of 36 years).
    """
    # 1. Parse birth datetime
    try:
        birth_dt = datetime.datetime.strptime(f"{birth_date_str} {birth_time_str}", "%Y-%m-%d %H:%M:%S")
    except ValueError:
        birth_dt = datetime.datetime.strptime(birth_date_str, "%Y-%m-%d")
        
    birth_date = birth_dt.date()
    
    # 2. Determine Nakshatra index (0..26)
    nakshatra_size = 360.0 / 27.0
    nak_idx = int(moon_sidereal_long / nakshatra_size) % 27
    nak_number = nak_idx + 1 # 1-indexed (1 = Ashwini)
    
    # 3. Calculate starting Yogini
    # Rule: (Nakshatra_No + 3) % 8
    # Remainder 1 = Mangala, 2 = Pingala, ..., 0 = Sankata
    val = (nak_number + 3) % 8
    # Convert remainder to index (0-indexed where 0 = Mangala, 7 = Sankata)
    if val == 0:
        start_yogini_idx = 7 # Sankata
    else:
        start_yogini_idx = val - 1
        
    # Longitude within this Nakshatra
    nak_long = moon_sidereal_long % nakshatra_size
    fraction_elapsed = nak_long / nakshatra_size
    fraction_remaining = 1.0 - fraction_elapsed
    
    # 4. Calculate first Dasha remaining duration
    first_yogini = YOGINI_ORDER[start_yogini_idx]
    remaining_duration = fraction_remaining * first_yogini["years"]
    
    # 5. Generate Mahadasha timeline for 108 years (3 cycles of 8 yoginis = 24 periods)
    timeline = []
    current_start_date = birth_date
    current_yogini_idx = start_yogini_idx
    
    # First Mahadasha (partial)
    first_end_date = add_years(current_start_date, remaining_duration)
    timeline.append({
        "name": YOGINI_ORDER[current_yogini_idx]["name"],
        "nepali": YOGINI_ORDER[current_yogini_idx]["nepali"],
        "lord": YOGINI_ORDER[current_yogini_idx]["lord"],
        "total_years": YOGINI_ORDER[current_yogini_idx]["years"],
        "start": current_start_date.isoformat(),
        "end": first_end_date.isoformat(),
        "is_partial": True,
        "remaining_years": remaining_duration
    })
    
    current_start_date = first_end_date
    current_yogini_idx = (current_yogini_idx + 1) % 8
    
    # Generate subsequent Mahadashas up to 108 years
    # 3 full cycles of 8 yoginis is 24. Since the first one is already added, we add 23 more.
    for _ in range(23):
        yogini = YOGINI_ORDER[current_yogini_idx]
        end_date = add_years(current_start_date, yogini["years"])
        timeline.append({
            "name": yogini["name"],
            "nepali": yogini["nepali"],
            "lord": yogini["lord"],
            "total_years": yogini["years"],
            "start": current_start_date.isoformat(),
            "end": end_date.isoformat(),
            "is_partial": False,
            "remaining_years": yogini["years"]
        })
        current_start_date = end_date
        current_yogini_idx = (current_yogini_idx + 1) % 8
        
    # 6. Add Antardashas (sub-periods) for each Yogini Mahadasha
    # For each MD, the 8 ADs start with the MD Yogini itself, and follow cyclical order.
    # AD duration fraction: (MD_years * AD_years) / 36
    for md in timeline:
        md_yogini_name = md["name"]
        md_start = datetime.date.fromisoformat(md["start"])
        md_end = datetime.date.fromisoformat(md["end"])
        
        # Find index of MD yogini
        md_yogini_idx = -1
        for idx, y in enumerate(YOGINI_ORDER):
            if y["name"] == md_yogini_name:
                md_yogini_idx = idx
                break
                
        # Scale if partial
        md_scaled_fraction = md["remaining_years"] / md["total_years"]
        
        ads = []
        ad_start = md_start
        ad_yogini_idx = md_yogini_idx
        
        for ad_count in range(8):
            ad_yogini = YOGINI_ORDER[ad_yogini_idx]
            ad_duration_years = (md["total_years"] * ad_yogini["years"]) / 36.0
            ad_scaled_years = ad_duration_years * md_scaled_fraction
            
            ad_days = int(ad_scaled_years * 365.25)
            
            if ad_count == 7:
                ad_end = md_end
            else:
                ad_end = ad_start + datetime.timedelta(days=ad_days)
                if ad_end > md_end:
                    ad_end = md_end
            
            ads.append({
                "name": ad_yogini["name"],
                "nepali": ad_yogini["nepali"],
                "start": ad_start.isoformat(),
                "end": ad_end.isoformat()
            })
            ad_start = ad_end
            ad_yogini_idx = (ad_yogini_idx + 1) % 8
            
        md["antardashas"] = ads
        
    return timeline
