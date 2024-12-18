'use client';

import Link from "next/link";
import Offense from "./views/Offense";
import PieChart from "./components/PieChart";
import OffenseBySex from "./views/OffenseBySex";

const page = () => {

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
                <div className="w-full flex justify-between gap-4 mx-auto">
                    <div>
                        <h3 className="text-center text-lg font-semibold">Number of total offences by sex</h3>
                        <OffenseBySex />
                    </div>
                    <div>
                        <h3 className="text-center text-lg font-semibold">Number of total offences by sex</h3>
                        <OffenseBySex />
                    </div>
                    <div>
                        <h3 className="text-center text-lg font-semibold">Number of total offences by sex</h3>
                        <OffenseBySex />
                    </div>
                    <div>
                        <h3 className="text-center text-lg font-semibold">Number of total offences by sex</h3>
                        <OffenseBySex />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page