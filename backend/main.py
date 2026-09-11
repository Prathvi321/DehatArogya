import os
import json
import logging
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()

from database import engine, Base, get_db
import models
import schemas
from qr_service import get_lan_ip, generate_tag_id, build_scan_url, generate_qr_base64
from ai_service import perform_ai_triage
from sqlalchemy import text

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("DehatArogya")

# Ensure database tables are created on startup
Base.metadata.create_all(bind=engine)

# Auto-migrate columns for existing SQLite database
def ensure_columns():
    with engine.connect() as conn:
        cursor = conn.execute(text("PRAGMA table_info(medical_history);"))
        existing_cols = [row[1] for row in cursor.fetchall()]
        if "latitude" not in existing_cols:
            conn.execute(text("ALTER TABLE medical_history ADD COLUMN latitude FLOAT;"))
            logger.info("Added 'latitude' column to medical_history table.")
        if "longitude" not in existing_cols:
            conn.execute(text("ALTER TABLE medical_history ADD COLUMN longitude FLOAT;"))
            logger.info("Added 'longitude' column to medical_history table.")
        if "vet_notes" not in existing_cols:
            conn.execute(text("ALTER TABLE medical_history ADD COLUMN vet_notes TEXT;"))
            logger.info("Added 'vet_notes' column to medical_history table.")
        conn.commit()

try:
    ensure_columns()
except Exception as e:
    logger.warning(f"Column migration check note: {e}")

app = FastAPI(
    title="DehatArogya API",
    description="Livestock Health Tracking & AI Triage System for Smart India Hackathon",
    version="1.1.0"
)

# Permissive CORS for hackathon demo over local Wi-Fi LAN
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "app": "DehatArogya",
        "description": "Smart India Hackathon Livestock Health Tracking & AI Triage",
        "lan_ip": get_lan_ip(),
        "status": "online"
    }


@app.get("/api/network-info")
def get_network_info():
    """Returns the current host LAN IP and frontend scan base URL."""
    lan_ip = get_lan_ip()
    frontend_port = os.getenv("FRONTEND_PORT", "5173")
    backend_port = os.getenv("BACKEND_PORT", "8000")
    return {
        "lan_ip": lan_ip,
        "backend_url": f"http://{lan_ip}:{backend_port}",
        "frontend_url": f"http://{lan_ip}:{frontend_port}",
        "scan_base_url": f"http://{lan_ip}:{frontend_port}/scan?tag_id="
    }


@app.post("/api/animals/register", response_model=schemas.AnimalDetailResponse, status_code=status.HTTP_201_CREATED)
def register_animal(payload: schemas.AnimalRegisterRequest, db: Session = Depends(get_db)):
    """
    Registers a new animal, generates a unique tag_id, encodes the scan URL into a QR code,
    and saves the animal to the database.
    """
    # Generate unique tag ID (e.g. TAG-8E4B1F)
    tag_id = generate_tag_id()
    while db.query(models.Animal).filter(models.Animal.tag_id == tag_id).first():
        tag_id = generate_tag_id()

    # Generate QR Code encoding http://<LOCAL_IP>:<FRONTEND_PORT>/scan?tag_id=TAG-XXXXXX
    scan_url = build_scan_url(tag_id)
    qr_base64 = generate_qr_base64(scan_url)

    # Create animal record
    db_animal = models.Animal(
        tag_id=tag_id,
        name=payload.name.strip(),
        animal_type=payload.animal_type.strip(),
        gender=payload.gender.strip(),
        age=payload.age,
        owner_phone=payload.owner_phone.strip() if payload.owner_phone else None,
        village=payload.village.strip() if payload.village else None,
        qr_code_base64=qr_base64,
    )
    db.add(db_animal)
    db.commit()
    db.refresh(db_animal)

    logger.info(f"Registered new animal: {db_animal.name} ({db_animal.animal_type}) with Tag: {tag_id}")

    return schemas.AnimalDetailResponse(
        tag_id=db_animal.tag_id,
        name=db_animal.name,
        animal_type=db_animal.animal_type,
        gender=db_animal.gender,
        age=db_animal.age,
        owner_phone=db_animal.owner_phone,
        village=db_animal.village,
        qr_code_base64=db_animal.qr_code_base64,
        qr_url=scan_url,
        registered_at=db_animal.registered_at,
        medical_history=[]
    )


@app.get("/api/animals/{tag_id}", response_model=schemas.AnimalDetailResponse)
def get_animal_by_tag(tag_id: str, db: Session = Depends(get_db)):
    """
    Fetches animal details and their complete medical history given a tag_id.
    """
    animal = db.query(models.Animal).filter(models.Animal.tag_id == tag_id).first()
    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Animal with Tag ID '{tag_id}' not found."
        )

    scan_url = build_scan_url(tag_id)
    history_items = [schemas.MedicalHistoryItem.from_orm_model(item) for item in animal.medical_history]

    return schemas.AnimalDetailResponse(
        tag_id=animal.tag_id,
        name=animal.name,
        animal_type=animal.animal_type,
        gender=animal.gender,
        age=animal.age,
        owner_phone=animal.owner_phone,
        village=animal.village,
        qr_code_base64=animal.qr_code_base64,
        qr_url=scan_url,
        registered_at=animal.registered_at,
        medical_history=history_items
    )


@app.get("/api/animals", response_model=list[schemas.AnimalDetailResponse])
def list_all_animals(db: Session = Depends(get_db)):
    """List all registered livestock in the database."""
    animals = db.query(models.Animal).order_by(models.Animal.registered_at.desc()).all()
    results = []
    for a in animals:
        results.append(schemas.AnimalDetailResponse(
            tag_id=a.tag_id,
            name=a.name,
            animal_type=a.animal_type,
            gender=a.gender,
            age=a.age,
            owner_phone=a.owner_phone,
            village=a.village,
            qr_code_base64=a.qr_code_base64,
            qr_url=build_scan_url(a.tag_id),
            registered_at=a.registered_at,
            medical_history=[schemas.MedicalHistoryItem.from_orm_model(item) for item in a.medical_history]
        ))
    return results


@app.post("/api/animals/diagnose", response_model=schemas.DiagnoseResponse)
def diagnose_animal(payload: schemas.DiagnoseRequest, db: Session = Depends(get_db)):
    """
    Processes symptom text with Gemini 2.5 Flash structured AI triage,
    saves the incident to medical_history, and returns structured guidance.
    """
    animal = db.query(models.Animal).filter(models.Animal.tag_id == payload.tag_id).first()
    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Animal with Tag ID '{payload.tag_id}' not found."
        )

    animal_dict = {
        "name": animal.name,
        "animal_type": animal.animal_type,
        "gender": animal.gender,
        "age": animal.age,
        "village": animal.village,
    }

    # Run Gemini AI Triage
    triage_result = perform_ai_triage(animal_dict, payload.symptoms)

    # Save to medical_history with mobile GPS coordinates if provided
    history_record = models.MedicalHistory(
        tag_id=animal.tag_id,
        reported_issue=payload.symptoms.strip(),
        detected_disease=triage_result["detected_disease"],
        risk_level=triage_result["risk_level"],
        requires_specialist=triage_result["requires_specialist"],
        remedy_routine_english=triage_result["diet_and_routine_en"],
        remedy_routine_hindi=triage_result["diet_and_routine_hi"],
        recommended_supplements=json.dumps(triage_result["supplements_or_remedies"]),
        user_status="PENDING",
        latitude=payload.latitude,
        longitude=payload.longitude,
    )
    db.add(history_record)
    db.commit()
    db.refresh(history_record)

    logger.info(f"Diagnosed incident #{history_record.id} for {animal.name} ({animal.tag_id}): {triage_result['detected_disease']} [GPS: {payload.latitude}, {payload.longitude}]")

    return schemas.DiagnoseResponse(
        history_id=history_record.id,
        tag_id=animal.tag_id,
        animal_name=animal.name,
        animal_type=animal.animal_type,
        triage=schemas.GeminiTriageOutput(**triage_result),
        user_status=history_record.user_status,
        latitude=history_record.latitude,
        longitude=history_record.longitude
    )


@app.post("/api/animals/resolve")
def resolve_incident(payload: schemas.ResolveRequest, db: Session = Depends(get_db)):
    """
    Updates the status of a medical incident (e.g. SATISFIED or ACTION_REQUIRED).
    """
    valid_statuses = ["PENDING", "SATISFIED", "ACTION_REQUIRED", "IN_TREATMENT", "TREATED"]
    if payload.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{payload.status}'. Must be one of {valid_statuses}."
        )

    incident = db.query(models.MedicalHistory).filter(models.MedicalHistory.id == payload.history_id).first()
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Medical history incident with ID {payload.history_id} not found."
        )

    incident.user_status = payload.status
    db.commit()
    db.refresh(incident)

    logger.info(f"Incident #{incident.id} status updated to {incident.user_status}")

    return {
        "success": True,
        "history_id": incident.id,
        "tag_id": incident.tag_id,
        "user_status": incident.user_status
    }


# ==========================================
# VETERINARY DOCTOR PORTAL ENDPOINTS
# ==========================================

@app.get("/api/vet/areas")
def get_vet_posting_areas(db: Session = Depends(get_db)):
    """
    Returns list of distinct villages/areas from registered animals
    where a vet doctor can be posted.
    """
    villages = db.query(models.Animal.village).filter(models.Animal.village.isnot(None)).distinct().all()
    areas = sorted(list({v[0].strip() for v in villages if v[0] and v[0].strip()}))
    # Ensure some standard default areas exist for demonstration if database is new
    for default_area in ["Rampur", "Gokul", "Shivpuri", "Sundarpur"]:
        if default_area not in areas:
            areas.append(default_area)
    return {"areas": sorted(areas)}


@app.get("/api/vet/incidents", response_model=list[schemas.VetIncidentItem])
def get_vet_incidents(
    village: str = None,
    risk_level: str = None,
    status: str = None,
    specialist_only: bool = False,
    db: Session = Depends(get_db)
):
    """
    Returns livestock medical cases filtered by the vet's assigned jurisdiction/area.
    """
    query = db.query(models.MedicalHistory, models.Animal).join(
        models.Animal, models.MedicalHistory.tag_id == models.Animal.tag_id
    )

    if village and village.upper() != "ALL":
        query = query.filter(models.Animal.village.ilike(f"%{village.strip()}%"))

    if risk_level and risk_level.upper() != "ALL":
        query = query.filter(models.MedicalHistory.risk_level == risk_level.upper())

    if status and status.upper() != "ALL":
        query = query.filter(models.MedicalHistory.user_status == status.upper())

    if specialist_only:
        query = query.filter(models.MedicalHistory.requires_specialist == True)

    results = query.order_by(models.MedicalHistory.created_at.desc()).all()

    incidents_list = []
    for mh, animal in results:
        supplements = []
        if mh.recommended_supplements:
            try:
                supplements = json.loads(mh.recommended_supplements)
            except Exception:
                supplements = [mh.recommended_supplements]

        incidents_list.append(schemas.VetIncidentItem(
            id=mh.id,
            tag_id=animal.tag_id,
            animal_name=animal.name,
            animal_type=animal.animal_type,
            gender=animal.gender,
            age=animal.age,
            owner_phone=animal.owner_phone,
            village=animal.village,
            reported_issue=mh.reported_issue,
            detected_disease=mh.detected_disease,
            risk_level=mh.risk_level,
            requires_specialist=mh.requires_specialist,
            remedy_routine_english=mh.remedy_routine_english,
            remedy_routine_hindi=mh.remedy_routine_hindi,
            recommended_supplements=supplements,
            user_status=mh.user_status,
            latitude=mh.latitude,
            longitude=mh.longitude,
            vet_notes=mh.vet_notes,
            created_at=mh.created_at
        ))

    return incidents_list


@app.post("/api/vet/action")
def record_vet_action(payload: schemas.VetActionRequest, db: Session = Depends(get_db)):
    """
    Allows a veterinary doctor to record clinical notes and update the treatment status
    (e.g., IN_TREATMENT, TREATED, SATISFIED, ACTION_REQUIRED).
    """
    incident = db.query(models.MedicalHistory).filter(models.MedicalHistory.id == payload.history_id).first()
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Medical history incident with ID {payload.history_id} not found."
        )

    incident.user_status = payload.status
    if payload.vet_notes is not None:
        incident.vet_notes = payload.vet_notes.strip()

    db.commit()
    db.refresh(incident)

    logger.info(f"Vet updated incident #{incident.id} to {incident.user_status}. Notes: {incident.vet_notes}")

    return {
        "success": True,
        "history_id": incident.id,
        "tag_id": incident.tag_id,
        "user_status": incident.user_status,
        "vet_notes": incident.vet_notes
    }

