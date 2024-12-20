'use client'

import { useEffect, useState } from 'react'
import BarChart from '../components/BarChart';
import { Bar, Legend, Tooltip } from 'recharts';
import { useSnackbar } from 'notistack';
import { useSearchParams } from 'next/navigation';

const COLORS = ['#6D7AFC', '#BD6DFC', '#8E6DFC', '#6DA7FC', '#CFC1FC'];
const AGE_GROUPS_TO_LABELS = {
    age_18_24: '18-24',
    age_25_44: '25-44',
    age_45_64: '45-64',
    age_65_plus: '65+',
    age__18: '<18',
};

const Offense = () => {

    const [data, setData] = useState([]);
    const [ageGroups, setAgeGroups] = useState<string[]>([]);
    const { enqueueSnackbar } = useSnackbar();
    const query = useSearchParams();

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/statistics/getCountArrestsByOffenseAndAge${query?.get('perp_sex') ? `?perp_sex=${query.get('perp_sex')}` : ''}`)
            .then((response) => response.json())
            .then(({ data }) => {
                setData(data);

                if (data.length > 0) {
                    const keys = Object.keys(data[0]);
                    const ageKeys = keys.filter((key) => key.startsWith('age_'));
                    setAgeGroups(ageKeys);
                }
            })
            .catch((error) => enqueueSnackbar(error, { variant: 'error' }));
    }, [query, enqueueSnackbar]);

    return (
        <BarChart data={data}>
            {ageGroups.map((ageGroup, index) => (
                <Bar
                    key={index}
                    dataKey={ageGroup}
                    stackId="a"
                    fill={COLORS[index]}
                />
            ))}
            <Legend
                formatter={(value: keyof typeof AGE_GROUPS_TO_LABELS) =>
                    AGE_GROUPS_TO_LABELS[value]
                }
            />
            <Tooltip
                formatter={(value: number | string, name: keyof typeof AGE_GROUPS_TO_LABELS) => [
                    value,
                    AGE_GROUPS_TO_LABELS[name],
                ]}
            />
        </BarChart>

    )
}

export default Offense