import React from 'react'
import { Column } from '@ant-design/charts';

function ColumnChart({ data, xField, yField, seriesField }) {
    var config = {
        data: data,
        xField: xField,
        yField: yField,
        seriesField: seriesField,
        // isPercent: true,
        // isStack: true,
        label: {
            position: 'middle',
            content: function content(item) {
                return item.Percent.toFixed(2);
            },
            style: { fill: '#000' },
        },
    };
    return (
        <Column {...config} />
    )
}

export default ColumnChart
