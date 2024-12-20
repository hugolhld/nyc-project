'use client'

import MapComponent from './components/Map'
import { useRouter, useSearchParams } from 'next/navigation';
import { ofns_desc } from '@/utils/utils';
// import { useSnackbar } from 'notistack';
import Link from 'next/link';
import { SnackbarProvider } from 'notistack';
import { useState } from 'react';

const Radio = ({ name, value, onChange, checked, title }) => (
    <div className='flex gap-1 items-center'>
        <input
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            type="radio"
            name={name}
            id={value}
            value={value}
            onChange={onChange}
            checked={checked}
        />
        <label htmlFor={value}>{title}</label>
    </div>
)

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
            <div className='w-full h-full bg-slate-500 text-white'>
                <div className='w-full h-full flex'>
                    <div className='w-4/5 shadow-lg'>
                        <MapComponent dataToDisplay={dataToDisplay} />
                    </div>
                    <div className='w-1/5 flex flex-col gap-4 p-4'>
                        <h2 className='font-semibold text-center text-2xl'>Filters</h2>
                        <div className='flex flex-col gap-2'>
                            <h3 className='text-lg font-semibold'>Select data to display</h3>
                            <div className='flex gap-2'>
                                <Radio
                                    name='all'
                                    value='all'
                                    title='All'
                                    onChange={({ target: { value } }) => setDataToDisplay(value)}
                                    checked={dataToDisplay === 'all'}
                                />

                                <Radio
                                    name='offenses'
                                    value='offenses'
                                    title='Offenses'
                                    onChange={({ target: { value } }) => setDataToDisplay(value)}
                                    checked={dataToDisplay === 'offenses'}
                                />

                                <Radio
                                    name='bikes'
                                    value='bikes'
                                    title='Bikes stations'
                                    onChange={({ target: { value } }) => setDataToDisplay(value)}
                                    checked={dataToDisplay === 'bikes'}
                                />
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
                                    className='w-full p-2 border shadow-lg text-slate-600'
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
                                <label htmlFor="gender" className='text-lg font-semibold'>Gender</label>
                                <div className='flex gap-4'>
                                    <Radio
                                        name='gender'
                                        value='all'
                                        title='All'
                                        onChange={({ target: { value } }) => onChange(value, 'perp_sex')}
                                        checked={params?.get('perp_sex') === 'all' || !params?.get('perp_sex')}
                                    />

                                    <Radio
                                        name='gender'
                                        value='M'
                                        title='Male'
                                        onChange={({ target: { value } }) => onChange(value, 'perp_sex')}
                                        checked={params?.get('perp_sex') === 'M'}
                                    />

                                    <Radio
                                        name='gender'
                                        value='F'
                                        title='Female'
                                        onChange={({ target: { value } }) => onChange(value, 'perp_sex')}
                                        checked={params?.get('perp_sex') === 'F'}
                                    />

                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="type" className='text-lg font-semibold'>Age group</label>
                                <select
                                    name="type"
                                    id="type"
                                    onChange={({ target: { value } }) => onChange(value, 'age_group')}
                                    value={params?.get('age_group') || 'all'}
                                    className='w-full p-2 border shadow-lg text-slate-600'
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