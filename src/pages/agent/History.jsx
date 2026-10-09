import { useState, useEffect } from 'react';
import AgentLayout from '../../components/AgentLayout';
import { api } from '../../services/api';
import { Search, CheckCircle, XCircle, Eye, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AgentHistory() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await api.getAllRequests();
        // Only show non-pending requests
        setRequests(data.filter(r => r.statut !== 'pending'));
      } catch (error) {
        console.error("Error fetching agent history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredRequests = requests.filter(req => 
    (req.userId && req.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (req.document && req.document.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (req.id && req.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AgentLayout>
      <div className="p-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-idz-soot">Historique des Traitements</h1>
            <p className="text-sm text-gray-400 font-medium">Archive de toutes les décisions prises (Acceptées / Rejetées)</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par ID ou document..." 
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-idz-action/20 focus:border-idz-action outline-none w-full md:w-72 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-soft shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-gray-400">Chargement de l'archive...</div>
            ) : filteredRequests.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">ID Demande</th>
                    <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-4">Document</th>
                    <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-4">Date Traitement</th>
                    <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-4">Statut FINAL</th>
                    <th className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-idz-soot">{req.id}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{req.userId}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 font-medium">{req.document}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                           <Calendar size={14} className="text-gray-300" />
                           {req.date}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {req.statut === 'accepted' ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                              <CheckCircle size={14} /> Acceptée
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                              <XCircle size={14} /> Rejetée
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => navigate(`/agent/demande/${req.id}`)}
                          className="bg-white border border-gray-200 hover:border-idz-action text-gray-600 hover:text-idz-action p-2 rounded-lg transition-all shadow-sm group"
                          title="Voir les détails"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-20 text-gray-400 bg-gray-50/30">
                <Clock size={40} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm">Aucun traitement trouvé dans l'historique.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}
