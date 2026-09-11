import os
import json
import logging
from typing import Dict, Any, List
from dotenv import load_dotenv

# Load .env from backend directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

logger = logging.getLogger(__name__)

# Structured Prompt Template for Livestock AI Triage
SYSTEM_PROMPT = """You are DehatArogya AI, an expert veterinary triage assistant specialized in Indian rural livestock (Cows, Buffaloes, Goats, Sheep).
Your job is to analyze reported symptoms alongside the animal's profile, identify the likely disease or health condition, evaluate risk urgency, and provide clear, actionable care guidance in both English and Hindi.

Return ONLY a valid JSON object matching this schema:
{
  "detected_disease": "Name of the condition/disease (e.g. Foot and Mouth Disease, Mastitis, Bloat, Bovine Ephemeral Fever)",
  "identified_symptoms": ["symptom 1", "symptom 2", ...],
  "risk_level": "LOW" or "MEDIUM" or "HIGH",
  "requires_specialist": true or false,
  "diet_and_routine_en": "Clear English guidance for daily diet, hydration, hygiene, and monitoring routines.",
  "diet_and_routine_hi": "सरल और व्यावहारिक हिंदी में दैनिक आहार, पानी, स्वच्छता और देखभाल के निर्देश।",
  "supplements_or_remedies": ["Remedy 1 (e.g., Potassium permanganate wash)", "Remedy 2 (e.g., Turmeric + mustard oil paste)", "Supplement (e.g., Electrolyte solution / Gur-water)"]
}

Guidelines:
- If symptoms indicate contagious, rapidly deteriorating, or life-threatening diseases (e.g. Anthrax, Blackleg, Hemorrhagic Septicemia, severe FMD, acute Bloat, high fever with breathing distress), set risk_level="HIGH" and requires_specialist=true.
- If moderate illness (e.g. early mastitis, mild diarrhea, localized tick infestation, mild fever), set risk_level="MEDIUM".
- If minor issues (e.g. mild indigestion, small scratch, seasonal coat change), set risk_level="LOW" and requires_specialist=false.
- Always provide rural-friendly remedies commonly available in Indian villages (turmeric, mustard oil, neem leaves, electrolytes, jaggery water, alum wash) in supplements_or_remedies alongside standard veterinary advice.
- Both English and Hindi advice must be compassionate, clear, and easy for a farmer to understand.
"""


def perform_ai_triage(animal_info: Dict[str, Any], symptoms: str) -> Dict[str, Any]:
    """
    Calls Google Gemini API (model: gemini-2.5-flash) using structured output.
    Falls back gracefully to veterinary rule-based triage if the API cannot be reached.
    """
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

    user_content = f"""Animal Profile:
- Name: {animal_info.get('name')}
- Species: {animal_info.get('animal_type')}
- Gender: {animal_info.get('gender')}
- Age: {animal_info.get('age')} years
- Village/Location: {animal_info.get('village', 'Rural')}

Reported Symptoms & Observations:
"{symptoms}"

Please perform a veterinary triage and return the required JSON response.
"""

    if api_key and not api_key.startswith("your_"):
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=api_key)

            # Response schema definition for structured output
            response_schema = {
                "type": "OBJECT",
                "properties": {
                    "detected_disease": {"type": "STRING"},
                    "identified_symptoms": {
                        "type": "ARRAY",
                        "items": {"type": "STRING"}
                    },
                    "risk_level": {
                        "type": "STRING",
                        "enum": ["LOW", "MEDIUM", "HIGH"]
                    },
                    "requires_specialist": {"type": "BOOLEAN"},
                    "diet_and_routine_en": {"type": "STRING"},
                    "diet_and_routine_hi": {"type": "STRING"},
                    "supplements_or_remedies": {
                        "type": "ARRAY",
                        "items": {"type": "STRING"}
                    }
                },
                "required": [
                    "detected_disease",
                    "identified_symptoms",
                    "risk_level",
                    "requires_specialist",
                    "diet_and_routine_en",
                    "diet_and_routine_hi",
                    "supplements_or_remedies"
                ]
            }

            # Model fallback sequence: latest suggested model first
            candidate_models = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-1.5-flash"]
            response = None
            last_err = None

            for m in candidate_models:
                try:
                    response = client.models.generate_content(
                        model=m,
                        contents=[
                            types.Content(
                                role="user",
                                parts=[types.Part.from_text(text=f"{SYSTEM_PROMPT}\n\n{user_content}")]
                            )
                        ],
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            response_schema=response_schema,
                            temperature=0.2,
                        )
                    )
                    if response and response.text:
                        break
                except Exception as ex:
                    last_err = ex
                    continue

            if not response or not response.text:
                if last_err:
                    raise last_err

            if response and response.text:
                parsed = json.loads(response.text)
                # Normalize risk_level uppercase
                parsed["risk_level"] = parsed.get("risk_level", "MEDIUM").upper()
                return parsed

        except Exception as e:
            logger.warning(f"Gemini API call failed ({e}), falling back to intelligent rule-based triage.")

    # Intelligent Fallback Engine for demo resilience
    return fallback_triage(animal_info, symptoms)


def fallback_triage(animal_info: Dict[str, Any], symptoms: str) -> Dict[str, Any]:
    """
    Veterinary decision matrix fallback for offline demonstration and resilience.
    """
    sym_lower = symptoms.lower()
    animal_type = animal_info.get("animal_type", "Livestock")

    # Critical / High-risk indicators
    if any(w in sym_lower for w in ["blister", "drool", "mouth", "foot", "fmd", "खुरपका", "मुंहपका", "larva", "convulsion"]):
        return {
            "detected_disease": "Suspected Foot & Mouth Disease (FMD) / Vesicular Stomatitis",
            "identified_symptoms": ["Mouth ulcerations / blisters", "Excessive salivation", "Lameness", "Reduced feeding"],
            "risk_level": "HIGH",
            "requires_specialist": True,
            "diet_and_routine_en": "Isolate the animal immediately to prevent contagious spread. Provide soft green fodder, lukewarm rice water gruel, and clean cool drinking water. Wash mouth lesions with 1% potassium permanganate or alum solution.",
            "diet_and_routine_hi": "पशु को तुरंत अन्य जानवरों से अलग (क्वारंटीन) करें। खाने के लिए मुलायम हरा चारा और दलिया दें। मुंह के छालों को पोटाश (1% पोटेशियम परमैंगनेट) या फिटकरी के पानी से धोएं। तुरंत पशु चिकित्सक से संपर्क करें।",
            "supplements_or_remedies": [
                "1% Alum or Potassium Permanganate mouth wash",
                "Turmeric and coconut/mustard oil paste on lesions",
                "Oral electrolyte solution with Jaggery (Gur)",
                "Immediate Veterinary Attendant Call"
            ]
        }
    elif any(w in sym_lower for w in ["udder", "milk", "swollen teat", "mastitis", "थन", "दूध में खून"]):
        return {
            "detected_disease": "Suspected Clinical Mastitis (Udder Inflammation)",
            "identified_symptoms": ["Swollen hot udder/teats", "Abnormal milk clotting", "Pain during milking", "Fever"],
            "risk_level": "HIGH",
            "requires_specialist": True,
            "diet_and_routine_en": "Completely strip milk from affected quarter every 2 hours and discard safely. Do not let calf suckle affected teat. Apply cold compress if acutely swollen. Ensure dry, clean bedding.",
            "diet_and_routine_hi": "संक्रमित थन से हर 2 घंटे में पूरा दूध बाहर निकालकर नष्ट करें। बछड़े को इस थन से दूध न पीने दें। सूजन कम करने के लिए बर्फ या ठंडे पानी की सिकाई करें। बाड़े में सूखापन और सफाई रखें।",
            "supplements_or_remedies": [
                "Trisodium Citrate solution (oral supplement)",
                "Neem leaf extract wash for teats after milking",
                "Intramammary antibiotic infusion by Veterinarian"
            ]
        }
    elif any(w in sym_lower for w in ["bloat", "stomach", "gas", "swollen left flank", "अफरा", "पेट फूलना"]):
        return {
            "detected_disease": "Acute Rumen Tympany (Bloat / Indigestion)",
            "identified_symptoms": ["Distension of left flank", "Discomfort and restlessness", "Labored breathing"],
            "risk_level": "HIGH",
            "requires_specialist": True,
            "diet_and_routine_en": "Withhold all concentrates and green legumes. Gently walk the animal. Keep head elevated. Administer antifoaming agent or vegetable oil immediately.",
            "diet_and_routine_hi": "हरा चारा और दाना तुरंत रोकें। पशु को धीरे-धीरे टहलाएं ताकि गैस निकल सके। 200 मिलीलीटर सरसों का तेल और 20 ग्राम हींग मिलाकर पिलाएं। यदि सांस लेने में दिक्कत हो तो तुरंत डॉक्टर बुलाएं।",
            "supplements_or_remedies": [
                "Mustard Oil (150-200ml) mixed with Hing (Asafoetida)",
                "Bloatosil or Simethicone suspension",
                "Ginger and Black Salt digestive concoction"
            ]
        }
    elif any(w in sym_lower for w in ["diarrhea", "loose", "dung", "दस्त", "पतला गोबर"]):
        return {
            "detected_disease": "Acute Bovine Enteritis / Parasitic Diarrhea",
            "identified_symptoms": ["Watery foul dung", "Mild dehydration", "Dullness", "Reduced appetite"],
            "risk_level": "MEDIUM",
            "requires_specialist": False,
            "diet_and_routine_en": "Offer continuous oral rehydration solution (water + salt + jaggery/glucose). Feed dry straw and rice water gruel. Avoid lush legumes.",
            "diet_and_routine_hi": "पशु को निर्जलीकरण (Dehydration) से बचाने के लिए पानी में नमक और गुड़ मिलाकर बार-बार पिलाएं। सूखा भूसा और चावल की कांजी दें। 24 घंटे में सुधार न होने पर पशु चिकित्सक को दिखाएं।",
            "supplements_or_remedies": [
                "Oral Electrolyte Powder (ORS) with Jaggery",
                "Kutaja bark decoction or Bel fruit powder",
                "Probiotic bolus (Bifidobacterium / Yeast)"
            ]
        }
    elif any(w in sym_lower for w in ["fever", "shivering", "warm ears", "बुखार"]):
        return {
            "detected_disease": "Bovine Febrile Episode (Infectious / Ephemeral Fever)",
            "identified_symptoms": ["Elevated body temperature", "Shivering", "Loss of appetite", "Nasal dryness"],
            "risk_level": "MEDIUM",
            "requires_specialist": False,
            "diet_and_routine_en": "Keep animal in a shaded, well-ventilated stall. Sponge forehead with cool water. Provide warm mash of cracked wheat and jaggery.",
            "diet_and_routine_hi": "पशु को छायादार और हवादार स्थान पर रखें। माथे पर ठंडे पानी की पट्टी रखें। दलिया और गुड़ का गुनगुना काढ़ा दें। यदि 24 घंटे में बुखार न उतरे तो एंटीबायोटिक के लिए डॉक्टर बुलाएं।",
            "supplements_or_remedies": [
                "Giloy (Tinospora cordifolia) decoction",
                "Paracetamol veterinary bolus (Meloxicam + Paracetamol)",
                "Warm Jaggery-Ajwain concoction"
            ]
        }
    else:
        return {
            "detected_disease": f"Subclinical Malaise & Nutritional Stress in {animal_type}",
            "identified_symptoms": ["Lethargy / Dull demeanor", "Sub-optimal feed intake"],
            "risk_level": "LOW",
            "requires_specialist": False,
            "diet_and_routine_en": "Inspect feed quality for mold or dirt. Ensure 24/7 access to fresh drinking water. Supplement daily ration with balanced mineral mixture and fresh green fodder.",
            "diet_and_routine_hi": "चारे और पानी की स्वच्छता जांचें। दैनिक आहार में 50 ग्राम खनिज मिश्रण (Mineral Mixture) और ताज़ा हरा चारा शामिल करें। आराम की स्थिति पर नजर रखें।",
            "supplements_or_remedies": [
                "Commercial Mineral Mixture (50g daily)",
                "Liver tonic syrup (50ml daily for 5 days)",
                "Himalayan Pink Salt lick block in stall"
            ]
        }
