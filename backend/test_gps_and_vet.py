import os
import sys
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

import requests

BASE_URL = "http://127.0.0.1:8000"

print("=== TESTING GPS PERSISTENCE & VET DASHBOARD ENDPOINTS ===")

# 1. Register a test cow in 'Rampur'
reg_payload = {
    "name": "Nandini",
    "animal_type": "Cow",
    "gender": "Female",
    "age": 2.5,
    "owner_phone": "9812345678",
    "village": "Rampur"
}
res = requests.post(f"{BASE_URL}/api/animals/register", json=reg_payload)
assert res.status_code == 201, f"Failed to register: {res.text}"
animal_data = res.json()
tag_id = animal_data["tag_id"]
print(f"[OK] Registered animal: {animal_data['name']} with Tag: {tag_id} in Village: {animal_data['village']}")

# 2. Submit diagnose request with mobile GPS coordinates (e.g. 28.6139, 77.2090)
diag_payload = {
    "tag_id": tag_id,
    "symptoms": "Cow has swollen udder with clotty milk, painful to touch, mild fever.",
    "latitude": 28.613939,
    "longitude": 77.209021
}
diag_res = requests.post(f"{BASE_URL}/api/animals/diagnose", json=diag_payload)
assert diag_res.status_code == 200, f"Diagnose failed: {diag_res.text}"
diag_data = diag_res.json()
history_id = diag_data["history_id"]
print(f"[OK] Diagnosed condition: {diag_data['triage']['detected_disease']}")
print(f"[OK] Stored GPS: Lat={diag_data['latitude']}, Lng={diag_data['longitude']}")
assert diag_data["latitude"] == 28.613939, "Latitude mismatch"
assert diag_data["longitude"] == 77.209021, "Longitude mismatch"

# 3. Test Vet Areas endpoint
areas_res = requests.get(f"{BASE_URL}/api/vet/areas")
assert areas_res.status_code == 200
areas = areas_res.json()["areas"]
print(f"[OK] Vet areas available: {areas}")
assert "Rampur" in areas, "'Rampur' should be in areas list"

# 4. Test Vet Incidents filtered by 'Rampur'
incidents_res = requests.get(f"{BASE_URL}/api/vet/incidents?village=Rampur")
assert incidents_res.status_code == 200
incidents = incidents_res.json()
print(f"[OK] Found {len(incidents)} cases in Rampur jurisdiction.")
target_case = next((i for i in incidents if i["id"] == history_id), None)
assert target_case is not None, "Newly created case not found in Rampur incidents"
assert target_case["latitude"] == 28.613939, "GPS lat not returned in vet incident"
assert target_case["longitude"] == 77.209021, "GPS lng not returned in vet incident"
print(f"[OK] Verified case #{history_id} in Rampur: {target_case['animal_name']} ({target_case['tag_id']}) with GPS {target_case['latitude']}, {target_case['longitude']}")

# 5. Test Vet Action: Record field visit & clinical notes
action_payload = {
    "history_id": history_id,
    "status": "TREATED",
    "vet_notes": "Dr. Sharma visited farm. Administered intramammary infusion and anti-inflammatory."
}
action_res = requests.post(f"{BASE_URL}/api/vet/action", json=action_payload)
assert action_res.status_code == 200
action_data = action_res.json()
print(f"[OK] Vet updated status to: {action_data['user_status']}")
print(f"[OK] Vet recorded notes: {action_data['vet_notes']}")

print("\n=== ALL GPS AND VET TESTS PASSED SUCCESSFULLY! ===")
