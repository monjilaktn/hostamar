import React, { useState } from 'react'
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from './hooks/useAuth'
import LoginForm from './components/LoginForm'
import SystemStatus from './components/SystemStatus'
import AssetExplorer from './components/AssetExplorer'
import DashboardLayout from './components/DashboardLayout'
import CRMView from './components/CRMView'
import LeadCaptureForm from './components/LeadCaptureForm'
import GitOpsView from './components/GitOpsView'

function App() {
...
      case 'status':
        return <SystemStatus />;
      case 'dgp':
        return <AssetExplorer />;
      case 'crm':
...
        return <CRMView />;
      case 'gitops':
        return <GitOpsView />;
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
