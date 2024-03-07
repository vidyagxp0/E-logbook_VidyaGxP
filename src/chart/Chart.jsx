import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, LabelList } from 'recharts';
const Chart = () => {
    const data = [
        { name: '17 Feb 24', uv: 3.5, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '18 Feb 24', uv: 3.5, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '19 Feb 24', uv: 3.0, pv: 400, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '20 Feb 24', uv: 0.7, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '21 Feb 24', uv: 2.6, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '22 Feb 24', uv: 2.8, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '23 Feb 24', uv: 6.0, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '24 Feb 24', uv: 9.0, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '25 Feb 24', uv: 2.5, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '26 Feb 24', uv: 3.5, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '27 Feb 24', uv: 6.5, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '28 Feb 24', uv: 5.6, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '29 Feb 24', uv: 7.8, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '01 Mar 24', uv: 9.0, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '02 Mar 24', uv: 0.5, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '03 Mar 24', uv: 3.0, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '04 Mar 24', uv: 2.0, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
        { name: '06 Mar 24', uv: 4.0, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 }
    ];

    
    return (
        <LineChart width={1500} height={600} data={data} margin={{ top: 5, right: 20, bottom: 60, left: 0 }}>
            <Line type="monotone" dataKey="uv" stroke='#8884d8' />
            <Line type="monotone" dataKey="UCL" stroke="red" label="UCL" />
            <Line type="monotone" dataKey="LCL" stroke="red" />
            <CartesianGrid stroke="#cc" strokeDasharray="" />
            <XAxis dataKey="name" angle={-90} textAnchor="end" allowDataOverflow />
            <YAxis domain={[0.0, 5.1]} allowDecimals tickCount={21}/>
            <Tooltip/>
        </LineChart>
    )
}

export default Chart