import React, { useState, useEffect } from 'react';
import { Table, Card, Form, InputGroup, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

function DGPList() {
  const [tokens, setTokens] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const res = await axios.get('/api/dgp');
      setTokens(res.data);
    } catch (err) {
      console.error("Failed to fetch DGP tokens", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="shadow-sm mt-4">
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">DGP Token Registry (Managed Assets)</h5>
        <InputGroup size="sm" style={{ width: '250px' }}>
          <Form.Control
            placeholder="Search tokens..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Card.Header>
      <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {loading ? (
          <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
        ) : (
          <Table striped bordered hover responsive size="sm">
            <thead className="sticky-top bg-white">
              <tr>
                <th>Symbol</th>
                <th>Asset Name</th>
                <th>Price (USD)</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.length > 0 ? filteredTokens.map((token) => (
                <tr key={token._id}>
                  <td><strong>{token.symbol}</strong></td>
                  <td>{token.name}</td>
                  <td>${token.price.toFixed(2)}</td>
                  <td><Badge bg={token.status === 'active' ? 'success' : 'warning'}>{token.status}</Badge></td>
                  <td>{new Date(token.lastUpdated).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="text-center">No tokens found.</td></tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default DGPList;
