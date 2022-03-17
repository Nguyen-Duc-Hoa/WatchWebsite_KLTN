import React from 'react'
import { Button, Form, Input } from 'antd'
import { BiSearch } from 'react-icons/bi'

function SearchBox({ onSubmit }) {
    return (
        <Form layout='inline' onFinish={onSubmit}>
            <Form.Item
                name='search'>
                <Input size='large'  />
            </Form.Item>
            <Form.Item>
                <Button shape='round' size='large' type='primary' htmlType='submit' icon={<BiSearch />} />
            </Form.Item>
        </Form>
    )
}

export default SearchBox
