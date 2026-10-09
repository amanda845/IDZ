import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CitoyenLayout from '../../components/CitoyenLayout';
import { documentTypes } from '../../data/mockData';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Upload, CreditCard, Smartphone, ArrowLeft, Check } from 'lucide-react';

const STEPS = ['1- Nouveau document', '2- Justificatifs', '3- Paiement', '4- Confirmation'];

function StepBar({ current }) {
  return (
    <div className="flex gap-2 mb-8 flex-wrap">
      {STEPS.map((label, i) => (
        <div
          key={label}
          className={`px-4 py-2 rounded-soft text-xs font-semibold transition-all ${
            i === current ? 'step-active' : i < current ? 'bg-idz-action/20 text-idz-action' : 'step-inactive'
          }`}
        >
          {i < current ? '✓ ' : ''}{label}
        </div>
      ))}
    </div>
  );
}

export default function NewRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demRef, setDemRef] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/citoyen/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Step 1 — Document selection
  const Step1 = () => (
    <div>
      <h1 className="text-2xl font-heading font-bold text-idz-soot mb-1">Nouvelle demande</h1>
      <p className="text-sm text-gray-400 mb-6">Sélectionnez le document souhaité</p>
      <StepBar current={0} />

      <div className="bg-white rounded-soft border border-gray-100 shadow-sm overflow-hidden">
        {documentTypes.map((doc, i) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className={`flex items-center gap-4 px-6 py-4 cursor-pointer border-b border-gray-50 transition-all hover:bg-gray-50/70 ${
              selectedDoc?.id === doc.id ? 'bg-idz-action/5 border-l-4 border-l-idz-action' : ''
            }`}
          >
            <span className="text-xs text-gray-400 font-mono w-6">{String(i+1).padStart(2,'0')}</span>
            <span className="text-lg">{doc.emoji}</span>
            <div className="flex-1">
              <span className="text-sm font-medium text-idz-soot">{doc.label}</span>
              <span className="text-xs text-gray-400 ml-2">(Pièces : {doc.pieces})</span>
            </div>
            {selectedDoc?.id === doc.id && (
              <CheckCircle size={20} className="text-idz-action shrink-0" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={() => selectedDoc && setStep(1)}
          disabled={!selectedDoc}
          className={`btn-primary text-sm ${!selectedDoc ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Continuer →
        </button>
      </div>
    </div>
  );

  // Step 2 — Upload justificatifs
  const Step2 = () => (
    <div>
      <h1 className="text-2xl font-heading font-bold text-idz-soot mb-1">Nouvelle demande</h1>
      <p className="text-sm text-gray-400 mb-6">Téléversez vos pièces</p>
      <StepBar current={1} />

      <button onClick={() => setStep(0)} className="flex items-center gap-1.5 text-sm text-idz-action mb-6 hover:underline">
        <ArrowLeft size={14} /> Retour
      </button>

      {/* Pre-filled NIN data */}
      <div className="bg-gray-50 border border-gray-200 rounded-soft p-5 mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Données pré-remplies via NIN</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><span className="text-gray-400 block text-xs">Nom complet</span><span className="font-semibold text-idz-soot">{user.nom} {user.prenom}</span></div>
          <div><span className="text-gray-400 block text-xs">NIN</span><span className="font-mono font-semibold text-idz-action text-xs">{user.nin}</span></div>
          <div><span className="text-gray-400 block text-xs">Wilaya</span><span className="font-semibold text-idz-soot">{user.wilaya}</span></div>
          <div><span className="text-gray-400 block text-xs">Commune</span><span className="font-semibold text-idz-soot">{user.commune}</span></div>
        </div>
      </div>

      {/* Selected document */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-idz-soot mb-2">Document sélectionné</p>
        <div className="bg-gray-50 border border-gray-200 rounded-soft px-4 py-3 text-sm text-idz-soot font-medium">
          {selectedDoc?.label}
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-idz-soot mb-2">Pièces justificatives requises</p>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-soft p-10 cursor-pointer hover:border-idz-action hover:bg-idz-action/5 transition-all">
          <Upload size={28} className="text-gray-300 mb-3" />
          <span className="text-sm font-medium text-gray-500">Cliquez pour téléverser vos pièces</span>
          <span className="text-xs text-gray-400 mt-1">PDF / JPG — max 5 Mo par fichier</span>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => setUploadedFiles(Array.from(e.target.files))}
          />
        </label>
        {uploadedFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {uploadedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-md px-3 py-2 text-xs text-green-700">
                <CheckCircle size={14} /> {f.name} ({(f.size/1024/1024).toFixed(1)} Mo)
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button onClick={() => setStep(2)} className="btn-primary text-sm">
          Procéder au paiement →
        </button>
      </div>
    </div>
  );

  // Step 3 — Payment
  const Step3 = () => (
    <div>
      <h1 className="text-2xl font-heading font-bold text-idz-soot mb-1">Nouvelle demande</h1>
      <p className="text-sm text-gray-400 mb-6">Paiement</p>
      <StepBar current={2} />

      <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-idz-action mb-6 hover:underline">
        <ArrowLeft size={14} /> Retour
      </button>

      <div className="bg-white rounded-soft border border-gray-200 shadow-sm p-8 max-w-lg">
        <h2 className="text-base font-heading font-bold text-idz-soot text-center mb-1">Paiement en ligne</h2>
        <p className="text-xs text-gray-400 text-center mb-6">Choisissez votre méthode de paiement pour valider votre demande.</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { id: 'cib', label: 'CIB / SATIM', icon: CreditCard, emoji: '💳' },
            { id: 'baridi', label: 'BaridiMob', icon: Smartphone, emoji: '📱' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setPaymentMethod(m.id)}
              className={`flex flex-col items-center justify-center gap-2 border-2 rounded-soft p-6 transition-all ${
                paymentMethod === m.id
                  ? 'border-idz-forest bg-idz-forest/5 shadow-md'
                  : 'border-gray-200 hover:border-idz-action hover:bg-idz-action/5'
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-sm font-semibold text-idz-soot">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={async () => {
              if (paymentMethod) {
                setIsSubmitting(true);
                try {
                  const res = await api.createRequest({
                    document: selectedDoc.label,
                    commune: user.commune,
                    userId: user.id,
                    files: uploadedFiles // Send actual File objects
                  });
                  setDemRef(res.id);
                  setStep(3);
                } catch (err) {
                  alert("Erreur lors de la soumission");
                } finally {
                  setIsSubmitting(false);
                }
              } else {
                alert('Veuillez sélectionner une méthode de paiement.');
              }
            }}
            disabled={isSubmitting}
            className={`btn-primary text-sm ${isSubmitting ? 'opacity-50' : ''}`}
          >
            {isSubmitting ? 'Traitement...' : 'Confirmer et soumettre ma demande →'}
          </button>
        </div>
      </div>
    </div>
  );

  // Step 4 — Confirmation
  const Step4 = () => (
    <div>
      <h1 className="text-2xl font-heading font-bold text-idz-soot mb-1">Nouvelle demande</h1>
      <p className="text-sm text-gray-400 mb-6">Confirmation</p>
      <StepBar current={3} />

      <div className="bg-white rounded-soft border border-gray-100 shadow-sm p-12 max-w-lg text-center">
        <h2 className="text-xl font-heading font-bold text-idz-forest mb-4">Demande soumise avec succès</h2>
        <div className="w-14 h-14 bg-idz-action rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-white" />
        </div>
        <p className="text-sm text-gray-500 mb-2">Votre demande a été enregistrée avec l'identifiant :</p>
        <div className="text-2xl font-heading font-bold text-idz-soot mb-4 tracking-wider">{demRef}</div>
        <p className="text-xs text-gray-400 mb-8">
          Vous serez notifié par email lors du traitement de votre dossier par l'agent APC.
        </p>
        <button
          onClick={() => navigate('/citoyen/dashboard')}
          className="btn-primary inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={15} /> Retour au tableau
        </button>
      </div>
    </div>
  );

  const steps = [Step1, Step2, Step3, Step4];
  const CurrentStep = steps[step];

  return (
    <CitoyenLayout>
      <div className="p-8 max-w-4xl">
        <CurrentStep />
      </div>
    </CitoyenLayout>
  );
}
