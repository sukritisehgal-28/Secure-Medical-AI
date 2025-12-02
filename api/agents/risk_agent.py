"""
Risk Assessment Agent for clinical risk evaluation
"""
from typing import Dict, List, Optional, Tuple
from api.services.ai_service import MedicalAIService
from api.models.note import Note
from api.models.patient import Patient
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

class RiskAssessmentAgent:
    def __init__(self):
        self.ai_service = MedicalAIService()
    
    def generate_patient_risk_report(self, patient_id: int, db: Session) -> Dict[str, any]:
        """
        Generate comprehensive risk report for a patient
        """
        try:
            # Get patient and all their notes
            patient = db.query(Patient).filter(Patient.id == patient_id).first()
            if not patient:
                return {"error": "Patient not found"}
            
            notes = db.query(Note).filter(
                Note.patient_id == patient_id
            ).order_by(Note.created_at.desc()).all()
            
            if not notes:
                return {
                    "patient_name": f"{patient.first_name} {patient.last_name}",
                    "risk_level": "UNKNOWN",
                    "summary": "No notes available for risk assessment",
                    "risks": [],
                    "recommendations": [],
                    "escalation": "No data available",
                    "trends": [],
                    "last_assessment": None
                }
            
            # Analyze all notes for comprehensive risk assessment
            all_note_content = "\n\n".join([f"{note.title}: {note.content}" for note in notes])
            patient_context = self._build_patient_context(patient, notes)
            
            # Get AI risk assessment
            risk_analysis = self.ai_service.assess_risk(
                note_content=all_note_content,
                patient_history=[note.content for note in notes[:10]]  # Last 10 notes
            )
            
            # Analyze trends
            trends = self._analyze_risk_trends(notes)
            
            # Generate specific recommendations
            recommendations = self._generate_risk_recommendations(risk_analysis, trends, patient)
            
            # Determine escalation criteria
            escalation = self._determine_escalation(risk_analysis, trends)
            
            return {
                "patient_name": f"{patient.first_name} {patient.last_name}",
                "patient_id": patient.patient_id,
                "risk_level": risk_analysis["risk_level"],
                "summary": risk_analysis["risk_analysis"],
                "risks": self._extract_risk_factors(risk_analysis["risk_analysis"]),
                "recommendations": recommendations,
                "escalation": escalation,
                "trends": trends,
                "last_assessment": datetime.now().isoformat(),
                "monitoring_suggestions": risk_analysis.get("monitoring_suggestions", ""),
                "escalation_criteria": risk_analysis.get("escalation_criteria", "")
            }
            
        except Exception as e:
            return {
                "error": f"Error generating risk report: {str(e)}",
                "patient_name": "Unknown",
                "risk_level": "UNKNOWN",
                "summary": "Unable to assess risk",
                "risks": [],
                "recommendations": [],
                "escalation": "Contact IT support"
            }
    
    def _build_patient_context(self, patient: Patient, notes: List[Note]) -> str:
        """Build comprehensive patient context for risk assessment"""
        context_parts = [
            f"Patient: {patient.first_name} {patient.last_name}",
            f"DOB: {patient.date_of_birth}",
            f"MRN: {patient.medical_record_number}",
            f"Total Notes: {len(notes)}"
        ]
        
        if patient.allergies:
            context_parts.append(f"Allergies: {patient.allergies}")
        
        if patient.medical_history:
            context_parts.append(f"Medical History: {patient.medical_history}")
        
        # Add recent note summaries
        recent_notes = notes[:3]  # Last 3 notes
        for note in recent_notes:
            context_parts.append(f"Recent: {note.title} ({note.created_at.strftime('%Y-%m-%d')})")
        
        return "\n".join(context_parts)
    
    def _analyze_risk_trends(self, notes: List[Note]) -> List[Dict[str, any]]:
        """Analyze risk trends over time"""
        trends = []
        
        # Group notes by week
        weekly_notes = {}
        for note in notes:
            week_start = note.created_at - timedelta(days=note.created_at.weekday())
            week_key = week_start.strftime('%Y-%m-%d')
            
            if week_key not in weekly_notes:
                weekly_notes[week_key] = []
            weekly_notes[week_key].append(note)
        
        # Analyze each week
        for week, week_notes in list(weekly_notes.items())[:4]:  # Last 4 weeks
            high_risk_count = sum(1 for note in week_notes if note.risk_level == "HIGH")
            medium_risk_count = sum(1 for note in week_notes if note.risk_level == "MEDIUM")
            
            trends.append({
                "week": week,
                "total_notes": len(week_notes),
                "high_risk_notes": high_risk_count,
                "medium_risk_notes": medium_risk_count,
                "risk_trend": "increasing" if high_risk_count > 0 else "stable"
            })
        
        return trends
    
    def _generate_risk_recommendations(self, risk_analysis: Dict, trends: List[Dict], patient: Patient) -> List[str]:
        """Generate specific risk management recommendations"""
        recommendations = []
        
        risk_level = risk_analysis.get("risk_level", "UNKNOWN")
        
        if risk_level == "HIGH" or risk_level == "CRITICAL":
            recommendations.extend([
                "Increase monitoring frequency to every 2-4 hours",
                "Consider 24-hour nursing supervision",
                "Notify attending physician immediately",
                "Document all vital signs and symptoms"
            ])
        elif risk_level == "MEDIUM":
            recommendations.extend([
                "Monitor every 4-6 hours",
                "Review medication compliance",
                "Schedule follow-up within 24-48 hours",
                "Educate patient on warning signs"
            ])
        else:
            recommendations.extend([
                "Continue routine monitoring",
                "Schedule regular follow-up appointments",
                "Maintain current care plan"
            ])
        
        # Add trend-based recommendations
        if trends and any(t["risk_trend"] == "increasing" for t in trends):
            recommendations.append("⚠️ Risk trend is increasing - consider escalation")
        
        # Add patient-specific recommendations
        if patient.allergies:
            recommendations.append(f"⚠️ Monitor for allergic reactions - known allergies: {patient.allergies}")
        
        return recommendations
    
    def _extract_risk_factors(self, risk_analysis_text: str) -> List[str]:
        """Extract specific risk factors from AI analysis"""
        # Simple extraction - in production, use more sophisticated NLP
        risk_factors = []
        
        # Common risk factor keywords
        risk_keywords = [
            "hypertension", "diabetes", "infection", "fever", "pain", "shortness of breath",
            "chest pain", "dizziness", "nausea", "vomiting", "bleeding", "swelling",
            "confusion", "weakness", "fatigue", "weight loss", "weight gain"
        ]
        
        text_lower = risk_analysis_text.lower()
        for keyword in risk_keywords:
            if keyword in text_lower:
                risk_factors.append(keyword.title())
        
        return list(set(risk_factors))
    
    def _determine_escalation(self, risk_analysis: Dict, trends: List[Dict]) -> str:
        """Determine escalation requirements"""
        risk_level = risk_analysis.get("risk_level", "UNKNOWN")
        
        if risk_level == "CRITICAL":
            return "Immediate escalation to attending physician and charge nurse"
        elif risk_level == "HIGH":
            return "Escalate to attending physician within 2 hours"
        elif risk_level == "MEDIUM":
            return "Notify attending physician during next rounds"
        else:
            return "No immediate escalation required"
    
    def get_high_risk_patients(self, db: Session, limit: int = 10) -> List[Dict[str, any]]:
        """Get list of high-risk patients"""
        try:
            # Get patients with high-risk notes
            high_risk_notes = db.query(Note).filter(
                Note.risk_level.in_(["HIGH", "CRITICAL"])
            ).order_by(Note.created_at.desc()).limit(limit).all()
            
            high_risk_patients = []
            processed_patients = set()
            
            for note in high_risk_notes:
                if note.patient_id not in processed_patients:
                    patient = note.patient
                    high_risk_patients.append({
                        "patient_id": patient.patient_id,
                        "patient_name": f"{patient.first_name} {patient.last_name}",
                        "risk_level": note.risk_level,
                        "last_note_date": note.created_at.isoformat(),
                        "last_note_title": note.title,
                        "recommendations": note.recommendations
                    })
                    processed_patients.add(note.patient_id)
            
            return high_risk_patients
            
        except Exception as e:
            return []
