# app/guardrails.py (Phase 12: Safety & Quality)
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional

class AgentResponseSchema(BaseModel):
    """Ensures the agent output is structured and safe."""
    response: str = Field(description="The final answer to the user")
    source_documents: List[str] = Field(default=[], description="List of cited documents")
    confidence_score: float = Field(default=0.0, description="Confidence of the agent (0-1)")

    @field_validator("response")
    @classmethod
    def check_safety(cls, v: str):
        # Basic keyword blocklist for safety
        blocklist = ["password", "secret key", "internal ip"]
        for word in blocklist:
            if word in v.lower():
                raise ValueError(f"Output contains restricted info: {word}")
        return v

def validate_agent_output(raw_output: str) -> AgentResponseSchema:
    # This can be used to wrap agent responses for strict validation
    return AgentResponseSchema(response=raw_output, confidence_score=0.95)
