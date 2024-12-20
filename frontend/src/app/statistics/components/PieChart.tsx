import { PieChart as REPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

type Props = {
    data: object[],
    children?: JSX.Element[],
    props?: object
    total?: number
}

type Data =  {
    value?: number
}

const PieChart = ({ data, ...props }: Props) => {

    const total: number = data.reduce((acc: number, { value }: Data) => acc + (value || 0), 0);

    return (
        <div className='relative'>
            <ResponsiveContainer width="100%" height={350}>
                <REPieChart width={350} height={350} {...props}>
                    <Pie
                        dataKey="value"
                        isAnimationActive={false}
                        data={data}
                        cx="50%"
                        cy="50%"
                        fill="#8884d8"
                        label
                        innerRadius={60}
                        outerRadius={100}
                    >
                        {
                            data.map((_, index) => <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />)
                        }
                    </Pie>
                    <Tooltip wrapperClassName='z-1000' />
                </REPieChart>
            </ResponsiveContainer>
            {
                total && (
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        <h2 className='text-xl font-semibold text-center'>{total}</h2>
                        <p className='text-center'>Total</p>
                    </div>
                )
            }
        </div>
    );
}

export default PieChart