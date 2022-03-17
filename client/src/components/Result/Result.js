import React from 'react'
import { Result, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

function HomeResult() {
    return (
        <Result
            style={{paddingTop: '150px'}}
            icon={<SmileOutlined style={{color: '#1890ff'}} />}
            title="Success comes from hard work!!!"
            extra={<Button type="primary">Next</Button>}
        />
    )
}

export default HomeResult
