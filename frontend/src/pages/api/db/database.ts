import { Pool } from 'pg';

// Configuration du pool de connexions PostgreSQL
export const pool = new Pool({
    user: process.env.DB_USER || 'admin', // Nom d'utilisateur de la base de données
    host: process.env.DB_HOST || 'localhost', // Adresse du serveur PostgreSQL
    database: process.env.DB_NAME || 'geodb', // Nom de la base de données
    password: process.env.DB_PASSWORD || 'adminpassword', // Mot de passe
    port: Number(process.env.DB_PORT) || 5432, // Port PostgreSQL (par défaut : 5432)
    max: 20, // Nombre maximum de connexions dans le pool
    idleTimeoutMillis: 30000, // Délai d'inactivité avant de fermer une connexion (en ms)
    connectionTimeoutMillis: 2000, // Délai d'attente pour obtenir une connexion (en ms)
});

// Vérification de la connexion au pool au démarrage
pool.connect()
    .then(client => {
        console.log('Connecté à la base de données PostgreSQL');
        client.release(); // Libère la connexion après test
    })
    .catch(err => {
        console.error('Erreur lors de la connexion à PostgreSQL :', err);
    });
