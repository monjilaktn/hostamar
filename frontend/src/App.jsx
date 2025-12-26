import { useState } from 'react'
import { Container, Navbar, Nav, Card, Button, Form } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from './hooks/useAuth'
import SystemStatus from './components/SystemStatus'
import DGPList from './components/DGPList'
import DashboardLayout from './components/DashboardLayout'
import CRMView from './components/CRMView'

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

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Enterprise AI Assistant</h5>
            </Card.Header>
            <Card.Body style={{ height: 'calc(100vh - 250px)', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
              {chatHistory.length === 0 && (
                <div className="text-center text-muted mt-5">
                  <p>Welcome, {user?.username}. Use the experts to manage your hosting business.</p>
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`mb-3 ${msg.role === 'user' ? 'text-end' : ''}`}>
                  <div className={`d-inline-block p-3 rounded shadow-sm ${
                    msg.role === 'user' ? 'bg-primary text-white' : 
                    msg.role === 'system' ? 'bg-danger text-white' : 'bg-white border'
                  }`} style={{ maxWidth: '80%', textAlign: 'left' }}>
                    <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
                    <div className="mt-1">{msg.content}</div>
                  </div>
                </div>
              ))}
              {loading && <div className="text-muted small">AI Agent is thinking...</div>}
            </Card.Body>
            <Card.Footer className="bg-white">
              <Form onSubmit={handleSend} className="d-flex gap-2">
                <Form.Control 
                  type="text" 
                  placeholder="Ask anything..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                />
                <Button type="submit" variant="primary" disabled={loading}>
                  Send
                </Button>
              </Form>
            </Card.Footer>
          </Card>
        );
      case 'status':
        return <SystemStatus />;
      case 'dgp':
        return <DGPList />;
      case 'crm':
        return <CRMView />;
      default:
        return <SystemStatus />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}


export default App