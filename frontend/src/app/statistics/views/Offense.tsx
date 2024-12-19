'use client'

import { useEffect, useState } from 'react'
import BarChart from '../components/BarChart';
import { Bar } from 'recharts';
import { useSnackbar } from 'notistack';

const Offense = () => {

    const [data, setData] = useState([]);
    const [ageGroups, setAgeGroups] = useState<string[]>([]);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetch('http://localhost:3000/api/statistics/getCountArrestsByOffenseAndAge')
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
    }, [enqueueSnackbar]);

    return (
        <BarChart data={data}>
            {ageGroups.map((ageGroup, index) => (
                <Bar
                    key={index}
                    dataKey={ageGroup}
                    stackId="a"
                    fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Couleur aléatoire
                />
            ))}
        </BarChart>

    )
}

export default Offense