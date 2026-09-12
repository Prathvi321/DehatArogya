from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime
import json


class AnimalRegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, example="Gauri")
    animal_type: str = Field(..., example="Cow")  # Cow, Buffalo, Goat, Sheep
    gender: str = Field(..., example="Female")
    age: float = Field(..., gt=0, example=3.0)
    owner_phone: Optional[str] = Field(None, example="9876543210")
    village: Optional[str] = Field(None, example="Rampur")
    image_url: Optional[str] = Field(None, example="/images/cow1.png")


class GeminiTriageOutput(BaseModel):
    detected_disease: str
    identified_symptoms: List[str]
    risk_level: str  # LOW, MEDIUM, HIGH
    requires_specialist: bool
    diet_and_routine_en: str
    diet_and_routine_hi: str
    supplements_or_remedies: List[str]


class MedicineItem(BaseModel):
    name: str
    dosage: str


class MedicalHistoryItem(BaseModel):
    id: int
    tag_id: str
    reported_issue: str
    detected_disease: str
    risk_level: str
    requires_specialist: bool
    remedy_routine_english: str
    remedy_routine_hindi: str
    recommended_supplements: List[str]
    user_status: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    vet_notes: Optional[str] = None
    
    # Complaint Evidence
    complaint_image_url: Optional[str] = None
    complaint_audio_url: Optional[str] = None
    complaint_audio_transcript: Optional[str] = None

    # Scheduling & Deadlines
    deadline_date: Optional[datetime] = None
    scheduled_date: Optional[datetime] = None
    scheduled_time: Optional[str] = None
    scheduled_notes: Optional[str] = None
    assigned_doctor_name: Optional[str] = None

    # Clinical Treatment
    actual_diagnosis: Optional[str] = None
    treatment_given: Optional[str] = None
    medicines_used: List[Dict[str, Any]] = []
    treatment_image_url: Optional[str] = None
    treated_at: Optional[datetime] = None

    created_at: datetime

    @classmethod
    def from_orm_model(cls, model):
        supplements = []
        if model.recommended_supplements:
            try:
                supplements = json.loads(model.recommended_supplements)
            except Exception:
                supplements = [model.recommended_supplements]

        meds = []
        if getattr(model, "medicines_used", None):
            try:
                meds = json.loads(model.medicines_used)
            except Exception:
                meds = []

        return cls(
            id=model.id,
            tag_id=model.tag_id,
            reported_issue=model.reported_issue,
            detected_disease=model.detected_disease,
            risk_level=model.risk_level,
            requires_specialist=model.requires_specialist,
            remedy_routine_english=model.remedy_routine_english,
            remedy_routine_hindi=model.remedy_routine_hindi,
            recommended_supplements=supplements,
            user_status=model.user_status,
            latitude=getattr(model, "latitude", None),
            longitude=getattr(model, "longitude", None),
            vet_notes=getattr(model, "vet_notes", None),
            complaint_image_url=getattr(model, "complaint_image_url", None),
            complaint_audio_url=getattr(model, "complaint_audio_url", None),
            complaint_audio_transcript=getattr(model, "complaint_audio_transcript", None),
            deadline_date=getattr(model, "deadline_date", None),
            scheduled_date=getattr(model, "scheduled_date", None),
            scheduled_time=getattr(model, "scheduled_time", None),
            scheduled_notes=getattr(model, "scheduled_notes", None),
            assigned_doctor_name=getattr(model, "assigned_doctor_name", None),
            actual_diagnosis=getattr(model, "actual_diagnosis", None),
            treatment_given=getattr(model, "treatment_given", None),
            medicines_used=meds,
            treatment_image_url=getattr(model, "treatment_image_url", None),
            treated_at=getattr(model, "treated_at", None),
            created_at=model.created_at,
        )


class AnimalDetailResponse(BaseModel):
    tag_id: str
    name: str
    animal_type: str
    gender: str
    age: float
    owner_phone: Optional[str]
    village: Optional[str]
    image_url: Optional[str] = None
    qr_code_base64: str
    qr_url: Optional[str] = None
    registered_at: datetime
    medical_history: List[MedicalHistoryItem] = []


class DiagnoseRequest(BaseModel):
    tag_id: str
    symptoms: str = Field(..., min_length=3, example="Cow has high fever, mouth sores, not eating grass")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    complaint_image_url: Optional[str] = None
    complaint_audio_transcript: Optional[str] = None


class DiagnoseResponse(BaseModel):
    history_id: int
    tag_id: str
    animal_name: str
    animal_type: str
    triage: GeminiTriageOutput
    user_status: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    deadline_date: Optional[datetime] = None
    scheduled_date: Optional[datetime] = None
    scheduled_time: Optional[str] = None


class ResolveRequest(BaseModel):
    history_id: int
    status: str = Field(..., example="SATISFIED")  # SATISFIED or ACTION_REQUIRED


class VetScheduleRequest(BaseModel):
    history_id: int
    scheduled_date: str = Field(..., example="2024-09-14")
    scheduled_time: str = Field(..., example="10:00 AM")
    scheduled_notes: Optional[str] = Field(None, example="Arriving by 10 AM with antibiotics")


class VetTreatmentRequest(BaseModel):
    history_id: int
    actual_diagnosis: str = Field(..., example="Lumpy Skin Disease (confirmed)")
    treatment_given: str = Field(..., example="Injected Oxytetracycline 20ml and Meloxicam 10ml.")
    medicines_used: List[Dict[str, str]] = Field(default_factory=list, example=[{"name": "Oxytetracycline", "dosage": "20ml"}])
    treatment_image_url: Optional[str] = Field(None, example="/images/cow_treated.jpg")
    visit_date_time: Optional[str] = Field(None, example="14 Sep 2024, 10:15 AM")


class VetActionRequest(BaseModel):
    history_id: int
    status: str = Field(..., example="TREATED")  # TREATED, IN_TREATMENT, ACTION_REQUIRED, SATISFIED
    vet_notes: Optional[str] = Field(None, example="Administered 10ml Meloxicam and prescribed antiseptic wash.")


class VetIncidentItem(BaseModel):
    id: int
    tag_id: str
    animal_name: str
    animal_type: str
    gender: str
    age: float
    owner_phone: Optional[str]
    village: Optional[str]
    image_url: Optional[str] = None
    reported_issue: str
    detected_disease: str
    risk_level: str
    requires_specialist: bool
    remedy_routine_english: str
    remedy_routine_hindi: str
    recommended_supplements: List[str]
    user_status: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    complaint_image_url: Optional[str] = None
    complaint_audio_url: Optional[str] = None
    complaint_audio_transcript: Optional[str] = None
    deadline_date: Optional[datetime] = None
    scheduled_date: Optional[datetime] = None
    scheduled_time: Optional[str] = None
    scheduled_notes: Optional[str] = None
    actual_diagnosis: Optional[str] = None
    treatment_given: Optional[str] = None
    medicines_used: List[Dict[str, Any]] = []
    treatment_image_url: Optional[str] = None
    treated_at: Optional[datetime] = None
    vet_notes: Optional[str] = None
    created_at: datetime


