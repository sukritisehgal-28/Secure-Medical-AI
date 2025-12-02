"""
Enhanced AI Service for medical note processing using LangChain and OpenAI
REAL AI implementation with GPT-4 and embeddings
"""
import os
from typing import Dict, List, Optional, Tuple
import json
import re
from datetime import datetime

try:
    from langchain_openai import ChatOpenAI, OpenAIEmbeddings
    from langchain_core.prompts import PromptTemplate, ChatPromptTemplate
    from langchain_core.messages import HumanMessage, SystemMessage
    from langchain_community.vectorstores import FAISS
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from langchain_core.output_parsers import JsonOutputParser
    AI_AVAILABLE = True
except ImportError as e:
    AI_AVAILABLE = False
    print(f"⚠️ LangChain not available: {e}")

class MedicalAIService:
    """
    Enhanced Medical AI Service with real OpenAI integration
    Features:
    - Medical note summarization using GPT-4
    - Risk assessment with detailed analysis
    - RAG (Retrieval Augmented Generation) for historical context
    - Medical entity extraction
    - Treatment recommendations
    """
    
    def __init__(self):
        if not AI_AVAILABLE:
            self.enabled = False
            print("⚠️ AI Service disabled - missing dependencies")
            return
            
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if not self.openai_api_key:
            self.enabled = False
            print("⚠️ AI Service disabled - OPENAI_API_KEY not set")
            return
        
        self.enabled = True
        
        # Initialize LLM models
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",  # Using GPT-4o-mini for cost efficiency
            temperature=0.1,  # Low temperature for medical accuracy
            openai_api_key=self.openai_api_key
        )
        
        self.creative_llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.7,  # Higher temperature for recommendations
            openai_api_key=self.openai_api_key
        )
        
        # Initialize embeddings for RAG
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=self.openai_api_key,
            model="text-embedding-3-small"
        )
        
        # Text splitter for document chunking
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        
        # Vector store for historical notes (RAG)
        self.vectorstore = None
        
        print("✅ Enhanced AI Service initialized successfully!")
    
    def summarize_medical_note(self, note_content: str, note_type: str = "general", 
                               patient_history: Optional[List[str]] = None) -> Dict:
        """
        Generate comprehensive medical note summary using GPT-4
        """
        if not self.enabled:
            return self._get_mock_summary(note_content, note_type)
        
        try:
            # Build context from patient history if available
            history_context = ""
            if patient_history and self.vectorstore:
                # Use RAG to find relevant historical information
                relevant_docs = self.vectorstore.similarity_search(note_content, k=3)
                history_context = "\n".join([doc.page_content for doc in relevant_docs])
            
            # Create specialized prompt based on note type
            system_prompt = """You are an expert medical AI assistant specializing in clinical documentation. 
Your task is to analyze medical notes and provide structured, accurate summaries that help healthcare providers quickly understand patient conditions and care plans.

Guidelines:
- Be precise and medically accurate
- Use standard medical terminology
- Highlight critical information
- Maintain HIPAA compliance (no identifiable information)
- Focus on actionable insights
"""
            
            history_section = ""
            if history_context:
                history_section = f"\nPATIENT HISTORY CONTEXT:\n{history_context}\n"
            
            summary_json_template = """{
    "summary": "Brief 2-3 sentence overview",
    "key_findings": "Most important clinical findings",
    "chief_complaint": "Primary reason for visit",
    "assessment": "Clinical assessment and diagnosis",
    "vital_signs": "Any vital signs mentioned",
    "medications": "Medications mentioned",
    "treatment_plan": "Recommended treatment plan",
    "follow_up": "Follow-up recommendations",
    "risk_factors": "Any identified risk factors",
    "urgent_flags": "Any urgent concerns requiring immediate attention"
}"""
            
            user_prompt = (
                f"Analyze this {note_type} medical note and provide a comprehensive structured summary:\n\n"
                f"MEDICAL NOTE:\n{note_content}\n"
                f"{history_section}"
                "Provide your analysis in the following JSON format:\n"
                f"{summary_json_template}\n"
            )
            
            # Call GPT-4
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt)
            ]
            
            response = self.llm.invoke(messages)
            
            # Parse JSON response
            try:
                # Extract JSON from response
                content = response.content
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    result = json.loads(json_match.group())
                    result["ai_generated"] = True
                    result["model"] = "gpt-4o-mini"
                    result["timestamp"] = datetime.now().isoformat()
                    return result
                else:
                    # Fallback if no JSON found
                    return {
                        "summary": content[:500],
                        "ai_generated": True,
                        "model": "gpt-4o-mini"
                    }
            except json.JSONDecodeError:
                return {
                    "summary": response.content[:500],
                    "ai_generated": True,
                    "parsing_error": True
                }
                
        except Exception as e:
            print(f"Error in AI summarization: {str(e)}")
            return self._get_mock_summary(note_content, note_type)

    def generate_patient_summary(self, patient_name: str, notes: List[str]) -> str:
        """
        Generate a concise 3-4 line patient overview from recent notes.
        """
        if not notes:
            return "No documented encounters yet. Please add clinical notes to enable AI summaries."

        joined_notes = "\n\n".join(notes[:8])  # keep prompt compact

        if not self.enabled:
            # Lightweight fallback summary
            trimmed = joined_notes[:400].replace("\n", " ")
            return f"Patient overview for {patient_name}: {trimmed}..."

        try:
            system_prompt = (
                "You are an expert clinical documentation assistant. "
                "Write a brief, 3-4 line overview that captures the patient's current status, "
                "key diagnoses/complaints, notable vitals/findings, and plan or follow-up. "
                "Be concise, objective, and clinically relevant."
            )
            user_prompt = f"Patient: {patient_name}\nRecent notes:\n{joined_notes}"

            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt)
            ]

            response = self.llm.invoke(messages)
            return response.content.strip()
        except Exception as e:
            print(f"Error generating patient summary: {e}")
            trimmed = joined_notes[:400].replace("\n", " ")
            return f"Patient overview for {patient_name}: {trimmed}..."
    
    def assess_patient_risk(self, note_content: str, patient_history: List[str] = None, 
                           vital_signs: Dict = None) -> Dict:
        """
        Advanced risk assessment using GPT-4 with medical expertise
        """
        if not self.enabled:
            return self._get_mock_risk_assessment(note_content)
        
        try:
            # Prepare comprehensive context
            context_parts = [f"CURRENT NOTE:\n{note_content}"]
            
            if patient_history:
                context_parts.append(f"\nPATIENT HISTORY:\n" + "\n".join(patient_history[-5:]))  # Last 5 notes
            
            if vital_signs:
                context_parts.append(f"\nVITAL SIGNS:\n{json.dumps(vital_signs, indent=2)}")
            
            full_context = "\n".join(context_parts)
            
            system_prompt = """You are a clinical risk assessment AI with expertise in identifying patient risk factors and providing evidence-based recommendations.

Your task is to:
1. Assess overall patient risk level (LOW, MEDIUM, HIGH, CRITICAL)
2. Identify specific risk factors
3. Provide evidence-based recommendations
4. Suggest monitoring requirements
5. Determine if escalation is needed

Base your assessment on:
- Current symptoms and conditions
- Vital signs and lab values
- Patient history and comorbidities
- Standard clinical guidelines
"""
            
            risk_json_template = """{
    "risk_level": "LOW|MEDIUM|HIGH|CRITICAL",
    "confidence_score": 0-100,
    "summary": "Overall risk assessment summary",
    "risk_factors": ["list of specific risk factors"],
    "clinical_concerns": ["immediate clinical concerns"],
    "recommendations": ["specific evidence-based recommendations"],
    "monitoring_plan": "Recommended monitoring frequency and parameters",
    "escalation_criteria": "When to escalate care",
    "requires_urgent_attention": true/false,
    "estimated_severity": "mild|moderate|severe|life-threatening"
}"""
            
            user_prompt = (
                "Perform a comprehensive risk assessment:\n\n"
                f"{full_context}\n\n"
                "Provide your assessment in JSON format:\n"
                f"{risk_json_template}\n"
            )
            
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt)
            ]
            
            response = self.llm.invoke(messages)
            
            # Parse response
            try:
                content = response.content
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    result = json.loads(json_match.group())
                    result["ai_generated"] = True
                    result["assessment_timestamp"] = datetime.now().isoformat()
                    return result
            except json.JSONDecodeError:
                pass
            
            return self._get_mock_risk_assessment(note_content)
            
        except Exception as e:
            print(f"Error in risk assessment: {str(e)}")
            return self._get_mock_risk_assessment(note_content)
    
    def generate_treatment_recommendations(self, diagnosis: str, patient_context: str,
                                         contraindications: List[str] = None) -> Dict:
        """
        Generate evidence-based treatment recommendations using GPT-4
        """
        if not self.enabled:
            return self._get_mock_treatment_recommendations(diagnosis)
        
        try:
            contraindications_text = ""
            if contraindications:
                contraindications_text = f"\nCONTRAINDICATIONS:\n" + "\n".join(contraindications)
            
            system_prompt = """You are a medical AI assistant specialized in evidence-based treatment planning.
Provide treatment recommendations based on current clinical guidelines and best practices.
Always consider patient safety, contraindications, and individual patient factors."""
            
            treatment_json_template = """{
    "primary_treatment": "First-line treatment approach",
    "medications": [
        {
            "name": "medication name",
            "dosage": "typical dosage",
            "frequency": "how often",
            "duration": "treatment duration",
            "rationale": "why this medication"
        }
    ],
    "non_pharmacological": ["lifestyle modifications", "therapies"],
    "monitoring_requirements": "What to monitor and how often",
    "patient_education": ["key points to educate patient"],
    "red_flags": ["warning signs to watch for"],
    "follow_up_timeline": "When to follow up"
}"""
            
            user_prompt = (
                "Generate treatment recommendations for:\n\n"
                f"DIAGNOSIS: {diagnosis}\n\n"
                "PATIENT CONTEXT:\n"
                f"{patient_context}\n"
                f"{contraindications_text}\n\n"
                "Provide recommendations in JSON format:\n"
                f"{treatment_json_template}\n"
            )
            
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt)
            ]
            
            response = self.creative_llm.invoke(messages)
            
            try:
                content = response.content
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
            except json.JSONDecodeError:
                pass
            
            return self._get_mock_treatment_recommendations(diagnosis)
            
        except Exception as e:
            print(f"Error generating recommendations: {str(e)}")
            return self._get_mock_treatment_recommendations(diagnosis)
    
    def extract_medical_entities(self, text: str) -> Dict:
        """
        Extract medical entities (conditions, medications, procedures) from text
        """
        if not self.enabled:
            return {"entities": [], "error": "AI not available"}
        
        try:
            entity_json_template = """{
    "conditions": ["diagnosed conditions"],
    "symptoms": ["reported symptoms"],
    "medications": ["medications mentioned"],
    "procedures": ["procedures mentioned"],
    "vital_signs": ["vital signs with values"],
    "lab_results": ["lab results with values"]
}"""
            
            prompt = (
                "Extract all medical entities from the following text and categorize them:\n\n"
                f"TEXT: {text}\n\n"
                "Return JSON format:\n"
                f"{entity_json_template}\n"
            )
            
            response = self.llm.invoke([HumanMessage(content=prompt)])
            
            try:
                json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
            except:
                pass
            
            return {"entities": [], "raw_response": response.content}
            
        except Exception as e:
            return {"error": str(e)}
    
    def create_vectorstore_from_notes(self, notes: List[Dict]):
        """
        Create FAISS vector store from historical notes for RAG
        """
        if not self.enabled:
            return
        
        try:
            texts = []
            for note in notes:
                text = f"Date: {note.get('date', 'N/A')}\n"
                text += f"Type: {note.get('type', 'N/A')}\n"
                text += f"Content: {note.get('content', '')}"
                texts.append(text)
            
            if texts:
                docs = self.text_splitter.create_documents(texts)
                self.vectorstore = FAISS.from_documents(docs, self.embeddings)
                print(f"✅ Created vector store with {len(docs)} documents")
        except Exception as e:
            print(f"Error creating vector store: {str(e)}")
    
    # Mock methods for fallback
    def _get_mock_summary(self, content: str, note_type: str) -> Dict:
        """Fallback summary when AI is not available"""
        return {
            "summary": f"Summary of {note_type}: {content[:200]}...",
            "key_findings": "AI analysis not available - OpenAI API key needed",
            "assessment": "Manual review required",
            "ai_generated": False,
            "mock": True
        }
    
    def _get_mock_risk_assessment(self, content: str) -> Dict:
        """Fallback risk assessment"""
        risk_level = "MEDIUM"
        if any(word in content.lower() for word in ["critical", "urgent", "emergency", "severe"]):
            risk_level = "HIGH"
        elif any(word in content.lower() for word in ["stable", "normal", "routine"]):
            risk_level = "LOW"
        
        return {
            "risk_level": risk_level,
            "summary": "Risk assessment based on keyword analysis",
            "risk_factors": ["Automated assessment - AI not available"],
            "recommendations": ["Manual clinical review recommended"],
            "ai_generated": False,
            "mock": True
        }
    
    def _get_mock_treatment_recommendations(self, diagnosis: str) -> Dict:
        """Fallback treatment recommendations"""
        return {
            "primary_treatment": "Please consult clinical guidelines",
            "medications": [],
            "non_pharmacological": ["Lifestyle modifications", "Regular monitoring"],
            "follow_up_timeline": "As clinically indicated",
            "ai_generated": False,
            "mock": True
        }

# Example usage
if __name__ == "__main__":
    service = MedicalAIService()
    
    if service.enabled:
        # Test summarization
        test_note = """
        Patient presents with chest pain radiating to left arm, onset 2 hours ago.
        BP: 145/95, HR: 98, RR: 20, Temp: 98.6F, SpO2: 96%
        ECG shows normal sinus rhythm. Troponin pending.
        History of hypertension, on Lisinopril 10mg daily.
        Provisional diagnosis: Possible ACS vs musculoskeletal pain.
        """
        
        summary = service.summarize_medical_note(test_note, "emergency")
        print("Summary:", json.dumps(summary, indent=2))
        
        risk = service.assess_patient_risk(test_note)
        print("\nRisk Assessment:", json.dumps(risk, indent=2))
