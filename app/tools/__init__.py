# app/tools/__init__.py (Unified Tools Package)
from langchain_core.tools import tool
from typing import List, Dict, Any

# Mock Data
MOCK_TENDERS = [
    {"id": 1, "title": "Dhaka Bridge Construction", "budget": 500000},
    {"id": 2, "title": "Road Repair Chittagong", "budget": 200000}
]

@tool
def list_user_files(user_id: str) -> List[str]:
    """List documents uploaded by the user."""
    return ["trade_license.pdf", "tin_certificate.jpg"]

@tool
def read_document_content(user_id: str, filename: str) -> str:
    """Read text content from a document using OCR."""
    return "Sample OCR text content from document."

@tool
def search_tenders(query: str) -> List[Dict]:
    """Search for tenders."""
    return [t for t in MOCK_TENDERS if query.lower() in t['title'].lower()]

@tool
def calculate_vat_tax(amount: float) -> str:
    """Calculate VAT and Tax."""
    return f"Base: {amount}, Total: {amount * 1.20}"

@tool
def analyze_boq_item(description: str, qty: float) -> Dict[str, Any]:
    """Analyze BOQ item cost."""
    return {"item": description, "rate": 500, "total": qty * 500}

@tool
def browse_egp_tenders(keyword: str) -> str:
    """Browse e-GP portal."""
    return "Found live tenders"

@tool
def search_procurement_rules(query: str) -> str:
    """Search PPR-2008 rules."""
    return "PPR Rule 24: Liquid Assets must meet criteria."

@tool
def add_to_company_knowledge(text: str, category: str = "general") -> str:
    """Add knowledge to vault."""
    return "Added to vault"

@tool
def legal_risk_audit(user_id: str, filename: str) -> str:
    """Audit legal risks."""
    return "Risk Report: Low"

@tool
def extract_boq_table(user_id: str, filename: str) -> str:
    """Extract BOQ table."""
    return "Extracting BOQ table data..."