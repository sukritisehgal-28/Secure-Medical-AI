"""
Google Cloud Tasks integration for background job processing.
Replaces Celery for Cloud Run environment.
"""
import os
from google.cloud import tasks_v2
from google.protobuf import timestamp_pb2
import datetime
from typing import Optional, Dict, Any
import json

PROJECT_ID = os.getenv("GCP_PROJECT_ID", "securemed-ai")
LOCATION = os.getenv("GCP_REGION", "us-central1")
QUEUE_NAME = "mednotes-tasks"

def get_tasks_client():
    """Get Cloud Tasks client."""
    return tasks_v2.CloudTasksClient()

def create_task(
    endpoint: str,
    payload: Dict[Any, Any],
    schedule_time: Optional[datetime.datetime] = None,
    task_name: Optional[str] = None
) -> str:
    """
    Create a Cloud Task.
    
    Args:
        endpoint: API endpoint to call (e.g., '/ai/process-note')
        payload: JSON payload to send
        schedule_time: Optional time to schedule the task
        task_name: Optional custom task name
        
    Returns:
        Task name/ID
    """
    client = get_tasks_client()
    
    # Construct the queue path
    parent = client.queue_path(PROJECT_ID, LOCATION, QUEUE_NAME)
    
    # Get backend URL from environment
    backend_url = os.getenv("BACKEND_URL", "https://mednotes-backend-957293469884.us-central1.run.app")
    url = f"{backend_url}{endpoint}"
    
    # Construct the task
    task = {
        "http_request": {
            "http_method": tasks_v2.HttpMethod.POST,
            "url": url,
            "headers": {
                "Content-Type": "application/json",
            },
            "body": json.dumps(payload).encode(),
        }
    }
    
    # Add authentication for Cloud Run
    task["http_request"]["oidc_token"] = {
        "service_account_email": f"{PROJECT_ID}@appspot.gserviceaccount.com"
    }
    
    # Schedule task if time provided
    if schedule_time:
        timestamp = timestamp_pb2.Timestamp()
        timestamp.FromDatetime(schedule_time)
        task["schedule_time"] = timestamp
    
    # Create the task
    response = client.create_task(request={"parent": parent, "task": task})
    
    return response.name

def create_ai_summarization_task(note_id: int) -> str:
    """Create a task to summarize a clinical note."""
    return create_task(
        endpoint="/ai/tasks/summarize",
        payload={"note_id": note_id}
    )

def create_risk_assessment_task(patient_id: int) -> str:
    """Create a task to assess patient risk."""
    return create_task(
        endpoint="/ai/tasks/risk-assessment",
        payload={"patient_id": patient_id}
    )

def ensure_queue_exists():
    """Ensure the Cloud Tasks queue exists."""
    client = get_tasks_client()
    parent = client.common_location_path(PROJECT_ID, LOCATION)
    queue_name = client.queue_path(PROJECT_ID, LOCATION, QUEUE_NAME)
    
    try:
        client.get_queue(name=queue_name)
        print(f"Queue {QUEUE_NAME} already exists")
    except Exception:
        # Create the queue
        queue = {
            "name": queue_name,
            "rate_limits": {
                "max_dispatches_per_second": 10,
                "max_concurrent_dispatches": 10,
            },
        }
        client.create_queue(request={"parent": parent, "queue": queue})
        print(f"Created queue {QUEUE_NAME}")
