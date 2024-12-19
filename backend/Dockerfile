# Utiliser l'image officielle de PostGIS
FROM postgis/postgis:17-3.5

# Copiez le fichier JSON et le script SQL dans le conteneur
COPY ./data/arrested.json /docker-entrypoint-initdb.d/arrested.json
COPY ./data/bikes-nyc.json /docker-entrypoint-initdb.d/bikes-nyc.json
COPY ./sql/init.sql /docker-entrypoint-initdb.d/init.sql