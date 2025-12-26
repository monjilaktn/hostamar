# app/factory.py (Phase 10: Dynamic Config)
import yaml
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from app.tools import (
    search_tenders, 
    calculate_vat_tax, 
    analyze_boq_item, 
    read_document_content, 
    list_user_files,
    browse_egp_tenders
)
from app.tools.shell_tool import ShellTool
from app.tools.roadmap_tool import RoadmapTool

TOOL_MAP = {
    "search_tenders": search_tenders,
    "calculate_vat_tax": calculate_vat_tax,
    "analyze_boq_item": analyze_boq_item,
    "read_document_content": read_document_content,
    "list_user_files": list_user_files,
    "browse_egp_tenders": browse_egp_tenders,
    "shell_executor": ShellTool(),
    "roadmap_executor": RoadmapTool()
}

class AgentFactory:
    def __init__(self):
        config_path = "agents.yaml"
        if os.path.exists(config_path):
            with open(config_path, "r") as f:
                self.config = yaml.safe_load(f)
        else:
            self.config = {"agents": []}
            
        model_name = os.getenv("OPENAI_MODEL_NAME", "deepseek-r1:1.5b").strip()
            
        self.llm = ChatOpenAI(
            model=model_name,
            base_url=os.getenv("OPENAI_API_BASE"),
            api_key=os.getenv("OPENAI_API_KEY", "dummy"),
            temperature=0
        )

    def get_agent_node(self, name):
        agent_cfg = next((a for a in self.config["agents"] if a["name"] == name), None)
        if not agent_cfg:
            raise ValueError(f"Agent {name} not found.")
            
        tools = [TOOL_MAP[t] for t in agent_cfg["tools"] if t in TOOL_MAP]
        # Disable tool binding for models that don't support it (like DeepSeek-R1 on Ollama)
        llm_with_tools = self.llm # self.llm.bind_tools(tools) if tools else self.llm
        
        def node(state):
            msgs = state["messages"]
            if not any(isinstance(m, SystemMessage) for m in msgs):
                msgs.insert(0, SystemMessage(content=agent_cfg["system_prompt"]))
            return {"messages": [llm_with_tools.invoke(msgs)]}
            
        return node, tools

    def list_agents(self):
        return [a["name"] for a in self.config["agents"]]