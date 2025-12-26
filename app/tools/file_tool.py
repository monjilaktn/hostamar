import os
from langchain.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field

class WriteFileInput(BaseModel):
    file_path: str = Field(description="The path to the file to write (relative to project root).")
    content: str = Field(description="The content to write to the file.")

class WriteFileTool(BaseTool):
    name = "file_writer"
    description = "Writes content to a file. Use this to generate code, create configuration files, or write documentation."
    args_schema: Type[BaseModel] = WriteFileInput

    def _run(self, file_path: str, content: str) -> str:
        try:
            # Security: Prevent writing outside project directory
            if ".." in file_path or file_path.startswith("/"):
                return "Error: Cannot write outside project root."
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(file_path) or ".", exist_ok=True)
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
                
            return f"Successfully wrote to {file_path}"
        except Exception as e:
            return f"Error writing file: {str(e)}"

    def _arun(self, file_path: str, content: str):
        raise NotImplementedError("Async not implemented")
