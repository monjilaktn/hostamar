# Hostamar Master Task Distribution

This document defines the roles and responsibilities for all in-house AI agents.

## 🛠 Engineering Team
### **Software Developer Agent**
- **Tasks**: Write Django models, React components, and API views.
- **Goal**: 100% Test coverage and secure coding (OWASP).
- **Tool**: `file_writer`, `shell_executor`.

### **DevOps Engineer Agent**
- **Tasks**: Maintain CI/CD (GitHub Actions), Dockerize the In-house Platform, and Monitor Performance.
- **Goal**: 99.9% Uptime and <100ms response time.
- **Tool**: `shell_executor`, `roadmap_executor`.

## 📈 Business Team
### **Business Development Agent**
- **Tasks**: Lead generation, partnership outreach, and CRM management.
- **Goal**: Onboard 10 Businesses for the launch.
- **Tool**: `file_writer` (Proposals), `read_document_content`.

### **Marketing Automation Agent**
- **Tasks**: Generate social media content, draft marketing emails, and analyze market trends.
- **Goal**: Drive 1000+ leads for the sales funnel.
- **Tool**: `file_writer`, `read_document_content`.

## ⚖️ Legal & Finance
### **Legal Expert Agent**
- **Tasks**: Audit partnership contracts and ensure platform compliance with data privacy laws.
- **Tool**: `search_procurement_rules`, `legal_risk_audit`.

### **BOQ Estimator Agent**
- **Tasks**: Calculate project costs, VAT/Tax compliance, and financial forecasting.
- **Tool**: `calculate_vat_tax`, `extract_boq_table`.
