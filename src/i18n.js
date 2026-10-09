import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      landing: {
        title: "Vos services communaux en ligne",
        subtitle: "Demandez vos documents d'état civil sans vous déplacer à votre commune.",
        citizen: "Je suis citoyen",
        agent: "Je suis agent APC",
        stats: {
          wilayas: "Wilayas couvertes",
          types: "Types de documents",
          delay: "Délai de traitement",
          secure: "Sécurisé",
        },
        portals: "Choisissez votre espace",
        whatIsIdz: "C'est quoi IDZ ?",
        whyIdz: "Pourquoi IDZ ?",
        citizenSpace: "Espace Citoyen",
        agentSpace: "Espace Agent APC",
      },
      nav: {
        myRequests: "Mes demandes",
        newDoc: "Nouveau document",
        notifications: "Notifications",
        profile: "Mon profil",
        logout: "Déconnexion",
        dashboard: "Tableau de bord",
        queue: "File d'attente",
        history: "Historique",
      },
      status: {
        pending: "En attente",
        accepted: "Acceptée ✓",
        rejected: "Rejetée ✗",
      },
    }
  },
  ar: {
    translation: {
      landing: {
        title: "خدماتك البلدية عبر الإنترنت",
        subtitle: "اطلب وثائق الحالة المدنية دون التنقل إلى بلديتك.",
        citizen: "أنا مواطن",
        agent: "أنا موظف بلدية",
        stats: {
          wilayas: "ولاية مشمولة",
          types: "أنواع الوثائق",
          delay: "مدة المعالجة",
          secure: "آمن",
        },
        portals: "اختر فضاءك",
        whatIsIdz: "ما هو IDZ ؟",
        whyIdz: "لماذا IDZ ؟",
        citizenSpace: "فضاء المواطن",
        agentSpace: "فضاء موظف البلدية",
      },
      nav: {
        myRequests: "طلباتي",
        newDoc: "وثيقة جديدة",
        notifications: "الإشعارات",
        profile: "ملفي الشخصي",
        logout: "تسجيل الخروج",
        dashboard: "لوحة القيادة",
        queue: "قائمة الانتظار",
        history: "السجل",
      },
      status: {
        pending: "قيد الانتظار",
        accepted: "مقبول ✓",
        rejected: "مرفوض ✗",
      },
    }
  },
  en: {
    translation: {
      landing: {
        title: "Your municipal services online",
        subtitle: "Request your civil status documents without visiting your commune.",
        citizen: "I am a citizen",
        agent: "I am an APC agent",
        stats: {
          wilayas: "Wilayas covered",
          types: "Document types",
          delay: "Processing time",
          secure: "Secured",
        },
        portals: "Choose your space",
        whatIsIdz: "What is IDZ?",
        whyIdz: "Why IDZ?",
        citizenSpace: "Citizen Portal",
        agentSpace: "APC Agent Portal",
      },
      nav: {
        myRequests: "My requests",
        newDoc: "New document",
        notifications: "Notifications",
        profile: "My profile",
        logout: "Logout",
        dashboard: "Dashboard",
        queue: "Queue",
        history: "History",
      },
      status: {
        pending: "Pending",
        accepted: "Accepted ✓",
        rejected: "Rejected ✗",
      },
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
  });

export default i18n;
