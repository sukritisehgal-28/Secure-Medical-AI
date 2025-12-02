from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from api.db.database import Base
import enum

class AuditAction(str, enum.Enum):
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    LOGIN = "login"
    LOGOUT = "logout"

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(Enum(AuditAction), nullable=False)
    resource_type = Column(String, nullable=False)  # "note", "patient", "user"
    resource_id = Column(String, nullable=True)  # ID of the resource being accessed
    details = Column(Text, nullable=True)  # Additional details about the action
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Hash for integrity (optional for now)
    hash_chain = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User")
