"""
Background AI processing tasks using Celery
"""
from celery import current_task
from api.tasks.celery_app import celery_app
from api.agents.summarization_agent import SummarizationAgent
from api.agents.risk_agent import RiskAssessmentAgent
from api.db.database import SessionLocal
from api.models.note import Note
from api.models.patient import Patient
from api.models.audit import AuditLog, AuditAction
from api.models.user import User
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

@celery_app.task(bind=True)
def process_note_ai(self, note_id: int, user_id: int):
    """
    Background task to process a note with AI summarization and risk assessment
    """
    db = SessionLocal()
    try:
        # Update task status
        current_task.update_state(
            state="PROGRESS",
            meta={"status": "Processing note with AI", "note_id": note_id}
        )
        
        # Get note and patient
        note = db.query(Note).filter(Note.id == note_id).first()
        if not note:
            raise Exception(f"Note {note_id} not found")
        
        patient = db.query(Patient).filter(Patient.id == note.patient_id).first()
        if not patient:
            raise Exception(f"Patient for note {note_id} not found")
        
        # Process with AI
        summarization_agent = SummarizationAgent()
        result = summarization_agent.process_note(note, patient, db)
        
        # Log audit trail
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            audit_log = AuditLog(
                user_id=user_id,
                action=AuditAction.UPDATE,
                resource_type="note",
                resource_id=str(note_id),
                details=f"AI processing completed for note: {note.title}",
                ip_address="system"
            )
            db.add(audit_log)
            db.commit()
        
        if result["success"]:
            return {
                "status": "completed",
                "note_id": note_id,
                "summary": result["summary"],
                "risk_level": result["risk_level"],
                "recommendations": result["recommendations"]
            }
        else:
            raise Exception(f"AI processing failed: {result['error']}")
    
    except Exception as e:
        logger.error(f"Error processing note {note_id}: {str(e)}")
        raise self.retry(exc=e, countdown=60, max_retries=3)
    
    finally:
        db.close()

@celery_app.task(bind=True)
def generate_patient_risk_report(self, patient_id: int, user_id: int):
    """
    Background task to generate comprehensive risk report for a patient
    """
    db = SessionLocal()
    try:
        current_task.update_state(
            state="PROGRESS",
            meta={"status": "Generating risk report", "patient_id": patient_id}
        )
        
        risk_agent = RiskAssessmentAgent()
        risk_report = risk_agent.generate_patient_risk_report(patient_id, db)
        
        # Log audit trail
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            audit_log = AuditLog(
                user_id=user_id,
                action=AuditAction.READ,
                resource_type="patient",
                resource_id=str(patient_id),
                details=f"Risk report generated for patient",
                ip_address="system"
            )
            db.add(audit_log)
            db.commit()
        
        return {
            "status": "completed",
            "patient_id": patient_id,
            "risk_report": risk_report
        }
    
    except Exception as e:
        logger.error(f"Error generating risk report for patient {patient_id}: {str(e)}")
        raise self.retry(exc=e, countdown=60, max_retries=3)
    
    finally:
        db.close()

@celery_app.task(bind=True)
def batch_process_notes(self, note_ids: list, user_id: int):
    """
    Background task to batch process multiple notes
    """
    db = SessionLocal()
    try:
        current_task.update_state(
            state="PROGRESS",
            meta={"status": f"Processing {len(note_ids)} notes", "total": len(note_ids)}
        )
        
        summarization_agent = SummarizationAgent()
        results = []
        
        for i, note_id in enumerate(note_ids):
            # Update progress
            current_task.update_state(
                state="PROGRESS",
                meta={
                    "status": f"Processing note {i+1}/{len(note_ids)}",
                    "current": i + 1,
                    "total": len(note_ids)
                }
            )
            
            note = db.query(Note).filter(Note.id == note_id).first()
            if note:
                patient = db.query(Patient).filter(Patient.id == note.patient_id).first()
                if patient:
                    result = summarization_agent.process_note(note, patient, db)
                    results.append({
                        "note_id": note_id,
                        "success": result["success"],
                        "summary": result.get("summary"),
                        "risk_level": result.get("risk_level"),
                        "error": result.get("error")
                    })
        
        # Log audit trail
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            audit_log = AuditLog(
                user_id=user_id,
                action=AuditAction.UPDATE,
                resource_type="note",
                resource_id="batch",
                details=f"Batch processed {len(note_ids)} notes",
                ip_address="system"
            )
            db.add(audit_log)
            db.commit()
        
        return {
            "status": "completed",
            "processed_notes": len(results),
            "results": results
        }
    
    except Exception as e:
        logger.error(f"Error in batch processing: {str(e)}")
        raise self.retry(exc=e, countdown=60, max_retries=3)
    
    finally:
        db.close()

@celery_app.task
def update_vector_store():
    """
    Background task to update vector store with new notes
    """
    db = SessionLocal()
    try:
        from api.services.ai_service import MedicalAIService
        ai_service = MedicalAIService()
        
        # Get all notes for vector store
        notes = db.query(Note).filter(Note.status == "finalized").all()
        note_contents = [f"{note.title}: {note.content}" for note in notes]
        
        # Update vector store
        ai_service.add_documents_to_vector_store(note_contents)
        
        return {
            "status": "completed",
            "notes_processed": len(note_contents)
        }
    
    except Exception as e:
        logger.error(f"Error updating vector store: {str(e)}")
        return {"status": "error", "error": str(e)}
    
    finally:
        db.close()
