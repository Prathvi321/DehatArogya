import sys
import os
from datetime import datetime, timedelta

# Add backend directory to path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from main import app, ensure_columns
import sqlite3

client = TestClient(app)

print("1. Testing SQLite Auto-Migration...")
ensure_columns()
con = sqlite3.connect(os.path.join(backend_dir, 'dehat_arogya.db'))
cur = con.cursor()
animal_cols = [r[1] for r in cur.execute('PRAGMA table_info(animals);').fetchall()]
mh_cols = [r[1] for r in cur.execute('PRAGMA table_info(medical_history);').fetchall()]
con.close()

assert 'image_url' in animal_cols, "image_url missing from animals table"
assert 'deadline_date' in mh_cols, "deadline_date missing from medical_history table"
assert 'actual_diagnosis' in mh_cols, "actual_diagnosis missing from medical_history table"
assert 'medicines_used' in mh_cols, "medicines_used missing from medical_history table"
print(" SQLite columns verified successfully!")

print("\n2. Testing Animal Registration with Photo...")
reg_payload = {
    "name": "Kamdhenu",
    "animal_type": "Cow",
    "gender": "Female",
    "age": 4.0,
    "owner_phone": "9876543210",
    "village": "Rampur",
    "image_url": "/images/cow1.png"
}
res = client.post("/api/animals/register", json=reg_payload)
assert res.status_code == 201, f"Reg failed: {res.text}"
animal_data = res.json()
tag_id = animal_data["tag_id"]
print(f" Registered animal with Tag: {tag_id}, image: {animal_data.get('image_url')}")

print("\n3. Testing Public AI Triage with High-Risk Symptoms...")
diag_payload = {
    "tag_id": tag_id,
    "symptoms": "Cow has severe high fever, bleeding blisters in mouth and hooves, completely stopped eating, rapid shallow breathing",
    "latitude": 23.2031,
    "longitude": 77.0844,
    "complaint_image_url": "/images/cow1.png",
    "complaint_audio_transcript": "Gaye ko 2 din se tez bukhar hai aur chal nahi pa rahi."
}
res_diag = client.post("/api/animals/diagnose", json=diag_payload)
assert res_diag.status_code == 200, f"Diag failed: {res_diag.text}"
diag_data = res_diag.json()
history_id = diag_data["history_id"]
risk_level = diag_data["triage"]["risk_level"]
deadline = diag_data["deadline_date"]
sched_date = diag_data["scheduled_date"]
print(f" Diagnosed incident #{history_id}: Risk={risk_level}")
print(f" Deadline Date: {deadline}")
print(f" Auto-Assigned Visit Date: {sched_date} {diag_data.get('scheduled_time')}")

if risk_level == "HIGH":
    parsed_deadline = datetime.fromisoformat(deadline.replace("Z", "+00:00"))
    now = datetime.utcnow()
    assert (parsed_deadline.date() - now.date()).days <= 2, "High risk deadline must be <= 2 days"
    print(" Verified High Risk Strict 2-day deadline!")

print("\n4. Testing Doctor Appointment Rescheduling...")
# Try to schedule BEYOND deadline (e.g. + 10 days) -> MUST FAIL with 400
bad_date = (datetime.utcnow() + timedelta(days=10)).strftime("%Y-%m-%d")
bad_res = client.post("/api/vet/schedule", json={
    "history_id": history_id,
    "scheduled_date": bad_date,
    "scheduled_time": "11:00 AM",
    "scheduled_notes": "Attempting late reschedule"
})
assert bad_res.status_code == 400, f"Expected 400 rejection for exceeding deadline, got: {bad_res.status_code} {bad_res.text}"
print(f" Correctly rejected exceeding deadline: {bad_res.json()['detail']}")

# Valid reschedule within deadline
valid_date = (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%d")
good_res = client.post("/api/vet/schedule", json={
    "history_id": history_id,
    "scheduled_date": valid_date,
    "scheduled_time": "10:00 AM",
    "scheduled_notes": "Confirmed visit within deadline"
})
assert good_res.status_code == 200, f"Valid reschedule failed: {good_res.text}"
print(f" Successfully rescheduled within strict deadline to {valid_date}")

print("\n5. Testing Doctor Treatment Recording...")
treat_payload = {
    "history_id": history_id,
    "actual_diagnosis": "Severe Foot and Mouth Disease (FMD) with secondary bacterial infection",
    "treatment_given": "Administered intramuscular Oxytetracycline 20ml and Meloxicam 10ml. Applied copper sulfate antiseptic hoof wash.",
    "medicines_used": [
        {"name": "Oxytetracycline Injection", "dosage": "20 ml"},
        {"name": "Meloxicam Injection", "dosage": "10 ml"},
        {"name": "Copper Sulfate Solution", "dosage": "Topical 5%"}
    ],
    "treatment_image_url": "/images/cow_treated.jpg",
    "visit_date_time": "14 Sep 2024, 10:15 AM"
}
treat_res = client.post("/api/vet/treatment", json=treat_payload)
assert treat_res.status_code == 200, f"Treatment recording failed: {treat_res.text}"
treat_data = treat_res.json()
assert treat_data["user_status"] == "TREATED", "Incident should be TREATED"
print(f" Treatment recorded! Actual Diagnosis: {treat_data['actual_diagnosis']}")

print("\n6. Testing Animal Medical History Persistence...")
hist_res = client.get(f"/api/animals/{tag_id}")
assert hist_res.status_code == 200
hist_data = hist_res.json()
assert len(hist_data["medical_history"]) >= 1
latest_hist = hist_data["medical_history"][0]
assert latest_hist["actual_diagnosis"] == treat_payload["actual_diagnosis"]
assert len(latest_hist["medicines_used"]) == 3
print(f" Lifetime medical history verified for {hist_data['name']} ({tag_id})!")
print(" All backend workflows, scheduling engine, and database models verified 100%!")
