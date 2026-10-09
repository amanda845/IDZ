import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import CitoyenLogin from './pages/citoyen/Login';
import CitoyenDashboard from './pages/citoyen/Dashboard';
import NewRequest from './pages/citoyen/NewRequest';
import CitoyenNotifications from './pages/citoyen/Notifications';
import CitoyenHistory from './pages/citoyen/History';
import CitoyenProfile from './pages/citoyen/Profile';
import AgentLogin from './pages/agent/Login';
import AgentDashboard from './pages/agent/Dashboard';
import AgentQueue from './pages/agent/Queue';
import AgentRequestDetail from './pages/agent/RequestDetail';
import AgentHistory from './pages/agent/History';
import AgentProfile from './pages/agent/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Citizen routes */}
        <Route path="/citoyen/login" element={<CitoyenLogin />} />
        <Route path="/citoyen/dashboard" element={<CitoyenDashboard />} />
        <Route path="/citoyen/nouvelle-demande" element={<NewRequest />} />
        <Route path="/citoyen/notifications" element={<CitoyenNotifications />} />
        <Route path="/citoyen/historique" element={<CitoyenHistory />} />
        <Route path="/citoyen/profil" element={<CitoyenProfile />} />

        {/* Agent routes */}
        <Route path="/agent/login" element={<AgentLogin />} />
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
        <Route path="/agent/file-attente" element={<AgentQueue />} />
        <Route path="/agent/demande/:id" element={<AgentRequestDetail />} />
        <Route path="/agent/historique" element={<AgentHistory />} />
        <Route path="/agent/profil" element={<AgentProfile />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
