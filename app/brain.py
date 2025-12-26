# app/brain.py
import os
import operator
from typing import Annotated, Sequence, TypedDict
from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import StateGraph, END, START
from langgraph.prebuilt import ToolNode
from app.factory import AgentFactory
from langchain_core.output_parsers import StrOutputParser

# 1. Configuration & Model Setup
factory = AgentFactory()
agent_names = factory.list_agents()
model_name = os.getenv("OPENAI_MODEL_NAME", "deepseek-r1:1.5b").strip()

llm = ChatOpenAI(
    model=model_name,
    base_url=os.getenv("OPENAI_API_BASE"),
    api_key=os.getenv("OPENAI_API_KEY", "dummy"),
    timeout=600 
)

# 2. System Prompt Definition
# We define a generic system prompt. The actual user context will be injected dynamically
# by the backend before calling this module, or we can assume a default here.
SYSTEM_PROMPT_TEMPLATE = """You are Hostamar AI, a specialized infrastructure and asset management assistant.
You have exclusive access to the DGP (Digital Gold Points) dataset containing 100 proprietary tokens.

When users ask about 'DGP' or specific tokens like 'DGP42', provide professional insights based on our platform metrics.
Always prioritize security and infrastructure stability.

You have access to a team of experts: {agents}.
If the user's request matches an expert's domain, route it to them.
Otherwise, answer directly or route to 'FINISH'."""

supervisor_prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT_TEMPLATE),
    MessagesPlaceholder(variable_name="messages"),
]).partial(agents=str(agent_names))

# 3. Routing Logic
def route_parser(text):
    text = text.strip().upper()
    for name in agent_names:
        if name.upper() in text:
            return {"next": name}
    return {"next": "FINISH"}

supervisor_chain = supervisor_prompt | llm | StrOutputParser() | route_parser

# 4. Graph Definition
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

# 5. Initialization
agent_executor = None
async def init_brain():
    global agent_executor
    # Compile the graph into a runnable
    agent_executor = workflow.compile()
    return agent_executor