from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from api.db.database import get_db
from api.schemas.patient import PatientCreate, PatientUpdate, PatientResponse
from api.models.patient import Patient
from api.models.user import User
from api.deps import get_current_active_user

router = APIRouter(prefix="/patients", tags=["patients"])

@router.post("/", response_model=PatientResponse)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if patient already exists
    db_patient = db.query(Patient).filter(
        Patient.patient_id == patient.patient_id
    ).first()
    if db_patient:
        raise HTTPException(
            status_code=400,
            detail="Patient with this ID already exists"
        )
    
    db_patient = Patient(**patient.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.get("/", response_model=List[PatientResponse])
def get_patients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    patients = db.query(Patient).offset(skip).limit(limit).all()
    return patients

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )
    return patient

@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    patient_update: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )
    
    update_data = patient_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)
    
    db.commit()
    db.refresh(patient)
    return patient
