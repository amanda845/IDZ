import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import landingBg from '../assets/landing_bg.jpg';
import { User, ShieldCheck, Zap, Globe, FileText, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export default function Landing() {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="min-h-screen bg-idz-alabaster font-body flex flex-col" dir={dir}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="absolute top-0 left-0 w-full z-20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="bg-idz-forest text-white font-heading font-bold text-sm w-10 h-10 flex items-center justify-center rounded-md shadow">
            IDZ
          </div>
          <div>
            <div className="text-white font-heading font-bold text-base leading-tight drop-shadow">IDZ</div>
            <div className="text-white/70 text-xs hidden sm:block">Services Communaux Algériens</div>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex gap-1 bg-black/30 backdrop-blur-md p-1 rounded-full border border-white/20">
          {['ar', 'fr', 'en'].map((lng) => (
            <button
              key={lng}
              onClick={() => i18n.changeLanguage(lng)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                i18n.language === lng
                  ? 'bg-idz-action text-white shadow'
                  : 'text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              {lng.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative h-[62vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        {/* Background image - Algeria Martyrs' Memorial */}
        <div className="absolute inset-0">
          <img
            src={landingBg}
            alt="Mémorial des Martyrs, Alger"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.style.background = 'linear-gradient(135deg, #294411 0%, #1a2d0a 100%)';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <div className="inline-flex items-center gap-2 bg-idz-action/20 border border-idz-action/40 backdrop-blur-sm text-idz-action text-xs font-semibold px-3 py-1 rounded-full mb-5">
            🇩🇿 Plateforme officielle — Administration Numérique Algérienne
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-5 leading-tight drop-shadow-xl">
            {t('landing.title')}
          </h1>
          <p className="text-base md:text-lg text-white/85 mb-8 max-w-2xl mx-auto drop-shadow">
            {t('landing.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/citoyen/login"
              className="inline-flex items-center justify-center gap-2 bg-idz-action hover:bg-[#5a9118] text-white font-heading font-semibold px-8 py-3.5 rounded-soft transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
              <User size={18} />
              {t('landing.citizen')}
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/agent/login"
              className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm border-2 border-white/60 hover:bg-white hover:text-idz-forest text-white font-heading font-semibold px-8 py-3.5 rounded-soft transition-all duration-200 text-sm"
            >
              <ShieldCheck size={18} />
              {t('landing.agent')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ─────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 py-6 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: '58', label: t('landing.stats.wilayas') },
            { value: '5',  label: t('landing.stats.types') },
            { value: '24h',label: t('landing.stats.delay') },
            { value: '100%',label: t('landing.stats.secure') },
          ].map((s) => (
            <div key={s.value} className="py-2">
              <div className="text-2xl font-heading font-bold text-idz-forest">{s.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Portal Cards ────────────────────────────────────── */}
      <section className="py-16 px-4 bg-idz-alabaster">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center text-idz-forest mb-3">
            {t('landing.portals')}
          </h2>
          <p className="text-center text-gray-500 text-sm mb-10">Sélectionnez votre profil pour accéder à votre espace personnel</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Citizen Card */}
            <div className="bg-white rounded-soft p-8 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="w-12 h-12 bg-idz-action/10 rounded-xl flex items-center justify-center mb-6 text-idz-action group-hover:bg-idz-action group-hover:text-white transition-all duration-200">
                <User size={24} />
              </div>
              <h3 className="text-xl font-heading font-bold text-idz-forest mb-4">{t('landing.citizenSpace')}</h3>
              <ul className="space-y-2.5 mb-7 text-gray-600 text-sm">
                {[
                  'Extrait de naissance (12S) & (12)',
                  'Fiche familiale & Acte de mariage',
                  'Certificat de résidence',
                  'Suivi de demande & QR Code',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle size={15} className="text-idz-action mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 mb-6">Demandez vos documents en ligne, suivez leur statut en temps réel et recevez vos documents officiels.</p>
              <Link
                to="/citoyen/login"
                className="block w-full text-center btn-primary text-sm"
              >
                Accéder à l'espace citoyen →
              </Link>
            </div>

            {/* Agent Card */}
            <div className="bg-white rounded-soft p-8 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="w-12 h-12 bg-idz-forest/10 rounded-xl flex items-center justify-center mb-6 text-idz-forest group-hover:bg-idz-forest group-hover:text-white transition-all duration-200">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-heading font-bold text-idz-forest mb-4">{t('landing.agentSpace')}</h3>
              <ul className="space-y-2.5 mb-7 text-gray-600 text-sm">
                {[
                  "File d'attente centralisée",
                  'Traitement des pièces jointes',
                  'Validation avec signature (QR)',
                  'Authentification sécurisée 2FA',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle size={15} className="text-idz-forest mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 mb-6">Gérez les demandes de votre commune, vérifiez les pièces justificatives et délivrez les documents.</p>
              <Link
                to="/agent/login"
                className="block w-full text-center btn-outline-forest text-sm"
              >
                Connexion agent APC →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── C'est quoi IDZ ──────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-red-600 mb-6">{t('landing.whatIsIdz')}</h2>
          <p className="text-lg text-gray-700 leading-relaxed font-medium">
            IDZ est une plateforme d'administration numérique sécurisée conçue pour simplifier la vie des citoyens.
            Elle permet d'accéder à l'ensemble des services communaux en ligne, de soumettre des demandes administratives
            et de suivre leur traitement en temps réel, sans avoir à se déplacer.
          </p>
          <div className="mt-8 p-5 bg-idz-alabaster rounded-soft border border-gray-200 text-sm text-gray-600 italic">
            "IDZ n'est pas seulement une plateforme — c'est une réponse concrète au besoin d'efficacité et d'accessibilité dans les quartiers des Algériens."
          </div>
        </div>
      </section>

      {/* ── Pourquoi IDZ ────────────────────────────────────── */}
      <section className="py-16 bg-idz-forest text-white px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">{t('landing.whyIdz')}</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Zap,        title: 'Traitement rapide',       desc: 'Demande traitée en moins de 24h.' },
              { icon: ShieldCheck,title: 'Sécurité maximale',       desc: 'TLS 1.2, 2FA, QR Code sécurisé.' },
              { icon: Globe,      title: 'Multilingue (FR, AR, EN)',desc: 'Interface adaptée à tous.' },
              { icon: Clock,      title: '24h/24 7j/7',            desc: 'Plateforme toujours disponible.' },
              { icon: FileText,   title: 'Documents officiels',     desc: "Authentification par l'État algérien." },
              { icon: ShieldCheck,title: 'Traçabilité totale',      desc: 'Historique de vos démarches.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/10 backdrop-blur-sm p-5 rounded-soft border border-white/15 flex gap-4 hover:bg-white/15 transition-all duration-200">
                <div className="bg-white text-idz-action p-2.5 rounded-lg h-fit shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base mb-1">{title}</h4>
                  <p className="text-white/65 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-[#1a2d0a] text-white/50 text-center py-6 mt-auto">
        <p className="text-xs">© 2026 IDZ — Système des Services d'État Civil en Algérie — V2.1.4</p>
        <p className="text-xs mt-1 text-white/30">Ministère de l'Intérieur et des Collectivités Locales</p>
      </footer>
    </div>
  );
}
