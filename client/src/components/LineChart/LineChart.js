import React from 'react'
import { Line } from '@ant-design/charts';

function LineChart({ data, xField, yField }) {
    const config = {
        data,
        xField: xField,
        yField: yField,
        point: {
            size: 5,
            shape: 'diamond',
        },
    };
    return (
        <Line {...config} />
    )
}

export default LineChart
