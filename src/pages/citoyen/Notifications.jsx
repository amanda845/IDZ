import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CitoyenLayout from '../../components/CitoyenLayout';
import { api } from '../../services/api';
import { Download, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CitoyenNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/citoyen/login');
      return;
    }
    const fetchNotifs = async () => {
      try {
        const data = await api.getNotifications(user.id);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, [user, navigate]);

  const [showCause, setShowCause] = useState({});

  const toggleCause = (id) => {
    setShowCause(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownload = (fileUrl, docName) => {
    if (fileUrl) {
      const fullUrl = fileUrl.startsWith('http') ? fileUrl : `http://localhost:5002${fileUrl}`;
      window.open(fullUrl, '_blank');
    } else {
      alert(`Simulation: Téléchargement de "${docName}"...`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      alert("Erreur lors de la suppression");
    }
  };

  if (!user) return null;

  return (
    <CitoyenLayout>
      <div className="p-8 max-w-3xl">
        <h1 className="text-2xl font-heading font-bold text-idz-soot mb-1">
          Mes notifications 👋
        </h1>
        <div className="w-16 h-0.5 bg-idz-action mt-1 mb-8 rounded-full" />

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Chargement...</div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`group relative rounded-soft p-6 flex flex-col gap-4 transition-all hover:translate-x-1 ${
                  notif.type === 'accepted'
                    ? 'bg-green-50 border border-green-100 shadow-sm'
                    : 'bg-red-50 border border-red-100 shadow-sm'
                }`}
              >
                {/* Delete button */}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(notif.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/0 hover:bg-white shadow-none hover:shadow-md transition-all text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
                  title="Supprimer la notification"
                >
                  <X size={16} />
                </button>

                <div className="flex items-start justify-between gap-4 w-full pr-6">
                  <div className="flex-1">
                    <p className={`font-heading font-bold text-base mb-1 ${notif.type === 'accepted' ? 'text-green-800' : 'text-red-800'}`}>
                      {notif.document}
                    </p>
                    <p className={`font-medium text-sm ${notif.type === 'accepted' ? 'text-green-700/80' : 'text-red-700/80'}`}>
                      {notif.message}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {notif.type === 'accepted' ? (
                      <button 
                        onClick={() => handleDownload(notif.fileUrl, notif.document)}
                        className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md active:scale-95"
                      >
                        <Download size={14} />
                        Télécharger ici
                      </button>
                    ) : (
                      <button 
                        onClick={() => toggleCause(notif.id)}
                        className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md active:scale-95"
                      >
                        <AlertCircle size={14} />
                        Voir la cause
                      </button>
                    )}
                  </div>
                </div>

                {/* Conditional rejection reason */}
                {notif.type === 'rejected' && showCause[notif.id] && (
                  <div className="mt-2 bg-white/80 border border-red-100 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2">Motif du rejet :</p>
                    <p className="text-sm text-red-700 font-medium italic">"{notif.motif || 'Aucun motif spécifié.'}"</p>
                  </div>
                )}
              </div>
            ))
          )}

          {!loading && notifications.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">
              Aucune notification pour le moment.
            </div>
          )}
        </div>
      </div>
    </CitoyenLayout>
  );
}
