import React, { useState } from 'react';
import { Table, Card, Form, InputGroup } from 'react-bootstrap';
import dgpData from '../data/hundred_dgp.json';

function DGPList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTokens = dgpData.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="shadow-sm mt-4">
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">DGP Token Registry (100 Managed Assets)</h5>
        <InputGroup size="sm" style={{ width: '250px' }}>
          <Form.Control
            placeholder="Search tokens..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Card.Header>
      <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <Table striped bordered hover responsive size="sm">
          <thead className="sticky-top bg-white">
            <tr>
              <th>ID</th>
              <th>Symbol</th>
              <th>Asset Name</th>
              <th>Live Price (DGP/USD)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTokens.map((token) => (
              <tr key={token.id}>
                <td>{token.id}</td>
                <td><strong>{token.symbol}</strong></td>
                <td>{token.name}</td>
                <td>${token.price.toFixed(2)}</td>
                <td><span className="text-success">● Active</span></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default DGPList;
