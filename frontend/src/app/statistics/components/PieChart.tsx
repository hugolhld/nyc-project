import React, { PureComponent } from 'react';
import { PieChart as REPieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const data01 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
    { name: 'Group E', value: 278 },
    { name: 'Group F', value: 189 },
];

const data02 = [
    { name: 'Group A', value: 2400 },
    { name: 'Group B', value: 4567 },
    { name: 'Group C', value: 1398 },
    { name: 'Group D', value: 9800 },
    { name: 'Group E', value: 3908 },
    { name: 'Group F', value: 4800 },
];

type Props = {
    data: object[],
    children?: JSX.Element[],
    props?: object
}

const PieChart = ({ data, ...props }: Props) => {
    console.log(data)
    console.log(data01)
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
                {/* <Pie dataKey="value" data={data02} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" /> */}
                <Tooltip />
            </REPieChart>
        </ResponsiveContainer>
    );
}

export default PieChart