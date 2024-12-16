// server.js
const express = require('express');
const db = require('./db');
const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Route pour obtenir tous les enregistrements
app.get('/api/arrests', async (req, res) => {
  try {
    const result = await db.any('SELECT * FROM arrest_data');
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des données' });
  }
});

// Route pour obtenir un enregistrement spécifique
app.get('/api/arrests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.oneOrNone('SELECT * FROM arrest_data WHERE arrest_key = $1', [id]);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Enregistrement non trouvé' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'enregistrement' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
