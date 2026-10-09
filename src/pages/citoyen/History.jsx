import { useState, useEffect } from 'react';
import CitoyenLayout from '../../components/CitoyenLayout';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Download, FileText, Calendar, Search } from 'lucide-react';

export default function CitoyenHistory() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      try {
        const data = await api.getHistory(user.id);
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleDownload = (fileUrl) => {
    if (!fileUrl) return;
    const fullUrl = fileUrl.startsWith('http') ? fileUrl : `http://localhost:5002${fileUrl}`;
    window.open(fullUrl, '_blank');
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.requestId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CitoyenLayout>
      <div className="p-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-idz-soot">Historique des Documents</h1>
            <p className="text-sm text-gray-400">Retrouvez tous vos documents officiels délivrés</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un document..." 
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-idz-action/20 focus:border-idz-action outline-none w-full md:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-soft border border-dashed border-gray-200">
            <div className="w-10 h-10 border-4 border-idz-action border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-sm">Chargement de votre historique...</p>
          </div>
        ) : filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="bg-white rounded-soft p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-idz-action/10 rounded-lg text-idz-action">
                    <FileText size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    #{doc.requestId}
                  </span>
                </div>
                
                <h3 className="font-heading font-bold text-idz-soot mb-1 group-hover:text-idz-action transition-colors">
                  {doc.name}
                </h3>
                
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                  <Calendar size={14} />
                  Délivré le {doc.date}
                </div>

                <button 
                  onClick={() => handleDownload(doc.fileUrl)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-idz-forest text-white rounded-lg text-sm font-semibold hover:bg-idz-soot transition-colors shadow-sm"
                >
                  <Download size={16} />
                  Télécharger le PDF
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-soft border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <FileText size={32} />
            </div>
            <h3 className="text-gray-600 font-bold mb-1">Aucun document trouvé</h3>
            <p className="text-gray-400 text-sm">Vos documents acceptés apparaîtront ici.</p>
          </div>
        )}
      </div>
    </CitoyenLayout>
  );
}
