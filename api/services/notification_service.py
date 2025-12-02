"""
Email and SMS Notification Service
Integrates with SendGrid (Email) and Twilio (SMS)
"""
import os
from typing import Dict, List, Optional
from datetime import datetime
import json

class NotificationService:
    def __init__(self):
        # Email configuration (SendGrid)
        self.sendgrid_api_key = os.getenv("SENDGRID_API_KEY", "")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@medicalnotes.com")
        
        # SMS configuration (Twilio)
        self.twilio_account_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
        self.twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")
        self.twilio_phone_number = os.getenv("TWILIO_PHONE_NUMBER", "")
        
        # Check if services are configured
        self.email_enabled = bool(self.sendgrid_api_key)
        self.sms_enabled = bool(self.twilio_account_sid and self.twilio_auth_token)
    
    def send_email(self, to_email: str, subject: str, body: str, html_body: Optional[str] = None) -> Dict:
        """
        Send email notification using SendGrid
        """
        if not self.email_enabled:
            return {
                "success": False,
                "message": "Email service not configured. Set SENDGRID_API_KEY environment variable."
            }
        
        try:
            # Mock implementation - replace with actual SendGrid API call
            print(f"📧 EMAIL SENT")
            print(f"To: {to_email}")
            print(f"Subject: {subject}")
            print(f"Body: {body[:100]}...")
            
            return {
                "success": True,
                "message": "Email sent successfully",
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Email sending failed: {str(e)}"
            }
    
    def send_sms(self, to_phone: str, message: str) -> Dict:
        """
        Send SMS notification using Twilio
        """
        if not self.sms_enabled:
            return {
                "success": False,
                "message": "SMS service not configured. Set Twilio environment variables."
            }
        
        try:
            # Mock implementation - replace with actual Twilio API call
            print(f"📱 SMS SENT")
            print(f"To: {to_phone}")
            print(f"Message: {message}")
            
            return {
                "success": True,
                "message": "SMS sent successfully",
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"SMS sending failed: {str(e)}"
            }
    
    def send_appointment_reminder(self, patient_email: str, patient_phone: str, 
                                 appointment_date: str, doctor_name: str) -> Dict:
        """Send appointment reminder via email and SMS"""
        
        subject = "Appointment Reminder"
        email_body = f"""
        Dear Patient,
        
        This is a reminder about your upcoming appointment:
        
        Date & Time: {appointment_date}
        Doctor: {doctor_name}
        
        Please arrive 15 minutes early for check-in.
        
        If you need to reschedule, please contact us at least 24 hours in advance.
        
        Thank you,
        Medical Notes Team
        """
        
        sms_body = f"Appointment Reminder: {appointment_date} with Dr. {doctor_name}. Please arrive 15 min early."
        
        results = {}
        
        if patient_email:
            results['email'] = self.send_email(patient_email, subject, email_body)
        
        if patient_phone:
            results['sms'] = self.send_sms(patient_phone, sms_body)
        
        return results
    
    def send_critical_alert(self, staff_emails: List[str], patient_name: str, 
                          alert_message: str) -> Dict:
        """Send critical patient alert to medical staff"""
        
        subject = f"🚨 CRITICAL ALERT - {patient_name}"
        body = f"""
        CRITICAL PATIENT ALERT
        
        Patient: {patient_name}
        Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        
        Alert Details:
        {alert_message}
        
        Immediate attention required.
        
        This is an automated alert from the Medical Notes AI System.
        """
        
        results = []
        for email in staff_emails:
            result = self.send_email(email, subject, body)
            results.append({"email": email, "result": result})
        
        return {
            "success": all(r['result']['success'] for r in results),
            "results": results
        }
    
    def send_lab_results_notification(self, patient_email: str, patient_name: str) -> Dict:
        """Notify patient that lab results are available"""
        
        subject = "Lab Results Available"
        body = f"""
        Dear {patient_name},
        
        Your recent lab results are now available for review.
        
        Please log in to your patient portal to view your results, or contact your healthcare provider for more information.
        
        Best regards,
        Medical Notes Team
        """
        
        return self.send_email(patient_email, subject, body)
    
    def send_medication_reminder(self, patient_phone: str, medication_name: str, 
                                dosage: str, time: str) -> Dict:
        """Send medication reminder via SMS"""
        
        message = f"Medication Reminder: Take {medication_name} ({dosage}) at {time}."
        
        return self.send_sms(patient_phone, message)
    
    def send_follow_up_reminder(self, patient_email: str, patient_name: str, 
                               follow_up_date: str, reason: str) -> Dict:
        """Send follow-up appointment reminder"""
        
        subject = "Follow-up Appointment Needed"
        body = f"""
        Dear {patient_name},
        
        According to your treatment plan, you are due for a follow-up appointment.
        
        Recommended Follow-up Date: {follow_up_date}
        Reason: {reason}
        
        Please contact our office to schedule your appointment.
        
        Thank you,
        Medical Notes Team
        """
        
        return self.send_email(patient_email, subject, body)
    
    def send_discharge_instructions(self, patient_email: str, patient_name: str, 
                                   instructions: str) -> Dict:
        """Send discharge instructions to patient"""
        
        subject = "Discharge Instructions"
        body = f"""
        Dear {patient_name},
        
        Thank you for choosing our medical facility for your care.
        
        DISCHARGE INSTRUCTIONS:
        {instructions}
        
        If you have any questions or concerns, please contact your healthcare provider.
        
        Emergency: If you experience any emergency symptoms, call 911 or go to the nearest emergency room.
        
        Best wishes for a speedy recovery,
        Medical Notes Team
        """
        
        return self.send_email(patient_email, subject, body)

# Example usage and configuration instructions
"""
To enable email notifications:
1. Sign up for SendGrid account
2. Get API key from SendGrid dashboard
3. Set environment variable: SENDGRID_API_KEY=your_api_key_here
4. Set environment variable: FROM_EMAIL=your_email@domain.com

To enable SMS notifications:
1. Sign up for Twilio account
2. Get Account SID and Auth Token
3. Get a Twilio phone number
4. Set environment variables:
   - TWILIO_ACCOUNT_SID=your_account_sid
   - TWILIO_AUTH_TOKEN=your_auth_token
   - TWILIO_PHONE_NUMBER=+1234567890
"""
