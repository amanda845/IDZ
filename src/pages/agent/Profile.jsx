import AgentLayout from '../../components/AgentLayout';
import { mockAgent } from '../../data/mockData';

export default function AgentProfile() {
  const initials = `${mockAgent.prenom[0]}${mockAgent.nom[0]}`;

  return (
    <AgentLayout>
      <div className="p-8 max-w-2xl">
        <h1 className="text-2xl font-heading font-bold text-idz-soot mb-1">Mon Profil Agent</h1>
        <p className="text-sm text-gray-400 mb-8">Informations professionnelles de l'agent APC</p>

        {/* Avatar + Name */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full border-2 border-idz-forest flex items-center justify-center text-xl font-heading font-bold text-idz-forest bg-idz-forest/10">
            {initials}
          </div>
          <div>
            <p className="font-heading font-bold text-idz-soot text-base">{mockAgent.nom} {mockAgent.prenom}</p>
            <p className="text-sm text-gray-400">{mockAgent.commune}</p>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-white border border-gray-100 rounded-soft p-6 shadow-sm space-y-4">
          {[
            { label: 'Nom complet',     value: `${mockAgent.nom} ${mockAgent.prenom}` },
            { label: 'Matricule Agent', value: mockAgent.id, mono: true },
            { label: 'Commune / APC',   value: mockAgent.commune },
            { label: 'Email Officiel',  value: mockAgent.email },
            { label: 'Statut Compte',   value: 'Certifié ✓', cls: 'text-idz-action font-bold' },
          ].map(({ label, value, mono, cls }) => (
            <div key={label} className="flex items-start gap-4">
              <span className="text-sm text-gray-400 w-48 shrink-0">{label}</span>
              <span className={`text-sm font-semibold ${cls || 'text-idz-soot'} ${mono ? 'font-mono' : ''}`}>{value}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-soft flex items-start gap-3">
            <span className="text-amber-600 text-lg">⚠️</span>
            <p className="text-xs text-amber-700 leading-relaxed">
                <span className="font-bold">Note de sécurité :</span> En tant qu'agent APC, vos accès sont tracés. Assurez-vous de verrouiller votre session avant de quitter votre poste.
            </p>
        </div>
      </div>
    </AgentLayout>
  );
}
