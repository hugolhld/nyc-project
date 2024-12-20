'use client';

import Offense from "./views/Offense";
import OffenseBySex from "./views/OffenseBySex";
import OffenseByAgeGroup from "./views/OffenseByAgeGroup";
import OffenseByOrigin from "./views/OffenseByOrigin";
import { ofns_desc } from "@/utils/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { SnackbarProvider } from "notistack";

type TitleProps = {
    children: string
}

const Title = ({ children }: TitleProps) => {
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
        <SnackbarProvider>
            <div className='w-full bg-white-500 '>
                <div className="p-4">
                    <div className="w-full mx-auto flex flex-col justify-center gap-4">
                        <h3 className="text-left text-lg font-semibold">Offences type by age group</h3>
                        <div>
                            <label htmlFor="" className="mr-2">Filter by gender</label>
                            <select
                                name="perp_sex"
                                id=""
                                onChange={({ target: { value } }) => onChange(value, 'perp_sex')}
                                value={params?.get('perp_sex') || 'all'}
                                className="w-1/4 mx-auto p-2 border text-slate-600"
                            >
                                <option value="all">All</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                        <Offense />
                    </div>
                    <div className="py-4">
                        <label htmlFor="offenses" className="pr-2">Filter by offenses type</label>
                        <select
                            id="offenses"
                            name="offenses"
                            className="w-1/4 mx-auto p-2 border text-slate-600"
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
                            <Title>Number of total offences by gender</Title>
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
        </SnackbarProvider>
    )
}

export default page