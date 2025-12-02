from sqlalchemy import Column, Integer, String, DateTime, Date, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from api.db.database import Base

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, unique=True, index=True, nullable=False)  # External patient ID
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    medical_record_number = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Additional patient info
    emergency_contact = Column(Text, nullable=True)
    allergies = Column(Text, nullable=True)
    medical_history = Column(Text, nullable=True)
    
    # Relationships
    notes = relationship("Note", back_populates="patient")
