import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgentLayout from '../../components/AgentLayout';
import { api } from '../../services/api';
import { FileText, ArrowRight, X, Check, ArrowLeft } from 'lucide-react';

export default function AgentRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [motif, setMotif] = useState('');
  
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const all = await api.getAllRequests();
        const found = all.find(r => r.id === id);
        setRequest(found);
      } catch (error) {
        console.error("Error fetching request:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleAction = async (type) => {
    if (type === 'reject' && !motif) {
      alert('Veuillez saisir un motif de rejet.');
      return;
    }
    
    try {
      await api.updateRequestStatus(id, type === 'accept' ? 'accepted' : 'rejected', motif);
      alert(`Demande ${type === 'accept' ? 'acceptée' : 'rejetée'} avec succès.`);
      navigate('/agent/dashboard');
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading) return <AgentLayout><div className="p-8">Chargement...</div></AgentLayout>;
  if (!request) return <AgentLayout><div className="p-8">Demande non trouvée</div></AgentLayout>;

  return (
    <AgentLayout>
      <div className="p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
            >
              <ArrowLeft size={18} className="text-gray-500" />
            </button>
            <h1 className="text-2xl font-heading font-bold text-idz-soot">
              {request.id}
            </h1>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            request.statut === 'pending' ? 'bg-amber-100 text-amber-700' : 
            request.statut === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {request.statut === 'pending' ? 'En attente' : request.statut}
          </span>
        </div>

        {/* Citizen Info Card */}
        <div className="bg-white rounded-soft border border-gray-100 shadow-sm p-6 mb-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Informations de la demande</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8 text-sm">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1">ID Citoyen (UUID)</span>
              <span className="font-bold text-idz-soot">{request.userId}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1">Document</span>
              <span className="font-bold text-idz-soot">{request.document}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1">Date</span>
              <span className="font-bold text-idz-soot">{request.date}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1">Commune</span>
              <span className="font-bold text-idz-soot">{request.commune}</span>
            </div>
          </div>
        </div>

        {/* Pieces Justificatives */}
        {request.pieces && (
          <div className="bg-white rounded-soft border border-gray-100 shadow-sm p-6 mb-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Pièces justificatives</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {request.pieces.map((piece, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-soft bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg border border-gray-200">
                      <FileText size={18} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-idz-soot">{piece.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Justificatif</p>
                    </div>
                  </div>
                  <a 
                    href={piece.url.startsWith('http') ? piece.url : `http://localhost:5002${piece.url}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-idz-action font-bold hover:underline bg-white px-3 py-1.5 rounded-lg border border-idz-action/20 shadow-sm"
                  >
                    Voir le document
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decision Section */}
        {request.statut === 'pending' && (
          <div className="bg-white rounded-soft border border-gray-100 shadow-sm p-6 mb-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Décision</p>
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Motif de rejet (obligatoire si rejet) :</label>
              <textarea 
                rows={3}
                placeholder="Saisir un motif de rejet..."
                className="input-field resize-none"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => handleAction('reject')}
                className="flex-1 btn-outline-red flex items-center justify-center gap-2 py-4"
              >
                <X size={18} />
                Rejeter la demande
              </button>
              <button 
                onClick={() => handleAction('accept')}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-4"
              >
                <Check size={18} />
                Accepter & Générer QR Code
              </button>
            </div>
          </div>
        )}

        {/* Tip */}
        <div className="bg-idz-action/5 border border-idz-action/20 rounded-soft p-4 flex items-start gap-3">
          <div className="bg-white p-1.5 rounded-lg shadow-sm border border-idz-action/20">
            <FileText size={16} className="text-idz-action" />
          </div>
          <p className="text-[10px] text-idz-action leading-relaxed">
            <span className="font-bold">Info :</span> Les documents sont stockés en base de données SQLite pour une persistence complète.
          </p>
        </div>
      </div>
    </AgentLayout>
  );
}
