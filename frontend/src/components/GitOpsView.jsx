import React, { useEffect, useState } from 'react';
import { Table, Card, Badge, Row, Col, ListGroup } from 'react-bootstrap';
import axios from 'axios';

function GitOpsView() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeployments();
    const interval = setInterval(fetchDeployments, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const fetchDeployments = async () => {
    try {
      const res = await axios.get('/crm/deployments/');
      setDeployments(res.data);
    } catch (err) {
      console.error("Failed to fetch deployments", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="mb-4 text-primary">Git Ops & AI Automated Deployment</h4>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm border-0 bg-dark text-white">
            <Card.Body>
              <h6>Live Status</h6>
              <h3 className="text-success">● OPERATIONAL</h3>
              <p className="small mb-0 text-muted">Last sync: {new Date().toLocaleTimeString()}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="shadow-sm border-0 border-start border-4 border-info">
            <Card.Body>
              <h6>AI Audit (DeepSeek-R1) Insight</h6>
              {deployments.length > 0 ? (
                <p className="mb-0"><strong>Latest Scan:</strong> {deployments[0].ai_audit_result}</p>
              ) : (
                <p className="mb-0">No scans completed yet.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Header className="bg-white">Recent Deployments</Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Repository</th>
                <th>Commit</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {deployments.length > 0 ? deployments.map((deploy) => (
                <tr key={deploy.id}>
                  <td><strong>{deploy.repo_name}</strong></td>
                  <td className="text-muted">{deploy.commit_message}</td>
                  <td>
                    <Badge bg={
                      deploy.status === 'SUCCESS' ? 'success' :
                      deploy.status === 'FAILED' ? 'danger' : 'warning'
                    }>
                      {deploy.status}
                    </Badge>
                  </td>
                  <td className="small">{new Date(deploy.deployed_at).toLocaleString()}</td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="text-center">No deployment history found.</td></tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default GitOpsView;
