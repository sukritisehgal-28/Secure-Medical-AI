from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class AppointmentBase(BaseModel):
    title: str = Field(..., example="Cardiology Consult")
    patient_name: str = Field(..., example="John Smith")
    patient_id: Optional[int] = Field(None, description="Link to patient record if known")
    appointment_type: str = Field(..., example="Consultation")
    status: str = Field("confirmed", example="confirmed")
    location: str = Field(..., example="Clinic 4A")
    start_time: datetime
    end_time: datetime
    notes: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentUpdate(BaseModel):
    title: Optional[str] = None
    patient_name: Optional[str] = None
    patient_id: Optional[int] = None
    appointment_type: Optional[str] = None
    status: Optional[str] = None
    location: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    notes: Optional[str] = None


class AppointmentResponse(AppointmentBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
