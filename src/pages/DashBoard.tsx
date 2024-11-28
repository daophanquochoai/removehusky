import React, {useState} from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import {FaBlog, FaBoxes, FaFireAlt} from "react-icons/fa";
import {NavLink, Outlet} from "react-router-dom";
import {AiOutlineProduct} from "react-icons/ai";
import {MdCategory} from "react-icons/md";

const { Header, Sider, Content } = Layout;

const DashBoard = () => {

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();


    return (
        <Layout className={'h-[100vh]'}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme={"light"}>
                <div className="demo-logo-vertical h-[64px] p-4">
                    <img alt={'icon'} src={'https://demo.templatesjungle.com/foodfarm/images/logo.svg'}/>
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <FaFireAlt />,
                            label: <NavLink to={'/admin'}>Overview</NavLink>,
                        },
                        {
                            key: '2',
                            icon: <AiOutlineProduct />,
                            label: <NavLink to={'/admin/product'}>Product</NavLink>,
                        },
                        {
                            key: '3',
                            icon: <MdCategory />,
                            label: <NavLink to={'/admin/category'}>Category</NavLink>,
                        },
                        {
                            key: '4',
                            icon: <FaBoxes />,
                            label: <NavLink to={'/admin/order'}>Order</NavLink>,
                        },
                        {
                            key: '5',
                            icon: <FaBlog />,
                            label: <NavLink to={'/admin/blog'}>Blog</NavLink>,
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashBoard;