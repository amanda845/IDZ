-- ====================================================================
-- IDZ PLATFORM - SCHEMA SUPABASE COMPLET (PostgreSQL + RLS + Storage)
-- ====================================================================

-- 1. REGISTRE NATIONAL DE L'ETAT CIVIL (Simulation d'authentification par NIN)
CREATE TABLE IF NOT EXISTS public.national_registry (
    nin VARCHAR(18) PRIMARY KEY,
    num_acte_naissance VARCHAR(50),
    annee_registre VARCHAR(10),
    nom_fr VARCHAR(100) NOT NULL,
    nom_ar VARCHAR(100) NOT NULL,
    prenom_fr VARCHAR(100) NOT NULL,
    prenom_ar VARCHAR(100) NOT NULL,
    sexe VARCHAR(20),
    date_naissance VARCHAR(20),
    heure_naissance VARCHAR(20),
    lieu_naissance_fr VARCHAR(150),
    lieu_naissance_ar VARCHAR(150),
    wilaya_naissance VARCHAR(100),
    nom_prenom_pere_fr VARCHAR(150),
    nom_prenom_pere_ar VARCHAR(150),
    nom_prenom_mere_fr VARCHAR(150),
    nom_prenom_mere_ar VARCHAR(150),
    adresse_residence_fr TEXT,
    adresse_residence_ar TEXT,
    commune_residence VARCHAR(100),
    wilaya_residence VARCHAR(100),
    situation_matrimoniale VARCHAR(50),
    nom_prenom_conjoint_fr VARCHAR(150),
    nom_prenom_conjoint_ar VARCHAR(150),
    date_mariage VARCHAR(20),
    lieu_mariage VARCHAR(150),
    nombre_enfants INTEGER DEFAULT 0,
    details_enfants JSONB DEFAULT '[]'::jsonb,
    mentions_marginales TEXT,
    date_delivrance_s12 VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILS UTILISATEURS (Citoyens & Agents APC)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role VARCHAR(20) DEFAULT 'citoyen', -- 'citoyen' ou 'agent'
    nom VARCHAR(100),
    prenom VARCHAR(100),
    nin VARCHAR(18) UNIQUE REFERENCES public.national_registry(nin),
    commune VARCHAR(100),
    wilaya VARCHAR(100),
    daira VARCHAR(100),
    date_naissance VARCHAR(20),
    lieu_naissance VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DEMANDES DE DOCUMENTS (Actes, Passeport, Résidence...)
CREATE TABLE IF NOT EXISTS public.requests (
    id TEXT PRIMARY KEY,
    num VARCHAR(50),
    document VARCHAR(150) NOT NULL,
    commune VARCHAR(100),
    date VARCHAR(30),
    statut VARCHAR(30) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    pieces JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    type VARCHAR(30) NOT NULL, -- 'accepted', 'rejected', 'info'
    document VARCHAR(150),
    message TEXT,
    motif TEXT,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. HISTORIQUE DES DOCUMENTS OFFICIELS GENERES (PDFs)
CREATE TABLE IF NOT EXISTS public.generated_documents (
    id TEXT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) DEFAULT 'Official',
    file_url TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    request_id TEXT REFERENCES public.requests(id) ON DELETE SET NULL,
    date VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- SEED DATA : DONNEES DE TEST & DEMO
-- ====================================================================

-- Insertion dans le registre national
INSERT INTO public.national_registry (
    nin, num_acte_naissance, annee_registre, nom_fr, nom_ar, prenom_fr, prenom_ar, 
    sexe, date_naissance, heure_naissance, lieu_naissance_fr, lieu_naissance_ar, 
    wilaya_naissance, nom_prenom_pere_fr, nom_prenom_pere_ar, nom_prenom_mere_fr, 
    nom_prenom_mere_ar, adresse_residence_fr, adresse_residence_ar, commune_residence, 
    wilaya_residence, situation_matrimoniale, nom_prenom_conjoint_fr, nom_prenom_conjoint_ar, 
    date_mariage, lieu_mariage, nombre_enfants, details_enfants, mentions_marginales, date_delivrance_s12
) VALUES 
(
    '123456789123456789', '00452', '1990', 'BENALI', 'بن علي', 'AMINA', 'أمينة',
    'Féminin', '15/05/1990', '10:30', 'Alger Centre', 'الجزائر الوسطى',
    'Alger', 'BENALI Ahmed', 'بن علي أحمد', 'MANSOURI Fatima', 'منصوري فاطمة',
    '12 Rue Didouche Mourad, Alger', '12 شارع ديدوش مراد، الجزائر', 'Alger Centre', 'Alger',
    'Mariée', 'BELKACEM Karim', 'بلقاسم كريم', '20/06/2015', 'Alger Centre', 2,
    '[{"prenom": "Yasmine", "sexe": "Féminin", "date_naissance": "12/03/2017", "lieu_naissance": "Alger", "situation": "Célibataire"}, {"prenom": "Rayane", "sexe": "Masculin", "date_naissance": "05/09/2020", "lieu_naissance": "Alger", "situation": "Célibataire"}]'::jsonb,
    'Mariée le 20/06/2015 à Alger avec BELKACEM Karim.', '10/01/2012'
),
(
    '987654321098765432', '01289', '1985', 'BELKACEM', 'بلقاسم', 'KARIM', 'كريم',
    'Masculin', '22/11/1985', '02:15', 'Kouba', 'القبة',
    'Alger', 'BELKACEM Omar', 'بلقاسم عمر', 'ZIRI Salima', 'زيري سليمة',
    '05 Cité 1er Mai, Kouba', '05 حي 1 ماي، القبة', 'Kouba', 'Alger',
    'Marié', 'BENALI Amina', 'بن علي أمينة', '20/06/2015', 'Alger Centre', 2,
    '[]'::jsonb,
    'Marié le 20/06/2015 à Alger avec BENALI Amina.', '15/05/2012'
)
ON CONFLICT (nin) DO NOTHING;

-- Agent APC par défaut
INSERT INTO public.profiles (
    id, email, password_hash, role, nom, prenom, commune, wilaya, daira
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'agent@apc.dz',
    'password123',
    'agent',
    'ZIRI',
    'Mourad',
    'Alger Centre',
    'Alger',
    'Sidi M''Hamed'
)
ON CONFLICT (email) DO NOTHING;

-- Citoyen de démo
INSERT INTO public.profiles (
    id, email, password_hash, role, nom, prenom, nin, commune, wilaya, date_naissance, lieu_naissance
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'amina.benali@gmail.com',
    'password123',
    'citoyen',
    'BENALI',
    'AMINA',
    '123456789123456789',
    'Alger Centre',
    'Alger',
    '15/05/1990',
    'Alger Centre'
)
ON CONFLICT (email) DO NOTHING;

-- ====================================================================
-- CONFIGURATION DU STOCKAGE (BUCKETS SUPABASE STORAGE)
-- ====================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('request-attachments', 'request-attachments', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques de stockage permissives (recréées proprement)
DROP POLICY IF EXISTS "Public Access Attachments" ON storage.objects;
CREATE POLICY "Public Access Attachments" ON storage.objects FOR ALL USING (bucket_id = 'request-attachments');

DROP POLICY IF EXISTS "Public Access Documents" ON storage.objects;
CREATE POLICY "Public Access Documents" ON storage.objects FOR ALL USING (bucket_id = 'documents');

-- ====================================================================
-- RLS (ROW LEVEL SECURITY)
-- ====================================================================
ALTER TABLE public.national_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- Politiques ouvertes pour l'application IDZ (recréées proprement)
DROP POLICY IF EXISTS "Allow all on national_registry" ON public.national_registry;
CREATE POLICY "Allow all on national_registry" ON public.national_registry FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on profiles" ON public.profiles;
CREATE POLICY "Allow all on profiles" ON public.profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on requests" ON public.requests;
CREATE POLICY "Allow all on requests" ON public.requests FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on notifications" ON public.notifications;
CREATE POLICY "Allow all on notifications" ON public.notifications FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all on generated_documents" ON public.generated_documents;
CREATE POLICY "Allow all on generated_documents" ON public.generated_documents FOR ALL USING (true);
