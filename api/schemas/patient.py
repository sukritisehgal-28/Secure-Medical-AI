from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class PatientBase(BaseModel):
    patient_id: str
    first_name: str
    last_name: str
    date_of_birth: date
    medical_record_number: str
    emergency_contact: Optional[str] = None
    allergies: Optional[str] = None
    medical_history: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    emergency_contact: Optional[str] = None
    allergies: Optional[str] = None
    medical_history: Optional[str] = None

class PatientResponse(PatientBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
