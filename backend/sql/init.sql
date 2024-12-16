CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS arrest_data (
    arrest_key BIGINT PRIMARY KEY,
    arrest_date TIMESTAMP,
    pd_cd VARCHAR(10),
    pd_desc TEXT,
    ky_cd VARCHAR(10),
    ofns_desc TEXT,
    law_code VARCHAR(20),
    law_cat_cd CHAR(1),
    arrest_boro CHAR(1),
    arrest_precinct INT,
    jurisdiction_code INT,
    age_group VARCHAR(20),
    perp_sex CHAR(1),
    perp_race VARCHAR(50),
    x_coord_cd INT,
    y_coord_cd INT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom GEOMETRY(Point, 4326) -- Colonne géométrique pour PostGIS
);

DO $$
DECLARE
    record JSONB;
BEGIN
    -- Lire le fichier JSON et traiter chaque objet
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
            ), 4326) -- Créer la géométrie (Point) avec SRID 4326
        )
        ON CONFLICT (arrest_key) DO NOTHING; -- Éviter les doublons
    END LOOP;
END $$;
