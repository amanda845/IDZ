import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const NationalRegistry = sequelize.define('NationalRegistry', {
  nin: { type: DataTypes.STRING(18), primaryKey: true },
  nom_fr: DataTypes.STRING,
  prenom_fr: DataTypes.STRING,
  date_naissance: DataTypes.STRING,
  lieu_naissance_fr: DataTypes.STRING,
  commune_residence: DataTypes.STRING,
});

async function check() {
  try {
    const citizens = await NationalRegistry.findAll();
    console.log('--- CITOYENS DISPONIBLES DANS LE REGISTRE IMAGINAIRE ---');
    citizens.forEach(c => {
      console.log(`NIN: ${c.nin}`);
      console.log(`Nom: ${c.nom_fr} ${c.prenom_fr}`);
      console.log(`Naissance: ${c.date_naissance} à ${c.lieu_naissance_fr}`);
      console.log(`Résidence: ${c.commune_residence}`);
      console.log('----------------------------------------------------');
    });
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

check();
