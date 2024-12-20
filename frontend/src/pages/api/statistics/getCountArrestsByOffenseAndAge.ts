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

    switch (method) {
        case 'GET':
            return getCountArrestsByOffenseAndAge(req, res);

        default:
            res.status(405).json({ message: 'Méthode non autorisée' });
            break;
    }
}

async function getCountArrestsByOffenseAndAge(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const defaultAgeGroups = ['<18', '25-44', '45-64', '65+'];

    const { perp_sex } = req.query;

    let query = `
        SELECT 
            ofns_desc AS offense, 
            age_group, 
            COUNT(*) AS count
        FROM arrest_data
    `;
    const conditions: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = [];

    if (perp_sex) {
        conditions.push(`perp_sex = $${values.length + 1}`);
        values.push(perp_sex);
    }

    query += `
        ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
        GROUP BY ofns_desc, age_group
        ORDER BY offense ASC, count DESC
    `;

    try {
        const result = await pool.query(query, values);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = result.rows.reduce((acc: any[], row: any) => {
            const existing = acc.find((item) => item.name === row.offense);

            const ageGroupKey = `age_${row.age_group.replace('-', '_').replace('<', '_').replace('+', '_plus')}`;

            if (existing) {
                // Ajoute le compte à la tranche d'âge existante
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

        // Ajoute les tranches d'âge manquantes avec des valeurs par défaut (0)
        const enrichedData = data.map((offense) => {
            defaultAgeGroups.forEach((ageGroup) => {
                const ageGroupKey = `age_${ageGroup.replace('-', '_').replace('<', '_').replace('+', '_plus')}`;
                if (!(ageGroupKey in offense)) {
                    offense[ageGroupKey] = 0; // Initialise à 0 si la tranche d'âge est absente
                }
            });
            return offense;
        });

        res.status(200).json({
            success: true,
            data: enrichedData,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
        });
    }
}
