import { useState } from 'react'
import { Container, Navbar, Nav, Card, Button, Form } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from './hooks/useAuth'
import LoginForm from './components/LoginForm'
import SystemStatus from './components/SystemStatus'
import DGPList from './components/DGPList'

function App() {
  const { user, login, logout, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('chat')
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSend = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const userMsg = { role: 'user', content: message }
    setChatHistory(prev => [...prev, userMsg])
    setLoading(true)
    
    try {
      const res = await axios.post('/api/ai/chat', {
        message: message,
        thread_id: "thread-" + user?.username
      })
      
      const aiMsg = { role: 'assistant', content: res.data.response || JSON.stringify(res.data) }
      setChatHistory(prev => [...prev, aiMsg])
    } catch (err) {
      const errorMsg = { role: 'system', content: 'Error: ' + (err.response?.data?.message || err.message) }
      setChatHistory(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
      setMessage('')
    }
  }

  if (!isAuthenticated) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <LoginForm onLogin={login} />
      </Container>
    )
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#" onClick={() => setActiveTab('chat')}>Hostamar AI</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => setActiveTab('chat')} active={activeTab === 'chat'}>Chat</Nav.Link>
            <Nav.Link onClick={() => setActiveTab('status')} active={activeTab === 'status'}>System Status</Nav.Link>
            <Nav.Link onClick={() => setActiveTab('dgp')} active={activeTab === 'dgp'}>DGP Assets</Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="me-3">
              Signed in as: <strong>{user?.username}</strong>
            </Navbar.Text>
            <Button variant="outline-light" size="sm" onClick={logout}>Logout</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {activeTab === 'chat' ? (
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Enterprise AI Assistant</h5>
            </Card.Header>
            <Card.Body style={{ height: '500px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
              {chatHistory.length === 0 && (
                <div className="text-center text-muted mt-5">
                  <p>Welcome, {user?.username}. How can I assist you with your infrastructure today?</p>
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`mb-3 ${msg.role === 'user' ? 'text-end' : ''}`}>
                  <div className={`d-inline-block p-3 rounded shadow-sm ${
                    msg.role === 'user' ? 'bg-primary text-white' : 
                    msg.role === 'system' ? 'bg-danger text-white' : 'bg-white border'
                  }`} style={{ maxWidth: '80%' }}>
                    <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
                    <div className="mt-1">{msg.content}</div>
                  </div>
                </div>
              ))}
              {loading && <div className="text-muted italic">AI is generating response...</div>}
            </Card.Body>
            <Card.Footer className="bg-white">
              <Form onSubmit={handleSend} className="d-flex gap-2">
                <Form.Control 
                  type="text" 
                  placeholder="Ask anything..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                  className="py-2"
                />
                <Button type="submit" variant="primary" disabled={loading} className="px-4">
                  Send
                </Button>
              </Form>
            </Card.Footer>
          </Card>
        ) : activeTab === 'status' ? (
          <SystemStatus />
        ) : (
          <DGPList />
        )}
      </Container>
    </>
  )
}

export default App