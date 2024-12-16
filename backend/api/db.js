// db.js
const pgp = require('pg-promise')();

const db = pgp({
  host: 'postgres', // Assurez-vous que le port et l'adresse correspondent à votre configuration Docker
  port: 5432,
  database: 'geodb', // Nom de la base de données
  user: 'admin',
  password: 'adminpassword'
});

module.exports = db;
