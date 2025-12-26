import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Table, ProgressBar } from 'react-bootstrap';
import axios from 'axios';

function SystemStatus() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await axios.get('/api/system/status');
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch system status", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return <div className="text-center p-3">Loading system metrics...</div>;

  return (
    <div className="mt-4">
      <h4 className="mb-3">System Overview</h4>
      
      {/* Uptime & Performance */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100 text-center border-success">
            <Card.Body>
              <Card.Title>System Status</Card.Title>
              <h2 className="text-success">{data.status}</h2>
              <Card.Text className="mb-0">Uptime: {(data.uptime / 3600).toFixed(2)} hours</Card.Text>
              <Card.Text><strong>Managed Assets: {data.managed_assets} DGP</strong></Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Performance Metrics</Card.Title>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>CPU Usage</span>
                  <span>{data.performance.cpu}%</span>
                </div>
                <ProgressBar variant="info" now={data.performance.cpu} />
              </div>
              <div>
                <div className="d-flex justify-content-between">
                  <span>Memory Usage</span>
                  <span>{data.performance.memory}%</span>
                </div>
                <ProgressBar variant="warning" now={data.performance.memory} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Security Audit */}
        <Col md={6}>
          <Card>
            <Card.Header>Security Audit</Card.Header>
            <Table striped bordered hover size="sm" className="mb-0">
              <thead>
                <tr>
                  <th>Check</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.security.map((item) => (
                  <tr key={item.id}>
                    <td>{item.check}</td>
                    <td><Badge bg="success">{item.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>

        {/* Recent Changes */}
        <Col md={6}>
          <Card>
            <Card.Header>Recent Changes Log</Card.Header>
            <Table striped bordered hover size="sm" className="mb-0">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>User</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_changes.map((change) => (
                  <tr key={change.id}>
                    <td>{change.action}</td>
                    <td>{change.user}</td>
                    <td style={{fontSize: '0.85em'}}>
                      {new Date(change.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default SystemStatus;
