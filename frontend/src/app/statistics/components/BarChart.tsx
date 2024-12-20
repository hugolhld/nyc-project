import { PureComponent, ReactNode } from 'react';
import {
    BarChart as INITBarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';

class CustomizedAxisTick extends PureComponent {
    render() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { x, y, payload }: any = this.props;

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="end" fill="#000" transform="rotate(-35)" className='text-xs'>
                    {payload.value}
                </text>
            </g>
        );
    }
}

type BarChartProps = {
    data: object[],
    children: ReactNode
    props?: object
};

const BarChart = ({ data, children, ...props }: BarChartProps) => {
    return (
        <ResponsiveContainer width="100%" height={600}>
            <INITBarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                {...props}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} height={150} tick={<CustomizedAxisTick />} stroke='#000' color='#000' />
                <YAxis stroke='#000' />
                {children}
            </INITBarChart>
        </ResponsiveContainer>
    );
};

export default BarChart;
