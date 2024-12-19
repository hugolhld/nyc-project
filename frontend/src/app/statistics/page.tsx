'use client';

import Link from "next/link";
import Offense from "./views/Offense";
import OffenseBySex from "./views/OffenseBySex";
import OffenseByAgeGroup from "./views/OffenseByAgeGroup";
import OffenseByOrigin from "./views/OffenseByOrigin";
import { ofns_desc } from "@/utils/utils";
import { useRouter, useSearchParams } from "next/navigation";

type TitleProps = {
    children: string
}

const Title = ({children}: TitleProps) => {
    return (
        <h3 className="text-center text-lg font-semibold">{children}</h3>
    )
}

const page = () => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const params = useSearchParams();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();

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
        <div className='w-full h-screen'>
            <div className='relative flex justify-between items-center'>
                <Link href={'/'} className='w-1/5 top-0 left-0 p-4'>
                    Retour
                </Link>
                <h1 className='w-3/5 text-center text-2xl font-semibold p-4'>Statistiques</h1>
                <Link href={'/map'} className='w-1/5  text-end top-0 right-0 p-4'>
                    Map
                </Link>
            </div>
            <div className="p-4">

                <div className="w-full mx-auto flex flex-col justify-center gap-4">
                    <h3 className="text-left text-lg font-semibold">Offences type by age group</h3>
                    <Offense />
                </div>
                <div className="py-4">
                    <label htmlFor="offenses" className="pr-2">Filter by offenses type</label>
                    <select
                        id="offenses"
                        name="offenses"
                        className="w-1/4 mx-auto p-2 border"
                        onChange={({ target: { value } }) => onChange(value, 'ofns_desc')}
                        value={params?.get('ofns_desc') || 'all'}
                    >
                        <option value="all">All</option>
                        {
                            ofns_desc.map((offense, index) => {
                                return <option key={index} value={offense}>{offense}</option>
                            })
                        }
                    </select>
                </div>
                <div className="w-full flex justify-between gap-4 mx-auto">
                    <div>
                        <Title>Number of total offences by sex</Title>
                        <OffenseBySex />
                    </div>
                    <div>
                        <Title>Number of total offences by age group</Title>
                        <OffenseByAgeGroup />
                    </div>
                    <div>
                        <Title>Number of total offences by origin</Title>
                        <OffenseByOrigin />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page