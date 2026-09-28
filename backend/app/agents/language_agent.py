import re
from typing import Dict, Any

LANGUAGES = {
    "en": "English",
    "kn": "Kannada (ಕನ್ನಡ)",
    "hi": "Hindi (हिंदी)",
    "te": "Telugu (తెలుగు)",
    "ta": "Tamil (தமிழ்)"
}

class LanguageAgent:
    """Detects query language and translates/formats responses for Indian regional languages."""

    def detect_language(self, text: str) -> str:
        # Kannada unicode block: U+0C80 - U+0CFF
        if re.search(r'[\u0C80-\u0CFF]', text):
            return "kn"
        # Hindi / Devanagari unicode block: U+0900 - U+097F
        elif re.search(r'[\u0900-\u097F]', text):
            return "hi"
        # Telugu unicode block: U+0C00 - U+0C7F
        elif re.search(r'[\u0C00-\u0C7F]', text):
            return "te"
        # Tamil unicode block: U+0B80 - U+0BFF
        elif re.search(r'[\u0B80-\u0BFF]', text):
            return "ta"
        return "en"

    def format_kannada_summary(self, summary_en: str, risk: str, pfz_name: str, dist_km: float) -> str:
        risk_kn = {"LOW": "ಕಡಿಮೆ ಅಪ್ಸಾಯ", "CAUTION": "ಎಚ್ಚರಿಕೆ (CAUTION)", "HIGH": "ಹೆಚ್ಚಿನ ಅಪ್ಸಾಯ", "UNSAFE": "ಅಸುರಕ್ಷಿತ (UNSAFE)"}.get(risk, risk)
        return (
            f"ಒಆರ್‌ಸಿಎ (ORCA) ಸಾಗರ ಮಾಹಿತಿ ವರದಿ:\n\n"
            f"📍 ಹತ್ತಿರದ PFZ (ಮೀನುಗಾರಿಕಾ ವಲಯ): {pfz_name}\n"
            f"📏 ದೂರ: {dist_km} ಕಿ.ಮೀ\n"
            f"🛡️ ನಾಳೆಯ ಸುರಕ್ಷತಾ ಮಟ್ಟ: {risk_kn}\n\n"
            f"ಹವಾಮಾನ: ಗಾಳಿ ವೇಗ 16.5 knots, ಅಲೆಗಳ ಎತ್ತರ 1.8m, ಮಿಂಚಿನ ಎಚ್ಚರಿಕೆ moderat. "
            f"ಹೋಗುವ ಮೊದಲು ಇತ್ತೀಚಿನ ಅಧಿಕೃತ INCOIS ವರದಿಯನ್ನು ಪರಿಶೀಲಿಸಿ."
        )

    def format_hindi_summary(self, summary_en: str, risk: str, pfz_name: str, dist_km: float) -> str:
        risk_hi = {"LOW": "कम जोखिम (LOW)", "CAUTION": "सावधानी (CAUTION)", "HIGH": "उच्च जोखिम (HIGH)", "UNSAFE": "असुरक्षित (UNSAFE)"}.get(risk, risk)
        return (
            f"ओआरसीए (ORCA) समुद्री बुद्धिमत्ता रिपोर्ट:\n\n"
            f"📍 निकटतम PFZ (मत्स्य क्षेत्र): {pfz_name}\n"
            f"📏 दूरी: {dist_km} किमी\n"
            f"🛡️ कल सुबह सुरक्षा स्तर: {risk_hi}\n\n"
            f"मौसम: हवा 16.5 समुद्री मील, तरंगें 1.8m। प्रस्थान से पहले आधिकारिक INCOIS सलाह की जांच करें।"
        )

    def translate_response(self, text: str, lang: str, risk: str = "CAUTION", pfz_name: str = "PFZ-MNG-01", dist_km: float = 24.5) -> str:
        if lang == "kn":
            return self.format_kannada_summary(text, risk, pfz_name, dist_km) + "\n\n--- English Detailed Audit ---\n" + text
        elif lang == "hi":
            return self.format_hindi_summary(text, risk, pfz_name, dist_km) + "\n\n--- English Detailed Audit ---\n" + text
        return text

language_agent = LanguageAgent()
