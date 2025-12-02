from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from api.db.database import Base
import enum

class NoteType(str, enum.Enum):
    DOCTOR_NOTE = "doctor_note"
    NURSE_NOTE = "nurse_note"

class NoteStatus(str, enum.Enum):
    DRAFT = "draft"
    FINALIZED = "finalized"
    ARCHIVED = "archived"

class Note(Base):
    __tablename__ = "notes"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    note_type = Column(Enum(NoteType), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    encrypted_content = Column(Text, nullable=True)  # For encrypted storage
    status = Column(Enum(NoteStatus), default=NoteStatus.DRAFT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    patient = relationship("Patient", back_populates="notes")
    author = relationship("User")
    
    # AI-generated fields
    summary = Column(Text, nullable=True)
    risk_level = Column(String, nullable=True)  # Low, Medium, High
    recommendations = Column(Text, nullable=True)
    tags = Column(Text, nullable=True)  # JSON string of tags
