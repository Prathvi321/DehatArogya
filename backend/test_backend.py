import os
import sys
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# Test imports
from database import engine, Base, SessionLocal
import models
import schemas
from qr_service import get_lan_ip, generate_tag_id, build_scan_url, generate_qr_base64
from ai_service import perform_ai_triage

print(f"=== DEHAT AROGYA BACKEND SELF-TEST ===")
print(f"Detected LAN IP: {get_lan_ip()}")

# 1. Test database schema creation
Base.metadata.create_all(bind=engine)
print("[OK] Database tables created successfully.")

# 2. Test QR code generation
tag_id = generate_tag_id()
scan_url = build_scan_url(tag_id)
qr_b64 = generate_qr_base64(scan_url)
assert qr_b64.startswith("data:image/png;base64,"), "Invalid QR base64 format"
print(f"[OK] Generated Tag ID: {tag_id}")
print(f"[OK] Scan URL: {scan_url}")
print(f"[OK] QR Data URI size: {len(qr_b64)} chars")

# 3. Test Animal registration in DB
db = SessionLocal()
test_animal = models.Animal(
    tag_id=tag_id,
    name="Gauri",
    animal_type="Cow",
    gender="Female",
    age=3.0,
    owner_phone="9876543210",
    village="Rampur",
    qr_code_base64=qr_b64
)
db.add(test_animal)
db.commit()
db.refresh(test_animal)
print(f"[OK] Saved animal '{test_animal.name}' to database with tag '{test_animal.tag_id}'")

# 4. Test AI Triage (Gemini 2.5 Flash)
animal_dict = {
    "name": test_animal.name,
    "animal_type": test_animal.animal_type,
    "gender": test_animal.gender,
    "age": test_animal.age,
    "village": test_animal.village
}
test_symptoms = "Cow has severe fever for 2 days, blisters inside mouth, drooling foam, and has stopped eating grass."
print(f"\nSending test symptoms to Gemini AI Triage...")
triage = perform_ai_triage(animal_dict, test_symptoms)

print(f"[OK] AI Detected Disease: {triage.get('detected_disease')}")
print(f"[OK] Risk Level: {triage.get('risk_level')}")
print(f"[OK] Requires Specialist: {triage.get('requires_specialist')}")
print(f"[OK] English Routine: {triage.get('diet_and_routine_en')[:100]}...")
print(f"[OK] Supplements: {triage.get('supplements_or_remedies')}")

# 5. Save medical history incident
import json
incident = models.MedicalHistory(
    tag_id=test_animal.tag_id,
    reported_issue=test_symptoms,
    detected_disease=triage["detected_disease"],
    risk_level=triage["risk_level"],
    requires_specialist=triage["requires_specialist"],
    remedy_routine_english=triage["diet_and_routine_en"],
    remedy_routine_hindi=triage["diet_and_routine_hi"],
    recommended_supplements=json.dumps(triage["supplements_or_remedies"]),
    user_status="PENDING"
)
db.add(incident)
db.commit()
db.refresh(incident)
print(f"[OK] Incident #{incident.id} saved with status: {incident.user_status}")

# 6. Test resolution update
incident.user_status = "SATISFIED"
db.commit()
print(f"[OK] Incident #{incident.id} updated to: {incident.user_status}")

db.close()
print(f"\n=== ALL BACKEND TESTS PASSED SUCCESSFULLY! ===")

