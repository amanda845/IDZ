import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING },
  nom: DataTypes.STRING,
  prenom: DataTypes.STRING,
  nin: { type: DataTypes.STRING },
  commune: DataTypes.STRING,
  wilaya: DataTypes.STRING,
  date_naissance: DataTypes.STRING,
  lieu_naissance: DataTypes.STRING,
});

const NationalRegistry = sequelize.define('NationalRegistry', {
  nin: { type: DataTypes.STRING, primaryKey: true },
  nom_fr: DataTypes.STRING,
  prenom_fr: DataTypes.STRING,
  date_naissance: DataTypes.STRING,
  lieu_naissance_fr: DataTypes.STRING,
});

async function run() {
  try {
    const nin = '123456789123456789';
    const identity = await NationalRegistry.findByPk(nin);
    
    if (!identity) {
      console.log('Identity not found');
      return;
    }

    console.log(`Identity found: ${identity.nom_fr} ${identity.prenom_fr}`);
    console.log(`Birth: ${identity.date_naissance} at ${identity.lieu_naissance_fr}`);

    // Create user
    const user = await User.create({
      nin,
      nom: 'BENALI',
      prenom: 'AMINA',
      email: 'amina@test.com',
      password: 'password',
      commune: 'Alger Centre',
      wilaya: 'Alger',
      date_naissance: identity.date_naissance,
      lieu_naissance: identity.lieu_naissance_fr
    });

    console.log('User created:', user.toJSON());
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

run();
