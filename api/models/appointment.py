from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from api.db.database import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    patient_name = Column(String(255), nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)
    appointment_type = Column(String(50), nullable=False)
    status = Column(String(50), default="confirmed")
    location = Column(String(255), nullable=False)
    notes = Column(Text, nullable=True)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    patient = relationship("Patient", backref="appointments")
    creator = relationship("User")
