import type { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  host: 'localhost',  // Nom du service Docker de PostgreSQL
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
        return await getArrests(res)
      }

    default:
      res.status(405).json({ message: 'Méthode non autorisée' })
      break
  }
}

// Fonction pour récupérer tous les enregistrements
async function getArrests(res: NextApiResponse<ResponseData>) {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM arrest_data')
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
