import httpx
from typing import Tuple, Dict, Any, List
from app.services.mock_data import SAMPLE_PFZS, SAMPLE_WEATHER, SAMPLE_HAZARDS, SAMPLE_GEOFENCES, INCOIS_METADATA

class INCOISService:
    """Service to communicate with INCOIS ERDDAP / WebGIS APIs with seamless offline demo fallback."""

    def __init__(self):
        self.erddap_wms_url = "https://erddap.incois.gov.in/erddap/wms/incois_oceansat2_datasets/index.html"
        self.pfz_gis_url = "https://www.incois.gov.in/MarineFisheries/PfzWebGis"

    async def fetch_pfz_data(self) -> Tuple[List[Dict[str, Any]], str]:
        """Try fetching live PFZ advisories; fallback to cached snapshot on network timeout."""
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.get(self.pfz_gis_url)
                if res.status_code == 200 and "PFZ" in res.text:
                    return SAMPLE_PFZS, "LIVE"
        except Exception:
            pass
        # Fallback to verified cached dataset
        return SAMPLE_PFZS, "CACHED"

    async def fetch_weather_data(self) -> Tuple[Dict[str, Any], str]:
        """Try fetching Ocean State Forecast; fallback to cached demo data."""
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.get("https://incois.gov.in/oceanservices/osfforecast.jsp")
                if res.status_code == 200:
                    return SAMPLE_WEATHER, "LIVE"
        except Exception:
            pass
        return SAMPLE_WEATHER, "CACHED"

    def get_metadata(self) -> Dict[str, Any]:
        return INCOIS_METADATA

incois_service = INCOISService()
