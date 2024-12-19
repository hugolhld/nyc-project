import { PieChart as REPieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

type Props = {
    data: object[],
    children?: JSX.Element[],
    props?: object
}

const PieChart = ({ data, ...props }: Props) => {
    return (
        <ResponsiveContainer width={350} height={350}>
            <REPieChart width={350} height={350} {...props}>
                <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={data}
                    cx="50%"
                    cy="50%"
                    fill="#8884d8"
                    label
                >
                    {
                        data.map((entry, index) => <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />)
                    }
                </Pie>
                <Tooltip />
                <Legend />
            </REPieChart>
        </ResponsiveContainer>
    );
}

export default PieChart