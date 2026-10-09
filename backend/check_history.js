import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
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

async function check() {
  try {
    const docs = await GeneratedDocument.findAll();
    console.log('--- GENERATED DOCUMENTS ---');
    docs.forEach(d => {
      console.log(`Doc: ${d.name} | Request: ${d.requestId} | UserID: ${d.userId} | Date: ${d.date}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

check();
