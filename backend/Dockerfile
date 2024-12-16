# Utiliser l'image officielle de PostGIS
FROM postgis/postgis:17-3.5

# Copiez le fichier JSON et le script SQL dans le conteneur
COPY ./data/arrested.json /docker-entrypoint-initdb.d/arrested.json
COPY ./sql/init.sql /docker-entrypoint-initdb.d/init.sql

# Assurez-vous que les fichiers d'initialisation sont exécutés au démarrage du conteneur
# Les fichiers présents dans /docker-entrypoint-initdb.d seront automatiquement exécutés lors de l'initialisation

# Utiliser une image de base avec Node.js
FROM node:18

# Créer un répertoire pour l'application
WORKDIR /usr/src/app

# Copier les fichiers du projet dans le conteneur
COPY ./api .

# Installer les dépendances de l'API
RUN npm install

# Exposer le port pour l'API
EXPOSE 3000

# Lancer l'application API Node.js
CMD ["node", "server.js"]