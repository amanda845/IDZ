import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, PlusCircle, Bell, User, LogOut, Menu, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function CitoyenLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifCount, setNotifCount] = useState(0);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const initials = `${user.prenom[0]}${user.nom ? user.nom[0] : ''}`;

  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      try {
        const data = await api.getNotifications(user.id);
        setNotifCount(data.length);
      } catch (e) {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [user]);

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
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold">{user.prenom} {user.nom || ''}</div>
            <div className="text-xs text-white/60">Commune d'{user.commune || 'Alger'}</div>
          </div>
          <div className="w-9 h-9 bg-idz-action rounded-full flex items-center justify-center text-white font-bold text-sm font-heading">
            {initials}
          </div>
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
            </div>

          <nav className="flex flex-col gap-1 flex-1 mt-3">
            <NavLink
              to="/citoyen/dashboard"
              className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <FileText size={16} />
              {t('nav.myRequests')}
            </NavLink>
            <NavLink
              to="/citoyen/nouvelle-demande"
              className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <PlusCircle size={16} />
              {t('nav.newDoc')}
            </NavLink>
            <NavLink
              to="/citoyen/notifications"
              className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <div className="relative">
                <Bell size={16} />
                {notifCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                    {notifCount}
                  </span>
                )}
              </div>
              {t('nav.notifications')}
            </NavLink>
            <NavLink
              to="/citoyen/historique"
              className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <History size={16} />
              Historique
            </NavLink>
            <NavLink
              to="/citoyen/profil"
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
