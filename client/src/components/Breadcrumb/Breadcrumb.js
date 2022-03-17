import React from 'react'
import { Breadcrumb } from 'antd'

const style = {
    textAlign: 'center',
    fontSize: 16,
    margin: '60px 0 30px'
}

function Breadcrumbing({ route }) {
    return (
        <Breadcrumb separator=">" style={style}>
            {
                route.map((ele, index) => (
                    <Breadcrumb.Item key={index} href={ele.link}>{ele.name}</Breadcrumb.Item>
                ))
            }
        </Breadcrumb>
    )
}

export default Breadcrumbing
