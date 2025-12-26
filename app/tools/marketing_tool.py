from langchain_openai import ChatOpenAI
from langchain.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
import os

class MarketingInput(BaseModel):
    platform: str = Field(description="The platform (Facebook, Email, LinkedIn).")
    topic: str = Field(description="The topic or lead name to focus on.")

class MarketingTool(BaseTool):
    name = "marketing_generator"
    description = "Generates high-conversion marketing content using local AI. Use for email outreach and social media."
    args_schema: Type[BaseModel] = MarketingInput

    def _run(self, platform: str, topic: str) -> str:
        model_name = os.getenv("OPENAI_MODEL_NAME", "deepseek-r1:1.5b").strip()
        llm = ChatOpenAI(
            model=model_name,
            base_url=os.getenv("OPENAI_API_BASE"),
            api_key=os.getenv("OPENAI_API_KEY", "dummy")
        )
        
        prompt = f"Create a high-conversion {platform} post/email for Hostamar Enterprise. Topic: {topic}. Focus on 100GB storage, 100 DGP assets, and Local AI security."
        response = llm.invoke(prompt)
        return str(response.content)

    def _arun(self, platform: str, topic: str):
        raise NotImplementedError("Async not implemented")
