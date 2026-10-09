import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ListOrdered, Clock, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function AgentLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const requests = await api.getAllRequests();
        setPendingCount(requests.filter(r => r.statut === 'pending').length);
      } catch (e) {}
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-idz-alabaster overflow-hidden">
      {/* Top Header */}
      <header className="bg-idz-forest text-white flex items-center justify-between px-6 py-3 z-20 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/90 hover:text-white"
            title="Toggle Menu"
          >
            <Menu size={22} />
          </button>
          <div className="bg-idz-action text-white font-bold font-heading text-sm w-9 h-9 flex items-center justify-center rounded-md ml-1">
            IDZ
          </div>
          <div>
            <div className="font-heading font-bold text-sm leading-tight">IDZ</div>
            <div className="text-white/60 text-xs">Services Communaux Algériens</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right leading-tight">
            <div className="font-semibold text-white">{user.prenom} {user.nom}</div>
            <div className="text-[10px] text-white/60 font-medium uppercase tracking-wider">{user.commune}</div>
          </div>
          <span className="text-white/40">|</span>
          <span className="bg-white/10 border border-white/20 rounded-md px-2 py-0.5 text-xs font-semibold">2FA ✓</span>
          <button
            onClick={() => {
                logout();
                navigate('/');
            }}
            className="text-white/70 hover:text-white transition-colors text-xs"
          >
            ← Déconnexion
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`bg-idz-forest flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
            isSidebarOpen ? 'w-56' : 'w-0 opacity-0'
          }`}
        >
          <div className="w-56 py-4 px-3 flex flex-col h-full min-h-0">
            <div className="mb-2 shrink-0">
              <span className="flex items-center gap-1.5 text-xs text-green-400 font-semibold px-2 py-1">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                CONNECTÉ
              </span>
              <span className="text-xs text-amber-400 font-medium px-2">{pendingCount} demandes en attente</span>
            </div>

          <nav className="flex flex-col gap-1 flex-1 mt-3">
            <NavLink
              to="/agent/dashboard"
              className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <LayoutDashboard size={16} />
              {t('nav.dashboard')}
            </NavLink>
            <NavLink
              to="/agent/file-attente"
              className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <ListOrdered size={16} />
              {t('nav.queue')}
            </NavLink>
            <NavLink
              to="/agent/historique"
              className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <Clock size={16} />
              Historique
            </NavLink>
            <NavLink
              to="/agent/profil"
              className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <User size={16} />
              {t('nav.profile')}
            </NavLink>
          </nav>

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 text-sm font-medium transition-colors shrink-0"
            >
              <LogOut size={15} />
              {t('nav.logout')}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
