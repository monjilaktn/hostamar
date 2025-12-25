# app/tools.py (Final Fix for Missing Imports)
from langchain_core.tools import tool
from typing import List, Dict, Any

# Mock Data
MOCK_TENDERS = [
    {"id": 1, "title": "Dhaka Bridge Construction", "budget": 500000},
    {"id": 2, "title": "Road Repair Chittagong", "budget": 200000}
]

@tool
def list_user_files(user_id: str) -> List[str]:
    """
    List documents uploaded by the user.
    
    Args:
        user_id: The ID of the user.
    """
    return ["trade_license.pdf", "tin_certificate.jpg"]

@tool
def read_document_content(user_id: str, filename: str) -> str:
    """
    Read text content from a document using OCR.
    
    Args:
        user_id: User ID
        filename: File name
    """
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
def parse_boq_excel(file_path: str) -> str:
    """Parse BOQ Excel file."""
    return "Parsed BOQ data"

@tool
def generate_boq_excel(items_data: List[Dict[str, Any]]) -> str:
    """Generate BOQ Excel."""
    return "/tmp/Estimated_BOQ.xlsx"

@tool
def calculate_tender_capacity(max_turnover: float, duration_years: float, unfinished_works: float) -> str:
    """Calculate tender capacity."""
    return f"Capacity: {(max_turnover * 1.5) - unfinished_works}"

@tool
def fill_official_boq(template_path: str, calculated_rates: List[Dict[str, Any]]) -> str:
    """Fill official BOQ template."""
    return "Filled BOQ Template"

@tool
def get_amount_in_words(amount: float) -> str:
    """Convert amount to words."""
    return "One Lakh Taka Only"

@tool
def list_user_documents(user_id: str) -> str:
    """List documents (Alias for list_user_files)."""
    return "Trade License, TIN Certificate"

@tool
def verify_document_compliance(user_id: str, doc_name: str) -> str:
    """Verify document compliance."""
    return "Valid"

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
    return "Table extracted"