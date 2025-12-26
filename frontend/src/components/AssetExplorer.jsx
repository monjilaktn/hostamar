import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Form, InputGroup, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

function AssetExplorer() {
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [trxId, setTrxId] = useState('');

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await axios.get('/crm/assets/');
      setAssets(res.data);
    } catch (err) {
      console.error("Failed to fetch assets", err);
    }
  };

  const handlePurchase = (asset) => {
    setSelectedAsset(asset);
    setShowPayment(true);
  };

  const submitPayment = async () => {
    if (!trxId) return alert("Please enter Transaction ID");
    try {
        await axios.post('/crm/payments/', {
            trx_id: trxId,
            amount: selectedAsset.price,
            user_email: "user@example.com", // Replace with logged in user
            status: "PENDING"
        });
        alert("Payment Submitted! Verification in progress...");
        setShowPayment(false);
    } catch (e) {
        alert("Error submitting payment");
    }
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-primary">DGP Asset Explorer</h3>
        <InputGroup style={{ width: '300px' }}>
          <Form.Control 
            placeholder="Search Assets..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      <Row xs={1} md={2} lg={4} className="g-4">
        {filteredAssets.map((asset) => (
          <Col key={asset.id}>
            <Card className="h-100 shadow-sm border-0 hover-effect">
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <Badge bg="dark">{asset.symbol}</Badge>
                  <Badge bg="success">{asset.performance_score}% Perf</Badge>
                </div>
                <Card.Title>{asset.name}</Card.Title>
                <h4 className="my-3">${asset.price}</h4>
                <Button 
                    variant="outline-primary" 
                    className="w-100"
                    onClick={() => handlePurchase(asset)}
                >
                    Buy Asset
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Payment Modal */}
      <Modal show={showPayment} onHide={() => setShowPayment(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Purchase {selectedAsset?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please send <strong>${selectedAsset?.price}</strong> (BDT equivalent) to:</p>
          <h4 className="text-center text-primary my-3">01822417463 (Personal)</h4>
          <Form.Group>
            <Form.Label>Enter bKash TrxID</Form.Label>
            <Form.Control 
                type="text" 
                placeholder="e.g. 9G76..." 
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPayment(false)}>Close</Button>
          <Button variant="success" onClick={submitPayment}>Verify & Unlock</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AssetExplorer;
