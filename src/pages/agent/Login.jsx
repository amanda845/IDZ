import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import agentBg from '../../assets/agent_bg.jpg';
import { ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const AGENT_BG = agentBg;

export default function AgentLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1); // 1: Credentials, 2: 2FA
  const [formData, setFormData] = useState({ email: '', password: '', code: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Preliminary check: see if agent exists
      const agent = await api.loginAgent(formData.email, formData.password);
      // If OK, go to 2FA step (simulation)
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Re-login to get data and verify 2FA (simulated code 1234)
      if (formData.code !== '1234') {
        throw new Error("Code 2FA incorrect (utilisez 1234 for demo)");
      }
      const agent = await api.loginAgent(formData.email, formData.password);
      login({ ...agent, type: 'agent' });
      navigate('/agent/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-body bg-idz-alabaster">
      {/* ── Form Side ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 relative">
        <Link to="/" className="absolute top-5 right-6 flex items-center gap-1.5 text-xs text-gray-400 hover:text-idz-forest transition-colors">
          <ArrowLeft size={13} /> Retour à l'accueil
        </Link>

        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <div className="bg-idz-forest p-3 rounded-xl shadow-lg">
              <ShieldCheck className="text-white" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-soft shadow-xl border border-gray-100 p-8">
            <h1 className="text-xl font-heading font-bold text-idz-forest text-center mb-1">
              Espace Agent APC
            </h1>
            <p className="text-xs text-gray-400 text-center mb-6">
              Connexion sécurisée - Authentification 2FA
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md flex items-start gap-2 text-red-600 text-[10px]">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-idz-action text-white' : 'bg-gray-100 text-gray-400'}`}>
                {step > 1 ? <CheckCircle2 size={12} /> : '1'}
              </div>
              <div className={`h-0.5 w-12 rounded-full ${step > 1 ? 'bg-idz-action' : 'bg-gray-100'}`} />
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 2 ? 'bg-idz-action text-white' : 'bg-gray-100 text-gray-400'}`}>
                2
              </div>
            </div>

            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Email APC officiel</label>
                  <input
                    type="email"
                    placeholder="agent@commune-alger.dz"
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input-field"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full mt-2">
                  Continuer — Étape 2 / 2FA →
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4 text-center">
                <p className="text-xs text-gray-500 mb-4 font-bold uppercase tracking-wider">
                  ENTREZ le code a usage unique envoyer a Email APC officiel
                </p>
                <div className="flex justify-center">
                  <input
                    type="text"
                    placeholder="••••••••"
                    className="input-field text-center font-mono tracking-[0.5em] text-lg max-w-[200px]"
                    maxLength={8}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn-primary w-full mt-6">
                  Valider
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-400 hover:text-idz-forest transition-colors mt-4"
                >
                  ← Retour à l'étape 1
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Photo Side ───────────────────────────────────── */}
      <div className="hidden lg:block w-1/2 relative">
        <img
          src={AGENT_BG}
          alt="Grande Poste d'Alger"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-idz-forest/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-soft p-6 max-w-md">
            <h2 className="text-lg font-heading font-bold mb-2">Sécurité Gouvernementale</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              L'accès à cette interface est strictement réservé aux agents de l'État. Toute tentative d'accès non autorisée est passible de poursuites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
