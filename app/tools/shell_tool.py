import subprocess
from langchain.tools import BaseTool
from typing import Optional, Type
from langchain.pydantic_v1 import BaseModel, Field

class ShellInput(BaseModel):
    command: str = Field(description="The shell command to execute.")

class ShellTool(BaseTool):
    name = "shell_executor"
    description = "Executes shell commands on the local server. Use this to build, test, and deploy the project. Only use for approved maintenance tasks."
    args_schema: Type[BaseModel] = ShellInput

    def _run(self, command: str) -> str:
        """Executes a shell command."""
        try:
            # Security: Restrict dangerous commands if needed (basic filter)
            if "rm -rf /" in command:
                return "Error: Command blocked for security."
            
            result = subprocess.run(
                command, 
                shell=True, 
                check=True, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE, 
                text=True
            )
            return f"Stdout:\n{result.stdout}\nStderr:\n{result.stderr}"
        except subprocess.CalledProcessError as e:
            return f"Error executing command: {e}\nStdout: {e.stdout}\nStderr: {e.stderr}"
        except Exception as e:
            return f"Unexpected error: {str(e)}"

    def _arun(self, command: str):
        raise NotImplementedError("Async not implemented")
