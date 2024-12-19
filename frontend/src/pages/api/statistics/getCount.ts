import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../db/database';

type ArrestData = {
    arrest_key: string;
    arrest_date: string;
    pd_cd: string;
    pd_desc: string;
    ky_cd: string;
    ofns_desc: string;
    law_code: string;
    law_cat_cd: string;
    arrest_boro: string;
    arrest_precinct: string;
    jurisdiction_code: string;
    age_group: string;
    perp_sex: string;
    perp_race: string;
    x_coord_cd: string;
    y_coord_cd: string;
    latitude: string;
    longitude: string;
    lon_lat: {
        type: string;
        coordinates: [number, number];
    };
};

type ResponseData = {
    success?: boolean;
    message?: string;
    data?: ArrestData | ArrestData[];
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { method } = req;

    console.log(req.body.type)

    switch (method) {
        case 'GET':
            return getCount(req, res);

        default:
            res.status(405).json({ message: 'Méthode non autorisée' });
            break;
    }
}

async function getCount(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { ofns_desc, type } = req.query;

    try {
        const query = `
        SELECT 
          ${type} as name,
          CAST(COUNT(*) AS INTEGER) AS value
        FROM 
          arrest_data
        ${ofns_desc ? 'WHERE ofns_desc = $1' : ''}
        GROUP BY 
          ${type}
        ORDER BY 
          value DESC;
      `;

        const result = ofns_desc ? await pool.query(query, [ofns_desc]) : await pool.query(query);

        res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
        });
    }
}