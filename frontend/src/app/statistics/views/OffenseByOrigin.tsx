import { useState, useEffect } from 'react'
import PieChart from '../components/PieChart'
import { useSearchParams } from 'next/navigation';

const OffenseByOrigin = () => {
    const [data, setData] = useState([]);
    const query = useSearchParams();

    useEffect(() => {
        fetch(`http://localhost:3000/api/statistics/getCount?type=perp_race${query ? `&${query}` : ''}`)
            .then((response) => response.json())
            .then(({ data }) => setData(data))
            .catch((error) => console.error('Error during request:', error));
    }, [query]);

    return data.length > 0 && (
        <PieChart data={data} />
    )
}

export default OffenseByOrigin