import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: true // Enable logging to see SQL
});

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING },
  nom: DataTypes.STRING,
  prenom: DataTypes.STRING,
  nin: { type: DataTypes.STRING },
  date_naissance: DataTypes.STRING,
  lieu_naissance: DataTypes.STRING,
});

async function update() {
  try {
    const user = await User.findOne({ where: { nin: '123456789123456789' } });
    if (user) {
      console.log('User found, updating...');
      user.date_naissance = '15/05/1990';
      user.lieu_naissance = 'Alger Centre';
      await user.save();
      console.log('User updated!');
    } else {
      console.log('User not found');
    }
  } catch (err) {
    console.error('UPDATE ERROR:', err);
  } finally {
    process.exit();
  }
}

update();
