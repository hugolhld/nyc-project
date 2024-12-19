import { useState, useEffect} from 'react'
import PieChart from '../components/PieChart'
import { useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';

const OffenseByAgeGroup = () => {
    const [data, setData] = useState([]);
    const query = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetch(`http://localhost:3000/api/statistics/getCount?type=age_group${query ? `&${query}` : ''}`)
            .then((response) => response.json())
            .then(({ data }) => setData(data))
            .catch((error) => enqueueSnackbar(error, { variant: 'error' }));
    }, [query, enqueueSnackbar]);

    return data.length > 0 && (
        <PieChart data={data} />
    )
}

export default OffenseByAgeGroup