import React, { useEffect, useState } from 'react'
import PieChart from '../components/PieChart'

const OffenseBySex = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/statistics/route?sex=true')
            .then((response) => response.json())
            .then(({ data }) => setData(data))
            .catch((error) => console.error('Error during request:', error));
    }, []);



    return data.length > 0 && (
        <PieChart data={data} />
    )
}

export default OffenseBySex