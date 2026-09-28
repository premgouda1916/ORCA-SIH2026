from datetime import datetime, timedelta

# INCOIS Official Coverage Metadata
INCOIS_METADATA = {
    "webgis_nodes": 1223,
    "landing_centres": 586,
    "advisory_sectors": 14,
    "source_agency": "INCOIS (Indian National Centre for Ocean Information Services), MoES",
    "satellites": ["Oceansat-2 / Oceansat-3 (EOS-06)", "MODIS-Aqua", "Sentinel-3"],
    "last_synced": "2026-09-28 10:30 IST"
}

SAMPLE_PFZS = [
    {
        "id": "PFZ-MNG-01",
        "latitude": 12.9200,
        "longitude": 74.6500,
        "advisory_time": "2026-09-28 06:00 IST",
        "region": "Karnataka - Off Mangaluru Coast",
        "depth_meters": 35.0,
        "sst_celsius": 28.6,
        "chlorophyll_mg_m3": 3.8,
        "valid_until": "2026-09-29 18:00 IST",
        "source": "INCOIS PFZ Sector 7 Advisory",
        "status": "ACTIVE"
    },
    {
        "id": "PFZ-MNG-02",
        "latitude": 13.2100,
        "longitude": 74.4800,
        "advisory_time": "2026-09-28 06:00 IST",
        "region": "Karnataka - Off Malpe / Udupi",
        "depth_meters": 42.0,
        "sst_celsius": 28.2,
        "chlorophyll_mg_m3": 4.1,
        "valid_until": "2026-09-29 18:00 IST",
        "source": "INCOIS PFZ Sector 7 Advisory",
        "status": "ACTIVE"
    },
    {
        "id": "PFZ-KCH-01",
        "latitude": 9.9800,
        "longitude": 75.8500,
        "advisory_time": "2026-09-28 06:00 IST",
        "region": "Kerala - Off Kochi Coast",
        "depth_meters": 28.0,
        "sst_celsius": 29.1,
        "chlorophyll_mg_m3": 3.2,
        "valid_until": "2026-09-29 18:00 IST",
        "source": "INCOIS PFZ Sector 8 Advisory",
        "status": "ACTIVE"
    },
    {
        "id": "PFZ-MAA-01",
        "latitude": 13.1200,
        "longitude": 80.4500,
        "advisory_time": "2026-09-28 06:00 IST",
        "region": "Tamil Nadu - Off Chennai Coast",
        "depth_meters": 50.0,
        "sst_celsius": 28.9,
        "chlorophyll_mg_m3": 2.9,
        "valid_until": "2026-09-29 18:00 IST",
        "source": "INCOIS PFZ Sector 4 Advisory",
        "status": "ACTIVE"
    },
    {
        "id": "PFZ-VTZ-01",
        "latitude": 17.6500,
        "longitude": 83.4200,
        "advisory_time": "2026-09-28 06:00 IST",
        "region": "Andhra Pradesh - Off Visakhapatnam",
        "depth_meters": 65.0,
        "sst_celsius": 28.4,
        "chlorophyll_mg_m3": 3.5,
        "valid_until": "2026-09-29 18:00 IST",
        "source": "INCOIS PFZ Sector 3 Advisory",
        "status": "ACTIVE"
    }
]

SAMPLE_WEATHER = {
    "location": "Mangaluru Coastal Zone (Offshore 20-50km)",
    "timestamp": "2026-09-28 12:00 IST",
    "wind_speed_knots": 16.5,
    "wind_direction": "WNW (290°)",
    "wave_height_meters": 1.8,
    "wave_period_seconds": 7.2,
    "sea_state": "MODERATE",
    "lightning_risk": "MODERATE",
    "cyclone_alert": "NONE",
    "source": "INCOIS High Resolution Ocean State Forecast"
}

SAMPLE_HAZARDS = [
    {
        "id": "HAZ-WAVE-01",
        "type": "HIGH_WAVE",
        "severity": "MODERATE",
        "latitude": 13.2500,
        "longitude": 74.3000,
        "radius_km": 15.0,
        "start_time": "2026-09-28 08:00 IST",
        "end_time": "2026-09-29 20:00 IST",
        "description": "High wave warning: swell waves reaching 2.2m - 2.5m near St. Mary's Islands / Netrani offshore patch.",
        "source": "INCOIS Ocean State Forecast Warning"
    },
    {
        "id": "HAZ-LIGHTNING-01",
        "type": "LIGHTNING",
        "severity": "MODERATE",
        "latitude": 13.0500,
        "longitude": 74.4000,
        "radius_km": 20.0,
        "start_time": "2026-09-28 14:00 IST",
        "end_time": "2026-09-29 06:00 IST",
        "description": "Pre-monsoon localized convective thunderstorm clouds with isolated lightning activity detected by IMD Doppler Radar.",
        "source": "IMD Marine Weather Alert"
    }
]

SAMPLE_GEOFENCES = [
    {
        "id": "GEO-NAVY-01",
        "name": "Karwar Naval Base Restricted Defense Zone (Project Seabird)",
        "type": "NAVY_RANGE",
        "coordinates": [
            [14.80, 74.05],
            [14.85, 74.12],
            [14.72, 74.18],
            [14.68, 74.10],
            [14.80, 74.05]
        ],
        "danger_level": "CRITICAL",
        "description": "Strictly prohibited zone under Indian Navy jurisdiction. Civilian and fishing vessels unauthorized."
    },
    {
        "id": "GEO-MPA-01",
        "name": "St. Mary's & Netrani Island Coral Marine Protected Area",
        "type": "PROTECTED",
        "coordinates": [
            [14.00, 74.28],
            [14.05, 74.36],
            [13.95, 74.40],
            [13.90, 74.32],
            [14.00, 74.28]
        ],
        "danger_level": "HIGH",
        "description": "Ecologically Sensitive Coral Conservation Zone. Trawling and heavy net fishing strictly forbidden."
    },
    {
        "id": "GEO-IMBL-01",
        "name": "International Maritime Boundary Line (IMBL) Buffer Zone",
        "type": "MARITIME_BORDER",
        "coordinates": [
            [9.20, 79.50],
            [10.00, 79.80],
            [10.50, 80.10],
            [10.30, 80.25],
            [9.20, 79.50]
        ],
        "danger_level": "CRITICAL",
        "description": "International Boundary Line warning corridor. High risk of vessel interception or territorial breach."
    }
]

SAMPLE_ALERTS = [
    {
        "id": "ALT-001",
        "type": "LIGHTNING",
        "severity": "MODERATE",
        "title": "⚡ Lightning Hazard Alert",
        "message": "Isolated thunderstorm & lightning predicted off Malpe coast between 14:00 - 22:00 IST tomorrow.",
        "location": "Malpe Offshore (15km)",
        "latitude": 13.0500,
        "longitude": 74.4000,
        "timestamp": "2026-09-28 11:15 IST",
        "source": "IMD Marine Warning"
    },
    {
        "id": "ALT-002",
        "type": "HIGH_WAVE",
        "severity": "CAUTION",
        "title": "🌊 High Swell Wave Advisory",
        "message": "Wave heights expected to rise up to 2.2m during high tide tomorrow morning. Small crafts caution advised.",
        "location": "Mangaluru - Udupi Sector",
        "latitude": 13.2500,
        "longitude": 74.3000,
        "timestamp": "2026-09-28 09:30 IST",
        "source": "INCOIS OSF"
    },
    {
        "id": "ALT-003",
        "type": "PFZ_OPPORTUNITY",
        "severity": "LOW",
        "title": "🐟 High Chlorophyll PFZ Zone Active",
        "message": "PFZ-MNG-01 shows SST 28.6°C and Chlorophyll 3.8 mg/m³, favorable for Pelagic fish aggregation (Mackerel/Sardine).",
        "location": "Mangaluru Deep Water (25km)",
        "latitude": 12.9200,
        "longitude": 74.6500,
        "timestamp": "2026-09-28 06:00 IST",
        "source": "INCOIS PFZ Advisory"
    }
]
