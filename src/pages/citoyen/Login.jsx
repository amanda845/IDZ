import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import citoyenBg from '../../assets/citoyen_bg.jpg';
import { Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ALGERIA_PHOTO = citoyenBg;

export default function CitoyenLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tab, setTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  // Register form state
  const [regForm, setRegForm] = useState({ 
    prenom: '', 
    nom: '', 
    nin: '', 
    password: '', 
    email: '',
    commune: '',
    wilaya: 'Alger' // Default for now
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await api.loginCitizen(loginForm.email, loginForm.password);
      login({ ...user, type: 'citoyen' });
      navigate('/citoyen/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await api.registerCitizen(regForm);
      login({ ...user, type: 'citoyen' });
      navigate('/citoyen/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-body">
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 bg-idz-alabaster relative">
        <Link to="/" className="absolute top-5 right-6 flex items-center gap-1.5 text-xs text-gray-400 hover:text-idz-forest transition-colors">
          <ArrowLeft size={13} /> Retour à l'accueil
        </Link>

        <div className="flex items-center gap-2 mb-8">
          <div className="bg-idz-forest text-white font-heading font-bold text-sm w-9 h-9 flex items-center justify-center rounded-md">IDZ</div>
        </div>

        <div className="w-full max-w-sm bg-white rounded-soft shadow-lg border border-gray-100 p-8">
          <h1 className="text-xl font-heading font-bold text-idz-forest text-center mb-1">
            {tab === 'login' ? 'Connexion Citoyen' : 'Inscription Citoyen'}
          </h1>
          <p className="text-xs text-gray-400 text-center mb-4">
            {tab === 'login' ? 'Accédez à votre espace personnel sécurisé' : 'Simulation du registre national (NIN requis)'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md flex items-start gap-2 text-red-600 text-[10px]">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex rounded-soft border border-gray-200 overflow-hidden mb-6">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold transition-all ${tab === 'login' ? 'bg-idz-forest text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              Connexion
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold transition-all ${tab === 'register' ? 'bg-idz-forest text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              Inscription
            </button>
          </div>

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={loginForm.email}
                  onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                    className="input-field pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button disabled={loading} type="submit" className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
                {loading ? 'Connexion...' : 'Se connecter →'}
              </button>
              <p className="text-center text-xs text-idz-action hover:underline cursor-pointer mt-4">
                Mot de passe oublié / Aide
              </p>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Prénom</label>
                  <input type="text" placeholder="Ex: Amina" className="input-field" required
                    value={regForm.prenom} onChange={e => setRegForm({...regForm, prenom: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nom</label>
                  <input type="text" placeholder="Ex: Benali" className="input-field" required
                    value={regForm.nom} onChange={e => setRegForm({...regForm, nom: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Votre Commune</label>
                <input type="text" placeholder="Ex: Hussein Dey" className="input-field" required
                  value={regForm.commune} onChange={e => setRegForm({...regForm, commune: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">NIN (18 chiffres)</label>
                <input type="text" placeholder="123456789123456789" maxLength={18} className="input-field font-mono" required
                  value={regForm.nin} onChange={e => setRegForm({...regForm, nin: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input type="email" placeholder="votre@email.com" className="input-field" required
                  value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Mot de passe</label>
                <input type="password" placeholder="••••••••" className="input-field" required
                  value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} />
              </div>
              <button disabled={loading} type="submit" className="btn-primary w-full mt-1 flex items-center justify-center gap-2">
                {loading ? 'Inscription...' : 'Confirmer l\'inscription →'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Right / Photo side ──────────────────────────── */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img
          src={ALGERIA_PHOTO}
          alt="Vue d'Alger"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.parentNode.style.background = 'linear-gradient(135deg, #294411, #1a2d0a)';
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-idz-forest/30" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-soft p-4 text-white">
            <p className="text-sm font-semibold">🔒 Connexion sécurisée</p>
            <p className="text-xs text-white/70 mt-1">Vos données sont protégées par chiffrement TLS 1.2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
