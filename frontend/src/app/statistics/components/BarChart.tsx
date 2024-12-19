import { PureComponent } from 'react';
import {
    BarChart as INITBarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

class CustomizedAxisTick extends PureComponent {
    render() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { x, y, payload }: any = this.props;

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)" className='text-xs bg-slate-600'>
                    {payload.value}
                </text>
            </g>
        );
    }
}

type BarChartProps = {
    data: object[],
    children: JSX.Element[],
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
                <XAxis dataKey="name" interval={0} height={150} tick={<CustomizedAxisTick />} />
                <YAxis />
                <Tooltip />
                <Legend height={50} align='center' margin={{ top: 1000, left: 0, right: 0, bottom: 0 }} />

                {children}
            </INITBarChart>
        </ResponsiveContainer>
    );
};

export default BarChart;
