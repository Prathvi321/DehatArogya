from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Animal(Base):
    __tablename__ = "animals"

    tag_id = Column(String(32), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    animal_type = Column(String(50), nullable=False)  # Cow, Buffalo, Goat, Sheep
    gender = Column(String(20), nullable=False)        # Female, Male
    age = Column(Float, nullable=False)                # in years (e.g. 3.5)
    owner_phone = Column(String(20), nullable=True)
    village = Column(String(100), nullable=True)
    image_url = Column(Text, nullable=True)            # Optional animal portrait photo
    qr_code_base64 = Column(Text, nullable=False)
    registered_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to medical incidents
    medical_history = relationship(
        "MedicalHistory",
        back_populates="animal",
        cascade="all, delete-orphan",
        order_by="desc(MedicalHistory.created_at)"
    )


class MedicalHistory(Base):
    __tablename__ = "medical_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tag_id = Column(String(32), ForeignKey("animals.tag_id", ondelete="CASCADE"), nullable=False, index=True)
    reported_issue = Column(Text, nullable=False)
    detected_disease = Column(String(200), nullable=False)
    risk_level = Column(String(20), nullable=False)  # LOW, MEDIUM, HIGH
    requires_specialist = Column(Boolean, default=False)
    remedy_routine_english = Column(Text, nullable=False)
    remedy_routine_hindi = Column(Text, nullable=False)
    recommended_supplements = Column(Text, nullable=False)  # JSON-encoded array of strings
    user_status = Column(String(30), default="PENDING")     # PENDING, SATISFIED, ACTION_REQUIRED, IN_TREATMENT, TREATED
    latitude = Column(Float, nullable=True)                 # Mobile GPS Latitude when issue was registered
    longitude = Column(Float, nullable=True)                # Mobile GPS Longitude when issue was registered
    
    # Complaint Evidence
    complaint_image_url = Column(Text, nullable=True)        # Farmer's condition photo of the animal
    complaint_audio_url = Column(Text, nullable=True)        # Audio note recording URL / base64
    complaint_audio_transcript = Column(Text, nullable=True) # Speech-to-text transcript

    # Scheduling Engine & Strict Deadlines
    # High risk = 2 days, Medium risk = 5 days, Low risk = 7 days
    deadline_date = Column(DateTime, nullable=True)
    scheduled_date = Column(DateTime, nullable=True)
    scheduled_time = Column(String(30), nullable=True)       # e.g. "10:00 AM"
    scheduled_notes = Column(Text, nullable=True)
    assigned_doctor_name = Column(String(100), nullable=True)

    # Clinical Treatment Details (Saved by Doctor)
    actual_diagnosis = Column(String(200), nullable=True)    # Confirmed disease/problem
    treatment_given = Column(Text, nullable=True)            # Clinical procedure and interventions
    medicines_used = Column(Text, nullable=True)             # JSON array: [{"name": ..., "dosage": ...}]
    treatment_image_url = Column(Text, nullable=True)        # Post-treatment animal photo uploaded by doctor
    treated_at = Column(DateTime, nullable=True)             # Timestamp when treated
    vet_notes = Column(Text, nullable=True)                 # Notes/prescriptions added by vet
    created_at = Column(DateTime, default=datetime.utcnow)

    animal = relationship("Animal", back_populates="medical_history")
