# app/brain.py (Phase 10 Specialized Supervisor)
import sqlite3
import operator
import os
from typing import Annotated, Sequence, TypedDict
from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import StateGraph, END, START
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from app.factory import AgentFactory

factory = AgentFactory()
agent_names = factory.list_agents()
model_name = os.getenv("OPENAI_MODEL_NAME", "deepseek-r1:1.5b").strip()

llm = ChatOpenAI(
    model=model_name,
    base_url=os.getenv("OPENAI_API_BASE"),
    api_key=os.getenv("OPENAI_API_KEY", "dummy"),
    timeout=600 
)

    system_prompt = f"""You are Hostamar AI, a specialized infrastructure and asset management assistant.
    You have exclusive access to the DGP (Digital Gold Points) dataset containing 100 proprietary tokens.
    
    Context Information:
    - User: {user_context.get('username', 'Guest')}
    - Role: {user_context.get('role', 'user')}
    - DGP Tokens: Managed in system registry.
    
    When users ask about 'DGP' or specific tokens like 'DGP42', provide professional insights based on our platform metrics.
    Always prioritize security and infrastructure stability."""

options = ["FINISH"] + agent_names
func_def = {
    "name": "route",
    "parameters": {
        "type": "object",
        "properties": {"next": {"enum": options}},
        "required": ["next"]
    }
}
prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    MessagesPlaceholder(variable_name="messages"),
    ("system", "Next action? {options}")
]).partial(options=str(options))

from langchain_core.output_parsers import StrOutputParser

# Refactored Supervisor for models without tool support
supervisor_prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt + "\nResponse format: Just the name of the expert (e.g. Legal Expert) or 'FINISH'."),
    MessagesPlaceholder(variable_name="messages"),
]).partial(options=str(options))

def route_parser(text):
    text = text.strip().upper()
    for name in agent_names:
        if name.upper() in text:
            return {"next": name}
    return {"next": "FINISH"}

supervisor_chain = supervisor_prompt | llm | StrOutputParser() | route_parser


class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next: str

workflow = StateGraph(AgentState)
workflow.add_node("supervisor", lambda x: supervisor_chain.invoke(x))

for name in agent_names:
    node, tools = factory.get_agent_node(name)
    workflow.add_node(name, node)
    if tools:
        tool_node = f"{name}_tools"
        workflow.add_node(tool_node, ToolNode(tools))
        workflow.add_edge(tool_node, name)
        workflow.add_conditional_edges(name, lambda x, n=name: f"{n}_tools" if x["messages"][-1].tool_calls else "supervisor")
    else:
        workflow.add_edge(name, "supervisor")

workflow.add_conditional_edges("supervisor", lambda x: x["next"], {**{n:n for n in agent_names}, "FINISH": END})
workflow.add_edge(START, "supervisor")

agent_executor = None
async def init_brain():
    global agent_executor
    
    # Simple direct chain for testing basic LLM connectivity
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant."),
        MessagesPlaceholder(variable_name="messages"),
    ])
    
    chain = prompt | llm
    
    # Wrap in a simple runnable to match expected interface
    async def simple_executor(input_dict, config=None):
        response = await chain.ainvoke(input_dict)
        return {"messages": [response]}

    agent_executor = type('obj', (object,), {'ainvoke': simple_executor})
    return agent_executor