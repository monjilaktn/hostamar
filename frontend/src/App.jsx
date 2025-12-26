import { useState } from 'react'
import { Container, Navbar, Nav, Card, Button, Form, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from './hooks/useAuth'
import LoginForm from './components/LoginForm'
import SystemStatus from './components/SystemStatus'
import DGPList from './components/DGPList'
import DashboardLayout from './components/DashboardLayout'
import CRMView from './components/CRMView'
import LeadCaptureForm from './components/LeadCaptureForm'

function App() {
  const { user, login, logout, isAuthenticated } = useAuth()
...
  if (!isAuthenticated) {
    return (
      <Container className="py-5" style={{ minHeight: '100vh' }}>
        <Row className="justify-content-center align-items-center">
          <Col md={6}>
            <div className="text-center mb-4">
              <h1 className="display-4 fw-bold text-primary">Hostamar</h1>
              <p className="lead">Enterprise AI & Asset Management</p>
            </div>
            <LoginForm onLogin={login} />
          </Col>
          <Col md={6}>
            <LeadCaptureForm />
          </Col>
        </Row>
      </Container>
    )
  }
...
}


export default App