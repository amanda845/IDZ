import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, primaryKey: true },
  nom: DataTypes.STRING,
  prenom: DataTypes.STRING,
});

async function check() {
  const users = await User.findAll();
  users.forEach(u => console.log(`${u.prenom} ${u.nom}: ${u.id}`));
  process.exit();
}

check();
