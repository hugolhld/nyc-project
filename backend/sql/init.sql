-- Activer l'extension PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Table pour les données de arrest_data
CREATE TABLE IF NOT EXISTS arrest_data (
    arrest_key BIGINT PRIMARY KEY,
    arrest_date TIMESTAMP,
    pd_cd TEXT,
    pd_desc TEXT,
    ky_cd TEXT,
    ofns_desc TEXT,
    law_code TEXT,
    law_cat_cd TEXT,
    arrest_boro TEXT,
    arrest_precinct INT,
    jurisdiction_code INT,
    age_group TEXT,
    perp_sex TEXT,
    perp_race TEXT,
    x_coord_cd INT,
    y_coord_cd INT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom GEOMETRY(Point, 4326) -- Colonne géométrique pour PostGIS
);

-- Table pour les données des stations
CREATE TABLE IF NOT EXISTS stations (
    station_id TEXT PRIMARY KEY,
    external_id TEXT,
    name TEXT,
    lat DOUBLE PRECISION,
    lon DOUBLE PRECISION,
    capacity INT,
    has_kiosk BOOLEAN,
    rental_methods JSONB,
    rental_uris JSONB,
    region_id TEXT,
    electric_bike_surcharge_waiver BOOLEAN,
    station_type TEXT,
    short_name TEXT,
    eightd_has_key_dispenser BOOLEAN,
    eightd_station_services JSONB,
    geom GEOMETRY(Point, 4326) -- Colonne géométrique pour PostGIS
);

-- Script pour remplir les deux tables depuis leurs fichiers JSON respectifs
DO $$
DECLARE
    record JSONB;
BEGIN
    -- Vérifier l'existence des fichiers JSON
    IF NOT EXISTS (
        SELECT 1 FROM pg_ls_dir('/docker-entrypoint-initdb.d/')
        WHERE pg_ls_dir = 'arrested.json'
    ) THEN
        RAISE EXCEPTION 'Fichier arrested.json introuvable';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_ls_dir('/docker-entrypoint-initdb.d/')
        WHERE pg_ls_dir = 'bikes-nyc.json'
    ) THEN
        RAISE EXCEPTION 'Fichier stations.json introuvable';
    END IF;

    -- Remplir la table arrest_data depuis arrested.json
    FOR record IN
        SELECT * FROM jsonb_array_elements(
            pg_read_file('/docker-entrypoint-initdb.d/arrested.json')::jsonb
        )
    LOOP
        INSERT INTO arrest_data (
            arrest_key, arrest_date, pd_cd, pd_desc, ky_cd, ofns_desc, law_code, law_cat_cd,
            arrest_boro, arrest_precinct, jurisdiction_code, age_group, perp_sex, perp_race,
            x_coord_cd, y_coord_cd, latitude, longitude, geom
        )
        VALUES (
            (record->>'arrest_key')::BIGINT,
            (record->>'arrest_date')::TIMESTAMP,
            record->>'pd_cd',
            record->>'pd_desc',
            record->>'ky_cd',
            record->>'ofns_desc',
            record->>'law_code',
            record->>'law_cat_cd',
            record->>'arrest_boro',
            (record->>'arrest_precinct')::INT,
            (record->>'jurisdiction_code')::INT,
            record->>'age_group',
            record->>'perp_sex',
            record->>'perp_race',
            (record->>'x_coord_cd')::INT,
            (record->>'y_coord_cd')::INT,
            (record->>'latitude')::DOUBLE PRECISION,
            (record->>'longitude')::DOUBLE PRECISION,
            ST_SetSRID(ST_MakePoint(
                (record->>'longitude')::DOUBLE PRECISION,
                (record->>'latitude')::DOUBLE PRECISION
            ), 4326)
        )
        ON CONFLICT (arrest_key) DO NOTHING;
    END LOOP;

    -- Remplir la table stations depuis stations.json
    FOR record IN
        SELECT * FROM jsonb_array_elements(
            pg_read_file('/docker-entrypoint-initdb.d/bikes-nyc.json')::jsonb->'data'->'stations'
        )
    LOOP
        INSERT INTO stations (
            station_id,
            external_id,
            name,
            lat,
            lon,
            capacity,
            has_kiosk,
            rental_methods,
            rental_uris,
            region_id,
            electric_bike_surcharge_waiver,
            station_type,
            short_name,
            eightd_has_key_dispenser,
            eightd_station_services,
            geom
        )
        VALUES (
            record->>'station_id',
            record->>'external_id',
            record->>'name',
            (record->>'lat')::DOUBLE PRECISION,
            (record->>'lon')::DOUBLE PRECISION,
            (record->>'capacity')::INT,
            (record->>'has_kiosk')::BOOLEAN,
            record->'rental_methods',
            record->'rental_uris',
            record->>'region_id',
            (record->>'electric_bike_surcharge_waiver')::BOOLEAN,
            record->>'station_type',
            record->>'short_name',
            (record->>'eightd_has_key_dispenser')::BOOLEAN,
            record->'eightd_station_services',
            ST_SetSRID(ST_MakePoint(
                (record->>'lon')::DOUBLE PRECISION,
                (record->>'lat')::DOUBLE PRECISION
            ), 4326)
        )
        ON CONFLICT (station_id) DO NOTHING;
    END LOOP;
END $$;
