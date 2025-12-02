from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from api.models.note import NoteType, NoteStatus

class NoteBase(BaseModel):
    title: str
    content: str
    note_type: NoteType

class NoteCreate(NoteBase):
    patient_id: int

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    status: Optional[NoteStatus] = None

class NoteResponse(NoteBase):
    id: int
    patient_id: int
    author_id: int
    status: NoteStatus
    summary: Optional[str] = None
    risk_level: Optional[str] = None
    recommendations: Optional[str] = None
    tags: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class NoteSummary(BaseModel):
    id: int
    title: str
    note_type: NoteType
    content: Optional[str] = None
    summary: Optional[str] = None
    risk_level: Optional[str] = None
    recommendations: Optional[str] = None
    created_at: datetime
    author_name: str
    patient_name: str
