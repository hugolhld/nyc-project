'use client'

import React from 'react'
import MapComponent from '../components/Map'
import { IoLocationSharp } from "react-icons/io5";
import { useRouter, useSearchParams } from 'next/navigation';

const offenseTypes = [
    "all",
    "ALCOHOLIC BEVERAGE CONTROL LAW",
    "ASSAULT 3 & RELATED OFFENSES",
    "BURGLARY",
    "CANNABIS RELATED OFFENSES",
    "CHILD ABANDONMENT/NON SUPPORT",
    "CRIMINAL MISCHIEF & RELATED OF",
    "CRIMINAL TRESPASS",
    "DANGEROUS DRUGS",
    "DANGEROUS WEAPONS",
    "FELONY ASSAULT",
    "FORGERY",
    "FRAUDS",
    "GRAND LARCENY",
    "GRAND LARCENY OF MOTOR VEHICLE",
    "HOMICIDE-NEGLIGENT,UNCLASSIFIE",
    "INTOXICATED & IMPAIRED DRIVING",
    "INTOXICATED/IMPAIRED DRIVING",
    "JOSTLING",
    "MISCELLANEOUS PENAL LAW",
    "MURDER & NON-NEGL. MANSLAUGHTE",
    "NYS LAWS-UNCLASSIFIED FELONY",
    "OFF. AGNST PUB ORD SENSBLTY &",
    "OFFENSES AGAINST PUBLIC ADMINI",
    "OFFENSES AGAINST PUBLIC SAFETY",
    "OFFENSES AGAINST THE PERSON",
    "OFFENSES INVOLVING FRAUD",
    "OTHER OFFENSES RELATED TO THEF",
    "OTHER STATE LAWS",
    "OTHER STATE LAWS (NON PENAL LA",
    "OTHER TRAFFIC INFRACTION",
    "PETIT LARCENY",
    "POSSESSION OF STOLEN PROPERTY",
    "RAPE",
    "ROBBERY",
    "SEX CRIMES",
    "UNAUTHORIZED USE OF A VEHICLE",
    "VEHICLE AND TRAFFIC LAWS"
];


type Props = {}

const page = (props: Props) => {

    const router = useRouter();
    const params = useSearchParams();

    const onChange = (value: string, type: string) => {

        const query = new URLSearchParams(params?.toString());

        if (value === 'all') {
            query.delete(type);
            router.push(`?${query.toString()}`);
            return;
        }

        if (value === 'M') {
            query.delete('perp_sex');
            router.push(`?${query.toString()}`);
            return;
        }

        query.set(type, value);
        router.push(`?${query.toString()}`);
    }

    return (
        <div className='w-full h-screen'>
            <h1 className='text-2xl text-center font-semibold p-4'>Carte de la ville de New York et ses arrestations</h1>
            <div className='w-full h-full flex'>
                <div className='w-4/5'>
                    <MapComponent />
                </div>
                <div className='w-1/5 flex flex-col gap-4 px-4'>
                    <h2 className='font-semibold text-center text-2xl'>Filters</h2>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="type" className='text-lg font-semibold'>Type de delits</label>
                        <select
                            name="type"
                            id="type"
                            onChange={({ target: { value } }) => onChange(value, 'ofns_desc')}
                            value={params?.get('ofns_desc') || 'all'}
                            className='w-full p-2 border'
                        >
                            {
                                offenseTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="sexe" className='text-lg font-semibold'>Sexe</label>
                        <div className='flex gap-4'>
                            <div>
                                <input
                                    className='mr-2'
                                    type="radio"
                                    name="sexe"
                                    id="M"
                                    value="M"
                                    onChange={({ target: { value } }) => onChange(value, 'perp_sex')}
                                    checked={params?.get('perp_sex') === 'M' || !params?.get('perp_sex')}
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
                </div>
            </div>
        </div>
    )
}

export default page