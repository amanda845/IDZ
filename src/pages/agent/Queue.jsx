import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentLayout from '../../components/AgentLayout';
import { api } from '../../services/api';
import { Search, Eye } from 'lucide-react';

export default function AgentQueue() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await api.getAllRequests();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching queue:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredRequests = requests.filter(req => 
    req.statut === 'pending' && (
      (req.userId && req.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.document && req.document.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.id && req.id.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  return (
    <AgentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-idz-soot">
            File d'attente — Demandes citoyennes
          </h1>
          <div className="mt-4 max-w-lg relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Recherche par ID ou document..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-soft shadow-sm border border-gray-100 overflow-hidden">
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
                  {filteredRequests.map((req) => (
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
