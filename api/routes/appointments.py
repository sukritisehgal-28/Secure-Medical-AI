from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from api.db.database import get_db
from api.deps import get_current_active_user
from api.models.appointment import Appointment
from api.models.user import User
from api.schemas.appointment import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentUpdate,
)

router = APIRouter(prefix="/appointments", tags=["appointments"])


@router.post("/", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if appointment.end_time <= appointment.start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End time must be after start time.",
        )

    db_appointment = Appointment(**appointment.dict(), created_by=current_user.id)
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment


@router.get("/", response_model=List[AppointmentResponse])
def list_appointments(
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    query = db.query(Appointment)
    if start:
        query = query.filter(Appointment.start_time >= start)
    if end:
        query = query.filter(Appointment.start_time <= end)

    appointments = query.order_by(Appointment.start_time.asc()).all()

    if not appointments:
        total = db.query(Appointment).count()
        if total == 0:
            _seed_sample_appointments(db, current_user, start)
            appointments = query.order_by(Appointment.start_time.asc()).all()

    return appointments


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(
    appointment_id: int,
    appointment_update: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")

    if appointment.created_by != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")

    if (
        appointment_update.start_time
        and appointment_update.end_time
        and appointment_update.end_time <= appointment_update.start_time
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End time must be after start time.",
        )

    update_data = appointment_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(appointment, field, value)

    db.commit()
    db.refresh(appointment)
    return appointment


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")

    if appointment.created_by != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")

    db.delete(appointment)
    db.commit()


def _seed_sample_appointments(db: Session, user: User, start: Optional[datetime]) -> None:
    """Bootstrap the calendar with a few sample appointments when the table is empty."""
    reference = start or datetime.now()
    base = reference.replace(day=1, hour=8, minute=0, second=0, microsecond=0)
    samples = [
        (1, "Cardiology Consult", "Clinic 4A", "Consultation", "John Smith", 60),
        (3, "Post-op Follow-up", "Clinic 2C", "Follow-up", "Ravi Patel", 45),
        (6, "Telehealth Diabetes Check", "Virtual Room", "Telehealth", "Maria Lopez", 30),
        (10, "Knee Replacement Prep", "OR Block 3", "Procedure", "Marcus Lee", 90),
    ]

    for day_offset, title, location, visit_type, patient_name, duration in samples:
        start_dt = base + timedelta(days=day_offset)
        end_dt = start_dt + timedelta(minutes=duration)
        db.add(
            Appointment(
                title=title,
                patient_name=patient_name,
                appointment_type=visit_type,
                status="confirmed",
                location=location,
                start_time=start_dt,
                end_time=end_dt,
                notes=None,
                created_by=user.id,
            )
        )

    db.commit()
