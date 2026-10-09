// Mock Data for IDZ Platform

export const mockCitizen = {
  id: 'CIT-001',
  prenom: 'Amina',
  nom: 'Benali',
  nin: '123456789123456789',
  dateNaissance: '15/06/1992',
  commune: 'Hussein Dey',
  wilaya: 'Alger',
  email: 'Benalienably23@gmail.com',
  telephone: '0551234567',
};

export const mockRequests = [
  {
    id: 'DEM-2024-001',
    num: '01',
    document: 'Extrait de naissance (S12)',
    commune: 'Alger Centre',
    date: '28/03/2026',
    statut: 'pending',
  },
  {
    id: 'DEM-2024-002',
    num: '02',
    document: 'Certificat de résidence',
    commune: 'Alger Centre',
    date: '21/03/2026',
    statut: 'accepted',
  },
  {
    id: 'DEM-2024-003',
    num: '03',
    document: 'Acte de mariage',
    commune: 'Hussein Dey',
    date: '10/02/2026',
    statut: 'accepted',
  },
  {
    id: 'DEM-2024-004',
    num: '04',
    document: 'Fiche familiale état civil',
    commune: 'Bab El Oued',
    date: '05/01/2026',
    statut: 'rejected',
  },
  {
    id: 'DEM-2024-005',
    num: '05',
    document: 'Passeport (renouvellement)',
    commune: 'Alger Centre',
    date: '02/01/2026',
    statut: 'accepted',
  },
];

export const mockNotifications = [
  {
    id: 'DEM-620246',
    type: 'accepted',
    document: 'Extrait de naissance',
    message: "votre demande d'extrait de naissance est prete",
  },
  {
    id: 'DEM-629286',
    type: 'rejected',
    document: 'Act de mariage',
    message: "votre demande d'act de mariage a ete refuse",
    motif: 'Pièces justificatives insuffisantes. Merci de fournir un livret de famille valide.',
  },
];

export const documentTypes = [
  { id: 1, label: 'Extrait de naissance (12)', emoji: '📄', pieces: 'CNI + Livret de famille' },
  { id: 2, label: 'Extrait de naissance (13)', emoji: '📄', pieces: 'CNI + Livret de famille' },
  { id: 3, label: 'Naissance (12S)', emoji: '📄', pieces: 'CNI + Livret + Formulaire S12' },
  { id: 4, label: 'Fiche familiale', emoji: '👨‍👩‍👧', pieces: 'Livret de famille + CNI' },
  { id: 5, label: 'Certificat de résidence', emoji: '🏠', pieces: 'CNI + Justificatif domicile' },
  { id: 6, label: 'Passeport', emoji: '📘', pieces: 'CNI + 4 photos + Ancien passeport' },
];

// Agent mock data
export const mockAgent = {
  id: 'AGT-001',
  prenom: 'Karim',
  nom: 'Belkacem',
  commune: 'APC Béjaïa-Centre',
  email: 'agent@commune-bejaia.dz',
};

export const mockAgentRequests = [
  {
    id: 'REQ-001',
    num: '01',
    citoyen: 'Amina Kaci',
    document: 'Extrait S12',
    date: '31/03/2026',
    commune: 'Alger Centre',
    statut: 'pending',
    nin: '09873565286354 8345',
    dateNaissance: '11/06/2006',
    nom: 'Kaci',
    prenom: 'Amina',
    communeCitoyen: 'Alger-Centre',
    documentDemande: 'Extrait S12',
    pieces: [
      { name: 'facture_sonelgaz.pdf', size: '1.2 Mo', type: 'PDF' },
      { name: 'CNI_recto_verso.pdf', size: '0.8 Mo', type: 'PDF' },
    ],
  },
  {
    id: 'REQ-002',
    num: '02',
    citoyen: 'Youcef Brahim',
    document: 'Acte de mariage',
    date: '31/03/2026',
    commune: 'Bab El Oued',
    statut: 'pending',
    nin: '12345678901234 5678',
    dateNaissance: '22/03/1988',
    nom: 'Brahim',
    prenom: 'Youcef',
    communeCitoyen: 'Bab El Oued',
    documentDemande: 'Acte de mariage',
    pieces: [
      { name: 'livret_famille.pdf', size: '2.1 Mo', type: 'PDF' },
    ],
  },
  {
    id: 'REQ-003',
    num: '03',
    citoyen: 'Fatima Hamza',
    document: 'Fiche familiale',
    date: '30/03/2026',
    commune: 'Hussein Dey',
    statut: 'pending',
    nin: '98765432109876 5432',
    dateNaissance: '08/11/1975',
    nom: 'Hamza',
    prenom: 'Fatima',
    communeCitoyen: 'Hussein Dey',
    documentDemande: 'Fiche familiale',
    pieces: [
      { name: 'CNI.pdf', size: '0.5 Mo', type: 'PDF' },
      { name: 'livret.pdf', size: '1.8 Mo', type: 'PDF' },
    ],
  },
  {
    id: 'REQ-004',
    num: '04',
    citoyen: 'Omar Djilali',
    document: 'Certificat résidence',
    date: '30/03/2026',
    commune: 'El Harrach',
    statut: 'pending',
    nin: '11223344556677 8899',
    dateNaissance: '15/07/1990',
    nom: 'Djilali',
    prenom: 'Omar',
    communeCitoyen: 'El Harrach',
    documentDemande: 'Certificat de résidence',
    pieces: [
      { name: 'facture_eau.pdf', size: '0.9 Mo', type: 'PDF' },
      { name: 'CNI_recto.jpg', size: '0.3 Mo', type: 'JPG' },
    ],
  },
  {
    id: 'REQ-005',
    num: '05',
    citoyen: 'Sara Meziane',
    document: 'Passeport (renouvellement)',
    date: '29/03/2026',
    commune: "Sidi M'Hamed",
    statut: 'pending',
    nin: '55667788990011 2233',
    dateNaissance: '30/09/1995',
    nom: 'Meziane',
    prenom: 'Sara',
    communeCitoyen: "Sidi M'Hamed",
    documentDemande: 'Passeport (renouvellement)',
    pieces: [
      { name: 'ancien_passeport.pdf', size: '3.2 Mo', type: 'PDF' },
      { name: 'photos.jpg', size: '1.1 Mo', type: 'JPG' },
    ],
  },
];

export const agentStats = {
  enAttente: 12,
  traiteesAujourdhui: 47,
  rejetees: 3,
  tauxAcceptation: 98,
};
