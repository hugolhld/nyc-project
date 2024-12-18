'use client'

import MapComponent from './components/Map'
import { useRouter, useSearchParams } from 'next/navigation';
import { ofns_desc } from '@/utils/utils';
// import { useSnackbar } from 'notistack';
import Link from 'next/link';
import { SnackbarProvider } from 'notistack';
import { useState } from 'react';

const page = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [dataToDisplay, setDataToDisplay] = useState('all');

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const params = useSearchParams();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // const { enqueueSnackbar } = useSnackbar();

    const onChange = (value: string, type: string) => {

        const query = new URLSearchParams(params?.toString());

        if (value === 'all') {
            query.delete(type);
            router.push(`?${query.toString()}`);
            return;
        }

        query.set(type, value);
        router.push(`?${query.toString()}`);
    }

    return (
        <SnackbarProvider>
            <div className='w-full h-screen'>
                <div className='relative flex justify-between items-center'>
                    <Link href={'/'} className='w-1/5 top-0 left-0 p-4'>
                        Retour
                    </Link>
                    <h1 className='w-3/5 text-center text-2xl font-semibold p-4'>Carte de la ville de New York et ses arrestations</h1>
                    <Link href={'/statistics'} className='w-1/5  text-end top-0 right-0 p-4'>
                        Statistiques
                    </Link>
                </div>
                <div className='w-full h-full flex'>
                    <div className='w-4/5'>
                        <MapComponent dataToDisplay={dataToDisplay} />
                    </div>
                    <div className='w-1/5 flex flex-col gap-4 px-4'>
                        <h2 className='font-semibold text-center text-2xl'>Filters</h2>

                        <div className='flex flex-col gap-2'>
                            <h3 className='text-lg font-semibold'>Select data to display</h3>
                            <div className='flex gap-2'>
                                <div className='flex gap-1 items-center'>
                                    <input
                                        type="radio"
                                        name="all"
                                        id="all"
                                        onChange={() => setDataToDisplay('all')}
                                        checked={dataToDisplay === 'all'}
                                    />
                                    <label htmlFor="">All</label>
                                </div>

                                <div className='flex gap-1 items-center'>
                                    <input
                                        type="radio"
                                        name="offenses"
                                        id="offenses"
                                        onChange={() => setDataToDisplay('offenses')}
                                        checked={dataToDisplay === 'offenses'}
                                    />
                                    <label htmlFor="offenses">Offenses</label>
                                </div>

                                <div className='flex gap-1 items-center'>
                                    <input
                                        type="radio"
                                        name="bikes"
                                        id="bikes"
                                        onChange={() => setDataToDisplay('bikes')}
                                        checked={dataToDisplay === 'bikes'}
                                    />
                                    <label htmlFor="bikes">Bikes stations</label>
                                </div>
                            </div>
                        </div>

                        <div className={`${dataToDisplay === 'bikes' ? 'hidden' : 'block'} flex flex-col gap-4`}>

                            <div className={`flex flex-col gap-2`}>
                                <label htmlFor="type" className='text-lg font-semibold'>Offenses type</label>
                                <select
                                    name="type"
                                    id="type"
                                    onChange={({ target: { value } }) => onChange(value, 'ofns_desc')}
                                    value={params?.get('ofns_desc') || 'all'}
                                    className='w-full p-2 border'
                                >
                                    <option value="all">All</option>
                                    {
                                        ofns_desc.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="sexe" className='text-lg font-semibold'>Sex</label>
                                <div className='flex gap-4'>
                                    <div>
                                        <input
                                            className='mr-2'
                                            type="radio"
                                            name="sexe"
                                            id="All"
                                            value="all"
                                            onChange={({ target: { value } }) => onChange(value, 'perp_sex')}
                                            checked={params?.get('perp_sex') === 'all' || !params?.get('perp_sex')}
                                        />
                                        <label htmlFor="all">Tous</label>
                                    </div>
                                    <div>
                                        <input
                                            className='mr-2'
                                            type="radio"
                                            name="sexe"
                                            id="M"
                                            value="M"
                                            onChange={({ target: { value } }) => onChange(value, 'perp_sex')}
                                            checked={params?.get('perp_sex') === 'M'}
                                        />
                                        <label htmlFor="M">Homme</label>
                                    </div>

                                    <div>
                                        <input
                                            className='mr-2'
                                            type="radio"
                                            name="sexe"
                                            id="F"
                                            value="F"
                                            onChange={({ target: { value } }) => onChange(value, 'perp_sex')}
                                            checked={params?.get('perp_sex') === 'F'}
                                        />
                                        <label htmlFor="F">Femme</label>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="type" className='text-lg font-semibold'>Age group</label>
                                <select
                                    name="type"
                                    id="type"
                                    onChange={({ target: { value } }) => onChange(value, 'age_group')}
                                    value={params?.get('age_group') || 'all'}
                                    className='w-full p-2 border'
                                >
                                    <option value="all">All</option>
                                    {
                                        ['<18', '18-24', '25-44', '45-64', '65+'].map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SnackbarProvider>
    )
}

export default page