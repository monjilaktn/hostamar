import React, { useEffect, useState } from 'react';
import { Table, Card, Badge, Button } from 'react-bootstrap';
import axios from 'axios';

function CRMView() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      // Fetch from the new Django API exposed via Nginx
      const res = await axios.get('/crm/leads/');
      setLeads(res.data);
    } catch (err) {
      console.error("Failed to fetch CRM leads", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Business Leads (CRM)</h5>
        <Button size="sm" variant="primary">+ Add Lead</Button>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <p className="text-center">Loading leads...</p>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {leads.length > 0 ? leads.map((lead) => (
                <tr key={lead.id}>
                  <td><strong>{lead.company_name}</strong></td>
                  <td>{lead.contact_person}</td>
                  <td>
                    <Badge bg={
                      lead.status === 'WON' ? 'success' :
                      lead.status === 'NEW' ? 'primary' : 'secondary'
                    }>
                      {lead.status}
                    </Badge>
                  </td>
                  <td>{lead.email}</td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="text-center">No leads found. Ask the Business Agent to find some!</td></tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default CRMView;
