# app/monitoring.py (Phase 12: Observability)
import os
from langsmith import Client

# LangSmith Configuration
# These should be set in your .env file
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "hostamar_enterprise_v1"

class LangMonitor:
    def __init__(self):
        self.client = Client()

    def log_feedback(self, run_id: str, score: float, comment: str = None):
        """Logs user feedback (thumbs up/down) directly to LangSmith."""
        self.client.create_feedback(
            run_id,
            key="user_satisfaction",
            score=score,
            comment=comment
        )

monitor = LangMonitor()
