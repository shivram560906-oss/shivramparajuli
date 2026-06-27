import math
from typing import Dict, Any

# Nakshatra Names (English & Nepali)
NAKSHATRAS = [
    {"name": "Ashwini", "nepali": "अश्विनी"},
    {"name": "Bharani", "nepali": "भरणी"},
    {"name": "Krittika", "nepali": "कृत्तिका"},
    {"name": "Rohini", "nepali": "रोहिणी"},
    {"name": "Mrigashira", "nepali": "मृगशिरा"},
    {"name": "Ardra", "nepali": "आर्द्रा"},
    {"name": "Punarvasu", "nepali": "पुनर्वसु"},
    {"name": "Pushya", "nepali": "पुष्य"},
    {"name": "Ashlesha", "nepali": "अश्लेषा"},
    {"name": "Magha", "nepali": "मघा"},
    {"name": "Purva Phalguni", "nepali": "पूर्वाफाल्गुनी"},
    {"name": "Uttara Phalguni", "nepali": "उत्तराफाल्गुनी"},
    {"name": "Hasta", "nepali": "हस्त"},
    {"name": "Chitra", "nepali": "चित्रा"},
    {"name": "Svati", "nepali": "स्वाती"},
    {"name": "Visakha", "nepali": "विशाखा"},
    {"name": "Anuradha", "nepali": "अनुराधा"},
    {"name": "Jyeshtha", "nepali": "ज्येष्ठा"},
    {"name": "Mula", "nepali": "मूल"},
    {"name": "Purva Ashadha", "nepali": "पूर्वाषाढा"},
    {"name": "Uttara Ashadha", "nepali": "उत्तराषाढा"},
    {"name": "Shravana", "nepali": "श्रवण"},
    {"name": "Dhanishta", "nepali": "धनिष्ठा"},
    {"name": "Shatabhisha", "nepali": "शतभिषा"},
    {"name": "Purva Bhadrapada", "nepali": "पूर्वभाद्रपदा"},
    {"name": "Uttara Bhadrapada", "nepali": "उत्तरभाद्रपदा"},
    {"name": "Revati", "nepali": "रेवती"}
]

# Tithi Names (English & Nepali)
TITHIS = [
    {"name": "Prathama (Pratipada)", "nepali": "प्रतिपदा"},
    {"name": "Dwitiya", "nepali": "द्वितीया"},
    {"name": "Tritiya", "nepali": "तृतीया"},
    {"name": "Chaturthi", "nepali": "चतुर्थी"},
    {"name": "Panchami", "nepali": "पञ्चमी"},
    {"name": "Shashti", "nepali": "षष्ठी"},
    {"name": "Saptami", "nepali": "सप्तमी"},
    {"name": "Ashtami", "nepali": "अष्टमी"},
    {"name": "Navami", "nepali": "नवमी"},
    {"name": "Dashami", "nepali": "दशमी"},
    {"name": "Ekadashi", "nepali": "एकादशी"},
    {"name": "Dwadashi", "nepali": "द्वादशी"},
    {"name": "Trayodashi", "nepali": "त्रयोदशी"},
    {"name": "Chaturdashi", "nepali": "चतुर्दशी"},
    {"name": "Purnima (Full Moon)", "nepali": "पूर्णिमा"},
    {"name": "Prathama (Pratipada)", "nepali": "प्रतिपदा"},
    {"name": "Dwitiya", "nepali": "द्वितीया"},
    {"name": "Tritiya", "nepali": "तृतीया"},
    {"name": "Chaturthi", "nepali": "चतुर्थी"},
    {"name": "Panchami", "nepali": "पञ्चमी"},
    {"name": "Shashti", "nepali": "षष्ठी"},
    {"name": "Saptami", "nepali": "सप्तमी"},
    {"name": "Ashtami", "nepali": "अष्टमी"},
    {"name": "Navami", "nepali": "नवमी"},
    {"name": "Dashami", "nepali": "दशमी"},
    {"name": "Ekadashi", "nepali": "एकादशी"},
    {"name": "Dwadashi", "nepali": "द्वादशी"},
    {"name": "Trayodashi", "nepali": "त्रयोदशी"},
    {"name": "Chaturdashi", "nepali": "चतुर्दशी"},
    {"name": "Amavasya (New Moon)", "nepali": "औंसी"}
]

# Yoga Names
YOGAS = [
    {"name": "Vishkumbha", "nepali": "विष्कम्भ"},
    {"name": "Priti", "nepali": "प्रीति"},
    {"name": "Ayushman", "nepali": "आयुष्मान्"},
    {"name": "Saubhagya", "nepali": "सौभाग्य"},
    {"name": "Shobhana", "nepali": "शोभन"},
    {"name": "Atiganda", "nepali": "अतिगण्ड"},
    {"name": "Sukarma", "nepali": "सुकर्मा"},
    {"name": "Dhriti", "nepali": "धृति"},
    {"name": "Shula", "nepali": "शूल"},
    {"name": "Ganda", "nepali": "गण्ड"},
    {"name": "Vriddhi", "nepali": "वृद्धि"},
    {"name": "Dhruva", "nepali": "ध्रुव"},
    {"name": "Vyaghata", "nepali": "व्याघात"},
    {"name": "Harshana", "nepali": "हर्षण"},
    {"name": "Vajra", "nepali": "वज्र"},
    {"name": "Siddhi", "nepali": "सिद्धि"},
    {"name": "Vyatipata", "nepali": "व्यतिपात"},
    {"name": "Variyan", "nepali": "वरीयान्"},
    {"name": "Parigha", "nepali": "परिघ"},
    {"name": "Shiva", "nepali": "शिव"},
    {"name": "Siddha", "nepali": "सिद्ध"},
    {"name": "Sadhya", "nepali": "साध्य"},
    {"name": "Shubha", "nepali": "शुभ"},
    {"name": "Shukla", "nepali": "शुक्ल"},
    {"name": "Brahma", "nepali": "ब्रह्म"},
    {"name": "Indra", "nepali": "इन्द्र"},
    {"name": "Vaidhriti", "nepali": "वैधृति"}
]

# Karana Names
KARANAS = [
    {"name": "Bava", "nepali": "बव"},
    {"name": "Balava", "nepali": "बालव"},
    {"name": "Kaulava", "nepali": "कौलव"},
    {"name": "Taitila", "nepali": "तैतिल"},
    {"name": "Gara", "nepali": "गर"},
    {"name": "Vanija", "nepali": "वणिज"},
    {"name": "Vishti (Bhadra)", "nepali": "विष्टि"},
    {"name": "Shakuni", "nepali": "शकुनि"},
    {"name": "Chatushpada", "nepali": "चतुष्पाद"},
    {"name": "Naga", "nepali": "नाग"},
    {"name": "Kintughna", "nepali": "किन्तुघ्न"}
]

# Vara Names
VARAS = [
    {"name": "Sunday (Adityavara)", "nepali": "आइतवार"},
    {"name": "Monday (Somavara)", "nepali": "सोमवार"},
    {"name": "Tuesday (Mangalavara)", "nepali": "मङ्गलवार"},
    {"name": "Wednesday (Budhavara)", "nepali": "बुधवार"},
    {"name": "Thursday (Guruvara)", "nepali": "बिहिवार"},
    {"name": "Friday (Shukravara)", "nepali": "शुक्रवार"},
    {"name": "Saturday (Shanivara)", "nepali": "शनिवार"}
]

def calculate_panchang(jd: float, sun_long: float, moon_long: float) -> Dict[str, Any]:
    """
    Calculates the 5 attributes of Panchang: Vara, Tithi, Nakshatra, Yoga, Karana.
    Positions should be sidereal (for Nakshatra and Yoga) or consistent.
    """
    # 1. Vara (Day of week)
    # Julian Date starts at 12:00 noon. Add 0.5 to offset to calendar day start.
    vara_idx = int(jd + 1.5) % 7
    vara = VARAS[vara_idx]
    
    # 2. Tithi
    diff = (moon_long - sun_long) % 360.0
    tithi_val = diff / 12.0
    tithi_idx = int(tithi_val) % 30
    tithi = TITHIS[tithi_idx]
    paksha = "Shukla (Waxing)" if tithi_idx < 15 else "Krishna (Waning)"
    paksha_nep = "शुक्ल पक्ष" if tithi_idx < 15 else "कृष्ण पक्ष"
    
    # 3. Nakshatra
    # Each nakshatra occupies 13°20' = 13.333333 degrees
    nakshatra_val = moon_long / 13.3333333
    nakshatra_idx = int(nakshatra_val) % 27
    nakshatra = NAKSHATRAS[nakshatra_idx]
    pada = int((nakshatra_val - int(nakshatra_val)) * 4) + 1
    
    # 4. Yoga
    yoga_long = (sun_long + moon_long) % 360.0
    yoga_val = yoga_long / 13.3333333
    yoga_idx = int(yoga_val) % 27
    yoga = YOGAS[yoga_idx]
    
    # 5. Karana
    # First Karana is Kintughna (starts at tithi 1 Shukla Paksha)
    # The repeating mobile karanas are Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti
    # Shakuni, Chatushpada, Naga, Kintughna are fixed karanas
    karana_val = diff / 6.0
    karana_idx_all = int(karana_val) % 60
    
    if karana_idx_all == 0:
        karana = KARANAS[10] # Kintughna
    elif 1 <= karana_idx_all <= 57:
        # Repeats 8 times of 7 karanas
        repeating_idx = (karana_idx_all - 1) % 7
        karana = KARANAS[repeating_idx]
    elif karana_idx_all == 58:
        karana = KARANAS[7] # Shakuni
    elif karana_idx_all == 59:
        karana = KARANAS[8] # Chatushpada
    else:
        karana = KARANAS[9] # Naga
        
    return {
        "vara": {"name": vara["name"], "nepali": vara["nepali"], "index": vara_idx},
        "tithi": {
            "name": tithi["name"], 
            "nepali": tithi["nepali"], 
            "index": tithi_idx + 1, 
            "paksha": paksha, 
            "paksha_nepali": paksha_nep,
            "progress": (tithi_val - int(tithi_val)) * 100
        },
        "nakshatra": {
            "name": nakshatra["name"], 
            "nepali": nakshatra["nepali"], 
            "index": nakshatra_idx + 1, 
            "pada": pada,
            "progress": (nakshatra_val - int(nakshatra_val)) * 100
        },
        "yoga": {
            "name": yoga["name"], 
            "nepali": yoga["nepali"], 
            "index": yoga_idx + 1,
            "progress": (yoga_val - int(yoga_val)) * 100
        },
        "karana": {"name": karana["name"], "nepali": karana["nepali"], "index": karana_idx_all + 1}
    }
