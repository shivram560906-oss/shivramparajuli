from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

import datetime
import nepali_datetime
from database.connection import get_db
from database import models
from calculator import julian, planetary_positions, ayanamsha, houses, panchang, dasha, yogini, vargas

router = APIRouter()

# --- Pydantic Schemas for Request/Response Validation ---

class ChartRequest(BaseModel):
    name: str
    birth_date: str  # YYYY-MM-DD
    birth_time: str  # HH:MM:SS
    latitude: float
    longitude: float
    timezone: float  # hours offset, e.g. 5.75
    ayanamsha_type: str = "LAHIRI" # LAHIRI, RAMAN, KP, TROPICAL

class RecordCreate(BaseModel):
    name: str
    birth_date: str
    birth_time: str
    latitude: float
    longitude: float
    timezone: float
    gender: Optional[str] = None
    notes: Optional[str] = None

class RecordResponse(BaseModel):
    id: int
    name: str
    birth_date: str
    birth_time: str
    latitude: float
    longitude: float
    timezone: float
    gender: Optional[str] = None
    notes: Optional[str] = None
    
    class Config:
        orm_mode = True
        from_attributes = True

class SettingsUpdate(BaseModel):
    ayanamsha_type: str
    chart_style: str
    language: str

# --- Astrological Calculations & Helpers ---

LAGNA_PLANET_RELATIONS = {
    1: { # Aries / Mesha
        "karaka": ["Sun", "Jupiter", "Mars"],
        "maraka": ["Mercury", "Venus", "Saturn", "Rahu", "Ketu"],
        "sama": ["Moon"]
    },
    2: { # Taurus / Vrisha
        "karaka": ["Sun", "Mercury", "Saturn", "Venus"],
        "maraka": ["Moon", "Mars", "Jupiter", "Rahu", "Ketu"],
        "sama": []
    },
    3: { # Gemini / Mithuna
        "karaka": ["Mercury", "Venus"],
        "maraka": ["Sun", "Mars", "Jupiter", "Rahu", "Ketu"],
        "sama": ["Moon", "Saturn"]
    },
    4: { # Cancer / Karka
        "karaka": ["Moon", "Mars", "Jupiter"],
        "maraka": ["Mercury", "Venus", "Saturn", "Rahu", "Ketu"],
        "sama": ["Sun"]
    },
    5: { # Leo / Simha
        "karaka": ["Sun", "Mars", "Jupiter"],
        "maraka": ["Mercury", "Venus", "Saturn", "Rahu", "Ketu"],
        "sama": ["Moon"]
    },
    6: { # Virgo / Kanya
        "karaka": ["Mercury", "Venus"],
        "maraka": ["Moon", "Mars", "Jupiter", "Rahu", "Ketu"],
        "sama": ["Sun", "Saturn"]
    },
    7: { # Libra / Tula
        "karaka": ["Venus", "Mercury", "Saturn"],
        "maraka": ["Sun", "Mars", "Jupiter", "Rahu", "Ketu"],
        "sama": ["Moon"]
    },
    8: { # Scorpio / Vrishchika
        "karaka": ["Mars", "Moon", "Sun", "Jupiter"],
        "maraka": ["Mercury", "Venus", "Rahu", "Ketu"],
        "sama": ["Saturn"]
    },
    9: { # Sagittarius / Dhanu
        "karaka": ["Jupiter", "Sun", "Mars"],
        "maraka": ["Mercury", "Venus", "Rahu", "Ketu"],
        "sama": ["Moon", "Saturn"]
    },
    10: { # Capricorn / Makara
        "karaka": ["Saturn", "Mercury", "Venus"],
        "maraka": ["Sun", "Mars", "Jupiter", "Rahu", "Ketu"],
        "sama": ["Moon"]
    },
    11: { # Aquarius / Kumbha
        "karaka": ["Saturn", "Venus", "Mercury"],
        "maraka": ["Sun", "Mars", "Jupiter", "Rahu", "Ketu"],
        "sama": ["Moon"]
    },
    12: { # Pisces / Mina
        "karaka": ["Jupiter", "Moon", "Mars"],
        "maraka": ["Sun", "Mercury", "Venus", "Saturn", "Rahu", "Ketu"],
        "sama": []
    }
}

def is_planet_retrograde(planet_name: str, T: float) -> bool:
    if planet_name in ["Sun", "Moon"]:
        return False
    if planet_name in ["Rahu", "Ketu"]:
        return True
    lon1, _ = planetary_positions.get_geocentric_coordinates(planet_name, T)
    dT = 1e-6
    lon2, _ = planetary_positions.get_geocentric_coordinates(planet_name, T + dT)
    diff = (lon2 - lon1 + 180) % 360 - 180
    return diff < 0

def is_planet_combust(planet_name: str, T: float, is_retrograde: bool) -> bool:
    if planet_name in ["Sun", "Rahu", "Ketu"]:
        return False
    sun_lon = planetary_positions.get_sun_position(T)[0]
    if planet_name == "Moon":
        lon = planetary_positions.get_moon_position(T)[0]
    else:
        lon = planetary_positions.get_geocentric_coordinates(planet_name, T)[0]
    diff = abs((lon - sun_lon + 180) % 360 - 180)
    limits = {
        "Moon": 12.0,
        "Mars": 17.0,
        "Mercury": 12.0 if is_retrograde else 14.0,
        "Jupiter": 11.0,
        "Venus": 8.0 if is_retrograde else 10.0,
        "Saturn": 15.0
    }
    return diff <= limits.get(planet_name, 0.0)

def get_planet_relationship(planet_name: str, lagna_sign: int) -> str:
    relations = LAGNA_PLANET_RELATIONS.get(lagna_sign, {})
    if planet_name in relations.get("karaka", []):
        return "karaka"
    elif planet_name in relations.get("maraka", []):
        return "maraka"
    else:
        return "sama"

def get_planet_exaltation_debilitation(planet_name: str, sign_number: int) -> str:
    exaltation_signs = {
        "Sun": 1,      # Aries
        "Moon": 2,     # Taurus
        "Mars": 10,    # Capricorn
        "Mercury": 6,  # Virgo
        "Jupiter": 4,  # Cancer
        "Venus": 12,   # Pisces
        "Saturn": 7,   # Libra
        "Rahu": 2,     # Taurus
        "Ketu": 8      # Scorpio
    }
    debilitation_signs = {
        "Sun": 7,      # Libra
        "Moon": 8,     # Scorpio
        "Mars": 4,     # Cancer
        "Mercury": 12, # Pisces
        "Jupiter": 10, # Capricorn
        "Venus": 6,    # Virgo
        "Saturn": 1,   # Aries
        "Rahu": 8,     # Scorpio
        "Ketu": 2      # Taurus
    }
    if exaltation_signs.get(planet_name) == sign_number:
        return "exalted"
    elif debilitation_signs.get(planet_name) == sign_number:
        return "debilitated"
    return ""

# --- Calculation Logic Wrapper ---

def perform_calculations(
    name: str, 
    birth_date: str, 
    birth_time: str, 
    latitude: float, 
    longitude: float, 
    timezone: float, 
    ayanamsha_type: str
) -> Dict[str, Any]:
    
    # 1. Parse hour, minute, second from time string
    try:
        h, m, s = map(float, birth_time.split(":"))
    except ValueError:
        h, m, s = 12.0, 0.0, 0.0  # default to noon
        
    y, month, d = map(int, birth_date.split("-"))
    
    # 2. Get Julian Date and Julian Centuries
    jd = julian.datetime_to_jd(y, month, d, int(h), int(m), s, timezone)
    T = julian.jd_to_julian_centuries(jd)
    
    # 3. Calculate Ayanamsha value
    aya_val = ayanamsha.get_ayanamsha(ayanamsha_type, T)
    
    # 4. Calculate Lagna (Ascendant)
    lagna_tropical = houses.calculate_lagna(jd, latitude, longitude)
    lagna_sidereal = ayanamsha.convert_tropical_to_sidereal(lagna_tropical, aya_val)
    lagna_sign_num, lagna_sign_name = houses.get_zodiac_sign(lagna_sidereal)
    lagna_deg = lagna_sidereal % 30.0
    
    # 5. Calculate Planetary positions
    tropical_positions = planetary_positions.get_all_tropical_positions(T)
    sidereal_positions = {}
    planets_data = []
    
    # Standard list of planets for sorting
    planet_order = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
    
    for name_key in planet_order:
        if name_key not in tropical_positions:
            continue
        trop_long, trop_lat = tropical_positions[name_key]
        sid_long = ayanamsha.convert_tropical_to_sidereal(trop_long, aya_val)
        sidereal_positions[name_key] = sid_long
        
        sign_num, sign_name = houses.get_zodiac_sign(sid_long)
        long_in_sign = sid_long % 30.0
        
        is_retro = is_planet_retrograde(name_key, T)
        is_comb = is_planet_combust(name_key, T, is_retro)
        rel = get_planet_relationship(name_key, lagna_sign_num)
        exalt = get_planet_exaltation_debilitation(name_key, sign_num)
        
        planets_data.append({
            "name": name_key,
            "tropical_longitude": trop_long,
            "sidereal_longitude": sid_long,
            "sign_number": sign_num,
            "sign_name": sign_name,
            "longitude_in_sign": long_in_sign,
            "latitude": trop_lat,
            "is_retrograde": is_retro,
            "is_combust": is_comb,
            "relationship": rel,
            "exaltation_state": exalt
        })
        
    # 6. House Placements
    house_placements = houses.get_house_placements(sidereal_positions, lagna_sidereal)
    
    # Update planets list with house details
    for p in planets_data:
        p["house"] = house_placements[p["name"]]
        
    # 7. Panchang Calculations
    # Note: Panchang calculations use sidereal positions of Sun and Moon
    sun_sid = sidereal_positions["Sun"]
    moon_sid = sidereal_positions["Moon"]
    panchang_data = panchang.calculate_panchang(jd, sun_sid, moon_sid)
    
    # 8. Dasha Calculations
    dasha_data = dasha.calculate_vimshottari_dasha(moon_sid, birth_date, birth_time)
    
    # 9. Yogini Dasha Calculations
    yogini_dasha_data = yogini.calculate_yogini_dasha(moon_sid, birth_date, birth_time)
    
    vargas_data = vargas.calculate_varga_positions(lagna_sidereal, planets_data)
    
    return {
        "metadata": {
            "name": name,
            "birth_date": birth_date,
            "birth_time": birth_time,
            "latitude": latitude,
            "longitude": longitude,
            "timezone": timezone,
            "ayanamsha_type": ayanamsha_type,
            "ayanamsha_value": aya_val,
            "julian_date": jd
        },
        "lagna": {
            "longitude": lagna_sidereal,
            "sign_number": lagna_sign_num,
            "sign_name": lagna_sign_name,
            "longitude_in_sign": lagna_deg
        },
        "planets": planets_data,
        "panchang": panchang_data,
        "dasha": dasha_data,
        "yogini_dasha": yogini_dasha_data,
        "vargas": vargas_data
    }

# --- Route Handlers ---

@router.post("/calculate")
def calculate_chart(req: ChartRequest):
    try:
        results = perform_calculations(
            name=req.name,
            birth_date=req.birth_date,
            birth_time=req.birth_time,
            latitude=req.latitude,
            longitude=req.longitude,
            timezone=req.timezone,
            ayanamsha_type=req.ayanamsha_type
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Calculation Error: {str(e)}")

@router.get("/records", response_model=List[RecordResponse])
def get_records(db: Session = Depends(get_db)):
    # Return all saved records from the database
    return db.query(models.KundaliRecord).order_by(models.KundaliRecord.created_at.desc()).all()

@router.post("/records", response_model=RecordResponse)
def save_record(record: RecordCreate, db: Session = Depends(get_db)):
    db_record = models.KundaliRecord(
        name=record.name,
        birth_date=record.birth_date,
        birth_time=record.birth_time,
        latitude=record.latitude,
        longitude=record.longitude,
        timezone=record.timezone,
        gender=record.gender,
        notes=record.notes
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.delete("/records/{record_id}")
def delete_record(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(models.KundaliRecord).filter(models.KundaliRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(db_record)
    db.commit()
    return {"message": "Record deleted successfully"}

@router.get("/settings")
def get_settings(db: Session = Depends(get_db)):
    # Get settings or create default
    db_settings = db.query(models.Settings).first()
    if not db_settings:
        db_settings = models.Settings(
            ayanamsha_type="LAHIRI",
            chart_style="NORTH_INDIAN",
            language="en"
        )
        db.add(db_settings)
        db.commit()
        db.refresh(db_settings)
    return db_settings

@router.post("/settings")
def update_settings(settings: SettingsUpdate, db: Session = Depends(get_db)):
    db_settings = db.query(models.Settings).first()
    if not db_settings:
        db_settings = models.Settings()
        db.add(db_settings)
        
    db_settings.ayanamsha_type = settings.ayanamsha_type
    db_settings.chart_style = settings.chart_style
    db_settings.language = settings.language
    
    db.commit()
    db.refresh(db_settings)
    return db_settings

@router.get("/convert/bs-to-ad")
def convert_bs_to_ad(year: int, month: int, day: int):
    try:
        bs_date = nepali_datetime.date(year, month, day)
        ad_date = bs_date.to_datetime_date()
        return {"ad_date": ad_date.isoformat()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"BS to AD conversion failed: {str(e)}")

@router.get("/convert/ad-to-bs")
def convert_ad_to_bs(date: str):
    try:
        # date format: YYYY-MM-DD
        ad_dt = datetime.date.fromisoformat(date)
        bs_date = nepali_datetime.date.from_datetime_date(ad_dt)
        return {
            "bs_date": f"{bs_date.year}-{bs_date.month:02d}-{bs_date.day:02d}",
            "year": bs_date.year,
            "month": bs_date.month,
            "day": bs_date.day
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"AD to BS conversion failed: {str(e)}")

