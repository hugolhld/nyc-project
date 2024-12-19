import type { NextApiRequest, NextApiResponse } from 'next'
import { pool } from '../db/database'

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method } = req

  switch (method) {
    case 'POST':
        return await addArrest(req, res)

    default:
      res.status(405).json({ message: 'Méthode non autorisée' })
      break
  }
}

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