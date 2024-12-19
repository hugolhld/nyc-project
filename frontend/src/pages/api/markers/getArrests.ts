
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
    case 'GET':
      if (req.query.id) {
        return await getArrestById(req.query.id as string, res)
      } else {
        return await getArrests(req, res)
      }

    default:
      res.status(405).json({ message: 'Méthode non autorisée' })
      break
  }
}

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