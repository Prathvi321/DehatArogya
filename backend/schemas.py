from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import json


class AnimalRegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, example="Gauri")
    animal_type: str = Field(..., example="Cow")  # Cow, Buffalo, Goat, Sheep
    gender: str = Field(..., example="Female")
    age: float = Field(..., gt=0, example=3.0)
    owner_phone: Optional[str] = Field(None, example="9876543210")
    village: Optional[str] = Field(None, example="Rampur")


class GeminiTriageOutput(BaseModel):
    detected_disease: str
    identified_symptoms: List[str]
    risk_level: str  # LOW, MEDIUM, HIGH
    requires_specialist: bool
    diet_and_routine_en: str
    diet_and_routine_hi: str
    supplements_or_remedies: List[str]


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
    created_at: datetime

    @classmethod
    def from_orm_model(cls, model):
        supplements = []
        if model.recommended_supplements:
            try:
                supplements = json.loads(model.recommended_supplements)
            except Exception:
                supplements = [model.recommended_supplements]
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
    qr_code_base64: str
    qr_url: Optional[str] = None
    registered_at: datetime
    medical_history: List[MedicalHistoryItem] = []


class DiagnoseRequest(BaseModel):
    tag_id: str
    symptoms: str = Field(..., min_length=3, example="Cow has high fever, mouth sores, not eating grass")
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class DiagnoseResponse(BaseModel):
    history_id: int
    tag_id: str
    animal_name: str
    animal_type: str
    triage: GeminiTriageOutput
    user_status: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class ResolveRequest(BaseModel):
    history_id: int
    status: str = Field(..., example="SATISFIED")  # SATISFIED or ACTION_REQUIRED


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
    created_at: datetime

