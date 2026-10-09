import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AgentLayout from '../../components/AgentLayout';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Eye } from 'lucide-react';

export default function AgentDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.type !== 'agent') {
      navigate('/agent/login');
      return;
    }
    const fetchAll = async () => {
      try {
        const data = await api.getAllRequests();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching agent requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user, navigate]);

  if (!user) return null;

  const stats = {
    enAttente: requests.filter(r => r.statut === 'pending').length,
    traitees: requests.filter(r => r.statut !== 'pending').length,
    rejetees: requests.filter(r => r.statut === 'rejected').length,
    taux: requests.length > 0 ? Math.round((requests.filter(r => r.statut === 'accepted').length / requests.length) * 100) : 0
  };

  const statCards = [
    { label: 'En attente', value: stats.enAttente, color: 'text-orange-500', border: 'border-l-orange-500' },
    { label: "Traitées (Total)", value: stats.traitees, color: 'text-green-500', border: 'border-l-green-500' },
    { label: 'Rejetées', value: stats.rejetees, color: 'text-red-500', border: 'border-l-red-500' },
    { label: "Taux d'acceptation", value: `${stats.taux}%`, color: 'text-idz-forest', border: 'border-l-idz-forest' },
  ];

  return (
    <AgentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-idz-soot">
            Bonjour, Agent {user.prenom} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            APC de {user.commune} · Daïra de {user.daira} · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat) => (
            <div key={stat.label} className={`bg-white p-6 rounded-soft shadow-sm border border-gray-100 border-l-[6px] ${stat.border}`}>
              <div className={`text-4xl font-heading font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Queue */}
        <div className="bg-white rounded-soft shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-base font-heading font-bold text-idz-soot">
              File d'attente — Demandes citoyennes
            </h2>
            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {stats.enAttente} en attente
            </span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Chargement...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4 w-10">#</th>
                    <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-4">ID Demande</th>
                    <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-4">Document</th>
                    <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-4">Date</th>
                    <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-4">Statut</th>
                    <th className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.filter(r => r.statut === 'pending').map((req) => (
                    <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-400 font-mono">{req.num || req.id.slice(-3)}</td>
                      <td className="px-4 py-4 text-sm font-bold text-idz-soot">{req.id}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{req.document}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{req.date}</td>
                      <td className="px-4 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          req.statut === 'pending' ? 'bg-orange-100 text-orange-600' : 
                          req.statut === 'accepted' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {req.statut}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => navigate(`/agent/demande/${req.id}`)}
                          className="bg-idz-action hover:bg-[#5a9118] text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          <Eye size={14} />
                          Traiter
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}
