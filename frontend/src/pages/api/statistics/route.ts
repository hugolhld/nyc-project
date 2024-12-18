import { ofns_desc } from '@/utils/utils';
import type { NextApiRequest, NextApiResponse } from 'next';
import io from 'socket.io-client';
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
    data?: ArrestData | ArrestData[] | any;
};

// const socket = io('http://localhost:3000');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { method } = req;

    switch (method) {
        case 'GET':
            if (req.query.sex) {
                return getCountBySex(req, res);
            } else {
                return getCountArrestsByOffenseAndAge(req, res);
            }

        default:
            res.status(405).json({ message: 'Méthode non autorisée' });
            break;
    }
}

async function getCountArrestsByOffenseAndAge(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const { perp_sex, ofns_desc, age_group } = req.query;

    let query = `
        SELECT 
            ofns_desc AS offense, 
            age_group, 
            COUNT(*) AS count
        FROM arrest_data
    `;
    const conditions: string[] = [];
    const values: any[] = [];

    if (perp_sex) {
        conditions.push(`perp_sex = $${values.length + 1}`);
        values.push(perp_sex);
    }

    if (ofns_desc) {
        conditions.push(`ofns_desc ILIKE $${values.length + 1}`);
        values.push(`%${ofns_desc}%`);
    }

    if (age_group) {
        conditions.push(`age_group = $${values.length + 1}`);
        values.push(age_group);
    }

    query += `
        ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
        GROUP BY ofns_desc, age_group
        ORDER BY offense ASC, count DESC
    `;

    try {
        const result = await pool.query(query, values);


        const data = result.rows.reduce((acc: any[], row: any) => {
            const existing = acc.find((item) => item.name === row.offense);

            const ageGroupKey = `age_${row.age_group.replace('-', '_').replace('<', '_').replace('+', '_plus')}`;

            if (existing) {
                // Ajoute le compte à la tranche d'âge et met à jour le total
                existing[ageGroupKey] = (existing[ageGroupKey] || 0) + parseInt(row.count, 10);
                existing.total += parseInt(row.count, 10);
            } else {
                acc.push({
                    name: row.offense,
                    [ageGroupKey]: parseInt(row.count, 10),
                    total: parseInt(row.count, 10),
                });
            }

            return acc;
        }, []);


        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
        });
    }
}


async function getCountBySex(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
  ) {
    try {
      const query = `
        SELECT 
          perp_sex as name,
          CAST(COUNT(*) AS INTEGER) AS value
        FROM 
          arrest_data
        GROUP BY 
          perp_sex
        ORDER BY 
          value DESC;
      `;
  
      const result = await pool.query(query);
  
      res.status(200).json({
        success: true,
        data: result.rows, // Chaque ligne contient `perp_sex` et `total_offenses`.
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
      });
    }
  }
  