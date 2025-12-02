#!/usr/bin/env python3
"""
Enhanced Data Seeder - Creates extensive fake data for testing
"""
from api.db.database import SessionLocal, engine, Base
from api.models.user import User
from api.models.patient import Patient
from api.models.note import Note
from passlib.context import CryptContext
from datetime import datetime, timedelta
import random

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_more_fake_data():
    """Create extensive fake data for testing"""
    db = SessionLocal()
    
    try:
        print("🌱 Creating extensive fake data...")
        
        # Create more users
        users_data = [
            {"email": "dr.williams@hospital.com", "full_name": "Dr. Emily Williams", "role": "doctor"},
            {"email": "dr.chen@hospital.com", "full_name": "Dr. Michael Chen", "role": "doctor"},
            {"email": "dr.patel@hospital.com", "full_name": "Dr. Priya Patel", "role": "doctor"},
            {"email": "nurse.davis@hospital.com", "full_name": "Nurse Robert Davis", "role": "nurse"},
            {"email": "nurse.martinez@hospital.com", "full_name": "Nurse Maria Martinez", "role": "nurse"},
            {"email": "nurse.lee@hospital.com", "full_name": "Nurse Jennifer Lee", "role": "nurse"},
        ]
        
        created_users = []
        for user_data in users_data:
            existing = db.query(User).filter(User.email == user_data["email"]).first()
            if not existing:
                user = User(
                    email=user_data["email"],
                    hashed_password=pwd_context.hash("password123"),
                    full_name=user_data["full_name"],
                    role=user_data["role"]
                )
                db.add(user)
                created_users.append(user)
        
        db.commit()
        print(f"✅ Created {len(created_users)} new users")
        
        # Create more patients with detailed medical histories
        patients_data = [
            {
                "patient_id": "P004",
                "first_name": "Emily",
                "last_name": "Rodriguez",
                "date_of_birth": datetime(1988, 5, 12).date(),
                "medical_record_number": "MRN004",
                "allergies": "Latex, Shellfish",
                "medical_history": "Asthma since childhood, Seasonal allergies"
            },
            {
                "patient_id": "P005",
                "first_name": "Robert",
                "last_name": "Anderson",
                "date_of_birth": datetime(1945, 11, 30).date(),
                "medical_record_number": "MRN005",
                "allergies": "Sulfa drugs, Aspirin",
                "medical_history": "COPD, Former smoker (quit 10 years ago), Arthritis"
            },
            {
                "patient_id": "P006",
                "first_name": "Lisa",
                "last_name": "Taylor",
                "date_of_birth": datetime(1992, 3, 22).date(),
                "medical_record_number": "MRN006",
                "allergies": "None known",
                "medical_history": "Anxiety disorder, Migraines"
            },
            {
                "patient_id": "P007",
                "first_name": "David",
                "last_name": "Wilson",
                "date_of_birth": datetime(1955, 8, 15).date(),
                "medical_record_number": "MRN007",
                "allergies": "Penicillin",
                "medical_history": "Type 2 Diabetes, Hypertension, High cholesterol"
            },
            {
                "patient_id": "P008",
                "first_name": "Jennifer",
                "last_name": "Martinez",
                "date_of_birth": datetime(1990, 1, 5).date(),
                "medical_record_number": "MRN008",
                "allergies": "None known",
                "medical_history": "History of depression, Well-controlled with medication"
            },
        ]
        
        created_patients = []
        for patient_data in patients_data:
            existing = db.query(Patient).filter(Patient.patient_id == patient_data["patient_id"]).first()
            if not existing:
                patient = Patient(**patient_data)
                db.add(patient)
                created_patients.append(patient)
        
        db.commit()
        print(f"✅ Created {len(created_patients)} new patients")
        
        # Get all users and patients
        all_users = db.query(User).all()
        all_patients = db.query(Patient).all()
        
        # Create extensive notes
        note_templates = [
            {
                "title": "Routine Physical Examination",
                "content": "Annual wellness visit. Patient reports feeling well overall. Vital signs stable. BP: 120/80, HR: 72, Temp: 98.6°F. Physical exam unremarkable. Labs ordered: CBC, CMP, Lipid panel. Continue current medications. Follow-up in 1 year.",
                "note_type": "doctor_note"
            },
            {
                "title": "Follow-up Visit - Hypertension",
                "content": "Patient returns for BP check. Home BP readings averaging 130/85. Current medication: Lisinopril 10mg daily. Patient compliant with medication. BP today: 128/82. Well controlled. Continue current regimen. Follow-up in 3 months.",
                "note_type": "doctor_note"
            },
            {
                "title": "Diabetes Management",
                "content": "Diabetes follow-up. HbA1c: 7.2% (improved from 8.5% 3 months ago). Fasting glucose: 145 mg/dL. Patient following diet plan and exercising regularly. Metformin 1000mg twice daily. Excellent progress. Continue current plan. Next visit in 3 months.",
                "note_type": "doctor_note"
            },
            {
                "title": "Urgent Care - Chest Pain",
                "content": "Patient presents with chest pain onset 2 hours ago. Pain radiating to left arm. ECG shows normal sinus rhythm, no ST changes. Troponin negative. Likely musculoskeletal pain vs anxiety. Prescribed NSAIDs. Advised to seek ER if symptoms worsen. Follow-up in 48 hours.",
                "note_type": "doctor_note"
            },
            {
                "title": "Vital Signs Check",
                "content": "Routine vital signs monitoring. BP: 118/76, HR: 68, RR: 16, Temp: 98.4°F, SpO2: 99%. Patient resting comfortably. No complaints. Continue monitoring.",
                "note_type": "nurse_note"
            },
            {
                "title": "Medication Administration",
                "content": "Administered morning medications as prescribed. Patient tolerated well. No adverse reactions observed. Educated patient on medication schedule. Patient verbalized understanding.",
                "note_type": "nurse_note"
            },
            {
                "title": "Wound Care Assessment",
                "content": "Post-surgical wound assessment. Incision site clean, dry, and intact. No signs of infection. Dressing changed. Patient educated on wound care. Continue current care plan.",
                "note_type": "nurse_note"
            },
            {
                "title": "Fall Risk Assessment",
                "content": "Fall risk screening completed. Patient scored 8/10 on Morse Fall Scale (moderate risk). Safety measures implemented: bed alarm activated, non-slip socks provided, call bell within reach. Family educated on fall prevention.",
                "note_type": "nurse_note"
            },
            {
                "title": "Respiratory Assessment",
                "content": "Patient with history of asthma. Lungs clear to auscultation bilaterally. No wheezing or crackles. SpO2: 97% on room air. Respiratory rate: 16. Patient reports using inhaler as needed, last use 2 days ago. Continue current asthma management.",
                "note_type": "doctor_note"
            },
            {
                "title": "Mental Health Screening",
                "content": "Depression screening using PHQ-9: score 12 (moderate depression). Patient reports low mood, decreased interest in activities, sleep disturbance. Currently on Sertraline 50mg daily for 6 months. Discussed increasing dose to 100mg. Referred to counseling. Follow-up in 2 weeks.",
                "note_type": "doctor_note"
            },
        ]
        
        # Create notes for each patient with varied dates
        created_notes = []
        for patient in all_patients:
            # Create 5-10 notes per patient over the past 6 months
            num_notes = random.randint(5, 10)
            for i in range(num_notes):
                days_ago = random.randint(1, 180)
                template = random.choice(note_templates)
                author = random.choice(all_users)
                
                note = Note(
                    title=template["title"],
                    content=template["content"],
                    note_type=template["note_type"],
                    patient_id=patient.id,
                    author_id=author.id,
                    created_at=datetime.now() - timedelta(days=days_ago)
                )
                db.add(note)
                created_notes.append(note)
        
        db.commit()
        print(f"✅ Created {len(created_notes)} new notes")
        
        print("\n🎉 Successfully created extensive fake data!")
        print("\n📊 Summary:")
        print(f"   - Total Users: {len(all_users)}")
        print(f"   - Total Patients: {len(all_patients)}")
        print(f"   - Total Notes: {db.query(Note).count()}")
        
        print("\n🔑 Login Credentials:")
        print("   Doctor Logins:")
        print("   - dr.smith@hospital.com / password123")
        print("   - dr.williams@hospital.com / password123")
        print("   - dr.chen@hospital.com / password123")
        print("   - dr.patel@hospital.com / password123")
        print("\n   Nurse Logins:")
        print("   - nurse.johnson@hospital.com / password123")
        print("   - nurse.davis@hospital.com / password123")
        print("   - nurse.martinez@hospital.com / password123")
        print("   - nurse.lee@hospital.com / password123")
        
    except Exception as e:
        print(f"❌ Error creating fake data: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_more_fake_data()
