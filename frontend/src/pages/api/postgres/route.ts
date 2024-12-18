import { ofns_desc } from '@/utils/utils'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'
import io from 'socket.io-client'

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'admin',
  password: 'adminpassword',
  database: 'geodb',
})

type ArrestData = {
  arrest_key: string
  arrest_date: string
  pd_cd: string
  pd_desc: string
  ky_cd: string
  ofns_desc: string
  law_code: string
  law_cat_cd: string
  arrest_boro: string
  arrest_precinct: string
  jurisdiction_code: string
  age_group: string
  perp_sex: string
  perp_race: string
  x_coord_cd: string
  y_coord_cd: string
  latitude: string
  longitude: string
  lon_lat: {
    type: string
    coordinates: [number, number]
  }
}

type ResponseData = {
  message?: string
  data?: ArrestData | ArrestData[]
}

const socket = io('http://localhost:3000');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method } = req

  switch (method) {
    case 'GET':
      if (req.query.id) {
        return await getArrestById(req.query.id as string, res)
      } else {
        return await getArrests(req, res)
      }

    case 'POST':
      if(req.query.random) {
        return await addRandomArrest(res)
      } else {
        return await addArrest(req, res)
      }

    default:
      res.status(405).json({ message: 'Méthode non autorisée' })
      break
  }
}

// Fonction pour récupérer tous les enregistrements
async function getArrests(req: NextApiRequest, res: NextApiResponse<ResponseData>) {

  const { perp_sex, ofns_desc, age_group } = req.query

  console.log(req.query)

  try {
    const client = await pool.connect()

    let query = 'SELECT * FROM arrest_data'
    const conditions = []
    const values = []

    if (perp_sex) {
      conditions.push(`perp_sex = $${values.length + 1}`)
      values.push(perp_sex)
    }

    if (ofns_desc) {
      conditions.push(`ofns_desc = $${values.length + 1}`)
      values.push(ofns_desc)
    }

    if (age_group) {
      conditions.push(`age_group = $${values.length + 1}`)
      values.push(age_group)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    console.log(query)
    console.log(values)

    const result = await client.query(query, values)
    client.release()
    res.status(200).json({ data: result.rows })
  } catch (err) {
    console.error('Erreur lors de la récupération des données:', err)
    res.status(500).json({ message: 'Erreur lors de la récupération des données' })
  }
}

// Fonction pour récupérer un enregistrement spécifique par son id
async function getArrestById(id: string, res: NextApiResponse<ResponseData>) {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM arrest_data WHERE arrest_key = $1', [id])
    client.release()

    if (result.rows.length > 0) {
      res.status(200).json({ data: result.rows[0] })
    } else {
      res.status(404).json({ message: 'Enregistrement non trouvé' })
    }
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'enregistrement:', err)
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'enregistrement' })
  }
}

const getRandomData = () => {
  const boros = ["M", "B", "Q", "B", "S"];
  const offenses = ofns_desc;
  const ageGroups = ["<18", "18-24", "25-44", "45-64", "65+"];
  const sexes = ["M", "F"];
  const races = ["Black", "White", "Asian", "Hispanic", "Other"];

  const randomLatitude = 40.5 + Math.random() * 0.5; // Coordonnées NYC
  const randomLongitude = -74.0 + Math.random() * 0.5;

  return {
    arrest_key: `${Math.floor(Math.random() * 1000000)}`,
    arrest_date: new Date().toISOString(),
    pd_cd: `${Math.floor(Math.random() * 1000)}`,
    pd_desc: "Random PD Desc",
    ky_cd: `${Math.floor(Math.random() * 1000)}`,
    ofns_desc: offenses[Math.floor(Math.random() * offenses.length)],
    law_code: `LAW${Math.floor(Math.random() * 100)}`,
    law_cat_cd: ["M", "F", "V"][Math.floor(Math.random() * 3)],
    arrest_boro: boros[Math.floor(Math.random() * boros.length)],
    arrest_precinct: `${Math.floor(Math.random() * 100)}`,
    jurisdiction_code: `${Math.floor(Math.random() * 10)}`,
    age_group: ageGroups[Math.floor(Math.random() * ageGroups.length)],
    perp_sex: sexes[Math.floor(Math.random() * sexes.length)],
    perp_race: races[Math.floor(Math.random() * races.length)],
    x_coord_cd: `${Math.floor(Math.random() * 100000)}`,
    y_coord_cd: `${Math.floor(Math.random() * 100000)}`,
    latitude: randomLatitude.toFixed(6),
    longitude: randomLongitude.toFixed(6),
    lon_lat: {
      type: "Point",
      coordinates: [randomLongitude, randomLatitude],
    },
  };
};

async function addRandomArrest(res: NextApiResponse) {
  const data = getRandomData();

  try {
    const client = await pool.connect();

    const result = await client.query(
      `INSERT INTO arrest_data (
          arrest_key, arrest_date, pd_cd, pd_desc, ky_cd, ofns_desc, law_code, law_cat_cd,
          arrest_boro, arrest_precinct, jurisdiction_code, age_group, perp_sex, perp_race,
          x_coord_cd, y_coord_cd, latitude, longitude, geom
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
          ST_GeomFromGeoJSON($19)
        )`,
      [
        Math.floor(Math.random() * 1000000),
        data.arrest_date,
        data.pd_cd,
        data.pd_desc,
        data.ky_cd,
        data.ofns_desc,
        data.law_code,
        data.law_cat_cd,
        data.arrest_boro,
        data.arrest_precinct,
        data.jurisdiction_code,
        data.age_group,
        data.perp_sex,
        data.perp_race,
        data.x_coord_cd,
        data.y_coord_cd,
        data.latitude,
        data.longitude,
        JSON.stringify(data.lon_lat),
      ]
    );

    socket.emit('new_arrest', data);
    socket.emit('message', 'hello from api');

    console.log('go socket')

    // io.emit('new_arrest', data);

    // const socket = io('http://localhost:3000');
    // socket.emit('message', 'hello from api');
    // socket.emit('new_arrest', data);
    // socket.emit('new_arrest', data);


    // broadcast({ type: 'new_arrest', data });

    client.release();
    res.status(201).json({ message: "Arrestation aléatoire ajoutée", data });
    console.log("Arrest ajouté :", data.arrest_key);
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'arrestation aléatoire :", err);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'arrestation aléatoire" });
  }
};

async function addArrest(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const {
    arrest_date,
    pd_cd,
    pd_desc,
    ky_cd,
    ofns_desc,
    law_code,
    law_cat_cd,
    arrest_boro,
    arrest_precinct,
    jurisdiction_code,
    age_group,
    perp_sex,
    perp_race,
    x_coord_cd,
    y_coord_cd,
    latitude,
    longitude,
    lon_lat,
  } = req.body;

  // Validation de base
  if (!arrest_date || !latitude || !longitude || !ofns_desc) {
    return res.status(400).json({ message: 'Certains champs obligatoires sont manquants.' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO arrest_data (
        arrest_key, arrest_date, pd_cd, pd_desc, ky_cd, ofns_desc, law_code, law_cat_cd, arrest_boro,
        arrest_precinct, jurisdiction_code, age_group, perp_sex, perp_race, x_coord_cd,
        y_coord_cd, latitude, longitude, geom
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
        $18, ST_GeomFromGeoJSON($19)
      ) RETURNING *`,
      [
        Math.floor(Math.random() * 1000000),
        arrest_date,
        pd_cd,
        pd_desc,
        ky_cd,
        ofns_desc,
        law_code,
        law_cat_cd,
        arrest_boro,
        arrest_precinct,
        jurisdiction_code,
        age_group,
        perp_sex,
        perp_race,
        x_coord_cd,
        y_coord_cd,
        latitude,
        longitude,
        JSON.stringify(lon_lat),
      ]
    );

    client.release();
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    console.error('Erreur lors de l\'ajout de l\'enregistrement:', err);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'enregistrement' });
  }
}