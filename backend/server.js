import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import arabicReshaper from 'arabic-reshaper';
import bidiFactory from 'bidi-js';

const bidi = bidiFactory();

const FONT_PATH = 'C:\\Windows\\Fonts\\arial.ttf';

function formatArabic(text) {
  if (!text) return "";
  try {
    const reshaped = arabicReshaper.reshape(text);
    return bidi.getReorderedText(reshaped);
  } catch (e) {
    return text;
  }
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads folder if not exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Global Error Logger
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Initialize SQLite Database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

// Models
const NationalRegistry = sequelize.define('NationalRegistry', {
  nin: { type: DataTypes.STRING(18), primaryKey: true },
  num_acte_naissance: DataTypes.STRING,
  annee_registre: DataTypes.STRING,
  nom_fr: DataTypes.STRING,
  nom_ar: DataTypes.STRING,
  prenom_fr: DataTypes.STRING,
  prenom_ar: DataTypes.STRING,
  sexe: DataTypes.STRING,
  date_naissance: DataTypes.STRING,
  heure_naissance: DataTypes.STRING,
  lieu_naissance_fr: DataTypes.STRING,
  lieu_naissance_ar: DataTypes.STRING,
  wilaya_naissance: DataTypes.STRING,
  nom_prenom_pere_fr: DataTypes.STRING,
  nom_prenom_pere_ar: DataTypes.STRING,
  nom_prenom_mere_fr: DataTypes.STRING,
  nom_prenom_mere_ar: DataTypes.STRING,
  adresse_residence_fr: DataTypes.STRING,
  adresse_residence_ar: DataTypes.STRING,
  commune_residence: DataTypes.STRING,
  wilaya_residence: DataTypes.STRING,
  situation_matrimoniale: DataTypes.STRING,
  nom_prenom_conjoint_fr: DataTypes.STRING,
  nom_prenom_conjoint_ar: DataTypes.STRING,
  date_mariage: DataTypes.STRING,
  lieu_mariage: DataTypes.STRING,
  nombre_enfants: DataTypes.INTEGER,
  details_enfants: DataTypes.JSON, // Array of children objects
  mentions_marginales: DataTypes.TEXT,
  date_delivrance_s12: DataTypes.STRING,
});

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  nom: DataTypes.STRING,
  prenom: DataTypes.STRING,
  nin: { type: DataTypes.STRING(18), unique: true, allowNull: false },
  commune: DataTypes.STRING,
  wilaya: DataTypes.STRING,
  date_naissance: DataTypes.STRING,
  lieu_naissance: DataTypes.STRING,
});

const Agent = sequelize.define('Agent', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  nom: DataTypes.STRING,
  prenom: DataTypes.STRING,
  commune: DataTypes.STRING,
  wilaya: DataTypes.STRING,
  daira: DataTypes.STRING,
});

const Request = sequelize.define('Request', {
  id: { type: DataTypes.STRING, primaryKey: true },
  num: DataTypes.STRING,
  document: DataTypes.STRING,
  commune: DataTypes.STRING,
  date: DataTypes.STRING,
  statut: { 
    type: DataTypes.STRING, 
    defaultValue: 'pending' 
  },
  userId: DataTypes.UUID, // Link to User
  pieces: DataTypes.JSON,
});

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.STRING, primaryKey: true },
  type: DataTypes.STRING,
  document: DataTypes.STRING,
  message: DataTypes.STRING,
  motif: DataTypes.STRING,
  userId: DataTypes.UUID,
  fileUrl: DataTypes.STRING,
});

const GeneratedDocument = sequelize.define('GeneratedDocument', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: DataTypes.STRING,
  type: DataTypes.STRING,
  fileUrl: DataTypes.STRING,
  userId: DataTypes.UUID,
  requestId: DataTypes.STRING,
  date: DataTypes.STRING,
});

// Sync Database and Seed Initial Data
const syncDB = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced');

    // Seed only if empty
    const count = await NationalRegistry.count();
    if (count === 0) {
      // Seed National Registry with detailed Amina BENALI
      await NationalRegistry.create({
        nin: '123456789123456789',
        num_acte_naissance: '00452',
        annee_registre: '1990',
        nom_fr: 'BENALI',
        nom_ar: 'بن علي',
        prenom_fr: 'AMINA',
        prenom_ar: 'أمينة',
        sexe: 'Féminin',
        date_naissance: '15/05/1990',
        heure_naissance: '10:30',
        lieu_naissance_fr: 'Alger Centre',
        lieu_naissance_ar: 'الجزائر الوسطى',
        wilaya_naissance: 'Alger',
        nom_prenom_pere_fr: 'BENALI Ahmed',
        nom_prenom_pere_ar: 'بن علي أحمد',
        nom_prenom_mere_fr: 'MANSOURI Fatima',
        nom_prenom_mere_ar: 'منصوري فاطمة',
        adresse_residence_fr: '12 Rue Didouche Mourad, Alger',
        adresse_residence_ar: '12 شارع ديدوش مراد، الجزائر',
        commune_residence: 'Alger Centre',
        wilaya_residence: 'Alger',
        situation_matrimoniale: 'Mariée',
        nom_prenom_conjoint_fr: 'BELKACEM Karim',
        nom_prenom_conjoint_ar: 'بلقاسم كريم',
        date_mariage: '20/06/2015',
        lieu_mariage: 'Alger Centre',
        nombre_enfants: 2,
        details_enfants: [
          { prenom: 'Yasmine', sexe: 'Féminin', date_naissance: '12/03/2017', lieu_naissance: 'Alger', situation: 'Célibataire' },
          { prenom: 'Rayane', sexe: 'Masculin', date_naissance: '05/09/2020', lieu_naissance: 'Alger', situation: 'Célibataire' }
        ],
        mentions_marginales: 'Mariée le 20/06/2015 à Alger avec BELKACEM Karim.',
        date_delivrance_s12: '10/01/2012'
      });

      // Seed another for testing
      await NationalRegistry.create({
        nin: '987654321098765432',
        num_acte_naissance: '01289',
        annee_registre: '1985',
        nom_fr: 'BELKACEM',
        nom_ar: 'بلقاسم',
        prenom_fr: 'KARIM',
        prenom_ar: 'كريم',
        sexe: 'Masculin',
        date_naissance: '22/11/1985',
        heure_naissance: '02:15',
        lieu_naissance_fr: 'Kouba',
        lieu_naissance_ar: 'القبة',
        wilaya_naissance: 'Alger',
        nom_prenom_pere_fr: 'BELKACEM Omar',
        nom_prenom_pere_ar: 'بلقاسم عمر',
        nom_prenom_mere_fr: 'ZIRI Salima',
        nom_prenom_mere_ar: 'زيري سليمة',
        adresse_residence_fr: '05 Cité 1er Mai, Kouba',
        adresse_residence_ar: '05 حي 1 ماي، القبة',
        commune_residence: 'Kouba',
        wilaya_residence: 'Alger',
        situation_matrimoniale: 'Marié',
        nom_prenom_conjoint_fr: 'BENALI Amina',
        nom_prenom_conjoint_ar: 'بن علي أمينة',
        date_mariage: '20/06/2015',
        lieu_mariage: 'Alger Centre',
        nombre_enfants: 2,
        mentions_marginales: 'Marié le 20/06/2015 à Alger avec BENALI Amina.',
        date_delivrance_s12: '15/05/2012'
      });

      // Seed Authorised Agents
      await Agent.create({
        email: 'agent@apc.dz',
        password: 'password123',
        nom: 'ZIRI',
        prenom: 'Mourad',
        commune: 'Alger Centre',
        wilaya: 'Alger',
        daira: 'Sidi M\'Hamed'
      });
      console.log('Initial simulation data seeded');
    }
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

// syncDB(); // Moved to end

// API Routes - Authentication & Registration

// Citizen Registration
app.post('/api/citizen/register', async (req, res) => {
  const { nin, nom, prenom, email, password, commune, wilaya } = req.body;

  try {
    console.log('Registration attempt:', { nin, nom, prenom, email });
    // 1. Verify against Imaginary National Registry
    const identity = await NationalRegistry.findOne({ where: { nin } });
    
    if (!identity) {
      return res.status(400).json({ error: "NIN non reconnu dans le registre national." });
    }

    console.log('REGISTRY DATA FOR NIN:', nin, {
      birth: identity.date_naissance,
      place: identity.lieu_naissance_fr
    });

    // Check if name matches registry (case insensitive simulation)
    if (!identity.nom_fr || !identity.prenom_fr || identity.nom_fr.toLowerCase() !== nom.toLowerCase() || identity.prenom_fr.toLowerCase() !== prenom.toLowerCase()) {
      return res.status(400).json({ error: "Les informations (Nom/Prénom) ne correspondent pas au NIN fourni." });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ where: { nin } });
    if (existingUser) {
      return res.status(400).json({ error: "Ce citoyen est déjà inscrit." });
    }

    // 3. Create account
    const user = await User.create({
      nin, 
      nom, 
      prenom, 
      email, 
      password, 
      commune, 
      wilaya,
      date_naissance: identity.date_naissance,
      lieu_naissance: identity.lieu_naissance_fr
    });

    console.log('User created successfully with birth data:', {
      nin: user.nin,
      date_naissance: user.date_naissance,
      lieu_naissance: user.lieu_naissance
    });
    res.status(201).json(user);
  } catch (err) {
    console.error('REGISTRATION ERROR:', err);
    res.status(500).json({ error: "Erreur lors de l'inscription.", details: err.message });
  }
});

// Citizen Login
app.post('/api/citizen/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email, password } });
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: "Erreur lors de la connexion." });
  }
});

// Agent Login
app.post('/api/agent/login', async (req, res) => {
  const { email, password } = req.body;
  const agent = await Agent.findOne({ where: { email, password } });
  
  if (agent) {
    res.json(agent);
  } else {
    res.status(401).json({ error: "Identifiants agent incorrects." });
  }
});

// Request & Notification Routes

app.get('/api/requests', async (req, res) => {
  const requests = await Request.findAll();
  res.json(requests);
});

app.get('/api/requests/citizen/:userId', async (req, res) => {
  const requests = await Request.findAll({ where: { userId: req.params.userId } });
  res.json(requests);
});

app.post('/api/requests', upload.array('files'), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data); // Request details as JSON string
    
    // Process uploaded files
    const pieces = req.files.map(file => ({
      name: file.originalname,
      filename: file.filename,
      url: `/uploads/${file.filename}`
    }));

    const newRequest = await Request.create({
      ...data,
      id: `DEM-${Date.now()}`,
      num: Math.floor(100 + Math.random() * 900).toString(),
      date: new Date().toLocaleDateString('fr-FR'),
      statut: 'pending',
      pieces: pieces // Save objects with URLs
    });

    res.status(201).json(newRequest);
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).json({ error: "Erreur lors de la création de la demande" });
  }
});

app.put('/api/requests/:id', async (req, res) => {
  const { statut, motif } = req.body;
  
  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    // Update request status
    await Request.update({ statut }, { where: { id: req.params.id } });
    
    let fileUrl = null;

    if (statut === 'accepted') {
      console.log(`Generating PDF for request ${request.id}...`);
      // 1. Get User Data and Identity
      const user = await User.findByPk(request.userId);
      const identity = await NationalRegistry.findByPk(user.nin);
      
      if (!identity) {
        console.error(`Identity not found for NIN ${user.nin}`);
        throw new Error("Identity not found");
      }

      // 2. Generate PDF
      const fileName = `DOC-${request.id}-${Date.now()}.pdf`;
      const filePath = path.join(uploadDir, fileName);
      fileUrl = `/uploads/${fileName}`;

      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // --- CONFIG FONT ---
      try {
        doc.registerFont('MainFont', FONT_PATH);
        doc.font('MainFont');
        console.log("Font registered successfully");
      } catch (fontErr) {
        console.error("Font registration failed:", fontErr);
      }

      // --- HEADER ---
      doc.fontSize(10).text(formatArabic('الجمهورية الجزائرية الديمقراطية الشعبية'), { align: 'center' });
      doc.fontSize(10).text('RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE', { align: 'center' });
      doc.moveDown(0.2);
      doc.fontSize(8).text(formatArabic('وزارة الداخلية والجماعات المحلية والتهيئة العمرانية'), { align: 'center' });
      doc.fontSize(8).text('MINISTÈRE DE L\'INTÉRIEUR ET DES COLLECTIVITÉS LOCALES', { align: 'center' });
      doc.moveDown(0.1);
      doc.fontSize(9).text(`WILAYA DE ${identity.wilaya_residence.toUpperCase()} - APC DE ${identity.commune_residence.toUpperCase()}`, { align: 'center' });
      doc.moveDown(1.5);

      // --- LEGAL REFERENCES ---
      doc.fontSize(7);
      doc.text("Vu la loi n° 11-10 du 22 juin 2011 relative à la commune.");
      doc.text("Vu l'ordonnance n° 70-20 du 27 février 1970 relative à l'état civil.");
      doc.text("Vu le décret présidentiel n° 15-261 relatif au numéro d'identification national.");
      doc.moveDown(1);

      const docType = request.document.toLowerCase();

      if (docType.includes('passeport')) {
        doc.fontSize(16).text('ACCUSÉ DE RÉCEPTION - DEMANDE DE PASSEPORT', { align: 'center', underline: true });
        doc.fontSize(14).text(formatArabic('وصل استلام - طلب جواز سفر'), { align: 'center' });
        doc.moveDown(1.5);
        doc.fontSize(11);
        doc.text(`Le service de l'État Civil de la commune de ${identity.commune_residence} accuse réception de la demande de Passeport Biométrique effectuée par :`);
        doc.moveDown();
        doc.text(`NOM : ${identity.nom_fr} (${formatArabic(identity.nom_ar)})`);
        doc.text(`PRÉNOM : ${identity.prenom_fr} (${formatArabic(identity.prenom_ar)})`);
        doc.text(`NIN : ${identity.nin}`);
        doc.moveDown();
        doc.text("Votre dossier numérique a été validé par nos services. Ce document fait foi de dépôt de dossier.");
        doc.moveDown();
        doc.text("IMPORTANT : Une notification vous sera envoyée prochainement pour la prise d'empreintes digitales.", { oblique: true });
      } 
      else if (docType.includes('naissance')) {
        doc.fontSize(16).text('EXTRAIT DE L\'ACTE DE NAISSANCE', { align: 'center', underline: true });
        doc.fontSize(14).text(formatArabic('شهادة ميلاد'), { align: 'center' });
        doc.moveDown(1.5);
        doc.fontSize(10);
        doc.text(`Numéro de l'acte : ${identity.num_acte_naissance} / Année : ${identity.annee_registre}`);
        doc.moveDown();
        doc.fontSize(12);
        doc.text(`NOM : ${identity.nom_fr} (${formatArabic(identity.nom_ar)})`);
        doc.text(`PRÉNOM : ${identity.prenom_fr} (${formatArabic(identity.prenom_ar)})`);
        doc.moveDown(0.5);
        doc.fontSize(11);
        doc.text(`Sexe : ${identity.sexe} - Né(e) le : ${identity.date_naissance} à ${identity.heure_naissance}`);
        doc.text(`Lieu de naissance : ${identity.lieu_naissance_fr} (${formatArabic(identity.lieu_naissance_ar)})`);
        doc.moveDown();
        doc.text(`FILIATION :`);
        doc.text(`Fils/Fille de : ${identity.nom_prenom_pere_fr} (${formatArabic(identity.nom_prenom_pere_ar)})`);
        doc.text(`Et de : ${identity.nom_prenom_mere_fr} (${formatArabic(identity.nom_prenom_mere_ar)})`);
        doc.moveDown();
        doc.text(`NIN : ${identity.nin}`);
        doc.moveDown();
        doc.fontSize(9).text(`Mentions marginales : ${identity.mentions_marginales || 'Néant'}`);
      }
      else if (docType.includes('familiale')) {
        doc.fontSize(16).text('FICHE FAMILIALE D\'ÉTAT CIVIL', { align: 'center', underline: true });
        doc.fontSize(14).text(formatArabic('الدفتر العائلي للحالة المدنية'), { align: 'center' });
        doc.moveDown(1.5);
        doc.fontSize(11);
        doc.text(`CHEF DE FAMILLE : ${identity.nom_fr} ${identity.prenom_fr} (${formatArabic(identity.nom_ar)} ${formatArabic(identity.prenom_ar)})`);
        doc.text(`ÉPOUSE : ${identity.nom_prenom_conjoint_fr || 'N/A'} (${formatArabic(identity.nom_prenom_conjoint_ar) || 'N/A'})`);
        doc.moveDown();
        doc.text(`MARIAGE : Le ${identity.date_mariage || 'N/A'} à ${identity.lieu_mariage || 'N/A'}`);
        doc.moveDown();
        doc.text(`ENFANTS :`);
        if (identity.details_enfants && identity.details_enfants.length > 0) {
          identity.details_enfants.forEach((child, idx) => {
            doc.fontSize(9).text(`${idx + 1}. ${child.prenom} (${child.sexe}) - Né(e) le ${child.date_naissance}`);
          });
        }
      }
      else if (docType.includes('résidence') || docType.includes('residence')) {
        doc.fontSize(16).text('CERTIFICAT DE RÉSIDENCE', { align: 'center', underline: true });
        doc.fontSize(14).text(formatArabic('شهادة إقامة'), { align: 'center' });
        doc.moveDown(1.5);
        doc.fontSize(11);
        doc.text(`NOM : ${identity.nom_fr} (${formatArabic(identity.nom_ar)})`);
        doc.text(`PRÉNOM : ${identity.prenom_fr} (${formatArabic(identity.prenom_ar)})`);
        doc.moveDown();
        doc.text(`ADRESSE : ${identity.adresse_residence_fr}`);
        doc.text(formatArabic(identity.adresse_residence_ar), { align: 'right' });
        doc.moveDown();
        doc.text(`Commune : ${identity.commune_residence} - Wilaya : ${identity.wilaya_residence}`);
      }

      doc.moveDown(2);
      doc.fontSize(10).text(`Délivré à ${identity.commune_residence}, le ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' });
      
      // --- FOOTER PARAGRAPH ---
      doc.moveDown(2);
      doc.fontSize(8).fillColor('grey').text("Ce document est délivré de manière électronique conformément à la stratégie nationale de numérisation de l'administration algérienne. Il jouit de la même valeur juridique que le document format papier.", { align: 'justify' });
      doc.moveDown(0.5);
      doc.text("L'authenticité de ce document peut être vérifiée en scannant le code QR ci-dessous.", { align: 'center' });
      doc.fillColor('black');

      // 3. Generate QR Code
      const qrData = `VERIFICATION IDZ: ${request.id}\nCitoyen: ${identity.nom_fr} ${identity.prenom_fr}\nNIN: ${identity.nin}\nDoc: ${request.document}`;
      const qrImageBuffer = await QRCode.toBuffer(qrData);
      
      doc.image(qrImageBuffer, doc.page.width - 150, doc.y - 50, { width: 100 });
      doc.fontSize(8).font('Helvetica-Oblique').text('Document authentifié par code QR via la plateforme IDZ', doc.page.width - 150, doc.y + 55, { width: 100, align: 'center' });

      doc.end();

      // Wait for stream to finish
      await new Promise((resolve) => stream.on('finish', resolve));

      // 3. Save to GeneratedDocuments table
      console.log(`Saving document ${request.document} to history for user ${request.userId}...`);
      await GeneratedDocument.create({
        id: `DOC-${Date.now()}`,
        name: request.document,
        type: 'Official',
        fileUrl: fileUrl,
        userId: request.userId,
        requestId: request.id,
        date: new Date().toLocaleDateString('fr-FR')
      });
    }

    // 4. Create Notification
    await Notification.create({
      id: `NOT-${Date.now()}`,
      type: statut,
      document: request.document,
      message: statut === 'accepted' 
        ? `Votre demande de "${request.document}" a été acceptée. Votre document est prêt.` 
        : `Votre demande de "${request.document}" a été rejetée.`,
      motif: motif || '',
      userId: request.userId,
      fileUrl: fileUrl // Link to the PDF if accepted
    });

    res.json({ success: true, fileUrl });
  } catch (err) {
    console.error("Error updating request:", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour." });
  }
});

app.get('/api/notifications/:userId', async (req, res) => {
  const notifications = await Notification.findAll({ where: { userId: req.params.userId }, order: [['createdAt', 'DESC']] });
  res.json(notifications);
});

app.get('/api/documents/:userId', async (req, res) => {
  try {
    console.log(`Fetching history for user: ${req.params.userId}`);
    const docs = await GeneratedDocument.findAll({ 
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']]
    });
    console.log(`Found ${docs.length} documents for user ${req.params.userId}`);
    res.json(docs);
  } catch (err) {
    console.error('HISTORY FETCH ERROR:', err);
    res.status(500).json({ error: "Erreur lors de la récupération de l'historique." });
  }
});

app.delete('/api/notifications/:id', async (req, res) => {
  try {
    await Notification.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: "API is working" });
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await syncDB();
  console.log('Server is ready and listening...');
});
