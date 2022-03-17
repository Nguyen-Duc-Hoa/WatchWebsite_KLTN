import React, { useState } from 'react'
import { Button, Layout } from 'antd';
import AdminMenu from '../Menu/Menu'
import AvatarUser from '../Avatar/Avatar';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const headerStyle = {
    background: 'white',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
}


function AdminLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false)
    return (
        <Layout style={{ padding: 0 }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
            >
                <AdminMenu />
            </Sider>
            <Layout>
                <Header style={headerStyle}>
                    <Button type='primary' onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </Button>
                    <AvatarUser />
                </Header>
                <Content style={{ background: 'white' }}>
                    {children}
                </Content>
                <Footer style={{ textAlign: 'center' }}>©2021 Created by Huy</Footer>
            </Layout>
        </Layout>
    )
}

export default AdminLayout
